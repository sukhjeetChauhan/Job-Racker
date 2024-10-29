// AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

// Define the shape of the context value
export interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
}

// Define props for the AuthProvider, including children
interface AuthProviderProps {
  children: React.ReactNode
}

// Initialize the AuthContext with undefined to enforce the provider pattern
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkSession = async () => {
    try {
      const response = await axios.get('/api/auth/session-status/', {
        withCredentials: true,
      })
      setIsLoggedIn(response.data.isLoggedIn)
    } catch (error) {
      console.log(error)
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}
