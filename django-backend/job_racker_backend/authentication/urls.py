# authentication/urls.py
from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutUserView, SessionStatusView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('session-status/', SessionStatusView.as_view(), name='session_status'),
]