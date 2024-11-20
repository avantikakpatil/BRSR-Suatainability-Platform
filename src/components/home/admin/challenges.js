import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FaClock } from 'react-icons/fa';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const sanitizedEmail = sanitizeEmail(user.email);

          const database = getDatabase();
          
          // Fetch challenges data
          const challengesRef = ref(database, `PostalManager/${sanitizedEmail}/inputData/communityData`);
          const challengesSnapshot = await get(challengesRef);
          if (challengesSnapshot.exists()) {
            setChallenges(challengesSnapshot.val().challenges || []);
          }

          // Fetch deadlines data
          const deadlinesRef = ref(database, `divisional`);
          const deadlinesSnapshot = await get(deadlinesRef);
          if (deadlinesSnapshot.exists()) {
            const deadlinesData = deadlinesSnapshot.val();
            const deadlineList = Object.entries(deadlinesData).map(([key, value]) => ({
              key,
              ...value,
            }));
            setDeadlines(deadlineList);
          }
        } else {
          console.log('No user is authenticated.');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchData();
  }, []);

  // Sanitize email to use it as a path in Firebase
  const sanitizeEmail = (email) => {
    return email.replace(/[.#$/[\]]/g, '_');
  };

  return (
    <div style={styles.container}>
      {/* Loading Indicator */}
      {isLoading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div style={styles.mainContent}>
          {/* Challenges Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Community Engagement Challenges</h2>
            {challenges.length > 0 ? (
              challenges.map((challenge, index) => (
                <div key={index} style={styles.challengeCard}>
                  <h3 style={styles.challengeTitle}>{challenge.title}</h3>
                  <p style={styles.challengeDates}>
                    Start Date: {challenge.startDate} | End Date: {challenge.endDate}
                  </p>
                  <p style={styles.challengeDescription}>{challenge.description}</p>
                  <button style={styles.viewResultsButton}>View Results</button>
                </div>
              ))
            ) : (
              <div style={styles.noData}>No community engagement challenges available.</div>
            )}
          </div>

          {/* Deadlines Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Important Deadlines</h2>
            {deadlines.length > 0 ? (
              deadlines.map(({ key, deadline, notification }) => (
                <div key={key} style={styles.deadlineCard}>
                  <FaClock style={styles.clockIcon} />
                  <div>
                    <p style={styles.deadlineText}>
                      <strong>Deadline:</strong> {deadline}
                    </p>
                    <p style={styles.deadlineNotification}>
                      <strong>Notification:</strong> {notification || 'No notification provided.'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noData}>No deadlines available.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    position: 'relative',
  },
  loading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#555',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    flexWrap: 'wrap',
  },
  section: {
    width: '48%',
    marginBottom: '40px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  },
  challengeCard: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  challengeTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  challengeDates: {
    fontSize: '1em',
    color: '#555',
    marginBottom: '10px',
  },
  challengeDescription: {
    fontSize: '1em',
    color: '#333',
    marginBottom: '10px',
  },
  viewResultsButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  deadlineCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  clockIcon: {
    fontSize: '24px',
    color: '#ff9800',
    marginRight: '15px',
  },
  deadlineText: {
    fontSize: '1em',
    color: '#333',
  },
  deadlineNotification: {
    fontSize: '0.9em',
    color: '#777',
  },
  noData: {
    fontSize: '1.1em',
    color: '#888',
    textAlign: 'center',
  },
};

export default Challenges;
