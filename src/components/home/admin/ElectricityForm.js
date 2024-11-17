import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebaseConfig'; // Adjust the path as needed
import { ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from 'firebase/storage';

const ElectricityForm = ({ goBack }) => {
  const [formData, setFormData] = useState({
    currentYearElectricity: '',
    currentYearFuel: '',
    currentYearOtherSources: '',
    currentYearElectricityIntensity: '',
    optionalElectricityIntensity: '',
    externalAssessment: '',
    externalAgencyName: '',
    bill: null,
  });

  const [userEmail, setUserEmail] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
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
      bill: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log('Submitted Data:', { ...formData, email: userEmail });
      let billUrl = null;
  
      // Upload the bill file if provided
      if (formData.bill) {
        const fileRef = storageRef(storage, `bills/${Date.now()}-${formData.bill.name}`);
        const uploadTask = uploadBytesResumable(fileRef, formData.bill);
  
        setUploading(true);
  
        await uploadTask;
  
        billUrl = await getDownloadURL(fileRef);
      }
  
      // Use sanitized email to create a unique node
      const sanitizedEmail = sanitizeEmail(userEmail);
  
      // Use a fixed path for electricityData
      const electricityDataRef = ref(db, `PostalManager/${sanitizedEmail}/inputData/electricityData`);
  
      // Save the data
      await set(electricityDataRef, {
        ...formData,
        email: userEmail,
        billUrl: billUrl || null,
      });
  
      console.log('Data stored successfully.');
  
      // Reset form fields after successful submission
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
      console.error('Error storing data: ', error);
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
      <button
        onClick={goBack}
        style={styles.goBackButton}
      >
        Go Back
      </button>

      <h1 style={styles.heading}><b>Electricity Consumption Form</b></h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter</th>
              <th style={styles.th}>FY ____ (Current Financial Year)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Total electricity consumption (A)', name: 'currentYearElectricity' },
              { label: 'Total fuel consumption (B)', name: 'currentYearFuel' },
              { label: 'Electricity consumption through other sources (C)', name: 'currentYearOtherSources' },
            ].map((item) => (
              <tr key={item.name}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
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
                  style={styles.input}
                />
              </td>
            </tr>
            <tr>
              <td style={styles.td}>Electricity intensity per rupee of turnover</td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="currentYearElectricityIntensity"
                  value={formData.currentYearElectricityIntensity}
                  onChange={handleChange}
                  style={styles.input}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div style={styles.additionalInputs}>
          <label>
            External Assessment (Y/N):<br />
            <input
              type="text"
              name="externalAssessment"
              value={formData.externalAssessment}
              onChange={handleChange}
              style={styles.extraInput}
            />
          </label>
          {formData.externalAssessment.toLowerCase() === 'y' && (
            <label>
              Name of External Agency:<br />
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName}
                onChange={handleChange}
                style={styles.extraInput}
              />
            </label>
          )}
        </div>

        <div style={styles.uploadSection}>
          <label>
            Upload Bill (PDF, DOC, Image files):<br />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
              style={styles.extraInput}
            />
          </label>
        </div>

        <button type="submit" style={styles.button} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Submit'}
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
  heading: {
    textAlign: 'center',
    fontSize: '24px',
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
    padding: '8px',
    textAlign: 'center',
    fontSize: '14px',
  },
  td: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '4px',
    fontSize: '14px',
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
    fontSize: '14px',
  },
  uploadSection: {
    marginTop: '15px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default ElectricityForm;
