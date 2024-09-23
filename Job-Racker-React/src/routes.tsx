import { Route, createRoutesFromElements } from 'react-router-dom'
import App from './App'
// import Home from './Pages/Home'

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<App />}>
      {/* <Route index element={<Home />} /> */}
    </Route>
  </>
)

export default routes
