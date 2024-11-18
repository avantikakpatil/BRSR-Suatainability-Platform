import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const Dashboard = () => {
  const [baselineData, setBaselineData] = useState({});
  const [inputData, setInputData] = useState({});
  const [comparisonResults, setComparisonResults] = useState([]);

  useEffect(() => {
    // Replace with logged-in user's email or unique identifier
    const userEmail = "avantikapatil420@gmail_com";

    // Firebase database references
    const baselineRef = ref(db, `PostalManager/${userEmail}/BaselineScores`);
    const inputDataRef = ref(db, `PostalManager/${userEmail}/inputData`);

    // Function to fetch and listen to data
    const fetchData = () => {
      // Listen to baseline data
      const baselineListener = onValue(baselineRef, (snapshot) => {
        if (snapshot.exists()) {
          setBaselineData(snapshot.val());
        }
      });

      // Listen to input data
      const inputListener = onValue(inputDataRef, (snapshot) => {
        if (snapshot.exists()) {
          setInputData(snapshot.val());
        }
      });

      // Cleanup function to remove listeners
      return () => {
        off(baselineRef, baselineListener);
        off(inputDataRef, inputListener);
      };
    };

    // Call fetchData and clean up listeners on unmount
    const cleanup = fetchData();
    return cleanup;
  }, []);

  useEffect(() => {
    // Perform comparison only when both baseline and input data are loaded
    if (Object.keys(baselineData).length && Object.keys(inputData).length) {
      const results = compareData(baselineData, inputData);
      setComparisonResults(results);
    }
  }, [baselineData, inputData]);

  // Comparison logic
  const compareData = (baseline, inputData) => {
    const results = [];
    const comparisons = [
      { key: "electricity", label: "Electricity Consumption" },
      { key: "fuel", label: "Fuel Consumption" },
      { key: "water", label: "Water Consumption" },
      { key: "waste", label: "Waste Generation" }
    ];

    comparisons.forEach(({ key, label }) => {
      const baselineValue = parseFloat(baseline[key]) || 0;
      const inputValue = parseFloat(inputData[key]) || 0;

      let status = "Need to Improve";
      if (inputValue < baselineValue) {
        status = "Good";
      } else if (inputValue === baselineValue) {
        status = "OK";
      }

      results.push({ label, baseline: baselineValue, input: inputValue, status });
    });

    return results;
  };

  return (
    <div>
      <h1>Comparison Dashboard</h1>
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">Parameter</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">Baseline</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">Input Values</th>
            <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">Sustainability Status</th>
          </tr>
        </thead>
        <tbody>
          {comparisonResults.map((result, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{result.label}</td>
              <td className="border border-gray-300 px-4 py-2">{result.baseline}</td>
              <td className="border border-gray-300 px-4 py-2">{result.input}</td>
              <td
                className={`border border-gray-300 px-4 py-2 font-bold ${
                  result.status === "Good"
                    ? "text-green-600"
                    : result.status === "OK"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {result.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
