// Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth'; // Import doSignOut directly from firebase/auth

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4 fixed w-full z-20" style={{ height: '60px' }}>
      <div className="text-lg font-bold">BRSR Suatainability Platform</div>
      <div className="flex space-x-4">
        {userLoggedIn ? (
          <button
            onClick={() => doSignOut().then(() => navigate('/login'))}
            className="text-sm text-blue-300 hover:underline"
          >
            Logout
          </button>
        ) : (
          <>
            <Link className="text-sm text-blue-300 hover:underline" to="/login">
              Login
            </Link>
            <Link className="text-sm text-blue-300 hover:underline" to="/register">
              Register New Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
