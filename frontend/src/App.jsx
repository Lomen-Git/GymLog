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
//import './App.css'

const api = axios.create({
  baseURL: `/api/login`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setIsAuthenticated(true)
      api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password })
      const user = response.data
      localStorage.setItem("loggedUser", JSON.stringify(user))
      api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      setErrorMessage("Väärä käyttäjänimi tai salasana")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("loggedUser")
    delete api.defaults.headers.common["Authorization"]
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
                <LoginForm onLogin={handleLogin} />
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
