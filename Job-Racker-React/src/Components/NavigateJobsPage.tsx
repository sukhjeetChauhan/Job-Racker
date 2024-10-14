import { useNavigate } from 'react-router-dom'

export default function NavigateJobsPage() {
  const navigate = useNavigate()

  function handleClick() {
    navigate('/jobs')
  }

  return (
    <div className="w-full p-12 flex justify-end">
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded bg-blue-500 text-white"
      >
        My Jobs
      </button>
    </div>
  )
}
