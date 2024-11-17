import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";


const CommunityEngagementForm = ({ goBack }) => {
  const [challenges, setChallenges] = useState([
    {
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const handleChallengeChange = (e, index) => {
    const { name, value } = e.target;
    const updatedChallenges = [...challenges];
    updatedChallenges[index][name] = value;
    setChallenges(updatedChallenges);
  };

  const addChallengeRow = () => {
    setChallenges([
      ...challenges,
      {
        title: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeChallengeRow = (index) => {
    const updatedChallenges = challenges.filter((_, i) => i !== index);
    setChallenges(updatedChallenges);
  };


  const sanitizeEmail = (email) => {
    return email.replace(/[.#$/[\]]/g, '_');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Get authenticated user
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const sanitizedEmail = sanitizeEmail(user.email);
  
      // Create a reference to store data dynamically under user's email
      const database = getDatabase();
      const fuelDataPath = ref(database, `PostalManager/${sanitizedEmail}/inputData/communityData`);
  
      // Store the user-entered challenge data
      const communityFormData = {
        challenges: challenges, // Use the state directly here
      };
  
      // Store the data at the dynamically created path
      set(fuelDataPath, communityFormData)
        .then(() => {
          console.log("Community Data saved successfully under the user's email path!");
          // Redirect or handle post-submit action (e.g., reset form or show success message)
        })
        .catch((error) => {
          console.error("Error saving data: ", error);
        });
    } else {
      console.log("No user is authenticated.");
    }
  };
  

  return (
    <div style={styles.container}>
      {/* Go Back Button */}
      <button onClick={goBack} style={styles.goBackButton}>
        Go Back
      </button>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Community Engagement Form</h1>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Title</th>
              <th style={styles.tableHeader}>Start Date</th>
              <th style={styles.tableHeader}>End Date</th>
              <th style={styles.tableHeader}>Description</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    name="title"
                    value={challenge.title}
                    onChange={(e) => handleChallengeChange(e, index)}
                    style={styles.inputTitle}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="date"
                    name="startDate"
                    value={challenge.startDate}
                    onChange={(e) => handleChallengeChange(e, index)}
                    style={styles.inputDate}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="date"
                    name="endDate"
                    value={challenge.endDate}
                    onChange={(e) => handleChallengeChange(e, index)}
                    style={styles.inputDate}
                  />
                </td>
                <td style={styles.tableCell}>
                  <textarea
                    name="description"
                    value={challenge.description}
                    onChange={(e) => handleChallengeChange(e, index)}
                    style={styles.inputDescription}
                  />
                </td>
                <td style={styles.tableCell}>
                  <button
                    type="button"
                    onClick={() => removeChallengeRow(index)}
                    style={styles.button}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.buttonsContainer}>
          <button
            type="button"
            onClick={addChallengeRow}
            style={styles.addButton}
          >
            Add Challenge
          </button>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    padding: "10px",
    position: "relative",
  },
  goBackButton: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "0.9em",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  form: {
    width: "100%",
    maxWidth: "1200px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    marginTop: "50px", // Added margin to avoid overlap with Go Back button
  },
  title: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  tableHeader: {
    textAlign: "left",
    padding: "8px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.85em",
  },
  tableCell: {
    padding: "6px",
    borderBottom: "1px solid #ccc",
    fontSize: "0.85em",
  },
  inputTitle: {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.85em",
    marginBottom: "6px",
  },
  inputDate: {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.85em",
  },
  inputDescription: {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "0.85em",
    minHeight: "60px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  addButton: {
    backgroundColor: "#ff9800",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "4px",
    fontSize: "0.9em",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "4px",
    fontSize: "0.9em",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  button: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.8em",
  },
};

export default CommunityEngagementForm;
