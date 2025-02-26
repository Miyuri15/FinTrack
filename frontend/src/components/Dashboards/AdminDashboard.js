import React from "react";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";

const AdminDashboard = () => {
  const username = "Admin"; // Replace with dynamic username

  // Dummy data for all users
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
    { id: 3, name: "Admin User", email: "admin@example.com", role: "admin" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu Bar */}
      <MenuBar isAdmin={true} />

      {/* Main Content */}
      <div className="flex-grow">
        {/* Navbar */}
        <Navbar username={username} />

        {/* Dashboard Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Admin Dashboard</h1>

          {/* All Users Table */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">All Users</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;