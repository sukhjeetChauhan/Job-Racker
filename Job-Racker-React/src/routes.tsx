import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './App'
import Home from './Pages/Home'
import JobsPage from './Pages/JobsPage'
import Login from './Components/authentication/Login'
import CheckoutForm from './Components/Stripe/Checkout'
import Return from './Components/Stripe/Return'

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/return" element={<Return />} />
    </Route>
  </>
)

export default routes
