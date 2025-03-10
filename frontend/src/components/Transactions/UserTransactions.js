import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const UserTransactions = ({ username }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currencies, setCurrencies] = useState([]); // State to store currencies
  const [exchangeRates, setExchangeRates] = useState({}); // State to store exchange rates
  const [baseCurrency, setBaseCurrency] = useState("USD"); // State for base currency selection
  const [categories, setCategories] = useState([]); // State to store categories
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    amount: 0,
    currency: "USD", // Default currency
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

  // Fetch currencies from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/currencies/", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => setCurrencies(response.data))
      .catch((error) => console.error("Error fetching currencies:", error));
  }, [user.token]);

  // Fetch real-time exchange rates when base currency changes
  useEffect(() => {
    if (baseCurrency) {
      axios
        .get(`http://localhost:5000/api/currencies/real-time-rates?base=${baseCurrency}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          console.log("Exchange Rates Response:", response.data); // Log the response
          setExchangeRates(response.data);
        })
        .catch((error) => console.error("Error fetching real-time exchange rates:", error));
    }
  }, [baseCurrency, user.token]);

  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, [user.token]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      setError("User is not authenticated. Please log in.");
      return;
    }

    if (
      !newTransaction.amount ||
      !newTransaction.category ||
      !newTransaction.description ||
      !newTransaction.currency
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Check if the amount exceeds the category limit
    const selectedCategory = categories.find((cat) => cat.name === newTransaction.category);
    if (selectedCategory && newTransaction.amount > selectedCategory.limit) {
      Swal.fire({
        icon: "error",
        title: "Limit Exceeded",
        text: `The amount exceeds the limit for ${selectedCategory.name} (Limit: ${selectedCategory.limit})`,
        timer: 2000, // 2 seconds
        timerProgressBar: true,
      });
      return;
    }

    try {
      const payload = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        recurrencePattern: newTransaction.isRecurring
          ? {
              frequency: newTransaction.recurrencePattern.frequency,
              endDate: newTransaction.recurrencePattern.endDate,
            }
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
        currency: "USD",
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
      Swal.fire("Success!", "Transaction added successfully!", "success");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to add transaction");
      }
      console.error("Error:", err);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200";

  return (
    <Layout isAdmin={false} username={username}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-grow justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Transaction Management
          </h1>
          <button
            onClick={() => navigate("/transactions")}
            className="bg-blue-800 hover:bg-primary-700 text-white font-semibold text-xl py-2.5 px-6 rounded-lg transition-colors duration-200 mb-8"
          >
            View Transactions
          </button>
        </div>

        {/* Exchange Rate Display Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Exchange Rates
          </h2>
          <div className="space-y-4">
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className={inputClass}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Currency</th>
                  <th className="text-left">Code</th>
                  <th className="text-left">Exchange Rate</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => (
                  <tr key={currency.code}>
                    <td>{currency.name}</td>
                    <td>{currency.code}</td>
                    <td>{exchangeRates[currency.code]?.toFixed(4) || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
              <select
                value={newTransaction.currency}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, currency: e.target.value })
                }
                className={inputClass}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <select
                value={newTransaction.category}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, category: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4">
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
              className="w-full bg-blue-800 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
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