import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { ref, set, get, getDatabase } from 'firebase/database';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // State for name
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userLoggedIn } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const roles = ['DoP Headquarters', 'Postal Managers (Regional Managers)', 'Post Office Heads'];
  const [postOfficeData, setPostOfficeData] = useState({});

  // Fetch post office data on mount
  useEffect(() => {
    const db = getDatabase();
    const postOfficeRef = ref(db, 'postOfficeData');
    get(postOfficeRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPostOfficeData(snapshot.val());
        } else {
          console.log('No post office data found');
        }
      })
      .catch((error) => {
        console.error('Error fetching post office data:', error);
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }

    if (!selectedRole) {
      setErrorMessage('Please select a role');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Store user information in the database
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        await set(userRef, {
          name: name, // Save the name
          email: email,
          role: selectedRole,
          profileCompleted: false,
        });

        // Redirect to profile page after registration
        navigate('/admin/profile');
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/home" replace={true} />}

      <main className="w-full h-screen flex justify-center items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
              Create a New Account
            </h3>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div style={{ width: '310px' }}>
              {/* Name Input */}
              <div>
                <label className="text-sm text-gray-600 font-bold">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="text-sm text-gray-600 font-bold">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-sm text-gray-600 font-bold">Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  disabled={isRegistering}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
                <input
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  disabled={isRegistering}
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-sm text-gray-600 font-bold">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isRegistering || !selectedRole}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isRegistering
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'
              }`}
            >
              {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </button>
            
            {/* Redirect to Login */}
            <div className="text-sm text-center">
              Already have an account? {'   '}
              <Link to={'/login'} className="text-center text-sm hover:underline font-bold">
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
