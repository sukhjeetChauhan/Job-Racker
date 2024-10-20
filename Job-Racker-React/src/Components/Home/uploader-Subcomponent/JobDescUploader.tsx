import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface JobDescUploaderProps {
  jobDescFile: File | null // jobDescFile is a File object or null
  setJobDescFile: (file: File | null) => void // Function to set the jobDescFile state
  pastedText: string // pastedText is a string
  setPastedText: (text: string) => void // Function to set the pastedText state
}

export default function JobDescUploader({
  jobDescFile,
  setJobDescFile,
  pastedText,
  setPastedText,
}: JobDescUploaderProps) {
  const [jobText, setJobText] = useState<boolean | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Handle file drop
      if (acceptedFiles.length) {
        setJobDescFile(acceptedFiles[0]) // Set the dropped file (e.g., an image)
      }
    },
    [setJobDescFile]
  )

  // const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
  //   // Handle pasted text
  //   const text = event.clipboardData.getData('Text')
  //   if (text) {
  //     setPastedText(text)
  //   }
  // }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'], // Accepting image file types
    },
  })

  return (
    <div className="flex flex-col gap-4 mt-10 items-center">
      <h2 className="text-red-400 capitalize text-xl font-semibold">
        Job Description
      </h2>
      <div className="flex items-center justify-center w-96 h-48 border-2 border-dashed border-red-400 rounded-lg bg-gray-50 text-gray-700 p-4 overflow-y-auto">
        {jobText === null && (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setJobText(false)}
              className="px-[20px] py-[10px] bg-red-400 text-white rounded cursor-pointer"
            >
              Upload Image
            </button>
            <p className="text-red-400 uppercase text-xl">OR</p>
            <button
              onClick={() => setJobText(true)}
              className="px-[20px] py-[10px] bg-red-400 text-white rounded cursor-pointer"
            >
              Paste Text
            </button>
          </div>
        )}

        {/* text area */}
        {jobText && (
          <textarea
            name="jobDesc"
            className="w-full h-full bg-transparent"
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
          ></textarea>
        )}

        {/* Dropzone Area */}
        {!jobText && jobText !== null && (
          <div
            {...getRootProps()}
            className="cursor-pointer h-full w-full flex items-center justify-center"
          >
            <input {...getInputProps()} />
            {!jobDescFile && <p>Drag & drop your Job image here</p>}
            {jobDescFile && <p>Uploaded file: {jobDescFile.name}</p>}
            {/* {pastedText && <p>{pastedText}</p>} */}
          </div>
        )}
      </div>
      <div className="flex gap-8">
        {/* Separate Button for File Upload */}

        {jobText && (
          <button
            type="button"
            onClick={() => setPastedText('')}
            className="px-[20px] py-[10px] bg-red-400 text-white rounded cursor-pointer"
          >
            Clear Text
          </button>
        )}

        {jobText !== null && (
          <button
            type="button"
            onClick={() => setJobText(null)}
            className="px-[20px] py-[10px] bg-red-400 text-white rounded cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
