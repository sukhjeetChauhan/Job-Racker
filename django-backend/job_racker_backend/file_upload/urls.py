# file_upload/urls.py
from django.urls import path
from .views import compare_ai, update_job_application_status
from .views import create_job_application

urlpatterns = [
    path('compare-ai/', compare_ai, name='compare-ai'),
    path('apply/', create_job_application, name='create-job-application'),
    path('apply/<int:pk>/', update_job_application_status, name='update_job_application_status'),
]
