import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be signed in to submit data.");
      return;
    }

    const profileKey = Date.now();
    const profileRef = ref(db, `profile/${profileKey}`);

    set(profileRef, { ...formData.profile, userId: currentUser.uid })
      .then(() => {
        console.log('Data stored successfully!');
        setFormData({
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
      })
      .catch((error) => {
        console.error('Error storing data:', error);
      });
  };

  const formContainerStyle = {
    maxWidth: '90vw',
    margin: '10 auto',
    padding: '20px',
    backgroundColor: '#f4f4f9',
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
  };

  const buttonContainerStyle = {
    gridColumn: '1 / -1', // Spans the button across all columns
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
      <div>
        <label style={labelStyle}>Corporate Identity Number (CIN):</label>
        <input type="text" name="cin" value={formData.profile.cin} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Name of the Listed Entity:</label>
        <input type="text" name="name" value={formData.profile.name} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Year of Incorporation:</label>
        <input type="text" name="yearOfIncorporation" value={formData.profile.yearOfIncorporation} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Registered Office Address:</label>
        <input type="text" name="registeredOffice" value={formData.profile.registeredOffice} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Corporate Address:</label>
        <input type="text" name="corporateAddress" value={formData.profile.corporateAddress} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Email:</label>
        <input type="email" name="email" value={formData.profile.email} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Telephone:</label>
        <input type="text" name="telephone" value={formData.profile.telephone} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Website:</label>
        <input type="url" name="website" value={formData.profile.website} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Financial Year:</label>
        <input type="text" name="financialYear" value={formData.profile.financialYear} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Name of Stock Exchange(s):</label>
        <input type="text" name="stockExchange" value={formData.profile.stockExchange} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Paid-up Capital:</label>
        <input type="text" name="paidUpCapital" value={formData.profile.paidUpCapital} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Contact Name:</label>
        <input type="text" name="contactName" value={formData.profile.contactName} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Contact Details (Phone/Email):</label>
        <input type="text" name="contactDetails" value={formData.profile.contactDetails} onChange={handleChange} style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Reporting Boundary:</label>
        <select name="reportingBoundary" value={formData.profile.reportingBoundary} onChange={handleChange} style={inputStyle} required>
          <option value="">Select</option>
          <option value="standalone">Standalone</option>
          <option value="consolidated">Consolidated</option>
        </select>
      </div>

      <div style={buttonContainerStyle}>
        <button type="submit" style={buttonStyle}>Submit</button>
      </div>
    </form>
  );
};

export default AdminForm;
