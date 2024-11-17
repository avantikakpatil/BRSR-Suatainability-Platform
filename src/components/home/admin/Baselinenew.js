import React, { useState } from "react";

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

  const renderFormButtons = () => (
    <div className="flex justify-between mt-6">
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
      <button
        type="button"
        onClick={() => setCurrentForm(currentForm + 1)}
        disabled={currentForm === 4}
        className={`py-3 px-6 ${
          currentForm === 4
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white rounded-lg font-semibold`}
      >
        Next
      </button>
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
                to calculate your water usage baseline.
              </p>
            </div>
            {Object.keys(waterInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.replace(/([A-Z])/g, " $1")}:
                </label>
                <input
                  type="number"
                  placeholder="Liters per hour (L/h)"
                  value={waterInputs[key] || ""}
                  onChange={(e) =>
                    setWaterInputs({ ...waterInputs, [key]: e.target.value })
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
            {baselineWater && (
              <div>Baseline Water Consumption: {baselineWater} KL</div>
            )}
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
                <b>Get Your Baseline:</b> Fill the below information.
              </p>
            </div>
            {Object.keys(fuelInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.replace(/([A-Z])/g, " $1")}:
                </label>
                <input
                  type="number"
                  placeholder="Liters/day"
                  value={fuelInputs[key] || ""}
                  onChange={(e) =>
                    setFuelInputs({ ...fuelInputs, [key]: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              onClick={calculateFuelBaseline}
              className="bg-green-600 text-white p-2 mt-4"
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
              Provide Waste Generation Data
            </h1>
            <div className="bg-green-100 p-4 rounded mb-6">
              <p>
                <b>Get Your Baseline:</b> Please provide details about waste
                management.
              </p>
            </div>
            {Object.keys(wasteInputs).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 font-medium">
                  {key.replace(/([A-Z])/g, " $1")}:
                </label>
                <input
                  type="number"
                  placeholder="Metric Tons"
                  value={wasteInputs[key] || ""}
                  onChange={(e) =>
                    setWasteInputs({ ...wasteInputs, [key]: e.target.value })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              onClick={calculateWasteBaseline}
              className="bg-green-600 text-white p-2 mt-4"
            >
              Calculate Waste Baseline
            </button>
            {totalWaste && <div>Total Waste Generated: {totalWaste} Metric Tons</div>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {renderTimeline()}
      <div className="w-3/4 p-8">{renderForm()}{renderFormButtons()}</div>
    </div>
  );
}

export default BaselineCalculator;
