import React from "react";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";
import { FiDollarSign, FiPieChart, FiShoppingCart, FiUser } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Card from "./Card";

const UserDashboard = () => {
  const username = "JohnDoe"; // Replace with dynamic username
  const user = {
    name: "John Doe",
    email: "john@example.com",
    report: 4,
    budget: 5000,
    transactions: 25,
  };

  // Data for Budget Flow Chart
  const budgetFlowData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Budget Flow",
        data: [5000, 4500, 4000, 3500, 3000, 2500], // Example data
        fill: false,
        borderColor: "#3b82f6", // Blue color
        tension: 0.4,
      },
    ],
  };

  // Data for Transactions Amount Chart
  const transactionsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Transactions Amount",
        data: [200, 500, 800, 600, 1200, 900], // Example data
        fill: false,
        borderColor: "#10b981", // Green color
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
      <MenuBar isAdmin={false} />
      <div className="flex-grow">
        <Navbar username={username} />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-8">
            Welcome, {user.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Budget Plans" value={`$${user.budget}`} icon={<FiDollarSign />} />
            <Card title="Transactions" value={user.transactions} icon={<FiShoppingCart />} />
            <Card title="Reports" value={user.report} icon={<FiPieChart />} />
          </div>
          {/* Two Charts Side by Side */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                Budget Flow
              </h2>
              <Line data={budgetFlowData} />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                Transactions Amount
              </h2>
              <Line data={transactionsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;