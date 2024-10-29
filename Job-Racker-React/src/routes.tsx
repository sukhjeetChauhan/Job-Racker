import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './App'
import Home from './Pages/Home'
import JobsPage from './Pages/JobsPage'
import Login from './Components/authentication/Login'

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/login" element={<Login />} />
    </Route>
  </>
)

export default routes
