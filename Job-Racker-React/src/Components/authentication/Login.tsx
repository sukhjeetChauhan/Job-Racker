import { useContext, useState } from 'react'
import { loginUser, registerUser } from '../../apis/authenticationApis' // Adjust this path if needed
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

const LoginComponent = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false) // Toggle between login and register
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const handleLogin = async () => {
    try {
      const response = await loginUser(
        username,
        password,
        auth?.csrfToken as string
      )

      if (response?.data.message === 'Logged in successfully') {
        // Assume the API returns a response with a `message` field
        setMessage(response?.data.message || 'Logged in successfully')

        // Redirect or perform actions after login
        setTimeout(() => {
          auth?.setRefetch(!auth.refetch)
          navigate('/')
        }, 2000)
      } else {
        setMessage('Invalid credentials')
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string; message?: string }>

      if (err.response && err.response.data) {
        // Prefer a `message` field if it exists; fallback to `error`
        setMessage(
          err.response.data.message || err.response.data.error || 'Login failed'
        )
      } else {
        setMessage('An unexpected error occurred')
      }
    }
  }

  const handleRegister = async () => {
    try {
      await registerUser(
        username,
        password,
        firstName,
        lastName,
        auth?.csrfToken as string
      )
      setMessage('User registered successfully. You can now log in.')
      setIsRegisterMode(false)
    } catch (error) {
      const err = error as AxiosError<{ error: string }>
      if (err.response && err.response.data) {
        setMessage(err.response.data.error || 'Registeration failed')
      } else {
        setMessage('An unexpected error occurred')
      }
    }
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (isRegisterMode) {
      handleRegister()
    } else {
      handleLogin()
    }
  }

  return (
    <div className="w-full h-screen px-16 pt-32 bg-gradient-to-br from-blue-100 to-red-100">
      <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isRegisterMode ? 'Register' : 'Login'}
        </h2>
        {message && <p className="text-red-600 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {isRegisterMode && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-red-400 hover:bg-green-700 rounded-lg"
          >
            {isRegisterMode ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="w-full py-2 mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
          {isRegisterMode ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  )
}

export default LoginComponent
