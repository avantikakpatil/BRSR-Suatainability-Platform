import React, { useState, useEffect } from 'react';
import './AdminForm.css';
import { db, auth } from '../../../firebaseConfig'; // Ensure auth is imported
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
    // Che1lck for user authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('No user is signed in.');
      }
    });

    // Cleanup subscription on unmount
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
    console.log('Submitted data:', formData);

    // Check if a user is authenticated before submitting data
    if (!currentUser) {
      alert("You must be signed in to submit data.");
      return;
    }

    // Generate a unique key for the profile data
    const profileKey = Date.now(); // Using timestamp as unique key

    // Reference the database path to the "profile" node
    const profileRef = ref(db, `profile/${profileKey}`); // Change this line

    // Store data in Firebase
    set(profileRef, { ...formData.profile, userId: currentUser.uid })
      .then(() => {
        console.log('Data stored successfully!');
        // Optionally, reset the form or show a success message
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Corporate Identity Number (CIN): </label>
        <input type="text" name="cin" value={formData.profile.cin} onChange={handleChange} required />
      </div>
      <div>
        <label>Name of the Listed Entity: </label>
        <input type="text" name="name" value={formData.profile.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Year of Incorporation: </label>
        <input type="text" name="yearOfIncorporation" value={formData.profile.yearOfIncorporation} onChange={handleChange} required />
      </div>
      <div>
        <label>Registered Office Address: </label>
        <input type="text" name="registeredOffice" value={formData.profile.registeredOffice} onChange={handleChange} required />
      </div>
      <div>
        <label>Corporate Address: </label>
        <input type="text" name="corporateAddress" value={formData.profile.corporateAddress} onChange={handleChange} required />
      </div>
      <div>
        <label>Email: </label>
        <input type="email" name="email" value={formData.profile.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Telephone: </label>
        <input type="text" name="telephone" value={formData.profile.telephone} onChange={handleChange} required />
      </div>
      <div>
        <label>Website: </label>
        <input type="url" name="website" value={formData.profile.website} onChange={handleChange} required />
      </div>
      <div>
        <label>Financial Year: </label>
        <input type="text" name="financialYear" value={formData.profile.financialYear} onChange={handleChange} required />
      </div>
      <div>
        <label>Name of Stock Exchange(s): </label>
        <input type="text" name="stockExchange" value={formData.profile.stockExchange} onChange={handleChange} required />
      </div>
      <div>
        <label>Paid-up Capital: </label>
        <input type="text" name="paidUpCapital" value={formData.profile.paidUpCapital} onChange={handleChange} required />
      </div>
      <div>
        <label>Contact Name: </label>
        <input type="text" name="contactName" value={formData.profile.contactName} onChange={handleChange} required />
      </div>
      <div>
        <label>Contact Details (Phone/Email): </label>
        <input type="text" name="contactDetails" value={formData.profile.contactDetails} onChange={handleChange} required />
      </div>
      <div>
        <label>Reporting Boundary (Standalone/Consolidated): </label>
        <select name="reportingBoundary" value={formData.profile.reportingBoundary} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="standalone">Standalone</option>
          <option value="consolidated">Consolidated</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminForm;
