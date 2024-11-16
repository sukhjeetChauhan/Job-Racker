# payments/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
    path('session-status/', views.session_status, name='session_status'),
    path('available-scans/', views.get_available_scans, name='get_available_scans'),
]
