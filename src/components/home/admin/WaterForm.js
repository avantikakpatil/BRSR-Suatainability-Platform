import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";

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
    billFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, billFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const db = getDatabase();
    const newDataRef = ref(db, 'inputData/waterData/' + Date.now());

    set(newDataRef, {
      ...formData,
      createdAt: new Date().toISOString(),
      billFile: formData.billFile ? formData.billFile.name : null,
    })
      .then(() => {
        console.log("Data stored successfully");
        setFormData({
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
          billFile: null,
        });
      })
      .catch((error) => {
        console.error("Error storing data: ", error);
      });
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.title}>Water Management Form</h3>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            FY (Current):
            <input
              type="text"
              name="fyCurrent"
              value={formData.fyCurrent}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            FY (Previous):
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
              <th style={styles.tableHeader}>Source(Water withdrawal by source (in kilolitres))</th>
              <th style={styles.tableHeader}>Value (kl)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Surface water", name: "surfaceWater" },
              { label: "Groundwater", name: "groundwater" },
              { label: "Third party water", name: "thirdPartyWater" },
              { label: "Seawater / desalinated water", name: "seawater" },
              { label: "Others", name: "others" },
              { label: "Total withdrawal", name: "totalWithdrawal" },
              { label: "Total consumption", name: "totalConsumption" },
              { label: "Water intensity per turnover", name: "waterIntensity" },
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
        <p style={styles.optionalText}>Relevant metric may be selected</p>

        <div style={styles.singleInputGroup}>
          <label style={styles.singleLabel}>
            External assessment? (Y/N):
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
        </div>

        {formData.externalAssessment === "Y" && (
          <div style={styles.singleInputGroup}>
            <label style={styles.singleLabel}>
              External agency name:
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          </div>
        )}

        <div style={styles.singleInputGroup}>
          <label style={styles.singleLabel}>
            Upload Bill((PDF, DOC, Image files)):
            <input
              type="file"
              name="billFile"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </label>
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
    padding: "5px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  form: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "1400px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: "8px",
    fontSize: "1.1em",
    color: "#333",
    fontWeight: "bold",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "10px",
    gap: "10px",
  },
  singleInputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.85em",
    color: "#333",
    fontWeight: "500",
    width: "48%",
  },
  singleLabel: {
    fontSize: "0.85em",
    color: "#333",
    fontWeight: "500",
  },
  input: {
    padding: "6px",
    marginTop: "4px",
    borderRadius: "3px",
    border: "1px solid #ccc",
    fontSize: "0.85em",
    outline: "none",
  },
  fileInput: {
    padding: "6px",
    marginTop: "4px",
    borderRadius: "3px",
    fontSize: "0.85em",
    outline: "none",
  },
  table: {
    width: "100%",
    maxWidth: "100%",
    borderCollapse: "collapse",
    marginBottom: "15px",
  },
  tableHeader: {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.85em",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "0.85em",
  },
  tableInput: {
    width: "100%",
    padding: "6px",
    borderRadius: "3px",
    border: "1px solid #ccc",
    fontSize: "0.85em",
    outline: "none",
  },
  optionalTitle: {
    fontSize: "1em",
    color: "#333",
    fontWeight: "600",
    marginTop: "15px",
    marginBottom: "8px",
  },
  optionalText: {
    fontSize: "0.8em",
    color: "#555",
    marginBottom: "10px",
  },
  submitButton: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    fontSize: "1em",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
};

export default WaterForm;
