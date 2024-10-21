import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import { ref, get, getDatabase } from 'firebase/database'; // Import 'get' from Firebase

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userLoggedIn } = useAuth();

  const [selectedRole, setSelectedRole] = useState(''); // State for user-selected role

  const roles = ['DoP Headquarters', 'Postal Managers (Regional Managers)', 'Post Office Heads']; // Array of available roles
  const [postOfficeData, setPostOfficeData] = useState({}); // State to store fetched post office data

  useEffect(() => {
    const db = getDatabase(); // Get the Realtime Database reference
    const postOfficeRef = ref(db, 'postOfficeData'); // Reference the existing node

    get(postOfficeRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPostOfficeData(data);
        } else {
          console.log('No post office data found');
        }
      })
      .catch((error) => {
        console.error('Error fetching post office data:', error);
      });
  }, []); // Run only on component mount

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        setIsRegistering(false);
        return;
      }

      try {
        await doCreateUserWithEmailAndPassword(email, password);

        // No further action for user registration
        navigate(getDashboardPath(selectedRole)); // Navigate to role-based dashboard

      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  const getDashboardPath = (role) => {
    // Implement logic to determine dashboard path based on role
    switch (role) {
      case 'DoP Headquarters':
        return '/dop-hq-dashboard';
      case 'Postal Managers (Regional Managers)':
        return '/regional-manager-dashboard';
      case 'Post Office Heads':
        return '/post-office-head-dashboard';
      default:
        return '/home'; // Default dashboard if role is not recognized
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/home" replace={true} />}

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
          <div style={{width:'310px'}} >
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

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

            <div>
              <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
              <input
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                disabled={isRegistering}
              />
            </div>

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
            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isRegistering || selectedRole === ''} // Disable button if role is not selected
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
            >
              {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </button>
            <div className="text-sm text-center">
              Already have an account? {'   '}
              <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
