import React, { useState } from 'react';

const BaselineParametersForm = () => {
  const [formData, setFormData] = useState({
    electricityEmployees: '',
    electricitySize: '',
    fuelVehicles: '',
    fuelDistance: '',
    wasteEmployees: '',
    wasteHistorical: '',
    waterEmployees: '',
    waterSize: '',
    outreachInitiatives: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form Data:', formData);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Baseline Parameters</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Electricity Section */}
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Electricity</h2>
          <label style={styles.label}>Number of Employees</label>
          <input
            type="number"
            name="electricityEmployees"
            value={formData.electricityEmployees}
            onChange={handleChange}
            style={styles.smallInput}
          />
          <label style={styles.label}>Size of Post Office</label>
          <input
            type="text"
            name="electricitySize"
            value={formData.electricitySize}
            onChange={handleChange}
            style={styles.smallInput}
          />
        </div>

        {/* Fuel Section */}
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Fuel</h2>
          <label style={styles.label}>Number of Vehicles</label>
          <input
            type="number"
            name="fuelVehicles"
            value={formData.fuelVehicles}
            onChange={handleChange}
            style={styles.smallInput}
          />
          <label style={styles.label}>Average Distance (per year or month)</label>
          <input
            type="text"
            name="fuelDistance"
            value={formData.fuelDistance}
            onChange={handleChange}
            style={styles.smallInput}
          />
        </div>

        {/* Waste Section */}
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Waste</h2>
          <label style={styles.label}>Number of Employees</label>
          <input
            type="number"
            name="wasteEmployees"
            value={formData.wasteEmployees}
            onChange={handleChange}
            style={styles.smallInput}
          />
          <label style={styles.label}>Historical Waste Data</label>
          <input
            type="text"
            name="wasteHistorical"
            value={formData.wasteHistorical}
            onChange={handleChange}
            style={styles.smallInput}
          />
        </div>

        {/* Water Section */}
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Water</h2>
          <label style={styles.label}>Number of Employees</label>
          <input
            type="number"
            name="waterEmployees"
            value={formData.waterEmployees}
            onChange={handleChange}
            style={styles.smallInput}
          />
          <label style={styles.label}>Size of Post Office</label>
          <input
            type="text"
            name="waterSize"
            value={formData.waterSize}
            onChange={handleChange}
            style={styles.smallInput}
          />
        </div>

        {/* Community Outreach Section */}
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Community Outreach</h2>
          <label style={styles.label}>Number of Outreach Initiatives</label>
          <input
            type="text"
            name="outreachInitiatives"
            value={formData.outreachInitiatives}
            onChange={handleChange}
            style={styles.smallInput}
          />
        </div>

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#2e7d32',
    textAlign: 'center',  // Centering the main heading
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Two columns layout
    gap: '20px',  // Larger gap for better spacing
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeading: {
    fontSize: '16px',
    color: '#388e3c',
    marginBottom: '10px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#4f4f4f',
    textAlign: 'left',
    width: '100%',
  },
  smallInput: {
    width: '90%',  // Reduced the width to fit inside the section
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #b0bec5',
    fontSize: '12px',
    backgroundColor: '#fafafa',
  },
  button: {
    gridColumn: 'span 2',  // Button spans across both columns
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#388e3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default BaselineParametersForm;
