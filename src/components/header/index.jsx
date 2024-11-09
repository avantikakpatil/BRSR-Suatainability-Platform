import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch, FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { ref, get, getDatabase } from 'firebase/database';
import logo from '../../logo/image.png';

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(''); 

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const db = getDatabase();
        const profileRef = ref(db, 'PostalManager/inputData/profile'); 

        const snapshot = await get(profileRef);
        if (snapshot.exists()) {
          const profileData = snapshot.val();
          const firstKey = Object.keys(profileData)[0];
          const userProfile = profileData[firstKey];
          console.log("Fetched user profile:", userProfile);
          setUserName(userProfile.name);
        } else {
          console.log('No profile data found.');
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, [currentUser]);

  const handleLogout = () => {
    doSignOut().then(() => navigate('/login'));
  };

  return (
    <nav
      className="flex justify-between items-center bg-transparent text-white px-4 py-3 fixed w-[calc(100%-200px)] z-20 shadow-md backdrop-blur-lg"
      style={{ height: '70px', marginLeft: '270px', width: '82%' }}
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
          <FaSearch className="absolute text-gray-500 left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-100 text-gray-800 pl-10 pr-4 py-2 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
        </div>

        {/* Profile and Settings Dropdown */}
        <div className="relative">
          {userLoggedIn ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 focus:outline-none"
              >
                <FaUserCircle className="text-2xl" />
                <span className="ml-2 text-gray-700 font-medium">
                  {userName || 'User'}
                </span>
                <FaBars className="ml-2 text-lg" />
              </button>
            </>
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
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg transition-transform transform duration-200 ease-in-out origin-top-right">
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-t-md transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <FaUser className="mr-3 text-gray-500" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-100 rounded-b-md transition-colors"
              >
                <FaSignOutAlt className="mr-3 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
