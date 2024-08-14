import PropTypes from 'prop-types'
import styles from '../../styles/LoginForm.module.css'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  errorMessage
}) => {

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        {errorMessage && <div className={styles.errorMessage}> {errorMessage} </div>}
        <form onSubmit={handleSubmit}>
          <div>
            Käyttäjänimi:
            <br />
            <input
              id='username'
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            Salasana:
            <br />
            <input
              id='password'
              type='password'
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button className={styles.loginButton} id='login-button' type="submit">Kirjaudu</button>
        </form>
      </div>
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