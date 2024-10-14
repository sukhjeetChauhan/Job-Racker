import axios from 'axios'

export async function getAllJobs() {
  try {
    const response = await axios.get('http://localhost:8000/api/apply/')
    return response.data
  } catch (error) {
    console.log(`Response: ${error}`)
  }
}
