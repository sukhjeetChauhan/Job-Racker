import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import SpinnerLoader from '../SpinnerLoader'

const Return = () => {
  const [status, setStatus] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState<string>('')

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const sessionId = urlParams.get('session_id')

    fetch(
      `http://localhost:8000/api/stripe/session-status?session_id=${sessionId}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch session status')
        }
        return res.json()
      })
      .then((data) => {
        setStatus(data.status)
        setCustomerEmail(data.customer_email)
        // Redirect to a clean URL
        window.history.replaceState({}, document.title, '/return')
      })
      .catch((error) => {
        console.error('Error fetching session status:', error)
      })
  }, [])

  if (status === 'open') {
    return <Navigate to="/checkout" />
  }

  if (status === 'complete') {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-red-100">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-700">
            We appreciate your business! A confirmation email will be sent to{' '}
            <span className="font-medium text-gray-900">{customerEmail}</span>.
            If you have any questions, please email{' '}
            <a
              href="mailto:chauhansukhjeet@gmail.com"
              className="text-blue-500 underline hover:text-blue-700"
            >
              chauhansukhjeet@gmail.com
            </a>
            .
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="block text-center bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
            >
              Return to Home
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <SpinnerLoader />
      </div>
    </section>
  )
}

export default Return
