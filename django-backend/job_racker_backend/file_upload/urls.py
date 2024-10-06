# file_upload/urls.py
from django.urls import path
from .views import compare_ai

urlpatterns = [
    path('compare-ai/', compare_ai, name='compare-ai'),
]
