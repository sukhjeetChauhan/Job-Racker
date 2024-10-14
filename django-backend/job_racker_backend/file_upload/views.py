from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .serializers import JobApplicationSerializer
from .models import JobApplication
import pdfplumber
from PIL import Image
import pytesseract  # For OCR
from django.conf import settings
from openai import OpenAI
from pdf2image import convert_from_bytes
from rest_framework import status

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENAI_API_KEY)




@api_view(['GET', 'POST'])
def create_job_application(request):
    if request.method == 'GET':
        # Retrieve all job applications
        applications = JobApplication.objects.all()
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Create a new job application
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_job_application_status(request, pk):
    try:
        # Retrieve the job application by ID
        job_application = JobApplication.objects.get(pk=pk)
    except JobApplication.DoesNotExist:
        return Response({'error': 'Job application not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Only update the status field
    if 'status' in request.data:
        job_application.status = request.data['status']
        job_application.save()
        return Response({'message': 'Status updated successfully'}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def compare_ai(request):
    """
    Compare CV and job description (image or text) and return a similarity analysis using OpenAI.
    """
    # Extract CV file from the request
    cv_file = request.FILES.get('cv')
    job_desc_file = request.FILES.get('job_desc')
    job_desc_text = request.data.get('job_desc_text')  # In case job description is provided as text

    # Validate the presence of the CV file
    if not cv_file:
        raise ValidationError("No CV file uploaded")

    # Extract text from CV (PDF)
    cv_text = extract_text_from_pdf(cv_file)

    # Extract text from job description (Image or Text)
    if job_desc_file and job_desc_file.content_type.startswith('image/'):
        job_desc_text = extract_text_from_image(job_desc_file)  # Extract text from image
    elif not job_desc_text and job_desc_file:
        job_desc_text = extract_text_from_pdf(job_desc_file)  # Extract text if job description is also a PDF
    elif not job_desc_text:
        raise ValidationError("No job description provided")

    # Use OpenAI to compare the resume and job description
    comparison_result = compare_cv_and_job_description(cv_text, job_desc_text)

    # Return the analysis in the response
    return Response({
        'comparison_result': comparison_result,
        # 'text': cv_text
    })


def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file (handles both text-based and image-based)."""
    text = ''
    pdf_file.seek(0)  # Reset file pointer in case it was previously read
    
    # First attempt: Extract text using pdfplumber (text-based PDF)
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + ' '
    
    if text.strip():  # If text was successfully extracted using pdfplumber
        return text.strip()
    
    # Second attempt: Use OCR if no text was extracted (likely image-based PDF)
    pdf_file.seek(0)  # Reset file pointer again for OCR
    pdf_bytes = pdf_file.read()  # Read the entire PDF as bytes
    pages = convert_from_bytes(pdf_bytes)  # Convert PDF pages to images
    
    for page_image in pages:
        page_text = pytesseract.image_to_string(page_image)
        text += page_text + ' '
    
    return text.strip()  # Return extracted text (either from OCR or pdfplumber)


def extract_text_from_image(image_file):
    """Extract text from an image file using Tesseract OCR."""
    image = Image.open(image_file)
    text = pytesseract.image_to_string(image)
    return text.strip()


def compare_cv_and_job_description(cv_text, job_desc_text):
    """Use OpenAI to compare CV and job description text."""
    # Create a prompt for OpenAI to compare the CV and job description
    prompt = f"""
    I want you to compare the following resume (CV) and job description. Provide an analysis of how well the resume matches the job description (percentage), highlighting the strengths, missing skills, and overall suitability. 

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
