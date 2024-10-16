import { ChangeEvent, useEffect, useState } from 'react'
import { getAllJobs, updateStatus } from '../apis/jobApis'

export type Status = 'applied' | 'rejected' | 'interviewed' | 'offer'

type Jobs = {
  id: number
  job_title: string
  company_name: string
  status: Status
  date_applied: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Jobs[] | undefined | null>(null)
  const [filterOption, setFilterOption] = useState<string>('')
  const [filterInput, setFilterInput] = useState<string>('')
  const [refetch, setRefetch] = useState<boolean>(false)
  useEffect(() => {
    async function fetchData() {
      const allJobs = await getAllJobs()
      setJobs(allJobs)
    }

    fetchData()
  }, [refetch])

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

  function setStatusColor(status: string) {
    const res =
      status === 'applied'
        ? 'bg-transparent'
        : status === 'rejected'
        ? 'bg-red-300'
        : status === 'interviewed'
        ? 'bg-yellow-300'
        : 'bg-green-300'
    return res
  }

  async function handleChange(
    e: ChangeEvent<HTMLSelectElement>,
    id: number,
    status: string
  ): Promise<void> {
    const userConfirmed = window.confirm('Are you sure you want to proceed?')

    if (userConfirmed) {
      if (e.target.value !== status)
        await updateStatus(id, e.target.value as Status)
      setRefetch(!refetch)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="w-4/5 mx-auto">
        <div className="ml-auto w-fit mt-16 flex gap-2">
          <p className="text-lg">Filter By:</p>
          <select
            value={filterOption}
            className="border-2 border-gray-400 rounded bg-gray-100 p-[3px]"
          >
            <option value="job_title">Job Title</option>
            <option value="company_name">Company Name</option>
            <option value="date_applied">Date</option>
          </select>
          <input
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            className="border-2 border-gray-400 rounded bg-gray-100 p-[3px]"
          />
          <button className="bg-blue-500 px-4 rounded text-white">
            Search
          </button>
        </div>
      </div>
      <div className="w-4/5 mx-auto mb-32 mt-16 bg-gray-200 rounded min-h-[500px] p-8">
        <table className="min-w-full table-auto border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="border border-gray-500 px-4 py-2">Job Title</th>
              <th className="border border-gray-500 px-4 py-2">Company Name</th>
              <th className="border border-gray-500 px-4 py-2">Status</th>
              <th className="border border-gray-500 px-4 py-2">Date applied</th>
            </tr>
          </thead>
          <tbody>
            {jobs
              ?.sort(
                (a, b) =>
                  new Date(b.date_applied).getTime() -
                  new Date(a.date_applied).getTime()
              )
              .map((job, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-blue-200' : 'bg-blue-100'}
                >
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {job.job_title}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {job.company_name}
                  </td>
                  <td
                    className={`${setStatusColor(
                      job.status
                    )} border border-gray-500 px-4 py-2 text-center flex justify-between gap-2 relative`}
                  >
                    <select
                      className=" bg-transparent w-full focus:outline-none capitalize"
                      value={job.status}
                      onChange={(e) => handleChange(e, job.id, job.status)}
                    >
                      <option value={job.status}>{job.status}</option>
                      <option>----------</option>
                      {job.status !== 'applied' && (
                        <option value="applied">Applied</option>
                      )}
                      <option value="rejected">Rejected</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="offer">Offer</option>
                    </select>
                  </td>
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {convertDate(job.date_applied)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
