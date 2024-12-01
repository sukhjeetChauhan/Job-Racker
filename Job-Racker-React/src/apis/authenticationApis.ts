import axios, { AxiosError } from 'axios'

export const baseApiUrl = import.meta.env.VITE_API_BASE_URL

interface ErrorResponse {
  error: string
}

// Register User
export const registerUser = async (
  username: string,
  password: string,
  first_name: string,
  last_name: string,
  csrfToken: string
) => {
  try {
    const response = await axios.post(
      `${baseApiUrl}/api/auth/register/`,
      {
        username,
        password,
        first_name,
        last_name,
      },
      {
        headers: {
          'X-CSRFToken': csrfToken || '', // Include the CSRF token
        },
        withCredentials: true, // Include cookies in the request (important for sessions)
      }
    )
    console.log(response.data.message)
  } catch (error) {
    const err = error as AxiosError<ErrorResponse> // Define the error response type
    if (err.response && err.response.data) {
      console.error(err.response.data.error) // Now TypeScript recognizes err.response.data.error as a string
    } else {
      console.error('An unexpected error occurred')
    }
  }
}

// Login User
export const loginUser = async (
  username: string,
  password: string,
  csrfToken: string
) => {
  try {
    const response = await axios.post(
      `${baseApiUrl}/api/auth/login/`,
      {
        username,
        password,
      },
      {
        headers: { 'X-CSRFToken': csrfToken || '' },
        withCredentials: true,
      }
    )
    alert(response.data.message)
    return response
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>
    if (err.response && err.response.data) {
      console.error(err.response.data.error)
    } else {
      console.error('An unexpected error occurred')
    }
  }
}

// Logout User
export const logoutUser = async (token: string) => {
  try {
    const response = await axios.post(
      `${baseApiUrl}/api/auth/logout/`,
      {}, // An empty body if no data is required
      {
        headers: {
          'X-CSRFToken': token, // Attach CSRF token correctly
        },
        withCredentials: true, // Ensures cookies are sent with request
      }
    )
    alert(response.data.message)
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>
    if (err.response && err.response.data) {
      console.error(err.response.data.error)
    } else {
      console.error('An unexpected error occurred')
    }
  }
}

// Function to check session status
export const checkSession = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}/api/auth/session-status/`, {
      withCredentials: true,
    })
    return response
  } catch (error) {
    return error
  }
}
