import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import emailjs from 'emailjs-com';

const ListPostOffices = () => {
  const [postOffices, setPostOffices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);  // State to toggle email form
  const [currentEmail, setCurrentEmail] = useState(''); // Current email to send to
  const [message, setMessage] = useState(''); // State for message input

  // Fetch data from Firebase
  useEffect(() => {
    const poRef = ref(db, 'headquarter/postOffices');
    const unsubscribe = onValue(poRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Transform data and remove fields with missing data
        const formattedData = Object.entries(data).map(([id, details]) => ({
          id,
          category: details.poCategory || null,
          name: details.details?.postOfficeName || details.details?.name || null,
          corporateId: details.details?.corporateId || details.details?.cin || null,
          location:
            details.details?.location
              ? `${details.details.location.city || ''}, ${details.details.location.state || ''}, ${details.details.location.country || ''} - ${details.details.location.zipCode || ''}`
              : null,
          email: details.details?.userEmail || details.details?.email || null,
          phone: details.details?.contactPhone || details.details?.telephone || null,
          website: details.details?.websiteURL || details.details?.website || null,
        }));

        const filtered = formattedData.map((item) =>
          Object.fromEntries(Object.entries(item).filter(([, value]) => value !== null))
        );

        setPostOffices(filtered);
        setFilteredData(filtered); // Initialize filtered data
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

    const filtered = postOffices.filter((po) => {
      const searchableValues = Object.values(po)
        .filter((value) => typeof value === 'string') // Ensure only string fields are searched
        .join(' ')
        .toLowerCase();
      return searchableValues.includes(term);
    });

    setFilteredData(filtered);
  };

  // Handle email form toggle and setting current email
  const handleEmailButtonClick = (email) => {
    setCurrentEmail(email);
    setShowForm(true); // Show the email form
  };

  // Handle message change in email form
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle email sending via EmailJS
  const handleSendEmail = (e) => {
    e.preventDefault();  // Prevent default form submission

    const serviceID = 'service_stnn5nm'; // Replace with your EmailJS service ID
    const templateID = 'template_xrxxhgr'; // Replace with your EmailJS template ID
    const publicKey = 'c3qKQXJwMr5IbmKAF'; // Replace with your EmailJS public key

    const emailParams = {
      to_email: currentEmail,  // Send to the selected post office email
      message: message,  // User's message
    };

    emailjs
      .send(serviceID, templateID, emailParams, publicKey)
      .then(() => {
        alert(`Email sent successfully to ${currentEmail}`);
        setMessage('');  // Clear message field
        setShowForm(false); // Close the email form
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        alert('Failed to send email. Please try again.');
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>List of Post Offices</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search across all fields"
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />

      {/* Table */}
      {filteredData.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              {/* Dynamically render the column headers */}
              {Object.keys(filteredData[0]).map((key) => (
                <th key={key} style={styles.th}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((po) => (
              <tr key={po.id}>
                {/* Render values dynamically */}
                {Object.entries(po).map(([key, value]) => (
                  key !== 'id' && key !== 'Actions' && (
                    <td key={key} style={styles.td}>
                      {key === 'website' && value ? (
                        <a href={value} target="_blank" rel="noopener noreferrer">
                          {value}
                        </a>
                      ) : (
                        value || '-'
                      )}
                    </td>
                  )
                ))}
                <td style={styles.td}>
                  {po.email ? (
                    <button
                      style={styles.emailButton}
                      onClick={() => handleEmailButtonClick(po.email)}
                    >
                      Email
                    </button>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noData}>No Post Offices found</p>
      )}

      {/* Email Form Popup */}
      {showForm && (
        <div style={styles.formContainer}>
          <h3>Send Email</h3>
          <form onSubmit={handleSendEmail}>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your message here"
              style={styles.textarea}
            ></textarea>
            <button type="submit" style={styles.submitButton}>Send Email</button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => setShowForm(false)} // Close form without sending
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    marginBottom: '20px',
    padding: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
  emailButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  submitButton: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
};

export default ListPostOffices;
