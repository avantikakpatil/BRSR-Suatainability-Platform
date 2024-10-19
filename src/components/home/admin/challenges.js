import React, { useState, useEffect } from "react";
import "../../../style.css"; // Import your custom styles

const Challenges = () => {
  const [pastChallenges, setPastChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);

  // Simulated data (replace with your actual data fetching logic)
  const challengesData = [
    { id: 1, title: "Reduce Energy Consumption", startDate: "2024-10-01", endDate: "2024-10-15", isPast: true, resultsAvailable: true }, // Added resultsAvailable flag
    { id: 2, title: "Waste Reduction Week", startDate: "2024-10-20", endDate: "2024-10-27", isPast: false },
    { id: 3, title: "Community Recycling Drive", startDate: "2024-11-05", endDate: "2024-11-12", isPast: false },
  ];

  // Filter challenges based on past/upcoming status
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const past = challengesData.filter((challenge) => challenge.endDate < today);
    const upcoming = challengesData.filter((challenge) => challenge.startDate > today);
    setPastChallenges(past);
    setUpcomingChallenges(upcoming);
  }, []);

  const handleParticipateClick = (challengeId) => {
    // Implement logic to handle participation for a challenge (e.g., redirect to a participation page)
    console.log(`Participate button clicked for challenge: ${challengeId}`);
  };

  const handleResultsClick = (challengeId) => {
    // Implement logic to handle viewing results for a challenge (e.g., fetch and display results data)
    console.log(`Results button clicked for challenge: ${challengeId}`);
  };

  return (
    <div className="challenges-container">
      <h1 className="challenges-title">Challenges</h1>
      <div className="challenge-sections">
        {pastChallenges.length > 0 && (
          <div className="challenge-section">
            <h2 className="challenges-title">Past Challenges</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Results</th>
                </tr>
              </thead>
              <tbody>
                {pastChallenges.map((challenge) => (
                  <tr key={challenge.id}>
                    <td>{challenge.title}</td>
                    <td>{challenge.startDate}</td>
                    <td>{challenge.endDate}</td>
                    <td>
                      {challenge.resultsAvailable ? (
                        <button className="results-button" onClick={() => handleResultsClick(challenge.id)}>
                          View Results
                        </button>
                      ) : (
                        <p className="no-results">No results available</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {upcomingChallenges.length > 0 && (
          <div className="challenge-section">
            <h2 className="challenges-title">Upcoming Challenges</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingChallenges.map((challenge) => (
                  <tr key={challenge.id}>
                    <td>{challenge.title}</td>
                    <td>{challenge.startDate}</td>
                    <td>{challenge.endDate}</td>
                    <td>
                      <button className="participate-button" onClick={() => handleParticipateClick(challenge.id)}>
                        Participate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!(pastChallenges.length > 0 || upcomingChallenges.length > 0) && (
        <p className="no-challenges">No challenges to display.</p>
      )}
    </div>
  );
};

export default Challenges;