import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const Dashboard = () => {
  const [baselineData, setBaselineData] = useState({});
  const [comparisonResults, setComparisonResults] = useState([]);
  const [additionalData, setAdditionalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const paths = {
    electricity: `PostalManager/${userEmail}/inputData/electricityData/currentYearElectricity`,
    fuel: `PostalManager/${userEmail}/inputData/fuelData/fuelConsumption`,
    waste: `PostalManager/${userEmail}/inputData/wasteData/totalWaste`,
    water: `PostalManager/${userEmail}/inputData/waterData/totalConsumption`,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const formattedEmail = user.email.replace(/[.#$/[\]]/g, "_");
        setUserEmail(formattedEmail);
      } else {
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const baselineRef = ref(db, `PostalManager/${userEmail}/BaselineScores`);
    const additionalRefs = Object.entries(paths).reduce((acc, [key, path]) => {
      acc[key] = ref(db, path);
      return acc;
    }, {});

    const baselineListener = onValue(baselineRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestEntry = Object.values(data).pop();
        setBaselineData(latestEntry);
      } else {
        console.log("No baseline data found for user");
      }
      setLoading(false);
    });

    const additionalListeners = Object.entries(additionalRefs).map(([key, refPath]) =>
      onValue(refPath, (snapshot) => {
        if (snapshot.exists()) {
          setAdditionalData((prevData) => ({
            ...prevData,
            [key]: snapshot.val(),
          }));
        } else {
          console.log(`No ${key} data found`);
        }
      })
    );

    return () => {
      off(baselineRef, baselineListener);
      additionalListeners.forEach((unsubscribe) => off(unsubscribe));
    };
  }, [userEmail]);

  useEffect(() => {
    if (Object.keys(baselineData).length) {
      const results = compareData(baselineData);
      setComparisonResults(results);
    }
  }, [baselineData, additionalData]);

  const calculateScore = (totalValue, baselineValue) => {
    if (totalValue <= 0 || baselineValue <= 0) {
      return 0; // Return 0 if baseline or total value is not valid
    }

    const difference = baselineValue - totalValue;
    const percentageDifference = (difference / baselineValue) * 100;

    if (percentageDifference >= 50) {
      return 25; // Max score if total value is 50% or more below baseline
    } else if (percentageDifference >= 20 && percentageDifference < 50) {
      // Score between 20-24 for total value 40%-20% below baseline
      return 20 + ((percentageDifference - 20) / 30) * 4; // Linearly interpolated between 20-24
    } else if (percentageDifference >= 0 && percentageDifference < 20) {
      // Score between 17-20 if total value is close (same as or slightly less than baseline)
      return 17 + (percentageDifference / 20) * 3; // Linearly interpolated between 17-20
    } else {
      // Score below 10 for total value greater than baseline
      const overagePercentage = ((totalValue - baselineValue) / baselineValue) * 100;
      return Math.max(10 - (overagePercentage / 10), 0); // Decreasing score below 10, but not below 0
    }
  };

  const compareData = (baseline) => {
    const results = [
      { key: "electricity", label: "Electricity Consumption" },
      { key: "fuel", label: "Fuel Consumption" },
      { key: "water", label: "Water Consumption" },
      { key: "waste", label: "Waste Generation" },
    ];

    return results.map(({ key, label }) => {
      const baselineValue = parseFloat(baseline[key]) || 0;
      const totalValue = parseFloat(additionalData[key]) || 0;

      const score = calculateScore(totalValue, baselineValue);

      let status = "OK";
      if (baselineValue === 0) {
        status = "Need to Improve";
      } else if (baselineValue < 5) {
        status = "Good";
      }

      return { label, baseline: baselineValue, status, total: totalValue, score };
    });
  };

  const totalSustainabilityScore = comparisonResults.reduce(
    (sum, result) => sum + result.score,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comparison Dashboard</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : Object.keys(baselineData).length ? (
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                Parameter
              </th>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                Baseline
              </th>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                Sustainability Status
              </th>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                Total Value
              </th>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                Sustainability Score
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonResults.map((result, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{result.label}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {result.baseline}
                </td>
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
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {result.total.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {result.score.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td colSpan="4" className="border border-gray-300 px-4 py-2 text-right">
                Total Sustainability Score:
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {totalSustainabilityScore.toFixed(2)} / 100
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No data available for the current user.</p>
      )}
    </div>
  );
};

export default Dashboard;
