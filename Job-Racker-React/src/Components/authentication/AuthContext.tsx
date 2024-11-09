// AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true

// Define the shape of the context value
export interface AuthContextType {
  isLoggedIn: boolean
  user: string
  firstName: string
  csrfToken: string
  refetch: boolean
  setRefetch: (value: boolean) => void
}

// Define props for the AuthProvider, including children
interface AuthProviderProps {
  children: React.ReactNode
}

// Initialize the AuthContext with undefined to enforce the provider pattern
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState('')
  const [firstName, setFirstName] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const [refetch, setRefetch] = useState(false)

  const checkSession = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/auth/session-status/',
        {
          withCredentials: true,
        }
      )
      setIsLoggedIn(response.data.isLoggedIn)
      setUser(response.data.username)
      setFirstName(response.data.firstname)
    } catch (error) {
      console.log(error)
      setIsLoggedIn(false)
    }
  }

  const getCsrfToken = () => {
    // Fetch CSRF token on component mount
    axios
      .get('http://localhost:8000/api/auth/csrf-token/')
      .then((response) => {
        setCsrfToken(response.data.csrfToken)
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error)
      })
  }

  useEffect(() => {
    console.log('hello')

    getCsrfToken()
    checkSession()
    console.log(refetch)
  }, [refetch])

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, firstName, csrfToken, refetch, setRefetch }}
    >
      {children}
    </AuthContext.Provider>
  )
}
