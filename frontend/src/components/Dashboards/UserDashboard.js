import React from "react";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";

const UserDashboard = () => {
  const username = "JohnDoe"; // Replace with dynamic username

  // Dummy data for the user
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    budget: "$5000",
    transactions: 25,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu Bar */}
      <MenuBar isAdmin={false} />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Navbar */}
        <Navbar username={username} />

        {/* Dashboard Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Welcome, {user.name}</h1>

          {/* User Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900">Budget</h2>
              <p className="text-2xl font-bold mt-2">{user.budget}</p>
            </div>

            {/* Transactions Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900">Transactions</h2>
              <p className="text-2xl font-bold mt-2">{user.transactions}</p>
            </div>

            {/* Role Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900">Role</h2>
              <p className="text-2xl font-bold mt-2">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;