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
  const [sustainabilityScore, setSustainabilityScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // Firebase paths for each parameter
  const paths = {
    electricity: "electricityData/currentYearElectricity",
    fuel: "fuelData/fuelConsumption",
    waste: "wasteData/totalWaste",
    water: "waterData/totalConsumption",
  };

  // Authentication check to set userEmail
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

  // Fetch baseline data
  const fetchBaselineData = (userEmail) => {
    const baselineRef = ref(db, `PostalManager/${userEmail}/BaselineScores`);
    const baselineListener = onValue(baselineRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Baseline data:", snapshot.val()); // Debugging line
        const data = snapshot.val();
        setBaselineData(data);
      } else {
        console.log("No baseline data found");
        setBaselineData({});
      }
      setLoading(false); // Update loading state
    });
  };

  // Fetch additional data for each category (electricity, fuel, waste, water)
  const fetchAdditionalData = (userEmail) => {
    const additionalRefs = Object.fromEntries(
      Object.entries(paths).map(([key, path]) => [
        key,
        ref(db, `PostalManager/${userEmail}/inputData/${path}`),
      ])
    );

    // Fetch additional data for each category
    Object.entries(additionalRefs).forEach(([key, refPath]) =>
      onValue(refPath, (snapshot) => {
        if (snapshot.exists()) {
          setAdditionalData((prevData) => ({
            ...prevData,
            [key]: snapshot.val(), // Update additional data state
          }));
        } else {
          console.log(`No data found for ${key}`);
        }
      })
    );
  };

  // Fetch data from Firebase
  useEffect(() => {
    if (!userEmail) return;

    setLoading(true); // Set loading true while data is being fetched

    // Fetch baseline and additional data
    fetchBaselineData(userEmail);
    fetchAdditionalData(userEmail);
  }, [userEmail]);

  // Compare baseline and additional data, calculate scores
  useEffect(() => {
    if (Object.keys(baselineData).length && Object.keys(additionalData).length) {
      const results = compareData(baselineData);
      setComparisonResults(results);

      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      setSustainabilityScore(totalScore); // Set sustainability score
      saveTotalSustainabilityScore(totalScore);
    }
  }, [baselineData, additionalData]);

  // Score calculation logic
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

  // Compare data between baseline and additional data
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

  // Save the calculated sustainability score
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Comparison Dashboard</h1>

      <div className="bg-green-100 p-4 rounded-md shadow-md mb-6">
        <h2 className="text-xl font-semibold text-green-800">Sustainability Score</h2>
        {sustainabilityScore !== null ? (
          <p className="text-3xl font-bold text-green-900">
            {sustainabilityScore.toFixed(2)}
          </p>
        ) : (
          <p className="text-red-500">Sustainability score not available.</p>
        )}
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : comparisonResults.length ? (
        <div className="overflow-auto">
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
                  <td
                    className={`border px-4 py-2 font-bold ${result.status === "Good" ? "text-green-600" : "text-red-600"}`}
                  >
                    {result.status}
                  </td>
                  <td className="border px-4 py-2">{result.total}</td>
                  <td className="border px-4 py-2">{result.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No comparison data available</p>
      )}
    </div>
  );
};

export default Dashboard;
