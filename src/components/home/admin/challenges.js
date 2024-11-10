import React, { useState, useEffect } from "react";

// Icons as components
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const Challenges = () => {
  const [pastChallenges, setPastChallenges] = useState([]);
  const [upcomingChallenges, setUpcomingChallenges] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [selectedTab, setSelectedTab] = useState("upcoming");

  // Simulated data
  const challengesData = [
    {
      id: 1,
      title: "Reduce Energy Consumption",
      startDate: "2024-10-01",
      endDate: "2024-10-15",
      isPast: true,
      resultsAvailable: true,
      deadlines: ["Deadline 1 (Oct 10)", "Deadline 2 (Oct 12)"],
      description: "Help reduce energy usage in your community",
      participants: 156
    },
    {
      id: 2,
      title: "Waste Reduction Week",
      startDate: "2024-10-20",
      endDate: "2024-10-27",
      isPast: false,
      description: "Minimize waste through creative recycling",
      participants: 89
    },
    {
      id: 3,
      title: "Community Recycling Drive",
      startDate: "2024-11-05",
      endDate: "2024-11-12",
      isPast: false,
      description: "Organize local recycling initiatives",
      participants: 234
    },
  ];

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

  const ChallengeCard = ({ challenge, isPast }) => (
    <div className="challenge-card">
      <div className="challenge-header">
        <h3 className="challenge-title">{challenge.title}</h3>
        <span className="date-range">
          <CalendarIcon />
          {challenge.startDate} - {challenge.endDate}
        </span>
      </div>
      
      <p className="challenge-description">{challenge.description}</p>
      
      <div className="challenge-footer">
        <div className="participants">
          <ClockIcon />
          <span>{challenge.participants} participants</span>
        </div>
        
        {isPast ? (
          challenge.resultsAvailable && (
            <button
              onClick={() => handleResultsClick(challenge.id)}
              className="button results-button"
            >
              <AwardIcon />
              View Results
              <ChevronRight />
            </button>
          )
        ) : (
          <button
            onClick={() => handleParticipateClick(challenge.id)}
            className="button participate-button"
          >
            Join Challenge
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="challenges-container">
      <div className="challenges-content">
        <div className="challenges-header">
          <h1 className="main-title">Sustainability Challenges</h1>
          <div className="tab-buttons">
            <button
              onClick={() => setSelectedTab("upcoming")}
              className={`tab-button ${selectedTab === "upcoming" ? "active" : ""}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setSelectedTab("past")}
              className={`tab-button ${selectedTab === "past" ? "active" : ""}`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="challenges-grid">
          <div className="challenges-list">
            {selectedTab === "upcoming" ? (
              upcomingChallenges.length > 0 ? (
                upcomingChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} isPast={false} />
                ))
              ) : (
                <div className="empty-state">No upcoming challenges available.</div>
              )
            ) : (
              pastChallenges.length > 0 ? (
                pastChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} isPast={true} />
                ))
              ) : (
                <div className="empty-state">No past challenges available.</div>
              )
            )}
          </div>

          <div className="deadlines-panel">
            <div className="deadlines-card">
              <h2 className="deadlines-title">Important Deadlines</h2>
              <div className="deadlines-content">
                {deadlines.length > 0 ? (
                  <div className="deadlines-list">
                    {deadlines.map((deadline, index) => (
                      <div key={index} className="deadline-item">
                        <ClockIcon />
                        <span>{deadline}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No deadlines available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .challenges-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 2rem;
        }

        .challenges-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .challenges-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .main-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
        }

        .tab-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .tab-button {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .tab-button:not(.active) {
          background-color: white;
          color: #4b5563;
        }

        .tab-button:not(.active):hover {
          background-color: #f3f4f6;
        }

        .tab-button.active {
          background-color: #3b82f6;
          color: white;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .challenges-grid {
            grid-template-columns: 1fr;
          }
        }

        .challenges-list {
          display: grid;
          gap: 1.5rem;
        }

        .challenge-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .challenge-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .challenge-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .challenge-description {
          color: #4b5563;
          margin-bottom: 1rem;
        }

        .challenge-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .participants {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .participate-button {
          background-color: #dbeafe;
          color: #2563eb;
        }

        .participate-button:hover {
          background-color: #bfdbfe;
        }

        .results-button {
          background-color: #d1fae5;
          color: #059669;
        }

        .results-button:hover {
          background-color: #a7f3d0;
        }

        .deadlines-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .deadlines-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #eff6ff;
          border-radius: 0.375rem;
          color: #1f2937;
          transition: all 0.3s ease;
        }

        .deadline-item:hover {
          background-color: #dbeafe;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          background-color: white;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Challenges;