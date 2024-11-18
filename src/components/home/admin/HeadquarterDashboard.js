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
  const [totalConsumption, setTotalConsumption] = useState(0); // New state for total consumption
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

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

    const baselineListener = onValue(baselineRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestEntry = Object.values(data).pop();
        setBaselineData(latestEntry);

        // Calculate total consumption
        const total =
          parseFloat(latestEntry.electricity || 0) +
          parseFloat(latestEntry.fuel || 0) +
          parseFloat(latestEntry.water || 0) +
          parseFloat(latestEntry.waste || 0);
        setTotalConsumption(total);

        setLoading(false);
      } else {
        console.log("No baseline data found for user");
        setLoading(false);
      }
    });

    return () => off(baselineRef, baselineListener);
  }, [userEmail]);

  useEffect(() => {
    if (Object.keys(baselineData).length) {
      const results = compareData(baselineData);
      setComparisonResults(results);
    }
  }, [baselineData]);

  const compareData = (baseline) => {
    const results = [];
    const comparisons = [
      { key: "electricity", label: "Electricity Consumption" },
      { key: "fuel", label: "Fuel Consumption" },
      { key: "water", label: "Water Consumption" },
      { key: "waste", label: "Waste Generation" },
    ];

    comparisons.forEach(({ key, label }) => {
      const baselineValue = parseFloat(baseline[key]) || 0;

      let status = "OK";
      if (baselineValue === 0) {
        status = "Need to Improve";
      } else if (baselineValue < 5) {
        status = "Good";
      }

      results.push({ label, baseline: baselineValue, status });
    });

    return results;
  };

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
                Total Consumption
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
                {index === 0 && (
                  <td
                    rowSpan={comparisonResults.length}
                    className="border border-gray-300 px-4 py-2 text-center align-middle font-bold"
                  >
                    {totalConsumption.toFixed(2)} {/* Display total consumption */}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for the current user.</p>
      )}
    </div>
  );
};

export default Dashboard;
