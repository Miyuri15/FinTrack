import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const AddBudgetForm = ({ budget, onClose, onAddBudget }) => {
  const [month, setMonth] = useState("");
  const [budgetName, setBudgetName] = useState(""); // State for budget name
  const [amount, setAmount] = useState("");
  const [spendings, setSpendings] = useState([]); // State to store spending categories

  // Pre-fill form if editing
  useEffect(() => {
    if (budget) {
      setMonth(budget.month || "");
      setBudgetName(budget.budgetName || "");
      setAmount(budget.amount);
      setSpendings(budget.spendings);
    }
  }, [budget]);

  // Function to add a new spending category
  const handleAddSpending = () => {
    setSpendings([...spendings, { id: Date.now(), category: "", amount: 0 }]);
  };

  // Function to handle updating a spending category
  const handleUpdateSpending = (id, field, value) => {
    const updatedSpendings = spendings.map((spending) =>
      spending.id === id ? { ...spending, [field]: value } : spending
    );
    setSpendings(updatedSpendings);
  };

  // Function to handle deleting a spending category
  const handleDeleteSpending = (id) => {
    const updatedSpendings = spendings.filter((spending) => spending.id !== id);
    setSpendings(updatedSpendings);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!month && !budgetName) || !amount || spendings.length === 0) {
      alert("Please enter a month or budget name, and add at least one spending category.");
      return;
    }
  
    const newBudget = {
      month,
      budgetName,
      amount: parseFloat(amount),
      spendings,
    };
  
    // If we're editing a budget, we'll update it, otherwise we'll create a new one.
    if (budget) {
      // For editing the existing budget
      onAddBudget({ ...budget, ...newBudget });
    } else {
      // For adding a new budget, make an API request
      try {
        const response = await fetch("http://localhost:5000/api/budgets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newBudget),
        });
  
        if (response.ok) {
          const addedBudget = await response.json();
          onAddBudget(addedBudget); // Update parent component with new budget

          // Show success alert
          Swal.fire({
            title: "Success!",
            text: "Budget added successfully!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            onClose(); // Close the form after the alert is confirmed
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to add budget",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error adding budget:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while adding the budget",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          {budget ? "Edit Budget Plan" : "Add New Budget Plan"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Month Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Month (Optional)
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Month (Optional)</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          {/* Budget Name */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Budget Name (Optional)
            </label>
            <input
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter Budget Name (e.g., Trip Budget)"
            />
          </div>

          {/* Total Budget */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Total Budget
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Spending Categories */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Spending Categories
            </label>
            {spendings.map((spending) => (
              <div key={spending.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={spending.category}
                  onChange={(e) =>
                    handleUpdateSpending(
                      spending.id,
                      "category",
                      e.target.value
                    )
                  }
                  className="w-1/2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Category"
                />
                <input
                  type="number"
                  value={spending.amount}
                  onChange={(e) =>
                    handleUpdateSpending(
                      spending.id,
                      "amount",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-1/2 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Amount"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSpending(spending.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash className="text-red-600 hover:text-red-700 cursor-pointer" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSpending}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Add Spending Category
            </button>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {budget ? "Update Budget" : "Add Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetForm;