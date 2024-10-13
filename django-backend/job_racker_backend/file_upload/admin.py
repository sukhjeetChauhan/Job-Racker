from django.contrib import admin
from .models import JobApplication

# Register your models here.
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company_name', 'status', 'date_applied')  # Include the date_applied field

admin.site.register(JobApplication, JobApplicationAdmin)
