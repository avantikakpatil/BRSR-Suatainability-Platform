import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database"; 
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
    electricity: "electricityData/currentYearElectricity",
    fuel: "fuelData/fuelConsumption",
    waste: "wasteData/totalWaste",
    water: "waterData/totalConsumption",
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

    return () => unsubscribe(); // Unsubscribing from auth state listener
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const baselineRef = ref(db, `PostalManager/${userEmail}/BaselineScores`);
    const additionalRefs = Object.fromEntries(
      Object.entries(paths).map(([key, path]) => [
        key,
        ref(db, `PostalManager/${userEmail}/inputData/${path}`),
      ])
    );

    const baselineListener = onValue(baselineRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestEntry = Object.values(data).pop();
        setBaselineData(latestEntry || {});
      } else {
        console.log("No baseline data found");
      }
      setLoading(false);
    });

    const listeners = Object.entries(additionalRefs).map(([key, refPath]) =>
      onValue(refPath, (snapshot) => {
        if (snapshot.exists()) {
          setAdditionalData((prevData) => ({
            ...prevData,
            [key]: snapshot.val(),
          }));
        } else {
          console.log(`No data found for ${key}`);
        }
      })
    );

    return () => {
      // Cleanup listeners: This ensures no memory leaks or duplicate events
      baselineListener(); // Cleanup baseline listener manually by invoking the function.
      listeners.forEach((listener) => listener()); // Cleanup all additional listeners
    };
  }, [userEmail]);

  useEffect(() => {
    if (Object.keys(baselineData).length) {
      const results = compareData(baselineData);
      setComparisonResults(results);

      // Save the Total Sustainability Score to Firebase
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      saveTotalSustainabilityScore(totalScore);
    }
  }, [baselineData, additionalData]);

  const calculateScore = (totalValue, baselineValue) => {
    if (totalValue <= 0 || baselineValue <= 0) return 0;

    const difference = baselineValue - totalValue;
    const percentageDifference = (difference / baselineValue) * 100;

    if (percentageDifference >= 50) return 25;
    if (percentageDifference >= 20) return 20 + ((percentageDifference - 20) / 30) * 4;
    if (percentageDifference >= 0) return 17 + (percentageDifference / 20) * 3;

    const overagePercentage = ((totalValue - baselineValue) / baselineValue) * 100;
    return Math.max(10 - overagePercentage / 10, 0);
  };

  const compareData = (baseline) => {
    const parameters = [
      { key: "electricity", label: "Electricity Consumption" },
      { key: "fuel", label: "Fuel Consumption" },
      { key: "water", label: "Water Consumption" },
      { key: "waste", label: "Waste Generation" },
    ];

    return parameters.map(({ key, label }) => {
      const baselineValue = parseFloat(baseline[key]) || 0;
      const totalValue = parseFloat(additionalData[key]) || 0;
      const score = calculateScore(totalValue, baselineValue);

      const status = baselineValue === 0
        ? "Need to Improve"
        : totalValue <= baselineValue
        ? "Good"
        : "OK";

      return { label, baseline: baselineValue, total: totalValue, score, status };
    });
  };

  const saveTotalSustainabilityScore = (totalScore) => {
    if (!userEmail) return;

    const scoreRef = ref(db, `sustainabilityscore/${userEmail}`);
    set(scoreRef, {
      email: userEmail,
      TotalSustainabilityScore: totalScore,
    })
      .then(() => console.log("Sustainability score saved successfully"))
      .catch((error) => console.error("Error saving sustainability score: ", error));
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
      ) : comparisonResults.length ? (
        <table className="min-w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-gray-200">Parameter</th>
              <th className="border px-4 py-2 bg-gray-200">Baseline</th>
              <th className="border px-4 py-2 bg-gray-200">Status</th>
              <th className="border px-4 py-2 bg-gray-200">Total</th>
              <th className="border px-4 py-2 bg-gray-200">Score</th>
            </tr>
          </thead>
          <tbody>
            {comparisonResults.map((result, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border px-4 py-2">{result.label}</td>
                <td className="border px-4 py-2">{result.baseline}</td>
                <td className={`border px-4 py-2 font-bold ${
                    result.status === "Good" ? "text-green-600" : "text-red-600"
                  }`}>
                  {result.status}
                </td>
                <td className="border px-4 py-2">{result.total.toFixed(2)}</td>
                <td className="border px-4 py-2">{result.score.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td colSpan="4" className="border px-4 py-2 text-right">
                Total Sustainability Score:
              </td>
              <td className="border px-4 py-2">{totalSustainabilityScore.toFixed(2)}</td>
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
