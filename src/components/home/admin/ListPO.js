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
    const poRef = ref(db, 'headquarter/postOffices');
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
        po.type,
        po.details?.name,
        po.details?.cin,
        `${po.details?.address?.city}, ${po.details?.address?.state}, ${po.details?.address?.country} - ${po.details?.address?.pincode}`,
        po.details?.email,
        po.details?.telephone,
        po.details?.contactNumber,
        po.details?.website,
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
              <th style={styles.th} onClick={() => handleSort('type')}>Type</th>
              <th style={styles.th} onClick={() => handleSort('details.name')}>Name</th>
              <th style={styles.th} onClick={() => handleSort('details.cin')}>CIN</th>
              <th style={styles.th} onClick={() => handleSort('details.address')}>Address</th>
              <th style={styles.th} onClick={() => handleSort('details.email')}>Email</th>
              <th style={styles.th} onClick={() => handleSort('details.telephone')}>Telephone</th>
              <th style={styles.th} onClick={() => handleSort('details.contactNumber')}>Contact Number</th>
              <th style={styles.th} onClick={() => handleSort('details.website')}>Website</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((po) => (
              <tr key={po.id}>
                <td style={styles.td}>{po.type}</td>
                <td style={styles.td}>{po.details.name}</td>
                <td style={styles.td}>{po.details.cin}</td>
                <td style={styles.td}>
                  {po.details.address.city}, {po.details.address.state}, {po.details.address.country} -{' '}
                  {po.details.address.pincode}
                </td>
                <td style={styles.td}>{po.details.email}</td>
                <td style={styles.td}>{po.details.telephone}</td>
                <td style={styles.td}>{po.details.contactNumber}</td>
                <td style={styles.td}>{po.details.website}</td>
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
