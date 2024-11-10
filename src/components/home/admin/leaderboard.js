import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Dummy data with emojis and scores
  const dummyData = [
    { email: "post_office1@example.com", score: 95, city: "New York 🌆", badge: "🥇" },
    { email: "post_office2@example.com", score: 75, city: "Los Angeles 🌴", badge: "🥈" },
    { email: "post_office3@example.com", score: 60, city: "Chicago 🌃", badge: "🥈" },
    { email: "post_office4@example.com", score: 40, city: "Houston 🚀", badge: "🥉" },
    { email: "post_office5@example.com", score: 30, city: "Phoenix 🌞", badge: "🥉" },
  ];

  // Set dummy data for demonstration
  useEffect(() => {
    setLeaderboardData(dummyData);
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Email</th>
            <th>City</th>
            <th>Score</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.length > 0 ? (
            leaderboardData.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.email}</td>
                <td>{entry.city}</td>
                <td>{entry.score}</td>
                <td>{entry.badge}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Inline styles */}
      <style jsx>{`
        .leaderboard-container {
          max-width: 100%;
          padding: 10px;
          margin: auto;
          text-align: center;
          font-size: 12px; /* Smaller font size */
          color: white;
          background-color: white;
          border-radius: 5px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .leaderboard-title {
          font-size: 18px;
          font-weight: 600;
          color: #4a4a4a;
          margin-bottom: 10px;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leaderboard-table th {
          font-weight: 500;
          padding: 6px;
          text-align: center;
          color: #ffffff;
          background-color: #B6C6BE; /* Using specified color for headers */
          border-bottom: 1px solid #dcdcdc;
        }

        .leaderboard-table td {
          padding: 8px;
          text-align: center;
          color: #4a4a4a;
          border-bottom: 1px solid #e0e0e0;
          background-color: #ffffff;
        }

        .leaderboard-table tr:nth-child(even) {
          background-color: #f3f6f5; /* Light, faint background for alternating rows */
        }

        .leaderboard-table tr:hover {
          background-color: #e9efee; /* Soft hover color */
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
