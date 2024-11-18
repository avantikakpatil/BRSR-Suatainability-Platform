import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, query } from "firebase/database";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

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
    // Fetch data from Firebase
    const fetchData = async () => {
      try {
        const baselineRef = query(ref(db, "PostalManager/avantikapatil420@gmail_com/BaselineScores"));
        const inputDataRef = query(ref(db, "PostalManager/avantikapatil420@gmail_com/inputData"));

        const [baselineSnapshot, inputDataSnapshot] = await Promise.all([
          get(baselineRef),
          get(inputDataRef)
        ]);

        if (baselineSnapshot.exists() && inputDataSnapshot.exists()) {
          const baseline = baselineSnapshot.val();
          const inputData = inputDataSnapshot.val();

          setBaselineData(baseline);
          setInputData(inputData);

          // Perform comparison
          const results = compareData(baseline, inputData);
          setComparisonResults(results);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const compareData = (baseline, inputData) => {
    const results = [];
    const comparisons = [
      { key: "electricity", inputNode: "electricityData", inputKey: "currentYearElectricity" },
      { key: "fuel", inputNode: "fuelData", inputKey: "currentYearFuel" },
      { key: "water", inputNode: "waterData", inputKey: "totalConsumption" },
      { key: "waste", inputNode: "wasteData", inputKey: "totalWaste" }
    ];

    comparisons.forEach(({ key, inputNode, inputKey }) => {
      const baselineValue = parseFloat(baseline[key]) || 0;
      const inputNodeValues = Object.values(inputData[inputNode] || {});
      const inputTotal = inputNodeValues.reduce((sum, item) => sum + parseFloat(item[inputKey] || 0), 0);

      let status = "You need to improve";
      if (inputTotal < baselineValue) {
        status = "Good";
      } else if (inputTotal === baselineValue) {
        status = "OK";
      }

      results.push({ key, baseline: baselineValue, input: inputTotal, status });
    });

    return results;
  };

  const chartData = {
    labels: comparisonResults.map((item) => item.key),
    datasets: [
      {
        label: "Baseline Values",
        data: comparisonResults.map((item) => item.baseline),
        backgroundColor: "rgba(75, 192, 192, 0.5)"
      },
      {
        label: "Input Data Values",
        data: comparisonResults.map((item) => item.input),
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  };

  return (
    <div>
      <h1>Comparison Dashboard</h1>
      <Bar data={chartData} />
      <ul>
        {comparisonResults.map((result, index) => (
          <li key={index}>
            {result.key.toUpperCase()}: {result.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
