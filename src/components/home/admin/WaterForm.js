import React, { useState } from "react";

const WaterForm = () => {
  const [formData, setFormData] = useState({
    fyCurrent: "",
    fyPrevious: "",
    surfaceWater: "",
    groundwater: "",
    thirdPartyWater: "",
    seawater: "",
    others: "",
    totalWithdrawal: "",
    totalConsumption: "",
    waterIntensity: "",
    externalAssessment: "N",
    externalAgencyName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the formData or send it to the server
    console.log(formData);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.title}>Water withdrawal by source (in kilolitres)</h3>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            FY (Current Financial Year):
            <input
              type="text"
              name="fyCurrent"
              value={formData.fyCurrent}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            FY (Previous Financial Year):
            <input
              type="text"
              name="fyPrevious"
              value={formData.fyPrevious}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Source</th>
              <th style={styles.tableHeader}>Value (kilolitres)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Surface water", name: "surfaceWater" },
              { label: "Groundwater", name: "groundwater" },
              { label: "Third party water", name: "thirdPartyWater" },
              { label: "Seawater / desalinated water", name: "seawater" },
              { label: "Others", name: "others" },
              { label: "Total volume of water withdrawal", name: "totalWithdrawal" },
              { label: "Total volume of water consumption", name: "totalConsumption" },
              { label: "Water intensity per rupee of turnover", name: "waterIntensity" },
            ].map(({ label, name }) => (
              <tr key={name}>
                <td style={styles.tableCell}>{label}</td>
                <td style={styles.tableCell}>
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={styles.tableInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 style={styles.optionalTitle}>Water Intensity (Optional)</h4>
        <p style={styles.optionalText}>The relevant metric may be selected by the entity</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            External assessment by an agency? (Y/N):
            <select
              name="externalAssessment"
              value={formData.externalAssessment}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </label>

          {formData.externalAssessment === "Y" && (
            <label style={styles.label}>
              Name of the external agency:
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          )}
        </div>

        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f0f0f0",
      minHeight: "100vh",
    },
    form: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "700px",
    },
    title: {
      textAlign: "center",
      marginBottom: "30px",
      fontSize: "1.8em",
      color: "#333",
      fontWeight: "600",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column", // Stack items vertically
      marginBottom: "20px",
    },
    label: {
      margin: "10px 0",
      fontSize: "1em",
      color: "#333",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginTop: "5px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1em",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    },
    tableHeader: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      fontWeight: "600",
    },
    tableCell: {
      padding: "12px",
      borderBottom: "1px solid #ccc",
    },
    tableInput: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      fontSize: "1em",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    optionalTitle: {
      fontSize: "1.4em",
      color: "#333",
      fontWeight: "600",
      marginTop: "30px",
      marginBottom: "10px",
    },
    optionalText: {
      fontSize: "0.9em",
      color: "#555",
      marginBottom: "20px",
    },
    submitButton: {
      display: "block",
      width: "100%",
      padding: "15px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.1em",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    submitButtonHover: {
      backgroundColor: "#45a049",
    },
  };
  

export default WaterForm;
