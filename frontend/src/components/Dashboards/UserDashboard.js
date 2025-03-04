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
  });

  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState([]); // Budget data
  const [transactionData, setTransactionData] = useState([]); // Transaction data

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch budget data
        const budgetResponse = await fetch("http://localhost:5000/api/budgets", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const budgetData = await budgetResponse.json();
        setBudgetData(budgetData);

        // Fetch transaction data
        const transactionsResponse = await fetch("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const transactionsData = await transactionsResponse.json();
        setTransactionData(transactionsData);

        // Update state with fetched data
        setCount({
          ...count,
          budget: budgetData.length, // Number of budgets
          transactions: transactionsData.length, // Number of transactions
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process transaction data for the chart (income vs. expenses vs. month)
  const processTransactionData = () => {
    const monthlyData = {};

    transactionData.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString("default", { month: "short" }); // e.g., "Jan", "Feb"
      const type = transaction.type; // "income" or "expense"

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (type === "income") {
        monthlyData[month].income += transaction.amount;
      } else if (type === "expense") {
        monthlyData[month].expense += transaction.amount;
      }
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map((month) => monthlyData[month].income);
    const expenseData = labels.map((month) => monthlyData[month].expense);

    return { labels, incomeData, expenseData };
  };

  // Data for Budget Flow Chart
  const budgetFlowData = {
    labels: budgetData.map((budget) => budget.month), // Use budget months as labels
    datasets: [
      {
        label: "Budget Amount",
        data: budgetData.map((budget) => budget.amount), // Use budget amounts as data
        fill: false,
        borderColor: "#3b82f6", // Blue color
        tension: 0.4,
      },
    ],
  };

  // Data for Transactions Amount Chart
  const { labels, incomeData, expenseData } = processTransactionData();
  const transactionsData = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        fill: false,
        borderColor: "#10b981", // Green color
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: expenseData,
        fill: false,
        borderColor: "#ef4444", // Red color
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
          <Card title="Goals" value={count.goal} icon={<FiPieChart />} />
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