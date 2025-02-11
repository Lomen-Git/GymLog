import React, { useState } from 'react'
import styles from './Community.module.css'
import { ThumbsUp, Trash2, MessageSquare } from 'lucide-react'

const SinglePost = ({ post, handleLike, postVisibility, toggleVisibility, handleComment, currentUser, handleDelete }) => {
  const [newComment, setNewComment] = useState('')

  const submitComment = (e, postId) => {
    e.preventDefault()
    handleComment(postId, newComment)
    setNewComment('')
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp)
    const diffMs = now - createdAt
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)
  
    if (diffMinutes === 0) {
      return 'Just now'
    } else if (diffMinutes ===1) {
      return 'A minute ago'
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else if (diffDays < 30) {
      return `${diffDays} days ago`
    } else if (diffMonths < 12) {
      return `${diffMonths} months ago`
    } else {
      return `${diffYears} years ago`
    }
  }

  const isLikedByUser = (post) => {
    return post.likes.some(like => like.userId === currentUser.userId);
  }
  

  const isPostAuthor = (post) => {
    return post.author.username === currentUser.username
  }

  return (
    <div className={styles.postContainer}>
      {/* UPPER PART */}
      <div className={styles.postHeader}>
        <p className={styles.author}>{post.author.username}</p>
        <p className={styles.timestamp}>{getTimeAgo(post.createdAt)}</p>
      {isPostAuthor(post) && (
        <button className={styles.deletePost} onClick={() => handleDelete(post.id)}>
          <Trash2 size={20} />
        </button>
      )}
      </div>

      {/* POST */}
      <div className={styles.postContent}>
        <p>{post.content}</p>
      </div>

      {/* LIKES */}
      <div className={styles.postFooter}>
        <button onClick={() => handleLike(post.id)}>
          {post.likes.length}
          |
          <ThumbsUp 
            size={16} 
            className={isLikedByUser(post) ? styles.activeThumb : ''} 
          />
        </button>

        <div className={styles.buttons}>
          {postVisibility[post.id] ? (
            <button className={styles.button} onClick={() => toggleVisibility(post.id)}>
              {post.comments.length}
              <MessageSquare />
              </button>
          ) : (
            <button className={styles.button} onClick={() => toggleVisibility(post.id)}>
              {post.comments.length}
              <MessageSquare />
            </button>
          )}
        </div>
      </div>

      {/* COMMENTS */}
      {postVisibility[post.id] && (
        <div className={styles.commentSection}>
          <h4>Comments:</h4>
          {post.comments.map(comment => (
            <div key={comment.id} className={styles.commentBox}>
              <div className={styles.commentContent}>
                <span className={styles.commentAuthor}>{comment.user.username}:</span>
                <span>{comment.content}</span>
              </div>
              <span className={styles.timestamp}>{getTimeAgo(comment.createdAt)}</span>
            </div>
          ))}
      <form onSubmit={(e) => submitComment(e, post.id)} className={styles.commentForm}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={styles.commentInput}
        />
        <button type="submit" className={styles.commentButton}>Comment</button>
      </form>
      </div>
      )}
    </div>
  )
}

export default SinglePost
