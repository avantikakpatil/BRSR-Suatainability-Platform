import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebaseConfig'; // Adjust the path as needed
import { ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';

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
  const [uploading, setUploading] = useState(false);

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
      let billUrl = null;
  
      // If a bill file is uploaded, upload it to Firebase Storage and get the download URL
      if (formData.bill) {
        const fileRef = storageRef(storage, 'bills/' + Date.now() + '-' + formData.bill.name);
        const uploadTask = uploadBytesResumable(fileRef, formData.bill);
  
        setUploading(true); // Set uploading state to true before the upload starts
  
        // Await the upload task to complete
        await uploadTask;
  
        // After upload, get the download URL of the uploaded file
        billUrl = await getDownloadURL(fileRef);
      }
  
      // Create a reference in the Realtime Database under PostalManager/inputData/energyData
      const sanitizedEmail = sanitizeEmail(userEmail); // Sanitize email to ensure it's valid for Firebase
      const newDataRef = ref(db, `PostalManager/${sanitizedEmail}/inputData/energyData/${Date.now()}`); // Use email as part of the path for uniqueness
  
      await set(newDataRef, {
        ...formData,
        email: userEmail, // Include the user's email
        billUrl: billUrl || null, // Store the bill URL if available
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
      alert('Error storing data: ' + error.message); // Optionally show an alert for error feedback
    } finally {
      setUploading(false); // Ensure uploading state is reset regardless of success or failure
    }
  };

  // Function to sanitize the email (replace invalid characters for Firebase path)
  const sanitizeEmail = (email) => {
    return email.replace(/[.#$/[\]]/g, '_'); // Replaces . # $ / [ ] with underscores
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

        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height:'600px',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0', // Remove margin from all sides
    padding: '0', // Remove padding from all sides
  },
  headingContainer: {
    textAlign: 'center',
    marginBottom: '3px', // Reduced margin for compactness
  },
  heading: {
    fontSize: '1.2em', // Slightly smaller font size
    color: '#4CAF50',
    marginBottom: '5px',
  },
  form: {
    backgroundColor: "#fff",
    padding: "10px", // Reduced padding for compactness
    borderRadius: "8px", // Smaller border radius
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "900px", // Adjusted max width to make it more compact
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  table: {
    width: "100%",
    marginBottom: "10px", // Reduced margin for compactness
    fontSize: "0.85em", // Slightly smaller font size
  },
  th: {
    padding: "6px", // Reduced padding
    backgroundColor: "#4CAF50",
    color: "#fff",
    textAlign: "left",
    width: '50%',
  },
  td: {
    padding: "6px", // Reduced padding
    borderBottom: "1px solid #ddd",
    width: '50%',
  },
  inputSmall: {
    width: '100%',
    padding: '4px', // Reduced padding for compactness
    fontSize: '0.85em',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  inputReadOnly: {
    width: '100%',
    padding: '4px',
    fontSize: '0.85em',
    borderRadius: '4px',
    backgroundColor: '#e9e9e9',
    border: '1px solid #ccc',
  },
  inputLarge: {
    width: '100%',
    padding: '4px',
    fontSize: '0.85em',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  assessmentSection: {
    marginTop: '4px',
    marginBottom: '4px',
  },
  label: {
    fontSize: '0.85em',
    marginBottom: '4px',
  },
  inputAssessment: {
    width: '100%',
    padding: '4px',
    fontSize: '0.85em',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  uploadSection: {
    marginTop: '6px',
    marginBottom: '6px',
  },
  uploadInput: {
    marginTop: '4px',
  },
  button: {
    padding: '8px 10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9em',
    cursor: 'pointer',
  },
};


export default EnergyForm;
