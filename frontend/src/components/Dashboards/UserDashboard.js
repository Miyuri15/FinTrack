import React from "react";
import { FiDollarSign, FiPieChart, FiShoppingCart } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Card from "./Card";
import Layout from "../Layout";

const UserDashboard = () => {
  const username = localStorage.getItem("username");
  
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
    <Layout isAdmin={false} username={username}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-400 mb-6 sm:mb-8">
          Welcome, {username}
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card title="Budget Plans" value={`$${user.budget}`} icon={<FiDollarSign />} />
          <Card title="Transactions" value={user.transactions} icon={<FiShoppingCart />} />
          <Card title="Reports" value={user.report} icon={<FiPieChart />} />
        </div>

        {/* Charts Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
              Budget Flow
            </h2>
            <Line data={budgetFlowData} />
          </div>
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
              Transactions Amount
            </h2>
            <Line data={transactionsData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;