import { useState, useCallback, ClipboardEvent } from 'react'
import { useDropzone } from 'react-dropzone'

export default function JobDescUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file drop
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]) // Set the dropped file (e.g., an image)
    }
  }, [])

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    // Handle pasted text
    const text = event.clipboardData.getData('Text')
    if (text) {
      setPastedText(text)
    }
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'], // Accepting image file types
    },
    noClick: true, // Disable automatic file dialog on click
  })

  return (
    <div className="flex flex-col gap-4 mt-10 items-center">
      <h2 className="text-red-500 capitalize text-xl font-semibold">
        Job Description
      </h2>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        onPaste={onPaste}
        className="flex items-center justify-center w-96 h-48 border-2 border-dashed border-red-500 rounded-lg bg-gray-50 text-gray-700 cursor-text p-4 overflow-y-auto"
      >
        <input {...getInputProps()} />
        {!pastedText && (
          <p>Drag & drop an image here, or paste text with Ctrl+V</p>
        )}
        {file && <p>Uploaded file: {file.name}</p>}
        {pastedText && <p>{pastedText}</p>}
      </div>

      <div className="flex gap-8">
        {/* Separate Button for File Upload */}
        <button
          type="button"
          onClick={open}
          className="px-[20px] py-[10px] bg-blue-500 text-white rounded cursor-pointer"
        >
          Click to Upload an Image
        </button>
        <button
          type="button"
          onClick={() => setPastedText('')}
          className="px-[20px] py-[10px] bg-red-500 text-white rounded cursor-pointer"
        >
          Clear Text
        </button>
      </div>
    </div>
  )
}
