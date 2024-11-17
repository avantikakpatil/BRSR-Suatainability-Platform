import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebaseConfig'; // Adjust the path as needed
import { ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';

const ElectricityForm = () => {
  const [formData, setFormData] = useState({
    currentYearElectricity: '',
    currentYearFuel: '',
    currentYearOtherSources: '',
    currentYearElectricityIntensity: '',
    optionalElectricityIntensity: '',
    externalAssessment: '',
    externalAgencyName: '',
    bill: null, // New state for file upload
  });

  const [userEmail, setUserEmail] = useState('');
  const [uploading, setUploading] = useState(false);

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

      if (formData.bill) {
        const fileRef = storageRef(storage, 'bills/' + Date.now() + '-' + formData.bill.name);
        const uploadTask = uploadBytesResumable(fileRef, formData.bill);

        setUploading(true);

        await uploadTask;

        billUrl = await getDownloadURL(fileRef);
      }

      const sanitizedEmail = sanitizeEmail(userEmail);
      const newDataRef = ref(db, `PostalManager/${sanitizedEmail}/inputData/electricityData/${Date.now()}`);

      await set(newDataRef, {
        ...formData,
        email: userEmail,
        billUrl: billUrl || null,
      });

      console.log("Data stored successfully.");

      setFormData({
        currentYearElectricity: '',
        currentYearFuel: '',
        currentYearOtherSources: '',
        currentYearElectricityIntensity: '',
        optionalElectricityIntensity: '',
        externalAssessment: '',
        externalAgencyName: '',
        bill: null,
      });
    } catch (error) {
      console.error("Error storing data: ", error);
      alert('Error storing data: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const sanitizeEmail = (email) => {
    return email.replace(/[.#$/[\]]/g, '_');
  };

  return (
    <div style={styles.container}>
      <div style={styles.headingContainer}>
        <h1 style={styles.heading}>Electricity Consumption Form</h1>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter (Total electricity consumption in Joules or multiples)</th>
              <th style={styles.th}>FY ____ (Current Financial Year)</th>
            </tr>
          </thead>
          <tbody>
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
            <tr>
              <td style={styles.td}>Electricity consumption through other sources (C)</td>
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
            <tr>
              <td style={styles.td}><b>Total electricity consumption (A+B+C)</b></td>
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
            <tr>
              <td style={styles.td}>Electricity intensity per rupee of turnover (Total electricity consumption/turnover)</td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearElectricityIntensity"
                  value={formData.currentYearElectricityIntensity}
                  onChange={handleChange}
                  style={styles.inputSmall}
                />
              </td>
            </tr>
            <tr>
              <td style={styles.td}>
                Electricity intensity (optional) – the relevant metric may be selected by the entity
              </td>
              <td colSpan="2" style={styles.td}>
                <input
                  type="text"
                  name="optionalElectricityIntensity"
                  value={formData.optionalElectricityIntensity}
                  onChange={handleChange}
                  style={styles.inputLarge}
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
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  headingContainer: { marginBottom: '20px' },
  heading: { fontSize: '24px', textAlign: 'center' },
  form: { margin: '0 auto', width: '80%', maxWidth: '900px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '10px', backgroundColor: '#f4f4f4', textAlign: 'left' },
  td: { padding: '10px', border: '1px solid #ddd' },
  inputSmall: { width: '100px', padding: '5px' },
  inputReadOnly: { width: '100px', padding: '5px', backgroundColor: '#f9f9f9' },
  inputLarge: { width: '300px', padding: '5px' },
  label: { marginBottom: '5px', display: 'block' },
  inputAssessment: { width: '250px', padding: '5px', marginBottom: '10px' },
  uploadSection: { marginTop: '20px' },
  uploadInput: { padding: '5px' },
  button: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' },
  buttonDisabled: { backgroundColor: '#ddd' },
  assessmentSection: { marginTop: '20px' }
};

export default ElectricityForm;
