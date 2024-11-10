import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig'; // Adjust the path as needed
import { ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const EnergyForm = () => {
  const [formData, setFormData] = useState({
    currentYearElectricity: '',
    currentYearFuel: '',
    currentYearOtherSources: '',
    currentYearEnergyIntensity: '',
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
        currentYearFuel: '',
        currentYearOtherSources: '',
        currentYearEnergyIntensity: '',
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
        <h1 style={styles.heading}>Energy Consumption Form</h1>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter (Total energy consumption in Joules or multiples)</th>
              <th style={styles.th}>FY ____ (Current Financial Year)</th>
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
            </tr>
            {/* Energy intensity per rupee of turnover */}
            <tr>
              <td style={styles.td}>Energy intensity per rupee of turnover (Total energy consumption/turnover)</td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearEnergyIntensity"
                  value={formData.currentYearEnergyIntensity}
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
    fontSize: '1.5em', // Adjusted font size
    color: '#4CAF50', // Matches the button's green color
    marginBottom: '10px',
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
    marginBottom: "20px",
    fontSize: "0.9em",
  },
  th: {
    padding: "8px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textAlign: "left",
    width: '50%',
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    width: '50%',
  },
  inputSmall: {
    width: '100%',
    padding: '6px',
    fontSize: '0.9em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  inputReadOnly: {
    width: '100%',
    padding: '6px',
    fontSize: '0.9em',
    borderRadius: '5px',
    backgroundColor: '#e9e9e9',
    border: '1px solid #ccc',
  },
  inputLarge: {
    width: '100%',
    padding: '6px',
    fontSize: '0.9em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  assessmentSection: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  label: {
    fontSize: '0.9em',
    marginBottom: '6px',
  },
  inputAssessment: {
    width: '100%',
    padding: '8px',
    fontSize: '0.9em',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  uploadSection: {
    marginTop: '12px',
    marginBottom: '12px',
  },
  uploadInput: {
    marginTop: '6px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1em',
    cursor: 'pointer',
  },
};

export default EnergyForm;
