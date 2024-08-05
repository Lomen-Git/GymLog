import { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import axios from "axios"
import LoginForm from './components/auth/LoginForm'
import Mermaid from './components/Mermaid'
import Navbar from './components/Navbar'
import loginService from './services/login'
import logsService from './services/logs'
//import './App.css'


const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON !== null && loggedUserJSON !== 'null') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      logsService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const credentials = { username, password }
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      logsService.setToken(user.token)
      setIsAuthenticated(true)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Kirjautuminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    window.localStorage.setItem(
      'loggedUser', null
    )
  }

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar user={user} handleLogout={handleLogout} />}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        <div className="content">
        <Routes>
          <Route path="/login" element={isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <LoginForm
                  username={username}
                  password={password}
                  handlePasswordChange={({ target }) => setPassword(target.value)}
                  handleUsernameChange={({ target }) => setUsername(target.value)}
                  handleSubmit={handleLogin}
                />
              )
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <h1>Tervetuloa kotisivulle!</h1>
                <Mermaid />
              </PrivateRoute>
            }
          />
        </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
