import React, { useState, useEffect } from 'react'
import PostList from './PostList'
//import styles from './Posts.module.css'
import styles from './Community.module.css'
import { Send } from 'lucide-react'
import { CreatePost, FetchPosts, toggleLike, createComment, deletePost } from '../../services/forumServices'


const Community = () => {
  const [posts, setPosts] = useState([])
  const [newPostContent, setNewPostContent] = useState('')
  const [postVisibility, setPostVisibility] = useState({})
  const [page, setPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const postsPerPage = 10
  const [currentUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await FetchPosts(page, postsPerPage)
        setPosts(data.posts)
        setTotalPosts(data.totalPosts)
      } catch (error) {
        console.error('Error loading posts:', error)
      }
    }

    loadPosts()
  }, [page])

  console.log(posts)

  const toggleVisibility = (postId) => {
    // Kopio nykyisestä tilasta, jotta sitä voidaan muokata turvallisesti
    const updatedVisibility = { ...postVisibility }
    // Vaihdetaan näkyvyyden tila: jos avain on olemassa, vaihdetaan arvoa (toggle)
    updatedVisibility[postId] = !updatedVisibility[postId]
    // Päivitetään tila uudella näkyvyyden tilalla
    setPostVisibility(updatedVisibility)
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    try {
      const newPost = await CreatePost(newPostContent)
      setPosts((prevPosts) => [newPost, ...prevPosts])
      setNewPostContent('')
    } catch (error) {
      console.error('Error submitting post:', error)
    }
  }

  const handleLike = async (postId) => {
    try {
      const updatedPost = await toggleLike(postId)
      setPosts(posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      ))
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleComment = async (postId, commentContent) => {
    try {

      const updatedPost = await createComment(postId, commentContent)
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post
        )
      )
      
    } catch (error) {
      console.error('Kommentin luonti epäonnistui:', error)
    }
  }

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
    } catch (error) {
      console.error('Could not delete post:', error)
    }
  }
  

  return (
    <div className={styles.communityContainer}>
      <form onSubmit={handleCreatePost} className={styles.postForm}>
        <div className={styles.inputGroup}>
          <input
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className={styles.postInput}
          />
          <button type="submit" className={styles.postButton}>
          <Send size={16} style={{ marginRight: '8px' }} /> Post
          </button>
        </div>
      </form>

      <PostList
        posts={posts}
        handleLike={handleLike}
        postVisibility={postVisibility}
        toggleVisibility={toggleVisibility}
        handleComment={handleComment}
        currentUser={currentUser}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Community