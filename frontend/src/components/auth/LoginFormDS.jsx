import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../userContext';
import loginService from '../../services/login'
import registerService from '../../services/register'
//import Logo from '../../styles/Logo.jsx';
import logo from '../../assets/GLOGO.svg'
import Footer from '../../components/Footer/Footer'

const LoginForm = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(UserContext);
  const [flipped, setFlipped] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (verificationCode === '6969') {
      setIsEmailVerified(true);
    } else {
      setIsEmailVerified(false);
    }
  }, [verificationCode]);

  const handleSendVerificationCode = () => {
    setCountdown(60);
    // Tässä lähetettäisiin oikea koodi
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password };
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleRegistration = async (event) => {
    console.log('haloo, ollaanko rekistöröitymässä', newUsername, newPassword)
    event.preventDefault();
    try {
      const credentials = { username: newUsername, password: newPassword };
      
      if (!credentials.username || !credentials.password) {
        setErrorMessage('Username and password are required!');
        return;
      }

      console.log('koitetaan rekisteröitymistä', credentials)
      const response = await registerService.register(credentials);
      
      if (response?.username) {
        setMessage(`Welcome ${response.username} 😊\nLogin to confirm your password.`);
        setFlipped(false);
        setUsername(response.username);
        setNewEmail('');
        setNewUsername('');
        setNewPassword('');
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-stone-800 bg-opacity-20">
      <div className="flex-grow flex flex-col items-center justify-center gap-8 py-8">
        <div className='flex flex-col items-center'>
          <img src={logo} alt='Logo' className='w-41 h-41' />
        </div>
        
        <div className="relative w-96 h-[480px] [perspective:1000px]">
          <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            flipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Login Form */}
          <div className="absolute w-full h-full bg-zinc-900/20 backdrop-blur-sm rounded-lg p-8 shadow-2xl backface-hidden border border-indigo-700/30 flex flex-col">
            {errorMessage && (
              <div className="absolute top-4 left-4 right-4 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
                {errorMessage}
              </div>
            )}
            {message && (
              <div className="absolute top-4 left-4 right-4 p-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-center">
                {message}
              </div>
            )}
            <h2 className="text-2xl text-gray-200 mb-6 text-center font-semibold">Kirjaudu</h2>
            <div className="flex-1 flex flex-col justify-center">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    className={`w-full p-3 rounded-lg bg-zinc-800/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-700/50 border transition-colors
                      ${username === '' ? 'border-gray-700' :
                        username.length >= 3 ? 'border-indigo-500/50' : 'border-red-500/50'}`}
                    placeholder="Käyttäjätunnus"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    className={`w-full p-3 rounded-lg bg-zinc-800/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-700/50 border transition-colors
                      ${password === '' ? 'border-gray-700' :
                        password.length >= 3 ? 'border-indigo-500/50' : 'border-red-500/50'}`}
                    placeholder="Salasana"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-700 text-white p-3 rounded-lg hover:bg-indigo-600 active:bg-indigo-800 transition-colors font-medium shadow-lg shadow-indigo-700/20"
                >
                  Kirjaudu sisään
                </button>
              </form>
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <button
                className="text-gray-400 hover:text-indigo-400 text-sm cursor-pointer transition-colors"
                onClick={() => setFlipped(true)}
              >
                Rekisteröidy?
              </button>
            </div>
          </div>

          {/* Register Form */}
          <div className="absolute w-full h-full bg-zinc-900/20 backdrop-blur-sm rounded-lg p-8 shadow-2xl backface-hidden [transform:rotateY(180deg)] border border-indigo-700/30 flex flex-col">
            <h2 className="text-2xl text-gray-200 mb-6 text-center font-semibold">Rekisteröidy</h2>
            <form onSubmit={handleRegistration} className="space-y-3 flex-1">
              <div>
                <input
                  type="text"
                  value={newUsername}
                  onChange={({ target }) => setNewUsername(target.value)}
                  className={`w-full p-3 rounded-lg bg-zinc-800/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-700/50 border transition-colors
                    ${newUsername === '' ? 'border-gray-700' : 
                      newUsername.length >= 3 ? 'border-indigo-500/50' : 'border-red-500/50'}`}
                  placeholder="Käyttäjätunnus"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={({ target }) => setNewPassword(target.value)}
                  className={`w-full p-3 rounded-lg bg-zinc-800/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-700/50 border transition-colors
                    ${newPassword === '' ? 'border-gray-700' : 
                      newPassword.length >= 3 ? 'border-indigo-500/50' : 'border-red-500/50'}`}
                  placeholder="Salasana"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={newEmail}
                  onChange={({ target }) => setNewEmail(target.value)}
                  className={`w-full p-3 rounded-lg bg-zinc-800/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-700/50 border transition-colors
                    ${newEmail === '' ? 'border-gray-700' : 
                      newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'border-indigo-500/50' : 'border-red-500/50'}`}
                  placeholder="Sähköposti"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={({ target }) => setVerificationCode(target.value)}
                  className={`flex-1 p-3 rounded-lg bg-zinc-800/70 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-700/50 border transition-colors
                    ${verificationCode === '' ? 'border-gray-700' : 
                      verificationCode === '6969' ? 'border-indigo-500/50' : 'border-red-500/50'}`}
                  placeholder="Vahvistuskoodi"
                />
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={countdown > 0}
                  className={`px-4 rounded-lg transition-colors min-w-[80px] 
                    ${countdown > 0 || !newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                      ? 'bg-zinc-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-700 text-white hover:bg-indigo-600 active:bg-indigo-800'}`}
                >
                  {countdown > 0 ? `${countdown}s` : 'Lähetä'}
                </button>
              </div>
              <button
                type="submit"
                disabled={!isEmailVerified}
                className={`w-full p-3 rounded-lg font-medium transition-colors shadow-lg
                  ${isEmailVerified 
                    ? 'bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 text-white shadow-indigo-700/20' 
                    : 'bg-zinc-700 text-gray-400 cursor-not-allowed'}`}
              >
                Rekisteröidy
              </button>
            </form>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <button
                className="text-gray-400 hover:text-indigo-400 text-sm cursor-pointer transition-colors"
                onClick={() => setFlipped(false)}
              >
                Kirjaudu?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  )
}

export default LoginForm  