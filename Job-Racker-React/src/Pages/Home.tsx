import Title from '../Components/Home/Title'
import Uploader from '../Components/Home/Uploader'
import NavigateJobsPage from '../Components/NavigateJobsPage'

export default function Home() {
  return (
    <div className="w-full px-16 flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-red-100">
      <NavigateJobsPage />
      <Title />
      <Uploader />
    </div>
  )
}
