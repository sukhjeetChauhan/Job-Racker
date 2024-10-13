# file_upload/urls.py
from django.urls import path
from .views import compare_ai
from .views import create_job_application

urlpatterns = [
    path('compare-ai/', compare_ai, name='compare-ai'),
    path('apply/', create_job_application, name='create-job-application'),
]
