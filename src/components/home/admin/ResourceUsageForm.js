import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const ResourceUsageForm = () => {
    const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/admin/CumulativeExpenditure');
  };
  const [currentStep, setCurrentStep] = useState(0);

  const sections = [
    "Energy Consumption",
    "Water Usage",
    "Fuel and Transportation",
    "Consumables for Operations",
    "Office Supplies",
    "Building Maintenance",
    "IT and Communication Infrastructure",
    "Human Resources",
    "Sustainability Efforts"
  ];

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar with Timeline */}
      <div className="w-1/4 bg-white shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Monthly Resource Usage</h2>
        <ul className="space-y-4">
          {sections.map((section, index) => (
            <li key={index} className={`flex items-center ${index <= currentStep ? "text-green-600" : "text-gray-500"}`}>
              <span className={`rounded-full h-4 w-4 ${index <= currentStep ? "bg-green-600" : "bg-gray-300"} mr-2`}></span>
              {section}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8 space-y-10">
        <h1 className="text-2xl font-bold mb-4 text-green-600">About Your Resource Usage</h1>

        {/* Dynamic Section Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-600 mb-4">{sections[currentStep]}</h2>
          <p className="text-gray-600 mb-4">
            {`Please provide details about your ${sections[currentStep].toLowerCase()} for the month.`}
          </p>

          {/* Input fields based on section */}
          <div className="grid grid-cols-1 gap-4">
            {currentStep === 0 && (
              <>
                <input type="text" placeholder="Lighting (number of bulbs)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="HVAC Systems (number of units)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Computers and Electronics (number of devices)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Battery Usage (backup power)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Electric Doors (automated entry)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 1 && (
              <>
                <input type="text" placeholder="Restrooms (water consumption)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Cleaning (water for cleaning)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Staff Break Rooms (kitchen usage)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Landscape Maintenance (irrigation)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 2 && (
              <>
                <input type="text" placeholder="Vehicle Fuel (consumption)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Alternative Fuels (electric/hybrid mileage)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Transportation Equipment (maintenance items)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Backup Generators (fuel)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 3 && (
              <>
                <input type="text" placeholder="Paper (reams or kg)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Ink/Toner (cartridges)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Mailing Supplies (boxes, bubble wrap, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Cleaning Supplies (disinfectants, mops, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Packaging Materials (tape, bubble wrap, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 4 && (
              <>
                <input type="text" placeholder="Stationery (pens, paper clips, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Organizational Supplies (file cabinets, bins, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Technology Accessories (cables, chargers, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 5 && (
              <>
                <input type="text" placeholder="Paint and Repair Materials" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Cleaning and Sanitization Supplies" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Security Systems (CCTV, alarms)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Waste Management Supplies" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 6 && (
              <>
                <input type="text" placeholder="Network Devices (routers, modems)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Software and Licenses" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Telecommunication (phones, intercoms)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 7 && (
              <>
                <input type="text" placeholder="Staff Uniforms" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Training Materials (manuals, videos)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
            {currentStep === 8 && (
              <>
                <input type="text" placeholder="Solar Panels (energy produced)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Recycling Stations (paper, plastic, etc.)" className="w-full p-3 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Water Conservation (low-flow faucets, rainwater collection)" className="w-full p-3 border border-gray-300 rounded-lg" />
              </>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg ${currentStep === 0 ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-500"}`}
          >
            Previous
          </button>
          {currentStep < sections.length - 1 ? (
            <button
              onClick={nextStep}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500"
            >
              Next
            </button>
          ) : (
            <button onClick={handleLogout}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500"
            >
              Submit
            </button>

          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceUsageForm;
