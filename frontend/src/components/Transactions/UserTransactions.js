import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { useAuth } from "../../context/AuthContext";
import Notifications from "../Notifications";
import axios from "axios";

const UserTransactions = ({ username }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    amount: 0,
    category: "",
    tags: [],
    description: "",
    isRecurring: false,
    recurrencePattern: {
      frequency: "monthly",
      endDate: "",
      nextOccurrence: "",
    },
  });
  const [error, setError] = useState("");

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      setError("User is not authenticated. Please log in.");
      return;
    }

    if (
      !newTransaction.amount ||
      !newTransaction.category ||
      !newTransaction.description
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        recurrencePattern: newTransaction.isRecurring
          ? newTransaction.recurrencePattern
          : undefined,
      };

      const response = await axios.post(
        "http://localhost:5000/api/transactions",
        payload,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setNewTransaction({
        type: "expense",
        amount: 0,
        category: "",
        tags: [],
        description: "",
        isRecurring: false,
        recurrencePattern: {
          frequency: "monthly",
          endDate: "",
          nextOccurrence: "",
        },
      });
      setError("");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add transaction");
      }
      console.error("Error:", err);
    }
  };

  const inputClass = "w-full px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200";

  return (
    <Layout isAdmin={false} username={username}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-grow justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Transaction Management
        </h1>
                {/* View Transactions Button */}
          <button
            onClick={() => navigate("/transactions")}
            className="bg-blue-400 hover:bg-primary-700 text-white font-semibold text-xl py-2.5 px-6 rounded-lg transition-colors duration-200 mb-8"
          >
            View Transactions
          </button>
          </div>

        <Notifications />

        {/* Add Transaction Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Add New Transaction
          </h2>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value })
                }
                className={inputClass}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, amount: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category"
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, category: e.target.value })
                }
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, description: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newTransaction.tags.join(",")}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  tags: e.target.value.split(",").filter((tag) => tag.trim()),
                })
              }
              className={inputClass}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newTransaction.isRecurring}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, isRecurring: e.target.checked })
                }
                className="form-checkbox h-5 w-5 text-primary-600 dark:text-primary-400 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Recurring Transaction</span>
            </label>
            {newTransaction.isRecurring && (
              <div className="space-y-4">
                <select
                  value={newTransaction.recurrencePattern.frequency}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      recurrencePattern: {
                        ...newTransaction.recurrencePattern,
                        frequency: e.target.value,
                      },
                    })
                  }
                  className={inputClass}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <input
                  type="date"
                  placeholder="End Date"
                  value={newTransaction.recurrencePattern.endDate}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      recurrencePattern: {
                        ...newTransaction.recurrencePattern,
                        endDate: e.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-400 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              Add Transaction
            </button>
          </form>
        </div>

      </div>
    </Layout>
  );
};

export default UserTransactions;