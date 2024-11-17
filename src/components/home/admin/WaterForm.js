import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H",
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Function to sanitize email for Firebase
const sanitizeEmail = (email) => {
  return email.replace(/\./g, '_');
};

const WaterForm = () => {
  const [formData, setFormData] = useState({
    surfaceWater: '',
    groundwater: '',
    thirdPartyWater: '',
    seawater: '',
    others: '',
    totalWithdrawal: '',
    totalConsumption: '',
    waterIntensity: '',
    externalAssessment: 'N',
    externalAgencyName: '',
    billFile: null, // For file upload
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      billFile: e.target.files[0], // Capture the uploaded file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      const sanitizedEmail = sanitizeEmail(user.email); // Sanitize the email
      const waterDataPath = ref(database, `PostalManager/${sanitizedEmail}/inputData/waterData/${Date.now()}`);

      // Prepare data to store
      const dataToStore = { ...formData };
      delete dataToStore.billFile; // File uploads should be handled separately, not stored in Realtime Database

      // Store water data
      set(waterDataPath, dataToStore)
        .then(() => {
          console.log('Water data submitted successfully!');
          alert('Water data submitted successfully!');
        })
        .catch((error) => {
          console.error('Error submitting water data:', error);
          alert('Error submitting water data: ' + error.message);
        });
    } else {
      alert('No user is logged in');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.title}>Water Management Form</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>
                Source (Water withdrawal by source (in kilolitres))
              </th>
              <th style={styles.tableHeader}>Value (kl)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Surface water", name: "surfaceWater" },
              { label: "Groundwater", name: "groundwater" },
              { label: "Third party water", name: "thirdPartyWater" },
              { label: "Seawater / desalinated water", name: "seawater" },
              { label: "Others", name: "others" },
              { label: "Total withdrawal", name: "totalWithdrawal" },
              { label: "Total consumption", name: "totalConsumption" },
              { label: "Water intensity per turnover", name: "waterIntensity" },
            ].map(({ label, name }) => (
              <tr key={name}>
                <td style={styles.tableCell}>{label}</td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={styles.tableInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.singleInputGroup}>
          <label style={styles.singleLabel}>
            External assessment? (Y/N):
            <select
              name="externalAssessment"
              value={formData.externalAssessment}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </label>
        </div>

        {formData.externalAssessment === "Y" && (
          <div style={styles.singleInputGroup}>
            <label style={styles.singleLabel}>
              External agency name:
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          </div>
        )}

        <div style={styles.singleInputGroup}>
          <label style={styles.singleLabel}>
            Upload Bill (PDF, DOC, Image files):
            <input
              type="file"
              name="billFile"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </label>
        </div>

        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
  },
  tableCell: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center',
  },
  tableInput: {
    width: '100%',
    padding: '5px',
  },
  singleInputGroup: {
    marginBottom: '15px',
  },
  singleLabel: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
  },
  fileInput: {
    padding: '5px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default WaterForm;
