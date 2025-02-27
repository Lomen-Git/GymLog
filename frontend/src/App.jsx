import { useState, useEffect, useContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'

import LoginForm from './components/auth/LoginFormDS'
import Header from './components/Header/Header'
import Homepage from './components/Home/Homepage'
import ProgramEditor from './components/EditProgram/ProgramEditor'
import WorkoutContainer from './components/Workouts/WorkoutContainer'
import Community from './components/Community/Community'
import Profile from './components/User/Profile'
//import Mermaid from './components/Mermaid'
import './App.css'

import { UserContext } from './userContext'


const PrivateRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return children
  } else {
    return <Navigate to="/login" />
  }
}

const App = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON !== null && loggedUserJSON !== 'null') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    window.localStorage.setItem(
      'loggedUser', null
    )
  }

  return (
    <div className="bg-neutral-800 min-h-screen">
      <Router>
        <div>
          {user && <Header user={user} handleLogout={handleLogout} />}
        </div>
        <div className="content">
          <Routes>
            <Route path="/login"
            element={
              user ? <Navigate to="/" /> : <LoginForm />
            }
            />

            <Route
              path="/"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Homepage />
                </PrivateRoute>
              }
            />

            <Route
              path="/program"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ProgramEditor />
                </PrivateRoute>
              }
            />

            <Route
              path="/workout"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <WorkoutContainer />
                </PrivateRoute>
              }
            />

            <Route
              path="/community"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Community />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Profile />
                </PrivateRoute>
              }
            />
            
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
