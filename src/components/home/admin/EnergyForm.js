// EnergyForm.js
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
    externalAgencyName: ''
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
      [e.target.name]: e.target.value
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
        email: userEmail // Include the user's email
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
        externalAgencyName: ''
      });
    } catch (error) {
      console.error("Error storing data: ", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Energy Consumption Form</h1>
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
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#2c3e50',
  },
  form: {
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  inputSmall: {
    width: '80%',
    padding: '6px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  inputLarge: {
    width: '90%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  inputReadOnly: {
    width: '80%',
    padding: '6px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#e9ecef',
  },
  assessmentSection: {
    marginTop: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  inputAssessment: {
    width: '80%',
    padding: '6px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default EnergyForm;
