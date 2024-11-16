import React from 'react';

const FuelConsumptionForm = ({ goBack }) => {
  return (
    <div className="fuel-consumption-form p-8 bg-gray-50 shadow-md rounded-md">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
      >
        Go Back
      </button>

      <h2 className="text-2xl font-bold mb-6">Fuel Consumption Form</h2>

      {/* Table Section */}
      <table className="table-auto border-collapse w-full text-left text-sm mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Parameter</th>
            <th className="border border-gray-300 px-4 py-2">FY ____ (Current Financial Year)</th>
            <th className="border border-gray-300 px-4 py-2">FY ____ (Previous Financial Year)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Total electricity consumption (A)</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Total fuel consumption (B)</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Energy consumption through other sources (C)</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold">Total energy consumption (A+B+C)</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              Energy intensity per rupee of turnover (Total energy consumption / turnover in rupees)
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter value"
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Upload Bill Section */}
      <div className="mb-6">
        <label className="block font-bold mb-2">Upload Bill</label>
        <input
          type="file"
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Note Section */}
      <p className="mt-6 text-sm text-gray-600">
        <strong>Note:</strong> Indicate if any independent assessment/evaluation/assurance has been carried out by an
        external agency? (Y/N) If yes, name of the external agency.
      </p>
    </div>
  );
};

export default FuelConsumptionForm;
