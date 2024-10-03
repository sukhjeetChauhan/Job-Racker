from rest_framework import serializers

class PDFUploadSerializer(serializers.Serializer):
    pdf = serializers.FileField()