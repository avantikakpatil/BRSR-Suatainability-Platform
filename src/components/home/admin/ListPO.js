import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const ListPO = () => {
  const [postOffices, setPostOffices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  filterContainer: {
    marginBottom: '20px',
  },
  filterInput: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f4f4f4',
    color: '#333',
    textAlign: 'left',
    padding: '10px',
    borderBottom: '2px solid #ddd',
    cursor: 'pointer',
  },
  td: {
    padding: '10px',
    color: '#555',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  noData: {
    fontSize: '16px',
    color: '#999',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default ListPO;
