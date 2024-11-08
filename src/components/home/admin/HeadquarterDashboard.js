import React, { useState } from 'react';
import './AdminForm.css'; // Assuming your CSS file

const HeadquarterDashboard = () => {
  const [viewBy, setViewBy] = useState('state');

  const handleViewChange = (event) => {
    setViewBy(event.target.value);
  };

  return (
    <div className="headquarters-dashboard">
      <div className="button-container">
        <button>Create Post Office</button>
        <button style={{ marginLeft: 10 }}>Assign Role</button> </div>
      <div className="view-selection">
      <label>Report</label>
        <label>View By:</label>
        <select value={viewBy} onChange={handleViewChange}>
          <option value="state">State</option>
          <option value="division">Division</option>
        </select>
      </div>
    </div>
  );
};

export default HeadquarterDashboard;