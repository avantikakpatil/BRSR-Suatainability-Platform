import React, { useState } from "react";

import { db, ref, set, auth} from '../../../firebaseConfig'; // Adjust the import path as necessary

function BaselineCalculator() {
  const [currentForm, setCurrentForm] = useState(1);

  // Form 1: Electricity
  const [electricityInputs, setElectricityInputs] = useState({
    lighting: { number: "", wattage: "" },
    hvac: { number: "", wattage: "" },
    electronics: { number: "", wattage: "" },
    electricDoors: { hours: "", wattage: "" },
  });
  const [baselineElectricity, setBaselineElectricity] = useState(null);

  // Form 2: Water
  const [waterInputs, setWaterInputs] = useState({
    restrooms: "",
    cleaning: "",
    breakRooms: "",
    irrigation: "",
    surfaceWater: "",
    groundwater: "",
    thirdPartyWater: "",
  });
  const [baselineWater, setBaselineWater] = useState(null);

  // Form 3: Fuel
  const [fuelInputs, setFuelInputs] = useState({
    vehicleFuel: "",
    alternativeFuels: "",
    transportEquipment: "",
    backupGenerators: "",
  });
  const [baselineFuel, setBaselineFuel] = useState(null);

  // Form 4: Waste
  const [wasteInputs, setWasteInputs] = useState({
    plasticWaste: "",
    eWaste: "",
    bioMedicalWaste: "",
    constructionWaste: "",
    batteryWaste: "",
    radioactiveWaste: "",
    hazardousWaste: "",
    nonHazardousWaste: "",
  });
  const [totalWaste, setTotalWaste] = useState(null);

  const HOURS_PER_DAY = 8;
  const DAYS_PER_MONTH = 30;

  // Calculation functions
  const calculateElectricityBaseline = () => {
    const { lighting, hvac, electronics, electricDoors } = electricityInputs;
    const lightingConsumption =
      (Number(lighting.number) || 0) *
      (Number(lighting.wattage) / 1000) *
      HOURS_PER_DAY *
      DAYS_PER_MONTH;
    const hvacConsumption =
      (Number(hvac.number) || 0) *
      (Number(hvac.wattage) / 1000) *
      HOURS_PER_DAY *
      DAYS_PER_MONTH;
    const electronicsConsumption =
      (Number(electronics.number) || 0) *
      (Number(electronics.wattage) / 1000) *
      HOURS_PER_DAY *
      DAYS_PER_MONTH;
    const electricDoorsConsumption =
      (Number(electricDoors.hours) || 0) *
      (Number(electricDoors.wattage) / 1000) *
      DAYS_PER_MONTH;

    const totalConsumption =
      lightingConsumption +
      hvacConsumption +
      electronicsConsumption +
      electricDoorsConsumption;

    setBaselineElectricity(totalConsumption.toFixed(2));
  };

  const calculateWaterBaseline = () => {
    const totalHourlyUsage = Object.values(waterInputs)
      .map((val) => Number(val) || 0)
      .reduce((acc, val) => acc + val, 0);

    const totalMonthlyConsumptionLiters =
      totalHourlyUsage * HOURS_PER_DAY * DAYS_PER_MONTH;
    const totalMonthlyConsumptionKL = totalMonthlyConsumptionLiters / 1000;

    setBaselineWater(totalMonthlyConsumptionKL.toFixed(2));
  };

  const calculateFuelBaseline = () => {
    const totalDailyUsage = Object.values(fuelInputs)
      .map((val) => Number(val) || 0)
      .reduce((acc, val) => acc + val, 0);

    const totalMonthlyConsumptionLiters = totalDailyUsage * DAYS_PER_MONTH;

    setBaselineFuel(totalMonthlyConsumptionLiters.toFixed(2));
  };

  const calculateWasteBaseline = () => {
    const total = Object.values(wasteInputs)
      .map((value) => Number(value) || 0)
      .reduce((acc, val) => acc + val, 0);

    setTotalWaste(total.toFixed(2));
  };

  // Timeline component
  const renderTimeline = () => {
    const steps = [
      "Energy Consumption",
      "Water Usage",
      "Fuel Usage",
      "Waste Management",
    ];
    return (
      <div className="w-1/4 h-full bg-gray-100 p-4">
        <h2 className="text-lg font-bold text-green-600 mb-4">
          Progress Timeline
        </h2>
        {steps.map((step, index) => (
          <div key={index} className="mb-4 flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentForm === index + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`ml-3 font-medium ${
                currentForm === index + 1 ? "text-green-600" : "text-gray-600"
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    );
  };

 // Function to sanitize email for Firebase
const sanitizeEmail = (email) => {
  return email.replace(/\./g, '_');
};

  
  const saveDataToFirebase = () => {
    const user = auth.currentUser;
    if (user) {
      const sanitizedEmail = sanitizeEmail(user.email); // Use the updated sanitizeEmail function
      const data = {
        electricity: baselineElectricity,
        water: baselineWater,
        fuel: baselineFuel,
        waste: totalWaste,
        timestamp: Date.now(),
      };
  
      const dataRef = ref(db, `PostalManager/${sanitizedEmail}/BaselineScores/${data.timestamp}`);
      
      set(dataRef, data)
        .then(() => {
          console.log("Data saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving data: ", error);
        });
    } else {
      console.log("No user is authenticated");
    }
  };
  

  const renderFormButtons = () => (
    <div className="flex justify-between mt-6">
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentForm === 1}
        onClick={() => setCurrentForm(currentForm - 1)}
        className={`py-3 px-6 ${
          currentForm === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white rounded-lg font-semibold`}
      >
        Previous
      </button>
  
      {/* Conditionally render Next or Submit button */}
      {currentForm === 4 ? (
        <button
          type="button"
          onClick={saveDataToFirebase}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Submit
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setCurrentForm(currentForm + 1)}
          className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
        >
          Next
        </button>
      )}
    </div>
  );
  
  // Form rendering logic
  const renderForm = () => {
    switch (currentForm) {
      case 1:
        return (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-6">
              Provide Electricity Resources of Your Office
            </h1>
            <div className="bg-green-100 p-4 rounded mb-6">
              <p>
                <b>Get Your Baseline:</b> Please fill in the information below
                to calculate your electricity baseline usage.
              </p>
            </div>
            {Object.keys(electricityInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.toUpperCase()} - Number & Wattage:
                </label>
                <input
                  type="number"
                  placeholder={`Number`}
                  value={electricityInputs[key].number || ""}
                  onChange={(e) =>
                    setElectricityInputs({
                      ...electricityInputs,
                      [key]: {
                        ...electricityInputs[key],
                        number: e.target.value,
                      },
                    })
                  }
                  className="p-2 border rounded w-full mb-2"
                />
                <input
                  type="number"
                  placeholder={`Wattage (W)`}
                  value={electricityInputs[key].wattage || ""}
                  onChange={(e) =>
                    setElectricityInputs({
                      ...electricityInputs,
                      [key]: {
                        ...electricityInputs[key],
                        wattage: e.target.value,
                      },
                    })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              onClick={calculateElectricityBaseline}
              className="bg-green-600 hover:bg-green-700 text-white p-2 mt-4"
            >
              Calculate Electricity Baseline
            </button>
            {baselineElectricity && (
              <div>Baseline Electricity: {baselineElectricity} kWh</div>
            )}
          </>
        );
      case 2:
        return (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-6">
              Provide Water Usage Data
            </h1>
            <div className="bg-green-100 p-4 rounded mb-6">
              <p>
                <b>Get Your Baseline:</b> Please fill in the information below
                to calculate your water baseline usage.
              </p>
            </div>
            {Object.keys(waterInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.toUpperCase()} Usage (Liters per Hour):
                </label>
                <input
                  type="number"
                  placeholder={`Usage for ${key}`}
                  value={waterInputs[key] || ""}
                  onChange={(e) =>
                    setWaterInputs({
                      ...waterInputs,
                      [key]: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              onClick={calculateWaterBaseline}
              className="bg-green-600 hover:bg-green-700 text-white p-2 mt-4"
            >
              Calculate Water Baseline
            </button>
            {baselineWater && <div>Baseline Water: {baselineWater} KL</div>}
          </>
        );
      case 3:
        return (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-6">
              Provide Fuel Usage Data
            </h1>
            <div className="bg-green-100 p-4 rounded mb-6">
              <p>
                <b>Get Your Baseline:</b> Please fill in the information below
                to calculate your fuel baseline usage.
              </p>
            </div>
            {Object.keys(fuelInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.toUpperCase()} (Liters per day):
                </label>
                <input
                  type="number"
                  value={fuelInputs[key] || ""}
                  onChange={(e) =>
                    setFuelInputs({
                      ...fuelInputs,
                      [key]: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              onClick={calculateFuelBaseline}
              className="bg-green-600 hover:bg-green-700 text-white p-2 mt-4"
            >
              Calculate Fuel Baseline
            </button>
            {baselineFuel && <div>Baseline Fuel: {baselineFuel} Liters</div>}
          </>
        );
      case 4:
        return (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-6">
              Provide Waste Data
            </h1>
            <div className="bg-green-100 p-4 rounded mb-6">
              <p>
                <b>Get Your Baseline:</b> Please fill in the information below
                to calculate your waste baseline.
              </p>
            </div>
            {Object.keys(wasteInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.toUpperCase()} (Kg per month):
                </label>
                <input
                  type="number"
                  value={wasteInputs[key] || ""}
                  onChange={(e) =>
                    setWasteInputs({
                      ...wasteInputs,
                      [key]: e.target.value,
                    })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              onClick={calculateWasteBaseline}
              className="bg-green-600 hover:bg-green-700 text-white p-2 mt-4"
            >
              Calculate Waste Baseline
            </button>
            {totalWaste && <div>Total Waste: {totalWaste} Metric Tons</div>}
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex justify-center items-start p-6 space-x-6">
      {renderTimeline()}
      <div className="w-3/4">
        {renderForm()} {/* Render the current form */}
        {renderFormButtons()} {/* Render the form buttons */}
      </div>
    </div>
  );
  
}

export default BaselineCalculator;