import React, { useState } from 'react';
import { FaBolt, FaTrash, FaTint, FaHandsHelping, FaGasPump } from 'react-icons/fa'; // Import icons
import ElectricityForm from './ElectricityForm';
import WasteForm from './WasteForm';
import WaterForm from './WaterForm';
import CommunityEngagementForm from './CommunityEngagementForm';
import FuelConsumptionForm from './FuelConsumptionForm';

const AdminPanel = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const goBack = () => {
    setSelectedOption(null);
  };

  const menuOptions = [
    {
      label: 'Electricity',
      icon: <FaBolt className="text-blue-500 text-4xl mb-2" />, // Icon for electricity
      colorClass: 'bg-blue-100',
      buttonClass: 'bg-blue-400 hover:bg-blue-500',
      action: 'Electricity',
    },
    {
      label: 'Waste',
      icon: <FaTrash className="text-green-500 text-4xl mb-2" />, // Icon for waste
      colorClass: 'bg-green-100',
      buttonClass: 'bg-green-400 hover:bg-green-500',
      action: 'Waste',
    },
    {
      label: 'Water',
      icon: <FaTint className="text-teal-500 text-4xl mb-2" />, // Icon for water
      colorClass: 'bg-teal-100',
      buttonClass: 'bg-teal-400 hover:bg-teal-500',
      action: 'Water',
    },
    {
      label: 'Community Engagement',
      icon: <FaHandsHelping className="text-pink-500 text-4xl mb-2" />, // Icon for community engagement
      colorClass: 'bg-pink-100',
      buttonClass: 'bg-pink-400 hover:bg-pink-500',
      action: 'CommunityEngagement',
    },
    {
      label: 'Fuel Consumption',
      icon: <FaGasPump className="text-orange-500 text-4xl mb-2" />, // Icon for fuel
      colorClass: 'bg-orange-100',
      buttonClass: 'bg-orange-400 hover:bg-orange-500',
      action: 'FuelConsumption',
    },
  ];

  return (
    <div className="admin-panel p-8" style={{ marginLeft: '50px' }}>
      {!selectedOption && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {menuOptions.map((option, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${option.colorClass} p-6 rounded-lg shadow-md`}
            >
              <div className="mb-2">{option.icon}</div> {/* Display icon above label */}
              <h2 className="text-xl font-bold mb-4">{option.label}</h2>
              <button
                onClick={() => handleOptionClick(option.action)}
                className={`p-4 text-white font-bold rounded shadow-lg transition w-full ${option.buttonClass}`}
              >
                Input {option.label} Data
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOption === 'Electricity' && <ElectricityForm goBack={goBack} />}
      {selectedOption === 'Waste' && <WasteForm goBack={goBack} />}
      {selectedOption === 'Water' && <WaterForm goBack={goBack} />}
      {selectedOption === 'CommunityEngagement' && (
        <CommunityEngagementForm goBack={goBack} />
      )}
      {selectedOption === 'FuelConsumption' && (
        <FuelConsumptionForm goBack={goBack} />
      )}
    </div>
  );
};

export default AdminPanel;
