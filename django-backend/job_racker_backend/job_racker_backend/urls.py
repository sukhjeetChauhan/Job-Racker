
# job_racker/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),  # Prefix all authentication URLs with /api/auth/
    path('api/', include('file_upload.urls')), # path for file upload apis
    path('api/stripe/', include('stripe_app.urls')), # stripe api path
]
