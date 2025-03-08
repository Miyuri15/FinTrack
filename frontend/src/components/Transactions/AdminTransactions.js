import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";

export default function AdminTransactions() {
  const { user } = useAuth(); // Get the logged-in user from the context
  const isAdmin = user?.role === "admin"; // Ensure isAdmin is properly determined
  const username = user?.username; // Extract username if available

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions/allTransactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Access denied. Admins only.");
          } else {
            throw new Error("Failed to fetch transactions");
          }
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
      <MenuBar isAdmin={isAdmin} />
      <div className="flex-grow">
        <Navbar username={username} />
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Transactions</h1>
          {/* Transactions Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border dark:border-gray-600">Date</th>
                <th className="p-2 border dark:border-gray-600">Username</th>
                <th className="p-2 border dark:border-gray-600">Category</th>
                <th className="p-2 border dark:border-gray-600">Type</th>
                <th className="p-2 border dark:border-gray-600">Amount</th>
                <th className="p-2 border dark:border-gray-600">Tags</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border dark:border-gray-600">
                  <td className="p-2 border dark:border-gray-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border dark:border-gray-600">
                    {t.user ? t.user.username : "Unknown User"}
                  </td>
                  <td className="p-2 border dark:border-gray-600">{t.category}</td>
                  <td className="p-2 border dark:border-gray-600">{t.type}</td>
                  <td className="p-2 border dark:border-gray-600">{t.amount}</td>
                  <td className="p-2 border dark:border-gray-600">{t.tags.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}