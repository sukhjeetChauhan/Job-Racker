# authentication/views.py
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from stripe_app.models import UserScans


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"csrfToken": request.COOKIES['csrftoken']})



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

        # Create UserScans entry for the new user
        UserScans.create_new_user(user)

        # Authenticate and log in the user
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(
                {"message": "User created and logged in successfully"},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {"error": "User registration failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Log the user in
            login(request, user)

            # Update daily scans for the user
            try:
                user_scans = UserScans.objects.get(user=user)
                user_scans.update_daily_scans()  # Refresh daily scans if needed
            except UserScans.DoesNotExist:
                # If no UserScans object exists, create one for the user
                UserScans.objects.create(user=user)
                print(f"UserScans object created for user: {user.username}")
            except Exception as e:
                # Log or handle unexpected exceptions
                print(f"Error handling UserScans for user {user.username}: {str(e)}")

            return Response({"message": "Logged in successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# @method_decorator(csrf_exempt, name='dispatch')
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
