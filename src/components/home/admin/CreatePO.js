import React, { useState, useEffect } from 'react';
import './AdminForm.css'; // Import your CSS file
import { db, auth } from '../../../firebaseConfig';
import { ref, set, push } from 'firebase/database';
import { onAuthStateChanged } from "firebase/auth";

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
      const updatedDetails = { ...prevData.details };

      // Handle nested properties using split
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        updatedDetails[parent] = { ...updatedDetails[parent], [child]: value };
      } else {
        updatedDetails[name] = value;
      }

      return { ...prevData, details: updatedDetails };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted data:', formData);

    if (!currentUser) {
      alert("You must be signed in to submit data.");
      return;
    }

    const poRef = push(ref(db, 'postOffices'));

    set(poRef, {
      ...formData,
      details: {
        ...formData.details,
        address: {
          ...formData.details.address,
        }
      }
    })
      .then(() => {
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
          }
        });
      })
      .catch((error) => {
        console.error('Error storing data:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{fontWeight: 'bold', fontSize: '24px'}}>Create Post Office</h2>
      <div></div>
      <div style={{marginTop:'15px'}}>
        <label>Corporate Identity Number (CIN):</label>
        <input className="input-field" type="text" name="cin" value={formData.details.cin} onChange={handleChange} required />
      </div>
      <div style={{marginTop:'15px'}}>
        <label>Post Office Type:</label>
        <select className="input-field" type='text' value={poType} onChange={handleTypeChange}>
          <option value="regular">Regular Post Office</option>
          <option value="divisional">Divisional Post Office</option>
        </select>
      </div>
      <div>
        <label>Post Office Name:</label>
        <input className="input-field" type="text" name="name" value={formData.details.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input className="input-field" type="text" name="email" value={formData.details.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Contact Number:</label>
        <input className="input-field" type="text" name="contactNumber" value={formData.details.contactNumber} onChange={handleChange} required />
      </div>
      <div>
        <label>Telephone:</label>
        <input className="input-field" type="text" name="telephone" value={formData.details.telephone} onChange={handleChange} required />
      </div>
      <div>
      <div>
        <label>Website:</label>
        <input className="input-field" type="text" name="website" value={formData.details.website} onChange={handleChange} required />
      </div>
      <div style={{marginTop:'90px',marginLeft:'0px'}}>
        <label>Address:</label>
        <div style={{marginTop:'15px'}}>
          <label>Country:</label>
          <input className="input-field" type="text" name="address.country" value={formData.details.address.country} onChange={handleChange} required />
        </div>
        <div>
          <label>State:</label>
          <input className="input-field" type="text" name="address.state" value={formData.details.address.state} onChange={handleChange} required />
        </div>
        <div>
          <label>City:</label>
          <input className="input-field" type="text" name="address.city" value={formData.details.address.city} onChange={handleChange} required />
        </div>
        <div>
          <label>Pincode:</label>
          <input className="input-field" type="text" name="address.pincode" value={formData.details.address.pincode} onChange={handleChange} required />
        </div>
      </div></div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreatePO;
