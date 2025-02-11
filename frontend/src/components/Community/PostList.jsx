import SinglePost from "./SinglePost"
import styles from "./Posts.module.css"


const PostList = ({ posts, handleLike, postVisibility, toggleVisibility, handleComment, currentUser, handleDelete }) => {

  return (
    <div>
    {posts.slice(0, 10).map(post => (
      <SinglePost
        key={post.id}
        post={post}
        handleLike={handleLike}
        postVisibility={postVisibility}
        toggleVisibility={toggleVisibility}
        handleComment={handleComment}
        currentUser={currentUser}
        handleDelete={handleDelete}
      />
    ))}
  </div>
  )
}

export default PostList