import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BaselineCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [baselineElectricity, setBaselineElectricity] = useState(null);
  const [baselineWater, setBaselineWater] = useState(null);
  const [baselineFuel, setBaselineFuel] = useState(null);
  const [totalWaste, setTotalWaste] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate function

  const calculateBaselineElectricity = () => {
    const operatingHours = 8;
    const daysInMonth = 30;
    const totalConsumption =
      10 * operatingHours * daysInMonth + // Lighting
      20 * operatingHours * daysInMonth + // HVAC
      5 * operatingHours * daysInMonth + // Computers
      1 * operatingHours * daysInMonth + // Batteries
      2 * operatingHours * daysInMonth; // Electric Doors
    setBaselineElectricity(totalConsumption);
  };

  const calculateBaselineWater = () => {
    const waterConsumption = 5000; // Example value in liters
    setBaselineWater(waterConsumption);
  };

  const calculateBaselineFuel = () => {
    const fuelConsumption = 1000; // Example value in liters
    setBaselineFuel(fuelConsumption);
  };

  const calculateTotalWaste = () => {
    const wasteGenerated = 200; // Example value in kilograms
    setTotalWaste(wasteGenerated);
  };

  const handleSubmit = () => {
    // Perform any additional submission logic if needed
    console.log("Submission successful!");
    navigate("/SustainabilityScore"); // Redirect to onSustainabilityScore page
  };

  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Calculate Baseline Electricity
            </h2>
            <button
              onClick={calculateBaselineElectricity}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              Calculate
            </button>
            {baselineElectricity && (
              <p className="mt-4">Baseline Electricity: {baselineElectricity} kWh</p>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Calculate Baseline Water Usage
            </h2>
            <button
              onClick={calculateBaselineWater}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              Calculate
            </button>
            {baselineWater && (
              <p className="mt-4">Baseline Water Usage: {baselineWater} liters</p>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Calculate Baseline Fuel Consumption
            </h2>
            <button
              onClick={calculateBaselineFuel}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              Calculate
            </button>
            {baselineFuel && (
              <p className="mt-4">Baseline Fuel Consumption: {baselineFuel} liters</p>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Calculate Total Waste Generated
            </h2>
            <button
              onClick={calculateTotalWaste}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              Calculate
            </button>
            {totalWaste && (
              <p className="mt-4">Total Waste Generated: {totalWaste} kg</p>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Submit Baseline Data</h2>
            <p>Review all your inputs and click submit to proceed.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFormButtons = () => (
    <div className="mt-4 flex space-x-4">
      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          className="bg-gray-600 hover:bg-gray-700 text-white p-2"
        >
          Previous
        </button>
      )}
      {currentStep < 4 && (
        <button
          onClick={() => setCurrentStep((prev) => prev + 1)}
          className="bg-green-600 hover:bg-green-700 text-white p-2"
        >
          Next
        </button>
      )}
      {currentStep === 4 && (
        <button
          onClick={handleSubmit} // Call handleSubmit here
          className="bg-blue-600 hover:bg-blue-700 text-white p-2"
        >
          Submit
        </button>
      )}
    </div>
  );

  const renderTimeline = () => (
    <div className="flex flex-col w-1/4">
      {["Electricity", "Water", "Fuel", "Waste", "Submit"].map((step, index) => (
        <button
          key={index}
          onClick={() => setCurrentStep(index)}
          className={`p-4 mb-2 text-white rounded ${
            currentStep === index ? "bg-green-700" : "bg-green-500"
          }`}
        >
          {step}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex justify-center items-start p-6 space-x-6">
      {renderTimeline()}
      <div className="w-3/4">
        {renderForm()}
        {renderFormButtons()}
      </div>
    </div>
  );
}

export default BaselineCalculator;
