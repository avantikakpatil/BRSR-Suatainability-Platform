import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebaseConfig'; // Adjust the path as needed
import { ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ElectricityForm = ({ goBack }) => {
  const [formData, setFormData] = useState({
    currentYearElectricity: '',
    currentYearFuel: '',
    currentYearOtherSources: '',
  });

  const [userEmail, setUserEmail] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitted Data:', { ...formData, email: userEmail });

      // Use sanitized email to create a unique node
      const sanitizedEmail = sanitizeEmail(userEmail);

      // Use a fixed path for electricityData
      const electricityDataRef = ref(db, `PostalManager/${sanitizedEmail}/inputData/electricityData`);

      // Save the data
      await set(electricityDataRef, {
        ...formData,
        email: userEmail,
      });

      console.log('Data stored successfully.');

      // Reset form fields after successful submission
      setFormData({
        currentYearElectricity: '',
        currentYearFuel: '',
        currentYearOtherSources: '',
      });
    } catch (error) {
      console.error('Error storing data: ', error);
      alert('Error storing data: ' + error.message);
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
              <th style={styles.th}>FY ____ (Current Financial Year)in Wattage</th>
            </tr>
          </thead>
          <tbody>
            {[{ label: 'Total electricity consumption (A)', name: 'currentYearElectricity' }].map((item) => (
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
          </tbody>
        </table>

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
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
    fontSize: '20px',
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
    padding: '5px',
    fontSize: '14px',
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
