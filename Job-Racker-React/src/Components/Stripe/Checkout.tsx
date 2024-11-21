import { loadStripe } from '@stripe/stripe-js'
import { baseApiUrl } from '../../apis/authenticationApis'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { useCallback } from 'react'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripeKey = import.meta.env.VITE_STRIPE_KEY

const stripePromise = loadStripe(stripeKey)

const CheckoutForm = () => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(`${baseApiUrl}/api/stripe/create-checkout-session/`, {
      method: 'POST',
      credentials: 'include',
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
