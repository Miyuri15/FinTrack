import React from "react";

const Navbar = ({ username }) => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left: FinTrack Name */}
      <div className="text-2xl font-bold text-blue-900">
        FinTrack
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-grow mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right: User Icon and Username */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          {/* User Icon */}
          <img
            src="/images/user-icon.png" // Replace with your user icon image
            alt="User Icon"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
          {/* Username */}
          <span className="text-sm text-gray-700">{username}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;