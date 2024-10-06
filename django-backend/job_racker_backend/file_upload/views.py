from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
import pdfplumber
from transformers import pipeline
from PIL import Image

# Global model load (loaded once and reused)
ocr_pipeline = pipeline("image-to-text", model="microsoft/trocr-base-printed")
keyword_extractor = pipeline("ner", grouped_entities=True, model="dbmdz/bert-large-cased-finetuned-conll03-english")


@api_view(['POST'])
def compare_ai(request):
    """
    Compare CV and job description (image or text) and return keyword match percentage.
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
        job_desc_text = extract_text_from_image(job_desc_file)  # Extract text from image using the preloaded model
    elif not job_desc_text:
        raise ValidationError("No job description provided")

    # Extract keywords from both the CV and job description
    cv_keywords = extract_keywords(cv_text)
    job_desc_keywords = extract_keywords(job_desc_text)

    # Compare keywords and calculate match percentage
    match_percentage, missing_keywords = compare_keywords(cv_keywords, job_desc_keywords)

    # Return match percentage and missing keywords in the response
    return Response({
        'match_percentage': match_percentage,
        'missing_keywords': missing_keywords
    })


def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    with pdfplumber.open(pdf_file) as pdf:
        text = ''
        for page in pdf.pages:
            text += page.extract_text() + ' '
    return text.strip()


def extract_text_from_image(image_file):
    """Use the preloaded Hugging Face model to extract text from an image."""
    image = Image.open(image_file)
    
    # Use preloaded OCR model
    text = ocr_pipeline(image)
    
    extracted_text = text[0]['generated_text'] if text else ''
    return extracted_text.strip()


def extract_keywords(text):
    """Use preloaded Hugging Face pipeline to extract keywords from the text."""
    # Use preloaded NER model
    entities = keyword_extractor(text)
    
    # Extract keywords from the entities
    keywords = {entity['word'] for entity in entities if entity['entity_group'] in ['ORG', 'MISC', 'PER', 'LOC']}
    return keywords


def compare_keywords(cv_keywords, job_desc_keywords):
    """Compare extracted keywords from CV and job description."""
    # Calculate intersection and differences between keyword sets
    matched_keywords = cv_keywords.intersection(job_desc_keywords)
    missing_keywords = job_desc_keywords - cv_keywords

    # Calculate match percentage
    total_job_keywords = len(job_desc_keywords)
    match_percentage = (len(matched_keywords) / total_job_keywords) * 100 if total_job_keywords > 0 else 0

    return round(match_percentage, 2), list(missing_keywords)
