import React, { useState } from 'react';

const HeadquarterDashboard = () => {
  const [viewBy, setViewBy] = useState('state');

  const handleViewChange = (event) => {
    setViewBy(event.target.value);
  };

  return (
    <div className="headquarters-dashboard">
      <h2 className="dashboard-title">Headquarter Dashboard</h2>

      <div className="button-container">
        <button className="action-button">Create Post Office</button>
        <button className="action-button">Assign Role</button>
      </div>

      <div className="view-selection">
        <label className="report-label">Report:</label>
        <label className="view-by-label">View By:</label>
        <select className="view-by-select" value={viewBy} onChange={handleViewChange}>
          <option value="state">State</option>
          <option value="division">Division</option>
        </select>
      </div>

      <style jsx>{`
        .headquarters-dashboard {
          max-width: 100%;
          margin: 40px auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          text-align: left;
        }

        .dashboard-title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .button-container {
          display: flex;
          justify-content: space-evenly;
          margin-bottom: 20px;
        }

        .action-button {
          width: 45%;
          padding: 12px;
          font-size: 18px;
          font-weight: bold;
          color: #fff;
          background-color: #4caf50; /* Primary color */
          border: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .action-button:hover {
          background-color: #45a049;
        }

        .view-selection {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          margin-top: 20px;
        }

        .report-label,
        .view-by-label {
          font-size: 18px;
          font-weight: 500;
          color: #555;
        }

        .view-by-select {
          padding: 10px 15px;
          font-size: 18px;
          color: #333;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 200px;
        }
      `}</style>
    </div>
  );
};

export default HeadquarterDashboard;
