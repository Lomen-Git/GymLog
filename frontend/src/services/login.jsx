import axios from 'axios'
const baseUrl = `${API_DOMAIN}/login`

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

//eslint-disable-next-line
export default { login }