import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './authentication/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const user = useContext(AuthContext)
  console.log(user?.firstName)
  function navigateToJobs() {
    navigate('/jobs')
  }

  function navigateToLogin() {
    navigate('/login')
  }

  return (
    <div className="w-full p-12 flex justify-between">
      <div>
        <p className="text-blue-500 text-xl font-semibold">{`Welcome ${
          user?.user !== ''
            ? user?.firstName !== ''
              ? user?.firstName
              : user?.user
            : ''
        }`}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={navigateToLogin}
          className="px-4 py-2 rounded bg-red-400 text-white"
        >
          Login/Register
        </button>
        <button
          onClick={navigateToJobs}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          My Jobs
        </button>
      </div>
    </div>
  )
}
