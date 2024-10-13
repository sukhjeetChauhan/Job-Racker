from django.db import models

# Create your models here.


class JobApplication(models.Model):
    job_title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    date_applied = models.DateTimeField(auto_now_add=True)  # Automatically sets the current date

