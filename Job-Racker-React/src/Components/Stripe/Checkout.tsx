import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { useCallback } from 'react'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripePromise = loadStripe(
  'pk_test_51PLgjzK3nDwi1iFQFXCVEUyURYb88KGNqu0T1CF1ndZPHXuzFQoDlz845Kw7Ui5YUyMHItCWGBlmNEoCjs8r7kY200XEcGW366'
)

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch('http://localhost:8000/api/stripe/create-checkout-session/', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret)
  }, [])

  const options = { fetchClientSecret }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckoutForm
