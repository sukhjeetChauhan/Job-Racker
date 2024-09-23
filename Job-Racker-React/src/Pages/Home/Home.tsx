import CVUploader from './CVuploader'
import Title from './Title'

export default function Home() {
  return (
    <div className="w-full px-16 flex flex-col justify-center items-center">
      <Title />
      <CVUploader />
    </div>
  )
}
