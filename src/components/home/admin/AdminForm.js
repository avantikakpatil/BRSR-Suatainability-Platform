import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { ref, set, get, child } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const AdminForm = () => {
  const [formData, setFormData] = useState({
    profile: {
      cin: '',//Corporate Identity Number
      name: '',
      yearOfIncorporation: '',
      registeredOffice: '',
      corporateAddress: '',
      email: '',
      telephone: '',
      website: '',
      financialYear: '',
      stockExchange: '',
      paidUpCapital: '',
      contactName: '',
      contactDetails: '',
      reportingBoundary: '',
    },
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const sanitizedEmail = sanitizeEmail(user.email);
        fetchProfileData(sanitizedEmail);
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const sanitizeEmail = (email) => email.replace(/[.#$/[\]]/g, "_");

  const fetchProfileData = async (sanitizedEmail) => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `PostalManager/profile/${sanitizedEmail}`));
      if (snapshot.exists()) {
        setFormData({ profile: snapshot.val() });
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      profile: {
        ...prevData.profile,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be signed in to submit data.');
      return;
    }

    const sanitizedEmail = sanitizeEmail(currentUser.email);
    const profileRef = ref(db, `PostalManager/profile/${sanitizedEmail}`);
    try {
      await set(profileRef, { ...formData.profile, email: currentUser.email, userId: currentUser.uid });
      console.log('Data stored successfully!');
      setIsEditing(false);
      fetchProfileData(sanitizedEmail);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const capitalizeLabel = (label) =>
    label
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const containerStyle = {
    maxWidth: '1000px', 
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#f7fafc', // Light background for form
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Roboto", sans-serif',
  };

  const formContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', 
    gap: '20px', 
  };

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '15px',
    color: '#4A5568', // Darker gray for labels
    marginBottom: '5px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    backgroundColor: isEditing ? '#fff' : '#f1f3f5', // White for editable, gray for non-editable
  };

  const buttonContainerStyle = {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff', // Blue for Edit
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745', // Green for Save
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formContainerStyle}>
        {Object.keys(formData.profile).map((key) => (
          <div key={key}>
            <label style={labelStyle}>{capitalizeLabel(key)}:</label>
            {isEditing ? (
              <input
                type="text"
                name={key}
                value={formData.profile[key]}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            ) : (
              <p style={{ ...inputStyle, padding: '8px', border: 'none', backgroundColor: '#f1f3f5' }}>
                {formData.profile[key] || 'Not provided'}
              </p>
            )}
          </div>
        ))}

        <div style={buttonContainerStyle}>
          <button type="button" onClick={toggleEdit} style={editButtonStyle}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button type="submit" style={saveButtonStyle}>
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
