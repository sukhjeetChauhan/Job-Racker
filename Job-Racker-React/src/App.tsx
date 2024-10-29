import { Outlet } from 'react-router-dom'
import { AuthProvider } from './Components/authentication/AuthContext'

function App() {
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  )
}

export default App
