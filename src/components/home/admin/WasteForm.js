import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Initialize Firebase (replace with your Firebase configuration)
const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const WasteManagementForm = () => {
  const [formData, setFormData] = useState({
    wasteData: {
      currentPlasticWaste: '',
      previousPlasticWaste: '',
      currentEWaste: '',
      previousEWaste: '',
      currentBioMedicalWaste: '',
      previousBioMedicalWaste: '',
      currentConstructionWaste: '',
      previousConstructionWaste: '',
      currentBatteryWaste: '',
      previousBatteryWaste: '',
      currentRadioactiveWaste: '',
      previousRadioactiveWaste: '',
      otherHazardousWaste: '',
      otherNonHazardousWaste: '',
    },
    externalAssessment: '',
    externalAgencyName: '',
    billFile: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        billFile: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        wasteData: {
          ...prevData.wasteData,
          [name]: value,
        },
        ...(name === 'externalAssessment' || name === 'externalAgencyName' ? { [name]: value } : {}),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
  
    const uniqueKey = Date.now(); // Unique key for each entry
    const dataRef = ref(database, 'PostalManager/inputData/wasteData/' + uniqueKey); // Updated path
  
    set(dataRef, formData.wasteData)
      .then(() => {
        console.log('Data submitted successfully!');
        alert('Data submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        alert('Error submitting data: ' + error.message);
      });
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}><b>Waste Management Form</b></h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>PARAMETER (TOTAL WASTE GENERATED IN METRIC TONNES)</th>
              <th style={styles.th}>FY (CURRENT YEAR)</th>
              <th style={styles.th}>FY (PREVIOUS YEAR)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Plastic waste (A)', current: 'currentPlasticWaste', previous: 'previousPlasticWaste' },
              { label: 'E-waste (B)', current: 'currentEWaste', previous: 'previousEWaste' },
              { label: 'Bio-medical waste (C)', current: 'currentBioMedicalWaste', previous: 'previousBioMedicalWaste' },
              { label: 'Construction and demolition waste (D)', current: 'currentConstructionWaste', previous: 'previousConstructionWaste' },
              { label: 'Battery waste (E)', current: 'currentBatteryWaste', previous: 'previousBatteryWaste' },
              { label: 'Radioactive waste (F)', current: 'currentRadioactiveWaste', previous: 'previousRadioactiveWaste' },
            ].map((item) => (
              <tr key={item.label}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={item.current}
                    value={formData.wasteData[item.current]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={item.previous}
                    value={formData.wasteData[item.previous]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td style={styles.td}>Other hazardous waste (G)</td>
              <td colSpan="2" style={styles.fullWidthTd}>
                <input
                  type="number"
                  name="otherHazardousWaste"
                  value={formData.wasteData.otherHazardousWaste}
                  onChange={handleChange}
                  style={styles.fullWidthInput}
                />
              </td>
            </tr>
            <tr>
              <td style={styles.td}>Other non-hazardous waste (H)</td>
              <td colSpan="2" style={styles.fullWidthTd}>
                <input
                  type="number"
                  name="otherNonHazardousWaste"
                  value={formData.wasteData.otherNonHazardousWaste}
                  onChange={handleChange}
                  style={styles.fullWidthInput}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={styles.additionalInputs}>
          <label>External Assessment (Y/N):<br />
            <input
              type="text"
              name="externalAssessment"
              value={formData.externalAssessment}
              onChange={handleChange}
              style={styles.extraInput}
            />
          </label>
          <label>Upload Bill((PDF, DOC, Image files)):<br />
            <input
              type="file"
              name="billFile"
              onChange={handleChange}
              style={styles.extraInput}
            />
          </label>
        </div>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%', // Full width of the screen
    maxWidth: '1200px', // Increase max width for larger screens
    margin: '0 auto',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  heading: {
    textAlign: 'center',
    fontSize: '18px',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '5px',
    textAlign: 'center',
    fontSize: '12px',
    width: '33%', // Each column fills a third of the full width
  },
  td: {
    border: '1px solid #ccc',
    padding: '5px',
    textAlign: 'center',
    fontSize: '12px',
  },
  fullWidthTd: {
    border: '1px solid #ccc',
    padding: '5px',
    textAlign: 'center',
  },
  input: {
    width: '100%', // Full-width inputs
    padding: '4px',
    fontSize: '12px',
  },
  fullWidthInput: {
    width: '100%', // Full-width input fields for 'Other' rows
    padding: '4px',
    fontSize: '12px',
  },
  additionalInputs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  extraInput: {
    width: '100%',
    padding: '5px',
    fontSize: '12px',
  },
  button: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default WasteManagementForm;
