// Navbar.js
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../ThemeContext';

const Navbar = ({ username }) => {
  const { darkMode, setDarkMode } = useTheme();

  return (
<nav className="bg-background-light dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between mb-4">
  <div className="text-2xl font-bold text-blue-600 dark:text-white">
    FinTrack
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

    <div className="relative flex items-center space-x-2">
      <img
        src="/images/user-icon.png"
        alt="User Icon"
        className="w-10 h-10 rounded-full cursor-pointer"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">{username}</span>
    </div>
  </div>
</nav>
  );
};

export default Navbar;