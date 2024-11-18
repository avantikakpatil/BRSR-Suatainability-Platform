import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC8XobgVqF5bqK6sFiL3mqKNB3PHedZwQA",
    authDomain: "brsr-9b56a.firebaseapp.com",
    projectId: "brsr-9b56a",
    storageBucket: "brsr-9b56a.appspot.com",
    messagingSenderId: "548279958491",
    appId: "1:548279958491:web:19199e42e0d796ad4185fe",
    measurementId: "G-7SYPSVZR9H"
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
      setNotifications(Object.values(data)); // Convert object to array
    });

    return () => unsubscribe(); // Cleanup function to detach listener
  }, []); // Empty dependency array: runs only once on component mount

  const handleSubmit = (event) => {
    event.preventDefault();

    const deadlineRef = ref(db, 'divisional');
    set(deadlineRef, {
      deadline,
      notification,
    })
      .then(() => {
        console.log('Deadline and notification saved successfully!');
        setDeadline(''); // Clear the deadline input field
        setNotification(''); // Clear the notification input field
        if (onDeadlineSet) onDeadlineSet(deadline, notification); // Call optional callback
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
        // Update notifications state to reflect deletion
        setNotifications(notifications.filter((n) => n.key !== notificationKey));
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label htmlFor="deadline">Set Deadline:</label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
        />
        <label htmlFor="notification">Notification (Optional):</label>
        <textarea
          id="notification"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
          style={{ resize: 'vertical', minHeight: '5rem', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          placeholder="Enter a notification message for post offices..."
        />
        <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '0.75rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Set Deadline
        </button>
      </form>

      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((notification) => (
            <li key={notification.key}>
              {notification.notification}
              <button onClick={() => handleDeleteNotification(notification.key)} style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications yet.</p>
      )}
    </div>
  );
};

export default SetDeadline;