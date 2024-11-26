import { ChangeEvent, useContext, useState } from 'react'
import CVUploader from './uploader-Subcomponent/CVuploader'
import JobDescUploader from './uploader-Subcomponent/JobDescUploader'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import SpinnerLoader from '../SpinnerLoader'
import { AuthContext } from '../authentication/AuthContext'
import { baseApiUrl } from '../../apis/authenticationApis'

// Define TypeScript types for the result state
type SuccessResult = {
  comparison_result: string
}

type ErrorResult = {
  error: string
}

type ResultState = SuccessResult | ErrorResult | null

export default function Uploader() {
  const [CVfile, setCVFile] = useState<File | null>(null)
  const [jobDescFile, setJobDescFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState<string>('')
  const [result, setResult] = useState<ResultState>(null)
  const [resultLoading, setResultLoading] = useState<boolean>(false) // Loading state for result spinner
  const [jobPageloading, setJobPageLoading] = useState<boolean>(false) // Loading state for job Page spinner
  const [title, setTitle] = useState<string>('')
  const [noScans, setNoScans] = useState(false)
  const [companyName, setCompanyName] = useState<string>('')

  const userData = useContext(AuthContext)

  const navigate = useNavigate()

  async function analyzeByAi(): Promise<void> {
    if (
      (userData?.availableScans.total_scans_left as number) > 0 &&
      userData?.isLoggedIn
    ) {
      setResultLoading(true) // Start loading
      // Create form data object to send to the backend
      const formData = new FormData()
      if (CVfile) {
        formData.append('cv', CVfile) // Append CV file
      }
      if (jobDescFile) {
        formData.append('job_desc', jobDescFile) // Append Job Description image file
      }
      if (pastedText) {
        formData.append('job_desc_text', pastedText) // Append Job Description text
      }

      try {
        // Post the data using axios
        const response = await axios.post(
          `${baseApiUrl}/api/compare-ai/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              // 'X-CSRFToken': csrfToken, // Include CSRF token here
            },
            // withCredentials: true,
          }
        )

        // Handle successful response
        setResult(response.data)
        // console.log(response.data)
      } catch (error) {
        console.error('Error submitting data:', error)
        setResult({ error: 'Failed to process your request' })
      } finally {
        userData.setRefetch(!userData.refetch)
        setResultLoading(false) // Stop loading when done
      }
    }

    if (
      userData?.availableScans.total_scans_left === 0 &&
      userData.isLoggedIn
    ) {
      setNoScans(true)
    }

    if (!userData?.isLoggedIn) {
      alert(
        'Please Sign In to use this feature and get your 2 free daily scans.'
      )
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.name == 'title') {
      setTitle(event.target.value)
    }
    if (event.target.name == 'company') {
      setCompanyName(event.target.value)
    }
  }

  async function createJob() {
    setJobPageLoading(true)
    if (title !== '' && companyName !== '') {
      const response = await axios.post(
        `${baseApiUrl}/api/apply/`,
        {
          job_title: title,
          company_name: companyName,
          status: 'applied',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 201) {
        console.log('Job application submitted:', response.data)
        navigate('/jobs')
      } else {
        console.error('Failed to submit job application:', response.status)
      }
    } else {
      alert('Add Job title and Company Name')
    }
    setJobPageLoading(false)
  }

  return (
    <div className="flex flex-col gap-12 items-center pb-20">
      <div className="flex gap-12">
        <CVUploader CVfile={CVfile} setCVFile={setCVFile} />
        <JobDescUploader
          jobDescFile={jobDescFile}
          setJobDescFile={setJobDescFile}
          pastedText={pastedText}
          setPastedText={setPastedText}
        />
      </div>
      <div className="flex gap-4">
        <input
          name="title"
          type="text"
          placeholder="Job Title"
          className="px-4 py-2 rounded bg-gray-100 border-blue-300 border-2 text-lg"
          value={title}
          onChange={handleChange}
        />
        <input
          name="company"
          type="text"
          placeholder="Company Name"
          className="px-4 py-2 rounded bg-gray-100 border-blue-300 border-2 text-lg"
          value={companyName}
          onChange={handleChange}
        />
      </div>
      {resultLoading ? (
        <SpinnerLoader />
      ) : (
        <button
          className="bg-gray-400 rounded text-white px-4 py-2 text-lg"
          onClick={analyzeByAi}
        >
          Compare and Analyze
        </button>
      )}
      {noScans && (
        <p className="text-xl text-blue-500">
          You have run out of all your scans. Click
          <button
            onClick={() => {
              navigate('/checkout')
            }}
            className="px-4 py-[2px] bg-white text-red-400 border-2 border-gray-400 rounded mx-2"
          >
            Here
          </button>
          to buy more
        </p>
      )}
      {result && (
        <div className="w-4/5 p-12 bg-blue-100 rounded shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-500 mb-8">Result</h2>
          {'error' in result ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <div>
              <ReactMarkdown>{result.comparison_result}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
      {result && (
        <button
          onClick={createJob}
          className="px-[20px] py-[10px] bg-blue-500 text-white text-xl rounded cursor-pointer"
        >
          Rack This Job
        </button>
      )}
      {jobPageloading && result && <SpinnerLoader />}
    </div>
  )
}
