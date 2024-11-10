import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { ref, set, get, child } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const AdminForm = () => {
  const [formData, setFormData] = useState({
    profile: {
      cin: '',
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
    }
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const sanitizedEmail = sanitizeEmail(user.email);
        fetchProfileData(sanitizedEmail); // Fetch data if user is signed in
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const sanitizeEmail = (email) => {
    return email.replace(/\./g, '_').replace(/@/g, '_');
  };

  const fetchProfileData = async (sanitizedEmail) => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `PostalManager/profile/${sanitizedEmail}`));
      if (snapshot.exists()) {
        setFormData({ profile: snapshot.val() });
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
      alert("You must be signed in to submit data.");
      return;
    }

    const sanitizedEmail = sanitizeEmail(currentUser.email);
    const profileRef = ref(db, `PostalManager/profile/${sanitizedEmail}`);
    try {
      await set(profileRef, { ...formData.profile, email: currentUser.email, userId: currentUser.uid });
      console.log('Data stored successfully!');
      setIsEditing(false); // Disable edit mode after saving
      fetchProfileData(sanitizedEmail); // Refresh data display
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  // Function to capitalize each word in the label
  const capitalizeLabel = (label) => {
    return label.replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Styling
  const containerStyle = {
    maxWidth: '90vw',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#f0f4f8',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const formContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Dynamic columns based on screen size
    gap: '20px',
  };

  const labelStyle = {
    fontWeight: 'bold', // Bolder text for labels
    fontSize: '14px',
    color: '#333', // Darker color for emphasis
    marginBottom: '5px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    backgroundColor: isEditing ? '#fff' : '#f5f5f5',
  };

  const buttonContainerStyle = {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '25px',
  };

  const buttonStyle = {
    padding: '12px 25px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007BFF',
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
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
              <p style={{ ...inputStyle, padding: '8px', border: 'none', backgroundColor: '#f5f5f5' }}>
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
