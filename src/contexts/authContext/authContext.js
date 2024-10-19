// src/contexts/authContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false); // Replace with actual authentication logic

  // Add any authentication methods
  const login = () => setUserLoggedIn(true);
  const logout = () => setUserLoggedIn(false);

  return (
    <AuthContext.Provider value={{ userLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
