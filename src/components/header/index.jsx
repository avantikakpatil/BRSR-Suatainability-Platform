import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    doSignOut().then(() => navigate('/login'));
  };

  return (
    <nav
      className="flex justify-between items-center bg-transparent text-white px-4 py-3 fixed w-[calc(100%-200px)] z-20 shadow-md backdrop-blur-lg"
      style={{ height: '80px', marginLeft: '270px', width: '82%' }} // Adjust for sidebar width if needed
    >
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <img src="/path/to/logo.png" alt="Logo" className="w-8 h-8" />
        <div className="text-lg font-semibold whitespace-nowrap text-black">BRSR Sustainability Platform</div>
      </div>

      {/* Center Search Bar with Max Width */}
      <div className="flex-grow max-w-md mx-4 relative">
        <FaSearch className="absolute text-gray-200 left-4 top-3" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-800 bg-opacity-60 text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

  {/* Right Side - Profile and Settings Dropdown */}
  <div className="relative">
        {userLoggedIn ? (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-gray-700 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 focus:outline-none"
          >
            <FaBars className="text-lg" />
            <img src="/path/to/profile-pic.png" alt="Profile" className="w-8 h-8 rounded-full ml-2" />
          </button>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">
              Login
            </Link>
            <Link to="/register" className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
              Register
            </Link>
          </div>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-200"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm hover:bg-gray-200"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
