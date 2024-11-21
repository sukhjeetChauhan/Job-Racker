import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './authentication/AuthContext'
import { logoutUser } from '../apis/authenticationApis'

export default function Header() {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  

  function navigateToJobs() {
    navigate('/jobs')
  }

  function navigateToLogin() {
    navigate('/login')
  }

  async function handleLogout() {
    await logoutUser(auth?.csrfToken as string)
    // setTimeout(() => {
    auth?.setRefetch(!auth.refetch)
    // }, 2000)
  }

  return (
    <div className="w-full p-12 flex justify-between items-center">
      <div>
        <p className="text-blue-500 text-2xl font-semibold">{`Welcome ${
          auth?.user !== ''
            ? auth?.firstName !== ''
              ? auth?.firstName
              : auth?.user
            : ''
        }`}</p>
        <div className="flex gap-2 items-center mt-2">
          <p className="text-lg font-semibold">
            Scans Available:{' '}
            <span>{auth?.availableScans.total_scans_left}</span>
          </p>
        </div>
      </div>
      {auth?.isLoggedIn || (
        <div>
          <p className="text-lg text-red-400 font-semibold">
            Please Sign In to use the Scan services and get 2 free scans daily
          </p>
        </div>
      )}
      <div className="flex gap-2 items-center">
        {auth?.isLoggedIn && (
          <button
            className="px-4 py-2 rounded bg-gray-400 text-white"
            onClick={() => navigate('/checkout')}
          >
            Buy More Scans
          </button>
        )}
        {auth?.isLoggedIn && (
          <button
            onClick={navigateToJobs}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            My Jobs
          </button>
        )}
        {auth?.isLoggedIn ? (
          <button
            className="px-4 py-2 rounded bg-red-400 text-white"
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={navigateToLogin}
            className="px-4 py-2 rounded bg-red-400 text-white"
          >
            Login/Register
          </button>
        )}
      </div>
    </div>
  )
}
