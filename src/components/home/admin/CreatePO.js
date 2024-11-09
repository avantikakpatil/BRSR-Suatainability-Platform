import React, { useState, useEffect } from 'react';
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
    <form onSubmit={handleSubmit} style={{
      maxWidth: '1500px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent background
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
    }}
    >
      <h2 style={{ fontWeight: 'bold', fontSize: '24px' }}>Create Post Office</h2>
      <div></div><div></div>
      <div style={{ marginTop: '15px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Corporate Identity Number (CIN):
        </label>
        <input
          className="input-field"
          type="text"
          name="cin"
          value={formData.details.cin}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ marginTop: '15px',marginLeft:'10px',width:'370px',height:'40px'}}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Post Office Type:
        </label>
        <select style={{ width:'370px',height:'30px'}}
          className="input-field"
          type='text'
          value={poType}
          onChange={handleTypeChange}>
          <option value="regular">Regular Post Office</option>
          <option value="divisional">Divisional Post Office</option>
        </select>
        </div>
      
      <div style={{ marginTop: '15px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Post Office Name:
        </label>
        <input
          className="input-field"
          type="text"
          name="name"
          value={formData.details.name}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '15px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Email:
        </label>
        <input
          className="input-field"
          type="text"
          name="email"
          value={formData.details.email}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '15px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Contact Number:
        </label>
        <input
          className="input-field"
          type="text"
          name="contactNumber"
          value={formData.details.contactNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '15px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Telephone:
        </label>
        <input
          className="input-field"
          type="text"
          name="telephone"
          value={formData.details.telephone}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '15px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
          Website:
        </label>
        <input
          className="input-field"
          type="text"
          name="website"
          value={formData.details.website}
          onChange={handleChange}
          required
        />
      </div><div></div><div></div>
      <div style={{ marginTop: '20px', marginLeft: '0px',width:'370px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '20px' }}>
          Address:
        </label>
        <div style={{ marginTop: '15px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
            Country:
          </label>
          <input
            className="input-field"
            type="text"
            name="address.country"
            value={formData.details.address.country}
            onChange={handleChange}
            required
          />
        </div>
        
          <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
            State:
          </label>
          <input
            className="input-field"
            type="text"
            name="address.state"
            value={formData.details.address.state}
            onChange={handleChange}
            required
          />
    
        <div style={{marginLeft:'500px'}}>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
            City:
          </label>
          <input
            className="input-field"
            type="text"
            name="address.city"
            value={formData.details.address.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '13px' }}>
            Pincode:
          </label>
          <input
            className="input-field"
            type="text"
            name="address.pincode"
            value={formData.details.address.pincode}
            onChange={handleChange}
            required
          />
        </div></div>
      </div>
      <button style={{
        width:'150px',
        height:'50px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '250px',
        marginLeft:'200px',
      }} type="submit">Submit</button>
    </form>
  );
};

export default CreatePO;