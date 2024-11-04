import Title from '../Components/Home/Title'
import Uploader from '../Components/Home/Uploader'
import Header from '../Components/Header'
import { useContext } from 'react'
import { AuthContext } from '../Components/authentication/AuthContext'

export default function Home() {
  const user = useContext(AuthContext)
  console.log(user?.user)
  return (
    <div className="w-full px-16 flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-red-100">
      <Header />
      <Title />
      <Uploader />
    </div>
  )
}
