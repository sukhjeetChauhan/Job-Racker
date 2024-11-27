from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from .serializers import JobApplicationSerializer
from .models import JobApplication
import json
# import pdfplumber
import fitz
from PIL import Image
import pytesseract  # For OCR
from django.conf import settings
from openai import OpenAI
from pdf2image import convert_from_bytes
from rest_framework import status
from docx import Document
from stripe_app.models import UserScans

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)





@csrf_exempt
@login_required  # Ensures the user is authenticated
def create_job_application(request):
    user = request.user  # Get the authenticated user

    if request.method == 'GET':
        # Retrieve only the job applications for the authenticated user
        applications = JobApplication.objects.filter(user=user)
        serializer = JobApplicationSerializer(applications, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    elif request.method == 'POST':
        # Load the JSON data from the request body
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        print('Received data:', data)  # Log the received data
        serializer = JobApplicationSerializer(data=data)

        if serializer.is_valid():
            job_application = serializer.save(user=user)  # Automatically set the user field to the authenticated user
            return JsonResponse(serializer.data, status=201)

        print('Validation errors:', serializer.errors)  # Print validation errors for debugging
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)



@csrf_exempt
def update_job_application_status(request, pk):
    if request.method == 'PUT':
        try:
            job_application = JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            return JsonResponse({'error': 'Job application not found'}, status=404)
        
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        if 'status' in data:
            job_application.status = data['status']
            job_application.save()
            return JsonResponse({'message': 'Status updated successfully'}, status=200)

        return JsonResponse({'error': 'Status field is required'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def compare_ai(request):
    if request.method == "POST":
        """
        Compare CV and job description (image or text) and return a similarity analysis using OpenAI.
        """
        # Extract CV file from the request
        cv_file = request.FILES.get('cv')
        job_desc_file = request.FILES.get('job_desc')
        job_desc_text = request.POST.get('job_desc_text')  # In case job description is provided as text

        # Validate the presence of the CV file
        if not cv_file:
            return JsonResponse({'error': "No CV file uploaded"}, status=400)

        # Extract text from CV (PDF)
        cv_text = extract_text_from_pdf(cv_file)
       

        # Extract text from job description (Image or Text)
        if job_desc_file and job_desc_file.content_type.startswith('image/'):
            job_desc_text = extract_text_from_image(job_desc_file)  # Extract text from image
        elif not job_desc_text and job_desc_file:
            job_desc_text = extract_text_from_pdf(job_desc_file)  # Extract text if job description is also a PDF
        elif not job_desc_text:
            return JsonResponse({'error': "No job description provided"}, status=400)

        # Use OpenAI to compare the resume and job description
        comparison_result = compare_cv_and_job_description(cv_text, job_desc_text)

        if comparison_result:
            try:
                # Get the UserScans object for the logged-in user
                user_scans = UserScans.objects.get(user=request.user)
                
                # Attempt to consume a scan
                user_scans.consume_scan()                
                print("Scan consumed successfully")
                
            except Exception as e:
                print("error :", e)

        # Return the analysis in the response
        return JsonResponse({
            'comparison_result': comparison_result,
        })
    
    return JsonResponse({'error': "Method not allowed"}, status=405)


def extract_text_from_pdf(file):
    """Extract text from PDF or Word (.docx) file."""
    text = ''
    file_name = file.name.lower()

    if file_name.endswith('.pdf'):
        file.seek(0)  # Reset file pointer
        pdf_bytes = file.read()

        try:
            # Extract text using PyMuPDF
            pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
            for page_num in range(len(pdf_document)):
                page = pdf_document[page_num]
                text += page.get_text() + ' '  # Extract text from each page
            pdf_document.close()
        except Exception as e:
            print(f"Error using PyMuPDF: {e}")
            text = ''  # Reset text if PyMuPDF fails
        
        if not text.strip():  # If no text was extracted, fallback to OCR
            pages = convert_from_bytes(pdf_bytes)  # Convert PDF pages to images
            for page_image in pages:
                page_text = pytesseract.image_to_string(page_image)
                text += page_text + ' '

    elif file_name.endswith('.docx'):
        # Extract text from Word files
        doc = Document(file)
        for paragraph in doc.paragraphs:
            text += paragraph.text + ' '

    else:
        raise ValueError("Unsupported file type. Only .pdf and .docx files are supported.")

    return text.strip()


def extract_text_from_image(image_file):
    """Extract text from an image file using Tesseract OCR."""
    image = Image.open(image_file)
    text = pytesseract.image_to_string(image)
    return text.strip()


def compare_cv_and_job_description(cv_text, job_desc_text):
    """Use OpenAI to compare CV and job description text."""
    # Create a prompt for OpenAI to compare the CV and job description
    prompt = f"""
     I want you to analyze the following resume (CV) and job description to assess how well the resume matches the job requirements. Provide the following details in your analysis:

      1. **Match Percentage**: Estimate how well the skills and experience in the resume align with the job description, giving a percentage score.
      
      2. **Strengths**: List the key skills, qualifications, and experiences from the resume that match the job requirements. Highlight any areas where the candidate exceeds expectations.

      3. **Missing Skills**: Identify the skills, qualifications, or experiences mentioned in the job description that are not found in the resume.

      4. **Suitability**: Provide an overall evaluation of the candidate’s suitability for the job. Mention whether the candidate is a good fit, and if any gaps are significant enough to impact their chances.

    Resume:
    {cv_text}

    Job Description:
    {job_desc_text}

    Provide your analysis:
    """

    # Make the OpenAI API call using chat completion
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    # Extract the generated response
    comparison = completion.choices[0].message.content

    return comparison
