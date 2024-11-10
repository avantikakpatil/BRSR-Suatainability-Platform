import React, { useState, useEffect } from "react";

const CumulativeExpenditure = ({ formData }) => {
  const calculateCumulative = () => {
    const cumulativeValues = {};
    Object.keys(formData).forEach((key) => {
      cumulativeValues[key] = formData[key].reduce(
        (acc, val) => acc + (parseFloat(val) || 0),
        0
      );
    });
    return cumulativeValues;
  };

  const [cumulativeData, setCumulativeData] = useState({});

  useEffect(() => {
    const result = calculateCumulative();
    setCumulativeData(result);
  }, [formData]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-6">
          Monthly Cumulative Resource Usage
        </h1>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-4">Parameter</th>
              <th className="p-4">Cumulative Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(cumulativeData).map((key, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{key}</td>
                <td className="p-4">{cumulativeData[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CumulativeExpenditure;
