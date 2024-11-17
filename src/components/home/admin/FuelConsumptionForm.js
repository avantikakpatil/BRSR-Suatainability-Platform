import React from 'react';

const FuelConsumptionForm = ({ goBack }) => {
  return (
    <div style={styles.container}>
      <button
        onClick={goBack}
        style={styles.goBackButton}
      >
        Go Back
      </button>

      <h2 style={styles.heading}>Fuel Consumption Form</h2>

      {/* Table Section */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Parameter</th>
            <th style={styles.th}>FY ____ (Current Financial Year)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: 'Total electricity consumption (A)', key: 'electricityConsumption' },
            { label: 'Total fuel consumption (B)', key: 'fuelConsumption' },
            { label: 'Energy consumption through other sources (C)', key: 'otherEnergyConsumption' },
            { label: 'Total energy consumption (A+B+C)', key: 'totalEnergyConsumption' },
            { label: 'Energy intensity per rupee of turnover (Total energy consumption / turnover in rupees)', key: 'energyIntensity' },
          ].map((item) => (
            <tr key={item.key}>
              <td style={styles.td}>{item.label}</td>
              <td style={styles.td}>
                <input
                  type="text"
                  placeholder="Enter value"
                  style={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upload Bill Section */}
      <div style={styles.uploadSection}>
        <label style={styles.label}>Upload Bill</label>
        <input
          type="file"
          style={styles.fileInput}
        />
      </div>

      {/* Note Section */}
      <p style={styles.note}>
        <strong>Note:</strong> Indicate if any independent assessment/evaluation/assurance has been carried out by an
        external agency? (Y/N) If yes, name the external agency.
      </p>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: '#fff',
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
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  uploadSection: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px',
  },
  fileInput: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  note: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
};

export default FuelConsumptionForm;
