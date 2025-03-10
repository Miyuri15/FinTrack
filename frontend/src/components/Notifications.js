import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/notifications/', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setNotifications(response.data);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Notifications{' '}
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notifications</p>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg ${
                notification.read ? 'bg-gray-100' : 'bg-blue-100'
              } dark:bg-gray-700 flex justify-between`}
            >
              <div>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-600 dark:text-blue-400 text-xs"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="text-red-600 dark:text-red-400 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;