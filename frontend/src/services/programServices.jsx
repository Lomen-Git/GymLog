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

// Luo ohjelma
export const createProgram = async (program) => {
  console.log('create program servisessä ollaan')
  try {
    const token = getToken()
    const response = await api.post('/programs',
      { program },
      {
        headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating program:', error)
    throw error
  }
}
// Tallenna ohjelma
export const saveProgram = async (programId, program) => {
  console.log('haloo ollaanko täälä')
  try {
    const token = getToken()
    const response = await api.put(`/programs/${programId}`,
      { program },
      {
        headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error updating program:', error)
    throw error
  }
}
// Hae saatavilla olevien ohjelmien tiedot
export const getProgramList = async () => {
  try {
    const token = getToken()
    const response = await api.get('/programs', {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw error
  }
}
// Hae ohjelma kokonaisuudessaan
export const getProgramDetails = async (programId) => {
  try {
    const token = getToken()
    const response = await api.get(`/programs/${programId}`, {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching program details:', error)
    throw error
  }
}

export const getOngoingProgram = async () => {
  try {
    const token = getToken()
    const response = await api.get('/programs/ongoing', {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching ongoing program:', error)
    throw error
  }
}

export const startProgram = async (programId) => {
  try {
    const token = getToken()
    const response = await api.post(`/programs/start/${programId}`, {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error starting program:', error)
    throw error
  }
}

export const getProgram = () => {
  console.log('wtf, miksi ollaan täällä')
}
