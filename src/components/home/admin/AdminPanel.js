import React, { useState } from 'react';
import EnergyForm from './EnergyForm';
import WasteForm from './WasteForm';
import WaterForm from './WaterForm';
import CommunityEngagementForm from './CommunityEngagementForm'; // Import the new form component

const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const goBack = () => {
    setSelectedOption(null);
  };

  return (
    <div className="admin-panel p-8" style={{ marginLeft: '50px' }}>
      {!selectedOption && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-blue-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Energy</h2>
            <button
              onClick={() => handleOptionClick('Energy')}
              className="p-4 bg-blue-400 text-white font-bold rounded shadow-lg hover:bg-blue-500 transition w-full"
            >
              Input Energy Data
            </button>
          </div>

          <div className="flex flex-col items-center bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Waste</h2>
            <button
              onClick={() => handleOptionClick('Waste')}
              className="p-4 bg-green-400 text-white font-bold rounded shadow-lg hover:bg-green-500 transition w-full"
            >
              Input Waste Data
            </button>
          </div>

          <div className="flex flex-col items-center bg-teal-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Water</h2>
            <button
              onClick={() => handleOptionClick('Water')}
              className="p-4 bg-teal-400 text-white font-bold rounded shadow-lg hover:bg-teal-500 transition w-full"
            >
              Input Water Data
            </button>
          </div>

          <div className="flex flex-col items-center bg-pink-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Community Engagement</h2>
            <button
              onClick={() => handleOptionClick('CommunityEngagement')}
              className="p-4 bg-pink-400 text-white font-bold rounded shadow-lg hover:bg-pink-500 transition w-full"
            >
              Input Community Engagement Data
            </button>
          </div>
        </div>
      )}

      {/* Conditionally render forms based on selected option */}
      {selectedOption === 'Energy' && <EnergyForm goBack={goBack} />}
      {selectedOption === 'Waste' && <WasteForm goBack={goBack} />}
      {selectedOption === 'Water' && <WaterForm goBack={goBack} />}
      {selectedOption === 'CommunityEngagement' && <CommunityEngagementForm goBack={goBack} />}
    </div>
  );
};

export default AdminPanel;
