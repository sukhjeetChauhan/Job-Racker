from rest_framework import serializers
from .models import JobApplication

class PDFUploadSerializer(serializers.Serializer):
    pdf = serializers.FileField()


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id','job_title', 'company_name', 'status', 'date_applied']