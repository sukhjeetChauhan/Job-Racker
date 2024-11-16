import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const Return = () => {
  const [status, setStatus] = useState(null)
  const [customerEmail, setCustomerEmail] = useState('')

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
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }

  return null
}

export default Return
