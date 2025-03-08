import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditTransactionForm from "./EditTransactionForm";
import { FaBackward, FaLongArrowAltLeft } from "react-icons/fa";

const TransactionsPage = ({ username }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/transactions",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setTransactions(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired - please log in again");
          logout();
        } else {
          setError("Failed to fetch transactions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, navigate, logout]);

  const handleUpdateTransaction = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/transactions/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTransactions(
        transactions.map((t) => (t._id === id ? { ...t, ...response.data } : t))
      );
      setEditingTransaction(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update transaction");
      console.error("Update Error:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete transaction");
      console.error("Delete Error:", err);
    }
  };

  // Function to format amount with currency symbol
  const formatAmount = (amount, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency, // Use the currency code from the transaction
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  const inputClass = "w-full px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex space-x-4 cursor-pointer" onClick={() => navigate("/userTransactions")}>            
        <FaLongArrowAltLeft className="w-10 h-10"/>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Transaction History
        </h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-4 rounded-lg transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: transaction.type === 'income' 
                  ? 'rgba(16, 185, 129, 0.05)' 
                  : 'rgba(239, 68, 68, 0.05)',
                borderLeft: `4px solid ${transaction.type === 'income' ? '#10B981' : '#EF4444'}`
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-lg font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount, transaction.currency)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.category}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction._id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {transaction.description}
              </p>
              {transaction.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {transaction.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingTransaction && (
        <EditTransactionForm
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={handleUpdateTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;