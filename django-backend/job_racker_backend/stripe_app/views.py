# payments/views.py
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserScans
from django.contrib.auth.decorators import login_required
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Access the Stripe secret key
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')

# Set it for Stripe API usage
stripe.api_key = STRIPE_SECRET_KEY


YOUR_DOMAIN = 'http://localhost:5173'

@csrf_exempt
def create_checkout_session(request):
    
    try:
        session = stripe.checkout.Session.create(
            ui_mode='embedded',
            line_items=[
                    {
                    'price_data': {
                        'currency': 'nzd',
                        'product_data': {
                            'name': 'Get 30 Scans',
                        },
                        'unit_amount': 500,  # 5 NZD in cents
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            return_url=f"{YOUR_DOMAIN}/return?session_id={{CHECKOUT_SESSION_ID}}",
            # automatic_tax={'enabled': True},
        )
        return JsonResponse({'clientSecret': session.client_secret})
    except Exception as e:
        print(str(e))
        return JsonResponse({'error': str(e)}, status=400)
    
# payments/views.py
@csrf_exempt
def session_status(request):
    session_id = request.GET.get('session_id')
    if not session_id:
        return JsonResponse({'error': 'Session ID is required'}, status=400)

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return JsonResponse({
            'status': session.status,
            'customer_email': session.customer_details.email,
        })
    except stripe.error.InvalidRequestError:
        return JsonResponse({'error': 'Invalid session ID'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@login_required
def get_available_scans(request):
    
    """API to fetch the number of available scans for the authenticated user."""
    try:
        user_scans = UserScans.objects.get(user=request.user)
        available_scans = user_scans.get_available_scans()
        return JsonResponse({"scans": available_scans}, status=200)
    except UserScans.DoesNotExist:
        return JsonResponse({"error": "User scans record not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)




