import React, { useState } from 'react';


const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState(null); // To track the selected option

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="admin-panel p-8" style={{ marginLeft: '50px' }}> {/* Adjust margin to prevent overlap with sidebar */}
      <h1 className="text-2xl font-bold mb-6">Admin Panel - Input Data</h1>

      {/* Show options if no form is selected */}
      {!selectedOption && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8"> {/* Adjust grid for proper layout */}
          <div className="flex flex-col items-center bg-blue-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Energy</h2>
            <button 
              onClick={() => handleOptionClick('Energy')} 
              className="p-4 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-700 transition w-full"
            >
              Input Energy Data
            </button>
          </div>

          <div className="flex flex-col items-center bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Waste</h2>
            <button 
              onClick={() => handleOptionClick('Waste')} 
              className="p-4 bg-green-600 text-white font-bold rounded shadow-lg hover:bg-green-700 transition w-full"
            >
              Input Waste Data
            </button>
          </div>

          <div className="flex flex-col items-center bg-teal-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Water</h2>
            <button 
              onClick={() => handleOptionClick('Water')} 
              className="p-4 bg-teal-600 text-white font-bold rounded shadow-lg hover:bg-teal-700 transition w-full"
            >
              Input Water Data
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default AdminPanel;
