import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {

  return (
    <div className="loginContainer">
      <h2>Kirjaudu sisään!</h2>

      <form onSubmit={handleSubmit}>
        <div>
          Käyttäjänimi
          <input
            id='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Salasana
          <input
            id='password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button id='login-button' type="submit">Kirjaudu</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm