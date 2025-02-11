import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import newLogo from './newLogo.svg';

const Header = ({
  user = null,
  handleLogout = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Program', href: '/program' },
    { name: 'Workout', href: '/workout' },
    { name: 'Community', href: '/community' },
  ];

  // Klikkauksen käsittely dropdownin ja mobiilivalikon ulkopuolelle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 shadow-lg relative text-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-indigo-400 hover:text-indigo-300">
              <img src={newLogo} alt="Logo" className="h-16 w-16" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-end items-center">
            <div className="flex space-x-10 mr-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-3 font-medium ${
                    location.pathname === link.href
                      ? 'text-indigo-400 border-b-2 border-indigo-400'
                      : 'text-gray-300 hover:text-indigo-400'
                  } transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Dropdown */}
            <div className="relative ml-6" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-300 hover:text-indigo-400 px-4 py-3 rounded-md font-medium transition-colors duration-200"
              >
                {user ? (
                  <>
                    <User className="h-6 w-6 mr-2" />
                    <span className="mr-2">{user.username}</span>
                  </>
                ) : (
                  'Menu'
                )}
                <svg
                  className={`ml-1 h-6 w-6 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-indigo-400"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-indigo-400"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 absolute w-full z-50" ref={mobileMenuRef}>
          <div className="px-4 pt-4 pb-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-4 py-3 rounded-md text-xl font-medium ${
                  location.pathname === link.href
                    ? 'text-indigo-400 border-l-4 border-indigo-400'
                    : 'text-gray-300 hover:text-indigo-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-700 mt-3 pt-3">
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-gray-300 hover:text-indigo-400"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-gray-300 hover:text-indigo-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;