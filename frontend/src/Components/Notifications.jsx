import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch Notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:4000/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className="notification-bell">
      <button onClick={toggleDropdown}>
        <FaBell />
      </button>
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
