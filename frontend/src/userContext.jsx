import React, { createContext, useState } from 'react'

// Luodaan konteksti jota voidaan käyttää muissa komponenteissa..
// vastaavasti kuin useState voidaan käyttää..
// child komponentissa -> const { user, isAuthenticated } = useContext(userContext)
export const UserContext = createContext()

// Luo Provider-komponentti
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <UserContext.Provider value={{ 
      user, setUser,
      isAuthenticated, setIsAuthenticated
      }}>

      {children}
    </UserContext.Provider>
  )
}
