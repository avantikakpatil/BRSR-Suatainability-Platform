import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { ref, set, push, update } from 'firebase/database';
import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';

const CreatePO = () => {
  const [poType, setPoType] = useState('regular'); // Default PO type
  const [formData, setFormData] = useState({
    type: 'regular',
    details: {
      cin: '',
      name: '',
      address: {
        country: '',
        state: '',
        city: '',
        pincode: ''
      },
      telephone: '',
      website: '',
      contactNumber: '',
      email: '',
      password: '' // Included only for user creation
    }
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('No user is signed in.');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setPoType(selectedType);
    setFormData((prevData) => ({ ...prevData, type: selectedType }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prevData,
          details: {
            ...prevData.details,
            [parent]: { ...prevData.details[parent], [child]: value }
          }
        };
      }
      return { ...prevData, details: { ...prevData.details, [name]: value } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('You must be signed in to submit data.');
      return;
    }

    try {
      if (!formData.details.email || !formData.details.password) {
        console.warn('Email and password are required for user creation.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.details.email, formData.details.password);
      const newUser = userCredential.user;

      const headquarterRef = ref(db, 'headquarter');
      const poRef = push(ref(db, 'headquarter/postOffices')); // Adding under headquarter/postOffices

      await set(poRef, {
        ...formData,
        details: {
          ...formData.details,
          address: { ...formData.details.address }
        }
      });

      console.log('Data stored successfully!');
      setFormData({
        type: poType,
        details: {
          cin: '',
          name: '',
          address: {
            country: '',
            state: '',
            city: '',
            pincode: ''
          },
          telephone: '',
          website: '',
          contactNumber: '',
          email: '',
          password: ''
        }
      });
    } catch (error) {
      console.error('Error storing data or creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      <h2 style={styles.heading}>Create Post Office</h2>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Corporate Identity Number (CIN):</label>
        <input className="input-field" type="text" name="cin" value={formData.details.cin} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Post Office Type:</label>
        <select value={poType} onChange={handleTypeChange} style={styles.select}>
          <option value="regular">Regular Post Office</option>
          <option value="divisional">Divisional Post Office</option>
        </select>
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Post Office Name:</label>
        <input className="input-field" type="text" name="name" value={formData.details.name} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Email:</label>
        <input className="input-field" type="email" name="email" value={formData.details.email} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Password:</label>
        <input className="input-field" type="password" name="password" value={formData.details.password} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Telephone:</label>
        <input className="input-field" type="text" name="telephone" value={formData.details.telephone} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Website:</label>
        <input className="input-field" type="text" name="website" value={formData.details.website} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Contact Number:</label>
        <input className="input-field" type="number" name="contactNumber" value={formData.details.contactNumber} onChange={handleChange} required style={styles.input} />
      </div>

      <div style={styles.addressGroup}>
        <label style={{ ...styles.label, fontSize: '14px' }}>Address:</label>
        <div style={styles.addressInputs}>
          <input className="input-field" type="text" name="address.country" placeholder="Country" value={formData.details.address.country} onChange={handleChange} required style={styles.input} />
          <input className="input-field" type="text" name="address.state" placeholder="State" value={formData.details.address.state} onChange={handleChange} required style={styles.input} />
          <input className="input-field" type="text" name="address.city" placeholder="City" value={formData.details.address.city} onChange={handleChange} required style={styles.input} />
          <input className="input-field" type="text" name="address.pincode" placeholder="Pincode" value={formData.details.address.pincode} onChange={handleChange} required style={styles.input} />
        </div>
      </div>

      <button type="submit" style={styles.submitButton}>Submit</button>
    </form>
  );
};

const styles = {
  formContainer: {
    maxWidth: '1100px', // Increased width for better space
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Two columns layout
    gap: '20px',
  },
  heading: {
    gridColumn: 'span 2',
    fontSize: '24px', // Reduced size for heading
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px', // Reduced font size
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    padding: '10px',
    fontSize: '13px', // Reduced font size for input fields
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  select: {
    padding: '10px',
    fontSize: '13px', // Reduced font size for select
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
  },
  addressGroup: {
    gridColumn: 'span 2',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  addressInputs: {
    display: 'flex',
    gap: '15px',
    width: '100%',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    fontSize: '14px', // Reduced font size for button
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '30px',
  }
};

export default CreatePO;
