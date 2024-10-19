import React, { useState, useEffect } from "react";
import "../../../style.css"; // Import your custom styles

const Challenges = () => {
  const [pastChallenges, setPastChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  // Simulated data (replace with your actual data fetching logic)
  const challengesData = [
    { id: 1, title: "Reduce Energy Consumption", startDate: "2024-10-01", endDate: "2024-10-15", isPast: true, resultsAvailable: true, deadlines: ["Deadline 1 (Oct 10)", "Deadline 2 (Oct 12)"] },
    { id: 2, title: "Waste Reduction Week", startDate: "2024-10-20", endDate: "2024-10-27", isPast: false },
    { id: 3, title: "Community Recycling Drive", startDate: "2024-11-05", endDate: "2024-11-12", isPast: false },
  ];

  // Filter challenges based on past/upcoming status
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const past = challengesData.filter((challenge) => challenge.endDate < today);
    const upcoming = challengesData.filter((challenge) => challenge.startDate > today);
    const allDeadlines = challengesData.flatMap((challenge) => challenge.deadlines || []);
    
    setPastChallenges(past);
    setUpcomingChallenges(upcoming);
    setDeadlines(allDeadlines);
  }, []);

  const handleParticipateClick = (challengeId) => {
    console.log(`Participate button clicked for challenge: ${challengeId}`);
  };

  const handleResultsClick = (challengeId) => {
    console.log(`Results button clicked for challenge: ${challengeId}`);
  };

  return (
    <div className="challenges-container" style={{ display: 'flex' }}>
      <div className="main-content" style={{ flex: 3 }}>
        <h1 className="challenges-title">Challenges</h1>
        <div className="challenge-sections">
          {pastChallenges.length > 0 && (
            <div className="challenge-section-wrapper" style={{ margin: "10px" }}>
              <div className="challenge-section">
                <h2 className="challenges-title">Past Challenges</h2>
                <table style={{ fontSize: "14px", width: "100%" }}>
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
            </div>
          )}

          {upcomingChallenges.length > 0 && (
            <div className="challenge-section-wrapper" style={{ margin: "10px" }}>
              <div className="challenge-section" style={{ marginBottom: "20px" }}>
                <h2 className="challenges-title">Upcoming Challenges</h2>
                <table style={{ fontSize: "14px", width: "100%" }}>
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
            </div>
          )}

          {!(pastChallenges.length > 0 || upcomingChallenges.length > 0) && (
            <p className="no-challenges">No challenges to display.</p>
          )}
        </div>
      </div>

      {/* Deadlines Panel */}
      <div className="deadlines-panel" style={{ flex: 1, padding: "10px", backgroundColor: "#3d89da", marginLeft: "10px", border: "1px solid #ddd" }}>
        <h4 className="challenges-title">Important Deadlines</h4>
        {deadlines.length > 0 ? (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {deadlines.map((deadline, index) => (
              <li key={index} style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#e0f7fa", borderRadius: "5px" }}>
                {deadline}
              </li>
            ))}
          </ul>
        ) : (
          <p>No deadlines available.</p>
        )}
      </div>
    </div>
  );
};

export default Challenges;
