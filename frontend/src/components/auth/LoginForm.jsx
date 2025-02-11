import React, { useState, useContext } from 'react'
import styles from '../../styles/LoginForm.module.css'
import loginService from '../../services/login'
import registerService from '../../services/register'

import { UserContext } from '../../userContext'

const LoginForm = () => {

  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext)

  const [flipped, setFlipped] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // rekisteröitymis muuttujat
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const handleLogin = async (event) => {
    console.log('ollaan kirjautumis komponentissa')
    console.log(`user = ${user} ja isAuthenticated= ${isAuthenticated}`)
    event.preventDefault()
    try {
      const credentials = { username, password }
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUser(user)
      setIsAuthenticated(true)
      setUsername('')
      setPassword('')
    } catch (error) {
      const message = JSON.stringify(error.response.data.error)
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRegistration = async (event) => {
    console.log('Hei maailma :), ollaan rekistöröitymässä')
    console.log(`ja meidän saaman propsit on sitten ${newUsername}, ${newPassword}, ${newEmail}`)

    event.preventDefault()

    try {
      const credentials = {
        username: newUsername,
        password: newPassword
       }

      if (!credentials.username || !credentials.password) {
        setErrorMessage('Username and password are required!')
        return
      }
      console.log('koitetaan rekisteröitymistä', credentials)
      const response = await registerService.register(credentials)

      if (response && response.username) {
        setMessage(`Welcome ${response.username} 😊\nLogin to confirm your password.`)
      } else {
        throw new Error('Registration failed.')
      }

      setFlipped(false)
      setUsername(response.username)
      setNewEmail('')
      setNewUsername('')
      setNewPassword('')

    } catch (error) {
      const message = JSON.stringify(error.response.data.error)
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div
        className={`${styles.flipCard} ${flipped ? styles.flipped : ''}`}
      >
        <div className={styles.theCard}>
          <div className={styles.loginForm}>
            {errorMessage && <div className={styles.errorMessage}> {errorMessage} </div>}
            {message && <div className={styles.message}> {message} </div>}
            <h2>Kirjaudu</h2>
            <form onSubmit={handleLogin}>
              <div>
                Username:
                <br />
                  <input
                    id='username'
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
              </div>
              <div>
                Password:
                <br />
                  <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                  />
              </div>
              <button className={styles.loginButton} id='login-button' type="submit">Kirjaudu</button>
            </form>
            <div
              className={styles.toggleText}
              onClick={() => setFlipped(true)}
            >
              Register?
            </div>
          </div>

          {/* Register Form */}
          <div className={styles.registerForm}>
            <h2>Rekisteröidy</h2>
            <form onSubmit={handleRegistration}>
              <div>
                Username:
                <br />
                <input
                  type="text"
                  placeholder="Käyttäjänimi"
                  minLength='3'
                  required
                  onChange={({ target }) => setNewUsername(target.value)}
                   />
              </div>
              <div>
                Mail:
                <br />
                <input
                  type="email"
                  placeholder="Sähköposti"
                  onChange={({ target }) => setNewEmail(target.value)}
                  />
              </div>
              <div>
                Password:
                <br />
                <input
                  type="password"
                  placeholder="Salasana"
                  minLength='3'
                  onChange={({ target }) => setNewPassword(target.value)}
                  />
              </div>
              <button className={styles.registerButton} type="submit">
                Confirm
              </button>
            </form>
            <div
              className={styles.toggleText}
              onClick={() => setFlipped(false)}
            >
              Log in?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default LoginForm