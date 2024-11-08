import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { ref, set, get, child } from 'firebase/database';
import { onAuthStateChanged } from "firebase/auth";

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
        fetchProfileData(user.uid);  // Fetch data if user is signed in
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfileData = async (userId) => {
    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `profile/${userId}`));
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

    const profileRef = ref(db, `profile/${currentUser.uid}`);
    try {
      await set(profileRef, { ...formData.profile, userId: currentUser.uid });
      console.log('Data stored successfully!');
      setIsEditing(false); // Disable edit mode after saving
      fetchProfileData(currentUser.uid); // Refresh data display
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const formContainerStyle = {
    maxWidth: '90vw',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent background
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '13px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: isEditing ? '#ffffff' : 'transparent',
  };

  const buttonContainerStyle = {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'center',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  };

  return (
    <form onSubmit={handleSubmit} style={formContainerStyle}>
      {Object.keys(formData.profile).map((key) => (
        <div key={key}>
          <label style={labelStyle}>{key.replace(/([A-Z])/g, ' $1')}:</label>
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
            <p>{formData.profile[key] || 'Not provided'}</p>
          )}
        </div>
      ))}

      <div style={buttonContainerStyle}>
        <button type="button" onClick={toggleEdit} style={{ ...buttonStyle, backgroundColor: '#007BFF' }}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        {isEditing && (
          <button type="submit" style={buttonStyle}>
            Save
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminForm;
