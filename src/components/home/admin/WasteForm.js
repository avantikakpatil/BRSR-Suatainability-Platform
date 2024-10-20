import React, { useState } from 'react';

const WasteManagementForm = () => {
  const [formData, setFormData] = useState({
    currentPlasticWaste: '',
    previousPlasticWaste: '',
    currentEWaste: '',
    previousEWaste: '',
    currentBioMedicalWaste: '',
    previousBioMedicalWaste: '',
    currentConstructionWaste: '',
    previousConstructionWaste: '',
    currentBatteryWaste: '',
    previousBatteryWaste: '',
    currentRadioactiveWaste: '',
    previousRadioactiveWaste: '',
    otherHazardousWaste: '',
    otherNonHazardousWaste: '',
    recycledWaste: '',
    reusedWaste: '',
    otherRecoveryOperationsWaste: '',
    incinerationWaste: '',
    landfillWaste: '',
    otherDisposalWaste: '',
    externalAssessment: '',
    externalAgencyName: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Waste Management Form</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter</th>
              <th style={styles.th}>FY ____ (Current Year)</th>
              <th style={styles.th}>FY ____ (Previous Year)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Plastic waste (A)', field: 'PlasticWaste' },
              { label: 'E-waste (B)', field: 'EWaste' },
              { label: 'Bio-medical waste (C)', field: 'BioMedicalWaste' },
              { label: 'Construction and demolition waste (D)', field: 'ConstructionWaste' },
              { label: 'Battery waste (E)', field: 'BatteryWaste' },
              { label: 'Radioactive waste (F)', field: 'RadioactiveWaste' },
            ].map((item) => (
              <tr key={item.field}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={`current${item.field}`}
                    value={formData[`current${item.field}`]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={`previous${item.field}`}
                    value={formData[`previous${item.field}`]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
            {/* Other Hazardous Waste */}
            <tr>
              <td style={styles.td}>Other Hazardous waste (G)</td>
              <td colSpan="2" style={styles.td}>
                <input
                  type="text"
                  name="otherHazardousWaste"
                  value={formData.otherHazardousWaste}
                  onChange={handleChange}
                  style={styles.inputLong}
                />
              </td>
            </tr>
            {/* Other Non-hazardous Waste */}
            <tr>
              <td style={styles.td}>Other Non-hazardous waste (H)</td>
              <td colSpan="2" style={styles.td}>
                <input
                  type="text"
                  name="otherNonHazardousWaste"
                  value={formData.otherNonHazardousWaste}
                  onChange={handleChange}
                  style={styles.inputLong}
                />
              </td>
            </tr>
            {/* Waste Recovery Operations */}
            {[
              { label: 'Recycled waste', field: 'recycledWaste' },
              { label: 'Re-used waste', field: 'reusedWaste' },
              { label: 'Other recovery operations waste', field: 'otherRecoveryOperationsWaste' },
            ].map((item) => (
              <tr key={item.field}>
                <td style={styles.td}>{item.label}</td>
                <td colSpan="2" style={styles.td}>
                  <input
                    type="number"
                    name={item.field}
                    value={formData[item.field]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
            {/* Waste Disposal Operations */}
            {[
              { label: 'Incineration waste', field: 'incinerationWaste' },
              { label: 'Landfill waste', field: 'landfillWaste' },
              { label: 'Other disposal operations waste', field: 'otherDisposalWaste' },
            ].map((item) => (
              <tr key={item.field}>
                <td style={styles.td}>{item.label}</td>
                <td colSpan="2" style={styles.td}>
                  <input
                    type="number"
                    name={item.field}
                    value={formData[item.field]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* External Assessment */}
        <div style={styles.assessmentSection}>
          <label style={styles.label}>External Assessment (Y/N):</label>
          <input
            type="text"
            name="externalAssessment"
            value={formData.externalAssessment}
            onChange={handleChange}
            style={styles.inputAssessment}
          />
          {formData.externalAssessment.toLowerCase() === 'y' && (
            <>
              <label style={styles.label}>External Agency Name:</label>
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName}
                onChange={handleChange}
                style={styles.inputAssessment}
              />
            </>
          )}
        </div>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '100%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '10px',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
    width: '33%',
  },
  td: {
    border: '1px solid #ccc',
    padding: '8px',
  },
  input: {
    width: '90%',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.85rem',
  },
  inputLong: {
    width: '95%',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.85rem',
  },
  assessmentSection: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
  },
  inputAssessment: {
    width: '50%',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default WasteManagementForm;
