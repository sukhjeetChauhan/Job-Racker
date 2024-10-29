import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  function navigateToJobs() {
    navigate('/jobs')
  }

  function navigateToLogin() {
    navigate('/login')
  }

  return (
    <div className="w-full p-12 flex justify-end">
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
