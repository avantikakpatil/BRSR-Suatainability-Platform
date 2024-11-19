import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
  authDomain: "brsr-9b56a.firebaseapp.com",
  projectId: "brsr-9b56a",
  storageBucket: "brsr-9b56a.appspot.com",
  messagingSenderId: "548279958491",
  appId: "1:548279958491:web:19199e42e0d796ad4185fe",
  measurementId: "G-7SYPSVZR9H",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const SetDeadline = ({ onDeadlineSet }) => {
  const [deadline, setDeadline] = useState('');
  const [notification, setNotification] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = ref(db, 'divisional');
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const notificationList = Object.entries(data).map(([key, value]) => ({
        key,
        ...value,
      }));
      setNotifications(notificationList);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newNotificationRef = push(ref(db, 'divisional'));
    set(newNotificationRef, {
      deadline,
      notification,
    })
      .then(() => {
        console.log('Deadline and notification saved successfully!');
        setDeadline('');
        setNotification('');
        if (onDeadlineSet) onDeadlineSet(deadline, notification);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  const handleDeleteNotification = (notificationKey) => {
    const notificationRef = ref(db, `divisional/${notificationKey}`);
    remove(notificationRef)
      .then(() => {
        console.log('Notification deleted successfully!');
        setNotifications(notifications.filter((n) => n.key !== notificationKey));
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.header}>Set Deadline and Notification</h2>
          <label htmlFor="deadline" style={styles.label}>Set Deadline:</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={styles.input}
          />
          <label htmlFor="notification" style={styles.label}>Notification (Optional):</label>
          <textarea
            id="notification"
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            style={styles.textarea}
            placeholder="Enter a notification message for post offices..."
          />
          <button type="submit" style={styles.button}>
            Set Deadline
          </button>
        </form>
      </div>

      <div style={styles.right}>
        <h2 style={styles.header}>Notifications</h2>
        {notifications.length > 0 ? (
          <div style={styles.notifications}>
            {notifications.map(({ key, deadline, notification }) => (
              <div key={key} style={styles.notificationCard}>
                <p><strong>Deadline:</strong> {deadline}</p>
                <p><strong>Notification:</strong> {notification}</p>
                <button
                  onClick={() => handleDeleteNotification(key)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noNotifications}>No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  left: {
    flex: 1,
    maxWidth: '40%',
  },
  right: {
    flex: 1,
    maxWidth: '60%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '5rem',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  notifications: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
    maxHeight: '500px', // Set the maximum height
    overflowY: 'auto',  // Enable vertical scrolling
    paddingRight: '0.5rem', // Add some padding for better visibility
  },
  notificationCard: {
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#777',
    marginTop: '1rem',
  },
};

export default SetDeadline;
