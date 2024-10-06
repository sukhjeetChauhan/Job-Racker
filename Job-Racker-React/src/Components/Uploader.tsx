import { useState } from 'react'
import CVUploader from './Home/CVuploader'
import JobDescUploader from './Home/JobDescUploader'
import axios from 'axios'

// Define TypeScript types for the result state
type SuccessResult = {
  match_percentage: number
  missing_keywords: string[]
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-12">
        <CVUploader CVfile={CVfile} setCVFile={setCVFile} />
        <JobDescUploader
          jobDescFile={jobDescFile}
          setJobDescFile={setJobDescFile}
          pastedText={pastedText}
          setPastedText={setPastedText}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
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
        <div>
          <h2>Result</h2>
          {'error' in result ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <div>
              <p>Match Percentage: {result.match_percentage}%</p>
              <p>Missing Keywords: {result.missing_keywords.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
