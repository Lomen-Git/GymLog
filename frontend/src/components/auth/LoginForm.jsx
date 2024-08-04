import { useState } from "react"

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="loginContainer">
      <h2>Kirjaudu sisään!</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Käyttäjänimi:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Salasana:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Kirjaudu</button>
    </form>
    </div>
  )
}

export default LoginForm