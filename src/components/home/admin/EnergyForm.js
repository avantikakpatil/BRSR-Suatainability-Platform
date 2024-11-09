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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted Data:', { ...formData, email: userEmail });

    try {
      // Create a reference in the Realtime Database under inputData/energyData
      const newDataRef = ref(db, 'inputData/energyData/' + Date.now()); // Use timestamp as a unique ID
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
              <th style={styles.th}>Parameter</th>
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
    padding: '20px',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
  headingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "1200px", // Increased max width for more horizontal space
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch", // Ensure it stretches to the width
  },
  table: {
    width: "100%", // Ensures the table takes up full width
    tableLayout: "auto", // Auto adjust based on content
    marginBottom: "20px",
  },
  th: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textAlign: "left",
    fontSize: "1em",
  },
  td: {
    padding: "12px",
    border: "1px solid #ddd",
    fontSize: "1em",
  },
  inputSmall: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    outline: "none",
  },
  inputLarge: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    outline: "none",
  },
  inputReadOnly: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    outline: "none",
    backgroundColor: "#f5f5f5",
  },
  assessmentSection: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  label: {
    margin: "10px 0",
    fontSize: "1em",
    color: "#333",
    fontWeight: "500",
    width: "100%",
  },
  inputAssessment: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1em",
    outline: "none",
    width: "100%",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.1em",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default EnergyForm;
