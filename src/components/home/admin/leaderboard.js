import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

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

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const leaderboardRef = ref(db, 'sustainabilityscore'); // Path where the scores are stored

    // Fetch leaderboard data from Firebase Realtime Database
    onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data).map(([email, details]) => ({
          email,
          totalSustainabilityScore: details.TotalSustainabilityScore || 0,
        }));

        // Sort leaderboard by TotalSustainabilityScore (descending order)
        const sortedEntries = entries.sort((a, b) => b.totalSustainabilityScore - a.totalSustainabilityScore);

        // Assign badges based on score
        const leaderboardWithBadges = sortedEntries.map((entry, index) => {
          let badge = "🥉"; // Default badge (Bronze)
          if (index === 0) badge = "🥇"; // Gold for top scorer
          else if (index === 1) badge = "🥈"; // Silver for second place

          return { ...entry, badge };
        });

        setLeaderboardData(leaderboardWithBadges);
      }
    });
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Email</th>
            <th>Total Sustainability Score</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.length > 0 ? (
            leaderboardData.map((entry, index) => (
              <tr key={index} className="table-row">
                <td>{index + 1}</td>
                <td>{entry.email}</td>
                <td>{entry.totalSustainabilityScore}</td>
                <td>
                  <span className={`badge badge-${entry.badge === "🥇" ? "gold" : entry.badge === "🥈" ? "silver" : "bronze"}`}>
                    {entry.badge}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Inline styles */}
      <style jsx>{`
        .leaderboard-container {
          max-width: 95%; /* Expands the table width */
          padding: 30px;
          margin: 20px auto;
          text-align: center;
          font-size: 16px; /* Larger font size */
          color: #333;
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-out;
        }

        .leaderboard-title {
          font-size: 32px; /* Larger title */
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
          position: relative;
          animation: slideDown 0.5s ease;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leaderboard-table th {
          font-weight: 600;
          padding: 16px; /* Increased padding */
          text-align: center;
          font-size: 18px;
          color: #ffffff;
          background-color: #7a9d96;
          border-bottom: 2px solid #dcdcdc;
        }

        .leaderboard-table td {
          padding: 14px; /* Increased padding */
          text-align: center;
          font-size: 17px;
          border-bottom: 1px solid #e0e0e0;
          background-color: #ffffff;
          transition: background-color 0.3s ease;
        }

        .leaderboard-table tr:nth-child(even) {
          background-color: #f3f6f5;
        }

        .leaderboard-table tr:hover {
          background-color: #e0f0ed;
          transform: scale(1.02);
          transition: all 0.2s ease;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Badges */
        .badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 16px;
          color: #fff;
          font-weight: bold;
        }

        .badge-gold {
          background-color: #FFD700;
          color: #333;
          box-shadow: 0px 2px 5px rgba(255, 215, 0, 0.6);
        }

        .badge-silver {
          background-color: #C0C0C0;
          color: #333;
          box-shadow: 0px 2px 5px rgba(192, 192, 192, 0.6);
        }

        .badge-bronze {
          background-color: #CD7F32;
          color: #333;
          box-shadow: 0px 2px 5px rgba(205, 127, 50, 0.6);
        }

        .table-row {
          animation: fadeInRow 0.5s ease;
        }

        @keyframes fadeInRow {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
