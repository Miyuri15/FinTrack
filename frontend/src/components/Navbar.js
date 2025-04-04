import React, { useState } from 'react';
import { FiSun, FiMoon, FiBell } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

const Navbar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { user } = useAuth(); // Get the user from AuthContext
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-background-light dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between mb-4 relative">
      <div className="text-2xl font-bold text-blue-600 dark:text-white">
        <img
          src="/img/FintrackLogo.png"
          alt="logo"
          width={150}
          height={50}
          className="mb-5 mt-4"
        />
      </div>

      <div className="flex-grow mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-gray-900" />}
        </button>

        {/* Notification Bell Icon and Popup */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FiBell className="text-gray-900 dark:text-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50" style={{ top: '3rem', maxHeight: '400px', overflowY: 'auto' }}>
              <Notifications />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <FaUser />
          <span className="text-lg text-gray-700 dark:text-gray-300 font-bold">
            {user ? user.username : "Guest"} {/* Display the username from AuthContext */}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;