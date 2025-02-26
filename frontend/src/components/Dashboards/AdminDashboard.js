import React from "react";
import { FiUsers, FiUser, FiBarChart } from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Card from "./Card";
import Layout from "../Layout";

const AdminDashboard = () => {
  const username = "Admin";
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Admin User", email: "admin@example.com", role: "Admin" },
  ];

  // Data for Transactions of the Month Chart
  const transactionsData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Transactions",
        data: [120, 200, 150, 300], // Example data
        backgroundColor: "#3b82f6", // Blue color
        borderColor: "#3b82f6",
        borderWidth: 1,
      },
    ],
  };

  // Data for Active Users with Budget Chart
  const activeUsersBudgetData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Users",
        data: [50, 60, 70, 80, 90, 100], // Example data
        borderColor: "#10b981", // Green color
        fill: false,
        tension: 0.4,
      },
      {
        label: "Budget",
        data: [5000, 4500, 4000, 3500, 3000, 2500], // Example data
        borderColor: "#f59e0b", // Orange color
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <Layout isAdmin={true} username={username}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 sm:mb-8">
          Admin Dashboard
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card title="Total Users" value={users.length} icon={<FiUsers />} />
          <Card title="New Signups" value={5} icon={<FiUser />} />
          <Card title="Reports Generated" value={10} icon={<FiBarChart />} />
        </div>

        {/* Charts Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
              Transactions of the Month
            </h2>
            <Bar data={transactionsData} />
          </div>
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
              Active Users with Budget
            </h2>
            <Line data={activeUsersBudgetData} />
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
            All Users
          </h2>
          <table className="w-full text-text-light dark:text-gray-200">
            <thead>
              <tr className="bg-blue-50 dark:bg-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;