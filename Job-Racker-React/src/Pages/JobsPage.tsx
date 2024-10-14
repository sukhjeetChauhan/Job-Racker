import { useEffect, useState } from 'react'
import { getAllJobs } from '../apis/jobApis'

type Status = 'applied' | 'rejected' | 'interviewed' | 'offer'

type Jobs = {
  id: number
  job_title: string
  company_name: string
  status: Status
  date_applied: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Jobs[] | undefined | null>(null)
  useEffect(() => {
    async function fetchData() {
      const allJobs = await getAllJobs()
      setJobs(allJobs)
    }

    fetchData()
  }, [])

  function convertDate(date: string) {
    const dateNow = new Date(date)
    // Convert to New Zealand format (DD/MM/YYYY)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
    const nzFormattedDate = dateNow.toLocaleDateString('en-NZ', options)
    return nzFormattedDate
  }
  return (
    <div className="w-4/5 mx-auto my-32 bg-gray-200 rounded min-h-[500px] p-8">
      <table className="min-w-full table-auto border-collapse border border-gray-500">
        <thead>
          <th className="border border-gray-500 px-4 py-2">Job Title</th>
          <th className="border border-gray-500 px-4 py-2">Company Name</th>
          <th className="border border-gray-500 px-4 py-2">Status</th>
          <th className="border border-gray-500 px-4 py-2">Date applied</th>
        </thead>
        <tbody>
          {jobs?.map((job, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-blue-200' : 'bg-blue-100'}>
              <td className="border border-gray-500 px-4 py-2 text-center">
                {job.job_title}
              </td>
              <td className="border border-gray-500 px-4 py-2 text-center">
                {job.company_name}
              </td>
              <td className="border border-gray-500 px-4 py-2 text-center">
                {job.status}
              </td>
              <td className="border border-gray-500 px-4 py-2 text-center">
                {convertDate(job.date_applied)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
