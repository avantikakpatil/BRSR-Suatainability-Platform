import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig'; // Adjust the path as needed
import { ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const EnergyForm = () => {
  const [formData, setFormData] = useState({
    currentYearElectricity: '',
    previousYearElectricity: '',
    currentYearFuel: '',
    previousYearFuel: '',
    currentYearOtherSources: '',
    previousYearOtherSources: '',
    currentYearEnergyIntensity: '',
    previousYearEnergyIntensity: '',
    optionalEnergyIntensity: '',
    externalAssessment: '',
    externalAgencyName: '',
    bill: null, // New state for file upload
  });

  const [userEmail, setUserEmail] = useState('');

  // Get the currently logged-in user's email
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set the user's email if logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      bill: e.target.files[0], // Handle file upload
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted Data:', { ...formData, email: userEmail });

    try {
      // Create a reference in the Realtime Database under PostalManager/inputData/energyData
      const newDataRef = ref(db, 'PostalManager/inputData/energyData/' + Date.now()); // Use timestamp as a unique ID
      await set(newDataRef, {
        ...formData,
        email: userEmail, // Include the user's email
      });

      console.log("Data stored successfully.");
      // Clear the form or provide success feedback
      setFormData({
        currentYearElectricity: '',
        previousYearElectricity: '',
        currentYearFuel: '',
        previousYearFuel: '',
        currentYearOtherSources: '',
        previousYearOtherSources: '',
        currentYearEnergyIntensity: '',
        previousYearEnergyIntensity: '',
        optionalEnergyIntensity: '',
        externalAssessment: '',
        externalAgencyName: '',
        bill: null, // Clear uploaded file
      });
    } catch (error) {
      console.error("Error storing data: ", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headingContainer}>
        <h1 style={styles.heading}><b>Energy Consumption Form</b></h1>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter (Total energy consumption in Joules or multiples)</th>
              <th style={styles.th}>FY ____ (Current Financial Year)</th>
              <th style={styles.th}>FY ____ (Previous Financial Year)</th>
            </tr>
          </thead>
          <tbody>
            {/* Total electricity consumption */}
            <tr>
              <td style={styles.td}>Total electricity consumption (A)</td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearElectricity"
                  value={formData.currentYearElectricity}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="previousYearElectricity"
                  value={formData.previousYearElectricity}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
            </tr>
            {/* Total fuel consumption */}
            <tr>
              <td style={styles.td}>Total fuel consumption (B)</td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearFuel"
                  value={formData.currentYearFuel}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="previousYearFuel"
                  value={formData.previousYearFuel}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
            </tr>
            {/* Energy consumption through other sources */}
            <tr>
              <td style={styles.td}>Energy consumption through other sources (C)</td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearOtherSources"
                  value={formData.currentYearOtherSources}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="previousYearOtherSources"
                  value={formData.previousYearOtherSources}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
            </tr>
            {/* Total energy consumption */}
            <tr>
              <td style={styles.td}><b>Total energy consumption (A+B+C)</b></td>
              <td style={styles.td}>
                <input
                  type="text"
                  value={(
                    Number(formData.currentYearElectricity) +
                    Number(formData.currentYearFuel) +
                    Number(formData.currentYearOtherSources)
                  ).toFixed(2)}
                  readOnly
                  style={styles.inputReadOnly}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="text"
                  value={(
                    Number(formData.previousYearElectricity) +
                    Number(formData.previousYearFuel) +
                    Number(formData.previousYearOtherSources)
                  ).toFixed(2)}
                  readOnly
                  style={styles.inputReadOnly}
                />
              </td>
            </tr>
            {/* Energy intensity per rupee of turnover */}
            <tr>
              <td style={styles.td}>
                Energy intensity per rupee of turnover (Total energy consumption/turnover)
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearEnergyIntensity"
                  value={formData.currentYearEnergyIntensity}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="previousYearEnergyIntensity"
                  value={formData.previousYearEnergyIntensity}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
            </tr>
            {/* Optional Energy intensity */}
            <tr>
              <td style={styles.td}>
                Energy intensity (optional) – the relevant metric may be selected by the entity
              </td>
              <td colSpan="2" style={styles.td}>
                <input
                  type="text"
                  name="optionalEnergyIntensity"
                  value={formData.optionalEnergyIntensity}
                  onChange={handleChange}
                  style={styles.inputLarge}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* File Upload Section */}
        <div style={styles.uploadSection}>
          <label style={styles.label}>Upload Bill (PDF, DOC, Image files):</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
            style={styles.uploadInput}
          />
        </div>

        {/* External assessment and evaluation */}
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
              <label style={styles.label}>Name of External Agency:</label>
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

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    padding: '10px',
  },
  headingContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '1.2em',
    color: '#333',
  },
  form: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    width: "95%",
    maxWidth: "1200px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
    marginBottom: "20px",
    fontSize: "0.8em", // Slightly increased for readability
  },
  th: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  inputSmall: {
    width: '100%',
    padding: '8px',
    fontSize: '0.8em', // Slightly increased font size
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  inputReadOnly: {
    width: '100%',
    padding: '8px',
    fontSize: '0.8em',
    borderRadius: '5px',
    backgroundColor: '#e9e9e9',
    border: '1px solid #ccc',
  },
  inputLarge: {
    width: '100%',
    padding: '8px',
    fontSize: '0.8em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  uploadSection: {
    marginTop: '10px',
  },
  uploadInput: {
    padding: '8px',
    fontSize: '0.8em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  assessmentSection: {
    marginTop: '15px',
  },
  label: {
    fontSize: '0.8em', // Slightly increased font size
    marginBottom: '6px',
  },
  inputAssessment: {
    width: '100%',
    padding: '8px',
    fontSize: '0.8em',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: '0.9em', // Slightly increased font size
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EnergyForm;
