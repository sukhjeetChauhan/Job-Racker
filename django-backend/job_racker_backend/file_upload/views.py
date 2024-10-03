# from django.shortcuts import render

# Create your views here.

import pdfplumber
from transformers import pipeline

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PDFUploadSerializer

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")


@api_view(['POST'])
def upload_pdf(request):
    serializer = PDFUploadSerializer(data=request.data)
    if serializer.is_valid():
        pdf_file = serializer.validated_data['pdf']
        
        # Read the PDF and extract text
        with pdfplumber.open(pdf_file) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() + '\n'

        # Summarize the text using AI
        # Assuming you have an AI model set up
        # summary = get_ai_summary(text)

        return Response({'summary': text}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_ai_summary(text):
    
    return summarizer(text, max_length=130, min_length=30, do_sample=False)
