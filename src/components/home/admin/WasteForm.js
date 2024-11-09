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
      recycledWaste: '',
      reusedWaste: '',
      otherRecoveryOperationsWaste: '',
      incinerationWaste: '',
      landfillWaste: '',
      otherDisposalWaste: '',
    },
    externalAssessment: '',
    externalAgencyName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isWasteDataField = name.startsWith('current') || name.startsWith('previous') || name.startsWith('other') || name === 'recycledWaste' || name === 'reusedWaste' || name === 'otherRecoveryOperationsWaste' || name === 'incinerationWaste' || name === 'landfillWaste' || name === 'otherDisposalWaste';

    setFormData((prevData) => ({
      ...prevData,
      [isWasteDataField ? 'wasteData' : name]: {
        ...prevData.wasteData,
        ...(isWasteDataField ? { [name]: value } : {}),
      },
      ...(isWasteDataField ? {} : { [name]: value }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData); // Check submitted data in console

    const structuredData = {
      currentPlasticWaste: formData.wasteData.currentPlasticWaste,
      previousPlasticWaste: formData.wasteData.previousPlasticWaste,
      currentEWaste: formData.wasteData.currentEWaste,
      previousEWaste: formData.wasteData.previousEWaste,
      currentBioMedicalWaste: formData.wasteData.currentBioMedicalWaste,
      previousBioMedicalWaste: formData.wasteData.previousBioMedicalWaste,
      currentConstructionWaste: formData.wasteData.currentConstructionWaste,
      previousConstructionWaste: formData.wasteData.previousConstructionWaste,
      currentBatteryWaste: formData.wasteData.currentBatteryWaste,
      previousBatteryWaste: formData.wasteData.previousBatteryWaste,
      currentRadioactiveWaste: formData.wasteData.currentRadioactiveWaste,
      previousRadioactiveWaste: formData.wasteData.previousRadioactiveWaste,
      otherHazardousWaste: formData.wasteData.otherHazardousWaste,
      otherNonHazardousWaste: formData.wasteData.otherNonHazardousWaste,
      recycledWaste: formData.wasteData.recycledWaste,
      reusedWaste: formData.wasteData.reusedWaste,
      otherRecoveryOperationsWaste: formData.wasteData.otherRecoveryOperationsWaste,
      incinerationWaste: formData.wasteData.incinerationWaste,
      landfillWaste: formData.wasteData.landfillWaste,
      otherDisposalWaste: formData.wasteData.otherDisposalWaste,
    };

    const uniqueKey = Date.now(); // Use a unique key for each entry
    const dataRef = ref(database, 'inputData/wasteData/' + uniqueKey); // Reference under wasteData with unique key

    set(dataRef, structuredData)
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
              <th style={styles.th}>Parameter</th>
              <th style={styles.th}>FY ____ (Current Year)</th>
              <th style={styles.th}>FY ____ (Previous Year)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Plastic waste (A)', field: 'PlasticWaste' },
              { label: 'E-waste (B)', field: 'EWaste' },
              { label: 'Bio-medical waste (C)', field: 'BioMedicalWaste' },
              { label: 'Construction and demolition waste (D)', field: 'ConstructionWaste' },
              { label: 'Battery waste (E)', field: 'BatteryWaste' },
              { label: 'Radioactive waste (F)', field: 'RadioactiveWaste' },
            ].map((item) => (
              <tr key={item.field}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={`current${item.field}`}
                    value={formData.wasteData[`current${item.field}`]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={`previous${item.field}`}
                    value={formData.wasteData[`previous${item.field}`]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td style={styles.td}>Other Hazardous waste (G)</td>
              <td colSpan="2" style={styles.td}>
                <input
                  type="text"
                  name="otherHazardousWaste"
                  value={formData.wasteData.otherHazardousWaste}
                  onChange={handleChange}
                  style={styles.inputLong}
                />
              </td>
            </tr>
            <tr>
              <td style={styles.td}>Other Non-hazardous waste (H)</td>
              <td colSpan="2" style={styles.td}>
                <input
                  type="text"
                  name="otherNonHazardousWaste"
                  value={formData.wasteData.otherNonHazardousWaste}
                  onChange={handleChange}
                  style={styles.inputLong}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={styles.assessmentSection}>
          <label style={styles.label}>External Assessment (Y/N):</label>
          <input
            type="text"
            name="externalAssessment"
            value={formData.externalAssessment}
            onChange={handleChange}
            style={styles.inputAssessment}
          />
          {formData.externalAssessment.toLowerCase() === 'y' && (
            <>
              <label style={styles.label}>External Agency Name:</label>
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName}
                onChange={handleChange}
                style={styles.inputAssessment}
              />
            </>
          )}
        </div>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',  // increase the container width for a wider form
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '10px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    border: '1px solid #ccc',
    padding: '8px',
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center',
  },
  input: {
    width: '80%',  // shorter input fields for better spacing
    padding: '6px',
  },
  inputLong: {
    width: '95%', // longer input field for text entries
    padding: '6px',
  },
  assessmentSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  label: {
    marginRight: '10px',
  },
  inputAssessment: {
    padding: '6px',
    margin: '10px 0',
    width: '50%',  // adjust the width as per requirement
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default WasteManagementForm;
