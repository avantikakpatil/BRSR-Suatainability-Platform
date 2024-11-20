import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
<<<<<<< HEAD
import FinalReport from './admin/finalreport'; // Corrected import and component name
=======
>>>>>>> a22aa41358303cb4f9f6b269b9a91fa92df0d142

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Firebase Configuration
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

const Home = () => {
  const { currentUser } = useAuth();
  const [baselineScores, setBaselineScores] = useState([]);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
<<<<<<< HEAD
  const [reportVisible, setReportVisible] = useState(false);
=======
>>>>>>> a22aa41358303cb4f9f6b269b9a91fa92df0d142

  useEffect(() => {
    // Fetch user's name from the database
    const fetchUserName = async () => {
      if (!currentUser) return;

      try {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
<<<<<<< HEAD
          setUserName(userData.name || 'User');
=======
          setUserName(userData.name || 'User'); // Use the name or default to 'User'
>>>>>>> a22aa41358303cb4f9f6b269b9a91fa92df0d142
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
<<<<<<< HEAD
        setUserName('User');
=======
        setUserName('User'); // Default if error occurs
>>>>>>> a22aa41358303cb4f9f6b269b9a91fa92df0d142
      }
    };

    fetchUserName();
  }, [currentUser]);

  const userEmail = currentUser?.email?.replace(/\./g, '_');

  useEffect(() => {
    const fetchBaselineScores = async () => {
      if (!userEmail) return;

      try {
        const dbRef = ref(db);
        const userPath = `PostalManager/${userEmail}/BaselineScores`;

        const snapshot = await get(child(dbRef, userPath));

        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedData = Object.values(data).map((value) => ({
            electricity: parseFloat(value.electricity) || 0,
            fuel: parseFloat(value.fuel) || 0,
            waste: parseFloat(value.waste) || 0,
            water: parseFloat(value.water) || 0,
            co2: parseFloat(value.co2) || 0,
          }));
          setBaselineScores(formattedData);
        } else {
          setBaselineScores([]);
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
      }
    };

    fetchBaselineScores();
  }, [userEmail]);

  const createChartData = (label, value) => ({
    labels: [`${label} Usage`, 'Remaining'],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        hoverBackgroundColor: ['#45A049', '#C0C0C0'],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  });

  const handleViewReport = () => {
    setReportVisible(true);
  };

  const handleDownloadReport = () => {
    // For now, a placeholder. You can integrate report download functionality here.
    alert('Downloading report...');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {userName}!
      </h1>

      {/* Existing dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Energy Saved</h3>
          <p className="text-4xl font-bold text-green-500 mt-2">12,340 kWh</p>
          <p className="text-sm text-gray-500">↓ 5% vs previous month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Waste Reduced</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">4.5 tons</p>
          <p className="text-sm text-gray-500">↓ 2% vs previous month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Water Usage Reduction</h3>
          <p className="text-4xl font-bold text-blue-500 mt-2">3,200 liters</p>
          <p className="text-sm text-gray-500">↓ 4% vs previous month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">CO2 Emissions Reduced</h3>
          <p className="text-4xl font-bold text-red-500 mt-2">1.2 tons</p>
          <p className="text-sm text-gray-500">↓ 6% vs previous month</p>
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
              <Doughnut data={createChartData('Electricity', baselineScores[0].electricity)} options={{ rotation: -90, circumference: 180 }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Fuel Usage</h3>
              <Doughnut data={createChartData('Fuel', baselineScores[0].fuel)} options={{ rotation: -90, circumference: 180 }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Waste Usage</h3>
              <Doughnut data={createChartData('Waste', baselineScores[0].waste)} options={{ rotation: -90, circumference: 180 }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Water Usage</h3>
              <Doughnut data={createChartData('Water', baselineScores[0].water)} options={{ rotation: -90, circumference: 180 }} />
            </div>
          </>
        )}
        {!baselineScores.length && <p>No data available for the current user.</p>}
      </div>
<<<<<<< HEAD

      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={handleViewReport}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            View Report
          </button>
          <button
            onClick={handleDownloadReport}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Download Report
          </button>
        </div>
      </div>

      {reportVisible && (
        <div className="mt-8">
          <FinalReport postOffice={{}} previewOnly={true} />
        </div>
      )}
=======
>>>>>>> a22aa41358303cb4f9f6b269b9a91fa92df0d142
    </div>
  );
};

export default Home;