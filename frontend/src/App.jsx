import { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"

import LoginForm from './components/auth/LoginForm'
import Mermaid from './components/Mermaid'
import Navbar from './components/Navbar'
import Footer from "./components/Footer"
import loginService from './services/login'
import logsService from './services/logs'
import './App.css'


const PrivateRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

const App = () => {
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON !== null && loggedUserJSON !== 'null') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setIsAuthenticated(true)
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
        {user && <Navbar user={user} handleLogout={handleLogout} />}
      </div>
      <div className="content">
        <Routes>
          <Route path="/login" element={user ? (
                <Navigate to="/" />
              ) : (
                <LoginForm
                  username={username}
                  password={password}
                  handlePasswordChange={({ target }) => setPassword(target.value)}
                  handleUsernameChange={({ target }) => setUsername(target.value)}
                  handleSubmit={handleLogin}
                  errorMessage={errorMessage}
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
      <div><Footer /></div>
    </Router>
  )
}

export default App
