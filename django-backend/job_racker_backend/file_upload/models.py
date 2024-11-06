from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class JobApplication(models.Model):
    job_title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    date_applied = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
