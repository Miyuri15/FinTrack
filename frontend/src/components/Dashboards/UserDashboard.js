import { FiDollarSign, FiPieChart, FiShoppingCart } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Card from "./Card";
import Layout from "../Layout";
import { useAuth } from "../../context/AuthContext";
import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const { user } = useAuth(); // Get the user from AuthContext

  const [count, setCount] = useState({
    name: "John Doe",
    email: "john@example.com",
    goal: 0, // Initialize with 0
    budget: 0, // Initialize with 0
    transactions: 0, // Initialize with 0
  });  const [loading, setLoading] = useState(true);
  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch budget plans count
        const budgetResponse = await fetch("http://localhost:5000/api/budgets/count",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const budgetData = await budgetResponse.json();
  
        // Fetch transactions count
        const transactionsResponse = await fetch("http://localhost:5000/api/transactions/count",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const transactionsData = await transactionsResponse.json();
  
        // Fetch goals count
        // const goalsResponse = await fetch("http://localhost:5000/api/goals/count",
        // { headers: { Authorization: `Bearer ${user.token}` } });
        // const goalsData = await goalsResponse.json();
  
        // Update state with fetched data
        setCount({
          ...count,
          budget: budgetData.count,
          transactions: transactionsData.count,
          // goal: goalsData.count,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout isAdmin={false}>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-400 mb-6 sm:mb-8">
          Welcome, {user ? user.username : "Guest"}
        </h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card
            title="Budget Plans"
            value={`${count.budget}`}
            icon={<FiDollarSign />}
          />
          <Card
            title="Transactions"
            value={count.transactions}
            icon={<FiShoppingCart />}
          />
          <Card title="Goals" value={count.goal} icon={<FiPieChart />} />{" "}
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
