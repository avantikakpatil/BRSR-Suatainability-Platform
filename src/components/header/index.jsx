import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import logo from '../../logo/image.png'; // Adjust this path as needed

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
    style={{ height: '70px', marginLeft: '270px', width: '82%' }} // Adjust for sidebar width if needed
    >
      {/* Left Side - Logo and Title */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
        <div className="text-2xl font-bold text-black tracking-wider">
          BRSR Sustainability Platform
        </div>
      </div>

      <div className="flex items-center space-x-6">
  {/* Search Bar */}
  <div className="relative max-w-md">
    <FaSearch className="absolute text-gray-500 left-3 top-2.5" /> {/* Softer icon color */}
    <input
      type="text"
      placeholder="Search..."
      className="w-full bg-gray-100 text-gray-800 pl-10 pr-4 py-2 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" 
    />
  </div>


        {/* Profile and Settings Dropdown */}
        <div className="relative">
          {userLoggedIn ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-gray-700 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              <FaBars className="text-lg" />
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
              <button
            onClick={() => navigate("/admin/profile")}
            className="flex items-center p-3 w-full text-left rounded-lg transition-all bg-gray-800 hover:bg-blue-500 hover:shadow-md"
          >
            <span>Profile</span>
          </button>

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
      </div>
    </nav>
  );
};

export default Header;
