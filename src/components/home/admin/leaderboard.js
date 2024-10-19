import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig"; // Import Firebase database instance
import { ref, onValue } from "firebase/database"; // Import Realtime Database functions
import "../../../style.css"; // Import your custom styles

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Function to calculate score
  const calculateScore = (data) => {
    const { energyConsumption, fuelUsage, wasteGeneration, communityEngagement } = data;
    return Number(energyConsumption) + Number(fuelUsage) + Number(wasteGeneration) + Number(communityEngagement);
  };

  // Function to assign badges based on score
  const assignBadge = (score) => {
    if (score > 80) {
      return "../../../images/gold.png"; // Path to Gold badge image
    } else if (score >= 50 && score <= 80) {
      return "../../../images/silver.png"; // Path to Silver badge image
    } else {
      return "../../../images/bronze.png"; // Path to Bronze badge image
    }
  };

  // Fetch data from Firebase and populate leaderboard
  useEffect(() => {
    const postOfficeRef = ref(db, "postOfficeData");

    onValue(postOfficeRef, (snapshot) => {
      const data = snapshot.val();
      const leaderboardArray = [];

      if (data) {
        for (const email in data) {
          const formData = data[email];
          const score = calculateScore(formData);
          const badge = assignBadge(score);

          // Include city data if available in the fetched data
          const city = formData.city ? formData.city : ""; // Replace with your city property name in the data

          leaderboardArray.push({
            email: email.replace(/_/g, "."),
            score: score,
            badge: badge,
            city: city,
          });
        }

        // Sort the leaderboard data in descending order based on score
        leaderboardArray.sort((a, b) => b.score - a.score);
      }

      setLeaderboardData(leaderboardArray);
    });
  }, []);

  return (
    <div className="leaderboard-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="../../../images/trophy.png" alt="trophy" className="leaderboard-decoration" />
        <h1
          style={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "40px",
            fontFamily: "'Poppins', sans-serif",
            background: "linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(0,204,255,1) 100%)",
            WebkitBackgroundClip: "text",
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Leaderboard
        </h1>
        <img src="../../../images/trophy.png" alt="trophy" className="leaderboard-decoration" /> {/* Replace with your downloaded image filename */}
      </div>

      {/* Leaderboard table */}
      <table className="leaderboard-table">
        <thead>
          <tr style={{ fontWeight: "bold", textAlign: "center", background: "linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(0,204,255,1) 100%)", WebkitBackgroundClip: "text", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
            <th>Rank</th>
            <th>Post Office Email</th>
            <th>City</th>
            <th>Score</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.length > 0 ? (
            leaderboardData.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.email}</td>
                {/* Display city data if available */}
                <td>{entry.city}</td>
                <td>{entry.score}</td>
                <td>
                  <img
                    src={entry.badge}
                    alt={`${entry.badge.split("/").pop().split(".")[0]} badge`}
                    className="badge-image"
                  />
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
    </div>
  );
};

export default Leaderboard;