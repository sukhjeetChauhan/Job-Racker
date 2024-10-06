import { useDropzone, Accept } from 'react-dropzone'

import { useCallback } from 'react'

interface CVUploaderProps {
  CVfile: File | null // CVfile is a File object or null
  setCVFile: (file: File | null) => void // setCVFile is a function that updates the CVfile state
}

const acceptFormats: Accept = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
}

function CVUploader({ CVfile, setCVFile }: CVUploaderProps) {
  // const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0]
      setCVFile(uploadedFile)

      // Send the file to the backend
      const formData = new FormData()
      formData.append('pdf', uploadedFile)
    },
    [setCVFile]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptFormats,
  })

  return (
    <div className="flex flex-col gap-4 mt-10 items-center">
      <h2 className="text-blue-500 capitalize text-xl font-semibold">
        CV Upload
      </h2>
      <div
        {...getRootProps()}
        className="flex items-center justify-center w-96 h-48 border-2 border-dashed border-blue-500 rounded-lg bg-gray-50 text-gray-700 cursor-pointer p-4"
      >
        <input {...getInputProps()} />
        {CVfile ? (
          <p>{CVfile.name}</p>
        ) : (
          <p>Drag & drop a PDF or Word document here, or click to select one</p>
        )}
      </div>
    </div>
  )
}

export default CVUploader
