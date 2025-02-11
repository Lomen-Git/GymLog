import axios from 'axios'

// axios-instanssi
const api = axios.create({
  baseURL: '/api/gym'
})

// Apufunktio tokenin hakemiseen
const getToken = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  if (!loggedUserJSON || loggedUserJSON === 'null') {
    throw new Error('User is not logged in')
  }
  const user = JSON.parse(loggedUserJSON)
  return `Bearer ${user.token}`
}


export const CreateExercise = async (name) => {
  try {
    const token = getToken()
    const response = await api.post('/exercises', 
      { name },
      {
        headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating exercise:', error)
    throw error
  }
}

export const getUserExercises = async () => {
  try {
    const token = getToken()
    const response = await api.get('/exercises/', {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching exercises:', error)
    throw error
  }
}
