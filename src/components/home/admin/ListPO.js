import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import emailjs from 'emailjs-com';

const ListPO = () => {
  const [postOffices, setPostOffices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    credentials: '',
  });

  // Fetch data from Firebase
  useEffect(() => {
    const poRef = ref(db, 'headquarter/postOffices'); // Update reference path to match your DB structure
    const unsubscribe = onValue(poRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Transform data to maintain full structure
        const formattedData = Object.entries(data).map(([id, details]) => ({
          id,
          ...details,
        }));
        setPostOffices(formattedData);
        setFilteredData(formattedData); // Initialize filtered data
      } else {
        setPostOffices([]);
        setFilteredData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter all fields dynamically
    const filtered = postOffices.filter((po) => {
      const searchableValues = [
        po.poCategory,
        po.details?.postOfficeName,
        po.details?.corporateId,
        `${po.details?.location?.city || ''}, ${po.details?.location?.state || ''}, ${po.details?.location?.country || ''} - ${po.details?.location?.pincode || ''}`,
        po.details?.userEmail,
        po.details?.contactPhone,
        po.details?.phone,
        po.details?.websiteURL,
      ]
        .filter(Boolean) // Remove null or undefined values
        .join(' ')
        .toLowerCase();
      return searchableValues.includes(term);
    });

    setFilteredData(filtered);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = key.includes('.') ? key.split('.').reduce((o, i) => o?.[i], a) : a[key];
      const bValue = key.includes('.') ? key.split('.').reduce((o, i) => o?.[i], b) : b[key];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
    setSortConfig({ key, direction });
  };

  // Handle form visibility toggle
  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS configuration
    const serviceID = 'service_stnn5nm'; // Replace with your EmailJS service ID
    const templateID = 'template_xrxxhgr'; // Replace with your EmailJS template ID
    const publicKey = 'c3qKQXJwMr5IbmKAF'; // Replace with your EmailJS public key

    const emailParams = {
      user_email: formData.email, // Send to the email provided in the form
      user_name: formData.name,
      user_credentials: formData.credentials,
    };

    emailjs.send(serviceID, templateID, emailParams, publicKey)
      .then((response) => {
        console.log('Email successfully sent:', response.status, response.text);
        alert('Email sent successfully!');
        setFormData({ email: '', name: '', credentials: '' }); // Reset form fields
        setShowForm(false); // Hide form after submission
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        alert('Failed to send email. Please try again.');
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>List of Post Offices</h2>

      {/* Search Input */}
      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search across all fields"
          value={searchTerm}
          onChange={handleSearch}
          style={styles.filterInput}
        />
      </div>

      {/* Table */}
      {filteredData.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => handleSort('poCategory')}>Category</th>
              <th style={styles.th} onClick={() => handleSort('details.postOfficeName')}>Post Office Name</th>
              <th style={styles.th} onClick={() => handleSort('details.corporateId')}>Corporate ID</th>
              <th style={styles.th} onClick={() => handleSort('details.location')}>Location</th>
              <th style={styles.th} onClick={() => handleSort('details.userEmail')}>User Email</th>
              <th style={styles.th} onClick={() => handleSort('details.contactPhone')}>Contact Phone</th>
              <th style={styles.th} onClick={() => handleSort('details.phone')}>Phone</th>
              <th style={styles.th} onClick={() => handleSort('details.websiteURL')}>Website</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((po) => (
              <tr key={po.id}>
                <td style={styles.td}>{po.poCategory}</td>
                <td style={styles.td}>{po.details.postOfficeName}</td>
                <td style={styles.td}>{po.details.corporateId}</td>
                <td style={styles.td}>
                  {po.details.location?.city}, {po.details.location?.state}, {po.details.location?.country} -{' '}
                  {po.details.location?.pincode}
                </td>
                <td style={styles.td}>{po.details.userEmail}</td>
                <td style={styles.td}>{po.details.contactPhone}</td>
                <td style={styles.td}>{po.details.phone}</td>
                <td style={styles.td}>{po.details.websiteURL}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noData}>No Post Offices found</p>
      )}

      {/* Button to toggle form */}
      <button style={styles.formButton} onClick={toggleForm}>
        Send Email
      </button>

      {/* Form */}
      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Credentials:</label>
            <input
              type="text"
              name="credentials"
              value={formData.credentials}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

const styles = {
  // ... (Keep existing styles here)
  formButton: {
    padding: '10px 20px',
    marginTop: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ListPO;
