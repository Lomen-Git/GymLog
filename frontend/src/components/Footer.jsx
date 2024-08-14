import React, { useState } from "react"
import styles from '../styles/Footer.module.css'

const Footer = () => {
  
  const anecdotes = [
    '“First, solve the problem. Then, write the code.” – John Johnson',
    '“Code is like humor. When you have to explain it, it’s bad.” – Cory House',
    '“Make it work, make it right, make it fast.” – Kent Beck',
    '"Don’t comment bad code – rewrite it" – Brian Kernighan',
    '"No one in the brief history of computing has ever written a piece of perfect software. It’s unlikely that you’ll be the first" – Andy Hunt',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand" – Martin Fowler',
    '“The only way to go fast, is to go well.” ― Robert C. Martin',
    '"Talk is cheap. Show me the code" – Linus Torvalds',
    `"Everyone knows that debugging is twice as hard as writing a program in the first place. So if you're as clever as you can be when you write it, how will you ever debug it?" - Brian Kernighan`,
    '"A good programmer is someone who always looks both ways before crossing a one-way street" – Doug Linder',
  ]
  
  const getAnecdote = () => {
    const index = Math.floor(Math.random() * anecdotes.length)
    return anecdotes[index]
  }
  
  const [anecdote, setAnecdote] = useState(getAnecdote())
  
  const handleClick = () => {
    setAnecdote(getAnecdote())
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
      {anecdote}
      <button className={styles.reloadButton} onClick={handleClick}>&#x21bb;</button>
      </div>
    </footer>
  )
}

export default Footer