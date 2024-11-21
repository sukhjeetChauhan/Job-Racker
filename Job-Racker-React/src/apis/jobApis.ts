import axios from 'axios'
import { Status } from '../Pages/JobsPage'
import { baseApiUrl } from './authenticationApis'

export async function getAllJobs() {
  try {
    const response = await axios.get(`${baseApiUrl}/api/apply/`, {
      withCredentials: true, // Ensures the session is sent
    })
    return response.data
  } catch (error) {
    console.log(`Response: ${error}`)
  }
}

export async function updateStatus(id: number, newStatus: Status) {
  try {
    const response = await axios.put(`${baseApiUrl}/api/apply/${id}/`, {
      status: newStatus,
    })
    console.log(response.data)
  } catch (error) {
    console.log(`Response: ${error}`)
  }
}
