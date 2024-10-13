import { ChangeEvent, useState } from 'react'
import CVUploader from './Home/CVuploader'
import JobDescUploader from './Home/JobDescUploader'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

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
  const [loading, setLoading] = useState<boolean>(false) // Loading state for spinner
  const [title, setTitle] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')

  async function analyzeByAi(): Promise<void> {
    setLoading(true) // Start loading
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
        'http://localhost:8000/api/compare-ai/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // Handle successful response
      setResult(response.data)
    } catch (error) {
      console.error('Error submitting data:', error)
      setResult({ error: 'Failed to process your request' })
    } finally {
      setLoading(false) // Stop loading when done
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
    if (title !== '' && companyName !== '') {
      const response = await axios.post('http://localhost:8000/api/apply/', {
        job_title: title,
        company_name: companyName,
        status: 'applied',
      })

      if (response.status === 201) {
        console.log('Job application submitted:', response.data)
      } else {
        console.error('Failed to submit job application:', response.status)
      }
    } else {
      alert('Add Job title and Company Name')
    }
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
      {loading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="visually-hidden">--</span>
          </div>
        </div>
      ) : (
        <button
          className="bg-gray-400 rounded text-white px-4 py-2 text-lg"
          onClick={analyzeByAi}
        >
          Compare and Analyze
        </button>
      )}
      {result && (
        <div className="w-4/5 p-12 bg-blue-100 rounded">
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
    </div>
  )
}
