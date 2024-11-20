import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
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
const storage = getStorage(app);
const auth = getAuth();

// Function to sanitize email for Firebase
const sanitizeEmail = (email) => email.replace(/[.#$/[\]]/g, '_');

const FuelConsumptionForm = ({ goBack }) => {
  const [formData, setFormData] = useState({
    fuelConsumption: '',
    energyIntensity: '',
    billFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);

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
      billFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      const sanitizedEmail = sanitizeEmail(user.email);
      const fuelDataPath = ref(database, `PostalManager/${sanitizedEmail}/inputData/fuelData`);

      try {
        let fileUrl = '';
        if (formData.billFile) {
          setIsUploading(true);

          // Upload file to Firebase Storage
          const fileRef = storageRef(storage, `PostalManager/${sanitizedEmail}/files/${formData.billFile.name}`);
          await uploadBytes(fileRef, formData.billFile);

          // Get file URL
          fileUrl = await getDownloadURL(fileRef);
        }

        // Prepare data to store
        const dataToStore = {
          ...formData,
          billFile: fileUrl, // Add file URL to the database
        };
        delete dataToStore.billFile;

        // Store or update data
        await set(fuelDataPath, dataToStore);

        alert('Fuel data submitted successfully!');
      } catch (error) {
        console.error('Error submitting fuel data:', error);
        alert('Error submitting fuel data: ' + error.message);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('No user is logged in');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={goBack} style={styles.goBackButton}>
        Go Back
      </button>

      <h2 style={styles.heading}>Fuel Consumption Form</h2>

      <form onSubmit={handleSubmit}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter</th>
              <th style={styles.th}>FY ____ (Current Financial Year)</th>
            </tr>
          </thead>
          <tbody>
            {[ 
              { label: 'Total fuel consumption (B)', key: 'fuelConsumption' },
              { label: 'Energy intensity per rupee of turnover (Total energy consumption / turnover in rupees)', key: 'energyIntensity' },
            ].map((item) => (
              <tr key={item.key}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>
                  <input
                    type="text"
                    name={item.key}
                    value={formData[item.key]}
                    onChange={handleChange}
                    placeholder="Enter value"
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.uploadSection}>
          <label style={styles.label}>Upload Bill</label>
          <input type="file" onChange={handleFileChange} style={styles.fileInput} />
        </div>

        <button type="submit" style={styles.submitButton} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      <p style={styles.note}>
        <strong>Note:</strong> Indicate if any independent assessment/evaluation/assurance has been carried out by an
        external agency? (Y/N) If yes, name the external agency.
      </p>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  goBackButton: {
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
  },
  td: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  uploadSection: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  note: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
};

export default FuelConsumptionForm;
