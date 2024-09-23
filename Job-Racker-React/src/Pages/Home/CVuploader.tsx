import { useDropzone, Accept } from 'react-dropzone'

const acceptFormats: Accept = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
}

function CVUploader() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptFormats, // Use object notation instead of a string
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles)
    },
  })

  return (
    <div
      {...getRootProps()}
      className="flex items-center justify-center w-96 h-48 border-2 border-dashed border-blue-500 rounded-lg bg-gray-50 text-gray-700 cursor-pointer mt-10"
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop your CV here, or click to select files</p>
    </div>
  )
}

export default CVUploader
