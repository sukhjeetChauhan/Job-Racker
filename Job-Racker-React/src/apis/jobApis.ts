import axios from 'axios'
import { Status } from '../Pages/JobsPage'

export async function getAllJobs() {
  try {
    const response = await axios.get('http://localhost:8000/api/apply/', {
      withCredentials: true, // Ensures the session is sent
    })
    return response.data
  } catch (error) {
    console.log(`Response: ${error}`)
  }
}

export async function updateStatus(id: number, newStatus: Status) {
  try {
    const response = await axios.put(`http://localhost:8000/api/apply/${id}/`, {
      status: newStatus,
    })
    console.log(response.data)
  } catch (error) {
    console.log(`Response: ${error}`)
  }
}
