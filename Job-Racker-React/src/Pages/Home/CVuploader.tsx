import { useDropzone, Accept } from 'react-dropzone'
import axios from 'axios'
import { useState, useCallback } from 'react'

const acceptFormats: Accept = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
}

function CVUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    setFile(uploadedFile)

    // Send the file to the backend
    const formData = new FormData()
    formData.append('pdf', uploadedFile)

    axios
      .post<{ summary: string }>(
        'http://localhost:8000/api/upload-pdf/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) => {
        setSummary(response.data.summary)
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error)
      })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptFormats,
  })

  return (
    <div
      {...getRootProps()}
      className="flex items-center justify-center w-96 h-48 border-2 border-dashed border-blue-500 rounded-lg bg-gray-50 text-gray-700 cursor-pointer mt-10 p-4"
    >
      <input {...getInputProps()} />
      {file ? (
        <p>{file.name}</p>
      ) : (
        <p>Drag & drop a PDF or Word document here, or click to select one</p>
      )}

      {summary && (
        <div>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}

export default CVUploader
