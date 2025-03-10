import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout";

const Settings = () => {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]); // For search functionality
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "", exchangeRate: "" });
  const [searchQuery, setSearchQuery] = useState(""); // For search input

  useEffect(() => {
    fetchCategories();
    fetchCurrencies();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch currencies
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/currencies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCurrencies(response.data);
      setFilteredCurrencies(response.data); // Initialize filtered currencies
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  // Add a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/categories", {
        name: newCategory,
        limit: newLimit,
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
      setNewLimit("");
      Swal.fire("Success!", "Category added successfully!", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to add category.", "error");
    }
  };

  // Add a new currency
  const handleAddCurrency = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/currencies/add",
        newCurrency,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCurrencies([...currencies, response.data]);
      setFilteredCurrencies([...currencies, response.data]); // Update filtered list
      setNewCurrency({ code: "", name: "", exchangeRate: "" });
      Swal.fire("Success!", "Currency added successfully!", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to add currency.", "error");
    }
  };

  // Update currency exchange rate
  const handleUpdateCurrency = async (id, updatedRate) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/currencies/${id}`,
        { exchangeRate: updatedRate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedCurrencies = currencies.map((currency) =>
        currency._id === id ? response.data : currency
      );
      setCurrencies(updatedCurrencies);
      setFilteredCurrencies(updatedCurrencies); // Update filtered list
      Swal.fire("Success!", "Currency updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to update currency.", "error");
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
    );
    setFilteredCurrencies(filtered);
  };

  return (
    <Layout isAdmin={true}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Manage Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Categories</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Limit"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Manage Currencies Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Manage Currencies</h2>
          <form onSubmit={handleAddCurrency} className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Currency Code"
              value={newCurrency.code}
              onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Currency Name"
              value={newCurrency.name}
              onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Exchange Rate"
              value={newCurrency.exchangeRate}
              onChange={(e) => setNewCurrency({ ...newCurrency, exchangeRate: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Currency
            </button>
          </form>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search currencies..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Currencies List */}
          <div className="space-y-4">
            {filteredCurrencies.map((currency) => (
              <div
                key={currency._id}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 dark:text-gray-200">
                    {currency.code} - {currency.name} - Rate: {currency.exchangeRate}
                  </span>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      defaultValue={currency.exchangeRate}
                      onBlur={(e) => handleUpdateCurrency(currency._id, e.target.value)}
                      className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleUpdateCurrency(currency._id, currency.exchangeRate)}
                      className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;