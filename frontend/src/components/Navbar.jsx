import React from 'react'

const Navbar = ({ user, handleLogout }) => {
  return (
    <div className='navbar'>
    <header>
      <nav>
        <span>Tervetuloa, {user?.username}!</span>
        <button onClick={ handleLogout }>Kirjaudu ulos</button>
      </nav>
    </header>
    </div>
  )
}

export default Navbar
