import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { ref, set, push } from 'firebase/database';
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
      alert("You must be signed in to submit data.");
      return;
    }

    try {
      if (!formData.details.email || !formData.details.password) {
        console.warn('Email and password are required for user creation.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.details.email, formData.details.password);
      const newUser = userCredential.user;

      const poRef = push(ref(db, 'postOffices'));
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
    <form onSubmit={handleSubmit} style={{
      maxWidth: '1500px',
      margin: '0px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
    }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '24px' }}>Create Post Office</h2>
      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Corporate Identity Number (CIN):</label>
        <input className="input-field" type="text" name="cin" value={formData.details.cin} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Post Office Type:</label>
        <select style={{ width: '370px', height: '45px' }} value={poType} onChange={handleTypeChange}>
          <option value="regular">Regular Post Office</option>
          <option value="divisional">Divisional Post Office</option>
        </select>
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Post Office Name:</label>
        <input className="input-field" type="text" name="name" value={formData.details.name} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Email:</label>
        <input className="input-field" type="email" name="email" value={formData.details.email} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Password:</label>
        <input className="input-field" type="password" name="password" value={formData.details.password} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Telephone:</label>
        <input className="input-field" type="text" name="telephone" value={formData.details.telephone} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Website:</label>
        <input className="input-field" type="text" name="website" value={formData.details.website} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '25px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Contact Number:</label>
        <input className="input-field" type="number" name="contactNumber" value={formData.details.contactNumber} onChange={handleChange} required />
      </div>

      <div style={{ marginTop: '20px', width: '370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Address:</label>
        <div style={{ display: 'flex', gap: '10px',width:'1000px' }}>
          <input className="input-field" type="text" name="address.country" placeholder="Country" value={formData.details.address.country} onChange={handleChange} required />
          <input className="input-field" type="text" name="address.state" placeholder="State" value={formData.details.address.state} onChange={handleChange} required />
          <input className="input-field" type="text" name="address.city" placeholder="City" value={formData.details.address.city} onChange={handleChange} required />
          <input className="input-field" type="text" name="address.pincode" placeholder="Pincode" value={formData.details.address.pincode} onChange={handleChange} required />
        </div>
      </div>
      <button style={{
        width: '150px',
        height: '50px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '160px',
        marginLeft: '10%',
      }} type="submit">Submit</button>
    </form>
  );
};

export default CreatePO;
