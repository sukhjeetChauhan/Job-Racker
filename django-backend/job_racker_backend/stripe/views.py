# payments/views.py
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Set your secret key here or use Django settings
stripe.api_key = 'sk_test_51PLgjzK3nDwi1iFQEXuJtrmPeMOd6HvEg7TjwQfp2It0lBVf3xwfV2xr5Wx1cuYhSP897DJ9E7mWqnOSfHwSbgDr00xInY0sQf'

YOUR_DOMAIN = 'http://localhost:5173'

@csrf_exempt
def create_checkout_session(request):
    try:
        session = stripe.checkout.Session.create(
            ui_mode='embedded',
            line_items=[
                {
                    'price': 'YOUR_PRICE_ID',  # Replace with your actual Price ID
                    'quantity': 1,
                },
            ],
            mode='payment',
            return_url=f"{YOUR_DOMAIN}/return?session_id={{CHECKOUT_SESSION_ID}}",
            automatic_tax={'enabled': True},
        )
        return JsonResponse({'clientSecret': session.client_secret})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
# payments/views.py
@csrf_exempt
def session_status(request):
    session_id = request.GET.get('session_id')
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return JsonResponse({
            'status': session.status,
            'customer_email': session.customer_details.email
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



