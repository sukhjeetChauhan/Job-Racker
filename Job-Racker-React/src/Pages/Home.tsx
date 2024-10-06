import CVUploader from '../Components/Home/CVuploader'
import JobDescUploader from '../Components/Home/JobDescUploader'
import Title from '../Components/Home/Title'

export default function Home() {
  return (
    <div className="w-full px-16 flex flex-col justify-center items-center">
      <Title />
      <div className="flex gap-12">
        <CVUploader />
        <JobDescUploader />
      </div>
    </div>
  )
}
