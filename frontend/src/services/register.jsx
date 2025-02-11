import axios from 'axios'
const baseUrl = '/api/users'

const register = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch (error) {
    throw error
  }
}

//eslint-disable-next-line
export default { register }