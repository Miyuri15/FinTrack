import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";

export default function Analytics() {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const isAdmin = user?.role === "admin";

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

  const calculateAllIncomeExpenses = () => {
    const income = allTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenses = allTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return [
      { name: "Income", value: income, fill: "#82ca9d" },
      { name: "Expenses", value: expenses, fill: "#ff6b6b" },
    ];
  };

  const calculateUserIncomeExpenses = () => {
    const income = userTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expenses = userTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return [
      { name: "Income", value: income, fill: "#82ca9d" },
      { name: "Expenses", value: expenses, fill: "#ff6b6b" },
    ];
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <MenuBar isAdmin={isAdmin} />
      <div className="flex-grow">
        <Navbar />
        <div className="p-8 bg-white dark:bg-gray-800 min-h-screen">
          <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">Analytics</h1>
          {isAdmin && (
            <div className="mb-8 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">All Users' Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={calculateAllIncomeExpenses()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
                    {calculateAllIncomeExpenses().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", darkMode: "#2d3748", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {!isAdmin && (
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Your Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={calculateUserIncomeExpenses()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
                    {calculateUserIncomeExpenses().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", darkMode: "#2d3748", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
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
