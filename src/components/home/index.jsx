import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import FinalReport from "./admin/finalreport"; // Import the FinalReport component

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqK5bqK6sFiL3mqKNB3PHedZwQA",
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

const Home = () => {
  const { currentUser } = useAuth();
  const [baselineScores, setBaselineScores] = useState([]);
  const [userName, setUserName] = useState("");
  const [postOfficeData, setPostOfficeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!currentUser) return;

      try {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.name || "User");
        } else {
          setUserName("User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
      }
    };

    fetchUserName();
  }, [currentUser]);

  const userEmail = currentUser?.email?.replace(/\./g, "_");

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;

      try {
        setIsLoading(true);

        // Fetch Baseline Scores
        const dbRef = ref(db);
        const userPath = `PostalManager/${userEmail}/BaselineScores`;
        const baselineSnapshot = await get(child(dbRef, userPath));

        if (baselineSnapshot.exists()) {
          const data = baselineSnapshot.val();
          const formattedData = Object.values(data).map((value) => ({
            electricity: parseFloat(value.electricity) || 0,
            fuel: parseFloat(value.fuel) || 0,
            waste: parseFloat(value.waste) || 0,
            water: parseFloat(value.water) || 0,
            co2: parseFloat(value.co2) || 0,
          }));
          setBaselineScores(formattedData);
        }

        // Fetch Post Office Data
        const postOfficeRef = ref(db, `PostalManager/${userEmail}`);
        const postOfficeSnapshot = await get(postOfficeRef);

        if (postOfficeSnapshot.exists()) {
          setPostOfficeData(postOfficeSnapshot.val());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const createChartData = (label, value) => ({
    labels: [`${label} Usage`, "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        hoverBackgroundColor: ["#45A049", "#C0C0C0"],
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  });

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Energy Saved</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">12,340 kWh</p>
          <p className="text-sm text-gray-500">↓ 5% vs previous month</p>
        </div>
      </div>

      <div className="bg-green-500 text-white text-lg font-bold p-4 rounded-lg mt-8 text-center">
        YOUR BASELINES
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {baselineScores[0] && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Electricity Usage</h3>
              <Doughnut data={createChartData("Electricity", baselineScores[0].electricity)} />
            </div>
          </>
        )}
        {!baselineScores.length && <p>No data available for the current user.</p>}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {!isLoading && postOfficeData ? (
          <>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
              onClick={() => FinalReport({ postOffice: postOfficeData, previewOnly: true })}
            >
              View Report
            </button>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
              onClick={() => FinalReport({ postOffice: postOfficeData, previewOnly: false })}
            >
              Download Report
            </button>
          </>
        ) : (
          <p>Loading report data...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
