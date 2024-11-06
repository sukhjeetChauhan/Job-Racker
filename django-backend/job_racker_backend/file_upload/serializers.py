from rest_framework import serializers
from .models import JobApplication

class PDFUploadSerializer(serializers.Serializer):
    pdf = serializers.FileField()


class JobApplicationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = JobApplication
        fields = ['id','job_title', 'company_name', 'status','username', 'date_applied']