import React, { useState } from "react";
import { db } from "../../../firebaseConfig";
import { ref, set } from "firebase/database";

const ResourceUsageForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resourceData, setResourceData] = useState({
    energyConsumption: {
      lighting: '',
      hvac: '',
      electronics: '',
      battery: '',
      electricDoors: '',
    },
    waterUsage: {
      restrooms: '',
      cleaning: '',
      breakRooms: '',
      landscaping: '',
    },
    fuelAndTransportation: {
      vehicleFuel: '',
      alternativeFuels: '',
      transportEquipment: '',
      backupGenerators: '',
    },
    consumables: {
      paper: '',
      inkToner: '',
      mailingSupplies: '',
      cleaningSupplies: '',
      packagingMaterials: '',
    },
    officeSupplies: {
      stationery: '',
      organizationalSupplies: '',
      techAccessories: '',
    },
    buildingMaintenance: {
      paintRepairMaterials: '',
      cleaningSanitization: '',
      securitySystems: '',
      wasteManagement: '',
    },
    itCommunicationInfrastructure: {
      networkDevices: '',
      softwareLicenses: '',
      telecommunication: '',
    },
    humanResources: {
      staffUniforms: '',
      trainingMaterials: '',
    },
    sustainabilityEfforts: {
      solarPanels: '',
      recyclingStations: '',
      waterConservation: '',
    }
  });

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
      saveDataToFirebase();
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDataToFirebase = () => {
    const sectionKey = sections[currentStep];
    set(ref(db, `PostalManager/ResourceUsage/${sectionKey}`), resourceData[sectionKey] || {});
  };

  const handleInputChange = (sectionKey, fieldName, value) => {
    setResourceData((prevData) => ({
      ...prevData,
      [sectionKey]: {
        ...prevData[sectionKey],
        [fieldName]: value,
      },
    }));
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Save all data to Firebase when the form is submitted
    Object.keys(resourceData).forEach((sectionKey) => {
      set(ref(db, `PostalManager/ResourceUsage/${sectionKey}`), resourceData[sectionKey] || {});
    });
    alert("Data submitted successfully!");
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
                <input
                  type="text"
                  placeholder="Lighting (number of bulbs)"
                  value={resourceData.energyConsumption.lighting}
                  onChange={e => handleInputChange('energyConsumption', 'lighting', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="HVAC Systems (number of units)"
                  value={resourceData.energyConsumption.hvac}
                  onChange={e => handleInputChange('energyConsumption', 'hvac', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Computers and Electronics (number of devices)"
                  value={resourceData.energyConsumption.electronics}
                  onChange={e => handleInputChange('energyConsumption', 'electronics', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Battery Usage (backup power)"
                  value={resourceData.energyConsumption.battery}
                  onChange={e => handleInputChange('energyConsumption', 'battery', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Electric Doors (automated entry)"
                  value={resourceData.energyConsumption.electricDoors}
                  onChange={e => handleInputChange('energyConsumption', 'electricDoors', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {currentStep === 1 && (
              <>
                <input
                  type="text"
                  placeholder="Restrooms (water consumption)"
                  value={resourceData.waterUsage.restrooms}
                  onChange={e => handleInputChange('waterUsage', 'restrooms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Cleaning (water for cleaning)"
                  value={resourceData.waterUsage.cleaning}
                  onChange={e => handleInputChange('waterUsage', 'cleaning', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Staff Break Rooms (kitchen usage)"
                  value={resourceData.waterUsage.breakRooms}
                  onChange={e => handleInputChange('waterUsage', 'breakRooms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Landscape Maintenance (irrigation)"
                  value={resourceData.waterUsage.landscaping}
                  onChange={e => handleInputChange('waterUsage', 'landscaping', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {/* Additional steps follow the same pattern as above for Fuel and Transportation, Consumables, etc. */}

            {currentStep === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Vehicle Fuel"
                  value={resourceData.fuelAndTransportation.vehicleFuel}
                  onChange={e => handleInputChange('fuelAndTransportation', 'vehicleFuel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Alternative Fuels"
                  value={resourceData.fuelAndTransportation.alternativeFuels}
                  onChange={e => handleInputChange('fuelAndTransportation', 'alternativeFuels', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Transport Equipment"
                  value={resourceData.fuelAndTransportation.transportEquipment}
                  onChange={e => handleInputChange('fuelAndTransportation', 'transportEquipment', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Backup Generators"
                  value={resourceData.fuelAndTransportation.backupGenerators}
                  onChange={e => handleInputChange('fuelAndTransportation', 'backupGenerators', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

{currentStep === 3 && (
              <>
                <input
                  type="text"
                  placeholder="Paper Consumption"
                  value={resourceData.consumables.paper}
                  onChange={e => handleInputChange('consumables', 'paper', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Ink Toner"
                  value={resourceData.consumables.inkToner}
                  onChange={e => handleInputChange('consumables', 'inkToner', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Mailing Supplies"
                  value={resourceData.consumables.mailingSupplies}
                  onChange={e => handleInputChange('consumables', 'mailingSupplies', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Cleaning Supplies"
                  value={resourceData.consumables.cleaningSupplies}
                  onChange={e => handleInputChange('consumables', 'cleaningSupplies', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Packaging Materials"
                  value={resourceData.consumables.packagingMaterials}
                  onChange={e => handleInputChange('consumables', 'packagingMaterials', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

{currentStep === 4 && (
              <>
                <input
                  type="text"
                  placeholder="Stationery"
                  value={resourceData.officeSupplies.stationery}
                  onChange={e => handleInputChange('officeSupplies', 'stationery', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Organizational Supplies"
                  value={resourceData.officeSupplies.organizationalSupplies}
                  onChange={e => handleInputChange('officeSupplies', 'organizationalSupplies', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Tech Accessories"
                  value={resourceData.officeSupplies.techAccessories}
                  onChange={e => handleInputChange('officeSupplies', 'techAccessories', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {currentStep === 5 && (
              <>
                <input
                  type="text"
                  placeholder="Paint and Repair Materials"
                  value={resourceData.buildingMaintenance.paintRepairMaterials}
                  onChange={e => handleInputChange('buildingMaintenance', 'paintRepairMaterials', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Cleaning and Sanitization"
                  value={resourceData.buildingMaintenance.cleaningSanitization}
                  onChange={e => handleInputChange('buildingMaintenance', 'cleaningSanitization', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Security Systems"
                  value={resourceData.buildingMaintenance.securitySystems}
                  onChange={e => handleInputChange('buildingMaintenance', 'securitySystems', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Waste Management"
                  value={resourceData.buildingMaintenance.wasteManagement}
                  onChange={e => handleInputChange('buildingMaintenance', 'wasteManagement', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {currentStep === 6 && (
              <>
                <input
                  type="text"
                  placeholder="Network Devices"
                  value={resourceData.itCommunicationInfrastructure.networkDevices}
                  onChange={e => handleInputChange('itCommunicationInfrastructure', 'networkDevices', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Software Licenses"
                  value={resourceData.itCommunicationInfrastructure.softwareLicenses}
                  onChange={e => handleInputChange('itCommunicationInfrastructure', 'softwareLicenses', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Telecommunication"
                  value={resourceData.itCommunicationInfrastructure.telecommunication}
                  onChange={e => handleInputChange('itCommunicationInfrastructure', 'telecommunication', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {currentStep === 7 && (
              <>
                <input
                  type="text"
                  placeholder="Staff Uniforms"
                  value={resourceData.humanResources.staffUniforms}
                  onChange={e => handleInputChange('humanResources', 'staffUniforms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Training Materials"
                  value={resourceData.humanResources.trainingMaterials}
                  onChange={e => handleInputChange('humanResources', 'trainingMaterials', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}

            {currentStep === 8 && (
              <>
                <input
                  type="text"
                  placeholder="Solar Panels"
                  value={resourceData.sustainabilityEfforts.solarPanels}
                  onChange={e => handleInputChange('sustainabilityEfforts', 'solarPanels', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Recycling Stations"
                  value={resourceData.sustainabilityEfforts.recyclingStations}
                  onChange={e => handleInputChange('sustainabilityEfforts', 'recyclingStations', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Water Conservation"
                  value={resourceData.sustainabilityEfforts.waterConservation}
                  onChange={e => handleInputChange('sustainabilityEfforts', 'waterConservation', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </>
            )}




            {/* Repeat similar pattern for other steps... */}

            </div>
            {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-300 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {currentStep === sections.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={currentStep === sections.length - 1}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsageForm;