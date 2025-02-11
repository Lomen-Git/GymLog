import axios from 'axios'

// axios-instanssi
const api = axios.create({
  baseURL: '/api/forum'
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

export const CreatePost = async (content) => {
  try {
    const token = getToken()
    const response = await api.post('/posts', 
      { content },
      { 
        headers: { Authorization: token }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export const FetchPosts = async (page, postsPerPage) => {
  try {
    const token = getToken()
    const offset = (page - 1) * postsPerPage
    const response = await api.get(`/posts`, {
      params: { limit: postsPerPage, offset },
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const toggleLike = async (postId) => {
  try {
    const token = getToken()
    const response = await api.put(`/posts/${postId}/like`, {}, {
      headers: { Authorization: token }
    })
    return response.data
  } catch (error) {
    console.error('Error toggling like:', error)
    throw error
  }
}

export const createComment = async (postId, content) => {
  try {
    const token = getToken()
    const response = await api.post(`/posts/${postId}/comments`, 
      { content },
      { headers: { Authorization: token } }
    )
    return response.data
  } catch (error) {
    console.error('Error creating comment:', error)
    throw error
  }
}

export const deletePost = async (postId) => {
  try {
    const token = getToken()
    await api.delete(`/posts/${postId}`, {
      headers: { Authorization: token }
    })
    return true
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
