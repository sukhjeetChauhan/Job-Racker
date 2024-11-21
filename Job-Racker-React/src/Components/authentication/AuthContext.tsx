// AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { baseApiUrl } from '../../apis/authenticationApis'

axios.defaults.withCredentials = true

// Define shape of available scans object
interface Availablescans {
  daily_scans_left: number
  bought_scans_left: number
  total_scans_left: number
}

const initialScans = {
  daily_scans_left: 0,
  bought_scans_left: 0,
  total_scans_left: 0,
}

// Define the shape of the context value
export interface AuthContextType {
  isLoggedIn: boolean
  user: string
  firstName: string
  csrfToken: string
  refetch: boolean
  setRefetch: (value: boolean) => void
  availableScans: Availablescans
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
  const [availableScans, setAvailableScans] =
    useState<Availablescans>(initialScans)

  const checkSession = async () => {
    try {
      const response = await axios.get(
        `${baseApiUrl}/api/auth/session-status/`,
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
      .get(`${baseApiUrl}/api/auth/csrf-token/`)
      .then((response) => {
        setCsrfToken(response.data.csrfToken)
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error)
      })
  }

  const getAvailableScans = () => {
    // Fetch number of scans available
    axios
      .get(`${baseApiUrl}/api/stripe/available-scans/`)
      .then((response) => {
        setAvailableScans(response.data.scans)
      })
      .catch((error) => {
        console.error('Error fetching available scans:', error)
        setAvailableScans(initialScans)
      })
  }

  useEffect(() => {
    getCsrfToken()
    checkSession()
    getAvailableScans()
  }, [refetch])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        firstName,
        csrfToken,
        refetch,
        setRefetch,
        availableScans,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
