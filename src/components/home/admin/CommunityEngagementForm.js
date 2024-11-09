import React, { useState } from 'react';

const CommunityEngagementForm = ({ goBack }) => {
  const [challenges, setChallenges] = useState([
    {
      title: '',
      startDate: '',
      endDate: '',
      description: '',
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
        title: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const removeChallengeRow = (index) => {
    const updatedChallenges = challenges.filter((_, i) => i !== index);
    setChallenges(updatedChallenges);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission of community engagement data here
    console.log('Challenges:', challenges);
    goBack(); // Go back to the main admin panel
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Community Engagement Form</h1> {/* Bolded heading outside the table */}

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
                  <button type="button" onClick={() => removeChallengeRow(index)} style={styles.button}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.buttonsContainer}>
          <button type="button" onClick={addChallengeRow} style={styles.addButton}>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '10px', // Reduced padding for better layout
  },
  form: {
    width: '100%',
    maxWidth: '1000px', // Max width for better space utilization
    backgroundColor: '#fff',
    padding: '20px', // Consistent padding inside the form
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold', // Made the title bold
    marginBottom: '15px', // Reduced space between title and table
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px', // Reduced margin to bring table closer to title
  },
  tableHeader: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: '600',
  },
  tableCell: {
    padding: '8px',
    borderBottom: '1px solid #ccc',
  },
  inputTitle: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
    marginBottom: '8px', // Space between fields for better layout
  },
  inputDate: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
  },
  inputDescription: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
    minHeight: '80px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  addButton: {
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  button: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
};

export default CommunityEngagementForm;
