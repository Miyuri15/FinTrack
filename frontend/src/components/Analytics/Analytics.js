import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";

export default function Analytics() {
  const { user } = useAuth(); // Get the logged-in user
  const [allTransactions, setAllTransactions] = useState([]); // All users' transactions (admin only)
  const [userTransactions, setUserTransactions] = useState([]); // Logged-in user's transactions
  const isAdmin = user?.role === "admin"; // Check if the user is an admin

  // Fetch all transactions (admin only)
  useEffect(() => {
    if (isAdmin) {
      const fetchAllTransactions = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/transactions/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
          setAllTransactions(data);
        } catch (error) {
          console.error("Error fetching all transactions:", error);
        }
      };
      fetchAllTransactions();
    }
  }, [isAdmin]);

  // Fetch logged-in user's transactions
  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUserTransactions(data);
      } catch (error) {
        console.error("Error fetching user transactions:", error);
      }
    };
    fetchUserTransactions();
  }, []);

  // Calculate total income and expenses for all users (admin only)
  const calculateAllIncomeExpenses = () => {
    const income = allTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = allTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return [
      { name: "Income", value: income, fill: "#82ca9d" }, // Green for income
      { name: "Expenses", value: expenses, fill: "#ff6b6b" }, // Red for expenses
    ];
  };

  // Calculate total income and expenses for the logged-in user
  const calculateUserIncomeExpenses = () => {
    const income = userTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = userTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return [
      { name: "Income", value: income, fill: "#82ca9d" }, // Green for income
      { name: "Expenses", value: expenses, fill: "#ff6b6b" }, // Red for expenses
    ];
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
      <MenuBar isAdmin={isAdmin} />
      <div className="flex-grow">
        <Navbar />

        <div className="p-8 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Analytics</h1>

          {/* Admin Chart: All Users' Income vs Expenses */}
          {isAdmin && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">All Users' Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={calculateAllIncomeExpenses()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {calculateAllIncomeExpenses().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* User Chart: Logged-in User's Income vs Expenses */}
          {!isAdmin && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={calculateUserIncomeExpenses()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {calculateUserIncomeExpenses().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}