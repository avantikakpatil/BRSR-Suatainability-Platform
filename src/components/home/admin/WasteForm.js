import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H",
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const WasteForm = ({ goBack }) => {
  const [formData, setFormData] = useState({
    currentPlasticWaste: "",
    currentEWaste: "",
    currentBioMedicalWaste: "",
    currentConstructionWaste: "",
    currentBatteryWaste: "",
    currentRadioactiveWaste: "",
    otherHazardousWaste: "",
    otherNonHazardousWaste: "",
    externalAssessment: "",
    externalAgencyName: "",
    billFile: null,
    totalWaste: "",
  });

  const [currentUserId, setCurrentUserId] = useState(null);

  // Retrieve existing data if available
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const sanitizedEmail = user.email.replace(/[.#$/[\]]/g, "_");
        setCurrentUserId(sanitizedEmail);
        const userRef = ref(database, `PostalManager/${sanitizedEmail}/inputData/wasteData`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            setFormData(snapshot.val());
          }
        });
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let updatedFormData = { ...formData };

    if (type === "file") {
      updatedFormData.billFile = files[0];
    } else {
      updatedFormData[name] = value;
    }

    // Calculate total waste for relevant fields
    const wasteFields = [
      "currentPlasticWaste",
      "currentEWaste",
      "currentBioMedicalWaste",
      "currentConstructionWaste",
      "currentBatteryWaste",
      "currentRadioactiveWaste",
      "otherHazardousWaste",
      "otherNonHazardousWaste",
    ];

    const totalWaste = wasteFields.reduce((total, field) => {
      const fieldValue = parseFloat(updatedFormData[field]) || 0;
      return total + fieldValue;
    }, 0);

    updatedFormData.totalWaste = totalWaste.toFixed(2);

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user) {
      // Use sanitized email as a unique identifier
      const sanitizedEmail = user.email.replace(/[.#$/[\]]/g, "_");
      // Store data in a consistent node under the user's data
      const wasteDataRef = ref(database, `PostalManager/${sanitizedEmail}/inputData/wasteData`);

      // Upload the form data
      set(wasteDataRef, { ...formData })
        .then(() => {
          alert("Data submitted successfully! Existing data has been overwritten.");
          setFormData({
            currentPlasticWaste: "",
            currentEWaste: "",
            currentBioMedicalWaste: "",
            currentConstructionWaste: "",
            currentBatteryWaste: "",
            currentRadioactiveWaste: "",
            otherHazardousWaste: "",
            otherNonHazardousWaste: "",
            externalAssessment: "",
            externalAgencyName: "",
            billFile: null,
            totalWaste: 0,
          });
        })
        .catch((error) => {
          alert("Error submitting data: " + error.message);
        });
    } else {
      alert("No user is logged in.");
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={goBack} style={styles.goBackButton}>
        Go Back
      </button>

      <h1 style={styles.heading}>
        <b>Waste Management Form</b>
      </h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                PARAMETER (TOTAL WASTE GENERATED IN METRIC TONNES)
              </th>
              <th style={styles.th}>FY (CURRENT YEAR)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Plastic Waste", name: "currentPlasticWaste" },
              { label: "e-Waste", name: "currentEWaste" },
              { label: "Bio-Medical Waste", name: "currentBioMedicalWaste" },
              { label: "Construction and Demolition Waste", name: "currentConstructionWaste" },
              { label: "Battery Waste", name: "currentBatteryWaste" },
              { label: "Radioactive Waste", name: "currentRadioactiveWaste" },
              { label: "Other Hazardous Waste", name: "otherHazardousWaste" },
              { label: "Other Non-Hazardous Waste", name: "otherNonHazardousWaste" },
            ].map((item) => (
              <tr key={item.name}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.totalSection}>
          <label>
            <b>Total Waste:</b>
            <input
              type="text"
              name="totalWaste"
              value={formData.totalWaste}
              readOnly
              style={styles.input}
            />
          </label>
        </div>

        <div style={styles.additionalInputs}>
          <label>
            External Assessment (Y/N):<br />
            <select
              name="externalAssessment"
              value={formData.externalAssessment || ""}
              onChange={handleChange}
              style={styles.dropdown}
            >
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </label>
          {formData.externalAssessment?.toLowerCase() === "y" && (
            <label>
              Name of External Agency:<br />
              <input
                type="text"
                name="externalAgencyName"
                value={formData.externalAgencyName || ""}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          )}
        </div>

        <div style={styles.uploadSection}>
          <label>
            Upload Supporting Document (PDF, DOC, Image files):<br />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleChange}
              style={styles.fileInput}
            />
          </label>
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
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
  },
  goBackButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px",
    textAlign: "center",
    fontSize: "14px",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "center",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "4px",
    fontSize: "14px",
  },
  dropdown: {
    width: "100%",
    padding: "4px",
    fontSize: "14px",
  },
  additionalInputs: {
    marginTop: "20px",
  },
  uploadSection: {
    marginTop: "20px",
  },
  fileInput: {
    marginTop: "10px",
    fontSize: "14px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default WasteForm;
