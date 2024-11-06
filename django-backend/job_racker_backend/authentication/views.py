# authentication/views.py
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password

class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        
        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the new user
        user = User.objects.create(
            username=username,
            password=make_password(password),
            first_name=first_name,
            last_name=last_name
            
        )
        
        # Authenticate and log in the user
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "User created and logged in successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "User registration failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Logged in successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    

class SessionStatusView(APIView):
    def get(self, request):
        print(request.user)
        if request.user.is_authenticated:
            return JsonResponse({"isLoggedIn": True, "username": request.user.username, "firstname": request.user.first_name}, status=status.HTTP_200_OK)
        else:
            print("User not authenticated")  # Debugging line
            return JsonResponse({"isLoggedIn": False, "username": '',"firstname": '' }, status=status.HTTP_200_OK)
