// src/components/admin/AdminPanel.js

import React from 'react';
import InputDataForm from './InputDataForm'; // Import the InputDataForm

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <InputDataForm /> {/* Include the InputDataForm component */}
      {/* Other components like AnalyticsDashboard, UserManagement, etc. can go here */}
    </div>
  );
};

export default AdminPanel;
