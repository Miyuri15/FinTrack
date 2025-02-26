import React, { useState, useEffect } from "react";
import AddBudgetForm from "./AddBudgetForm";
import Layout from "../Layout";
import { FaPen, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert

const Budget = () => {
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [budgets, setBudgets] = useState([]); // State to store budget plans
  const [editingBudget, setEditingBudget] = useState(null); // State to track the budget being edited
  const [exceededBudgets, setExceededBudgets] = useState([]); // State to track exceeded budgets
  const [nearExceedBudgets, setNearExceedBudgets] = useState([]); // State to track budgets near exceeding

  // Function to handle adding a new budget
  const handleAddBudget = (newBudget) => {
    setBudgets([...budgets, { id: Date.now(), ...newBudget }]); // Add new budget
    setShowForm(false); // Close the form after adding
  };

  // Function to handle editing a budget
  const handleEditBudget = (updatedBudget) => {
    const updatedBudgets = budgets.map((budget) =>
      budget.id === updatedBudget.id ? updatedBudget : budget
    );
    setBudgets(updatedBudgets);
    setEditingBudget(null); // Close the edit form
  };

  // Function to handle deleting a budget
  const handleDeleteBudget = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedBudgets = budgets.filter((budget) => budget.id !== id);
        setBudgets(updatedBudgets);
        Swal.fire("Deleted!", "Your budget has been deleted.", "success");
      }
    });
  };
  // Function to handle updating a spending category
  const handleUpdateSpending = (budgetId, categoryId, field, newValue) => {
    if (isNaN(newValue) || newValue < 0) {
      console.error("Invalid input");
      return;
    }
    const updatedBudgets = budgets.map((budget) =>
      budget.id === budgetId
        ? {
            ...budget,
            spendings: budget.spendings.map((spending) =>
              spending.id === categoryId
                ? { ...spending, [field]: newValue }
                : spending
            ),
          }
        : budget
    );
    setBudgets(updatedBudgets);
  };

  // Function to handle deleting a spending category
  const handleDeleteSpending = (budgetId, categoryId) => {
    const updatedBudgets = budgets.map((budget) =>
      budget.id === budgetId
        ? {
            ...budget,
            spendings: budget.spendings.filter(
              (spending) => spending.id !== categoryId
            ),
          }
        : budget
    );
    setBudgets(updatedBudgets);
  };

  // Function to show SweetAlert when budget is exceeded
  const showExceedAlert = (exceedAmount) => {
    Swal.fire({
      title: "Budget Exceeded!",
      text: `You have exceeded your budget by $${exceedAmount.toFixed(2)}.`,
      icon: "warning",
      timer: 2000, // Auto-close after 2 seconds
      showConfirmButton: false,
    });
  };

  // Function to show SweetAlert when budget is near exceeding
  const showNearExceedAlert = (remainingBalance) => {
    Swal.fire({
      title: "Budget Near Exceeding!",
      text: `Your remaining balance is $${remainingBalance.toFixed(2)}.`,
      icon: "info",
      timer: 2000, // Auto-close after 2 seconds
      showConfirmButton: false,
    });
  };

  // Monitor budgets for exceed and near-exceed amounts
  useEffect(() => {
    const newExceededBudgets = budgets
      .map((budget) => {
        const totalSpent = budget.spendings.reduce(
          (total, spending) => total + (spending.spent || 0),
          0
        );
        const exceedAmount = totalSpent - budget.amount;
        return { id: budget.id, exceedAmount };
      })
      .filter((budget) => budget.exceedAmount > 0);

      const newNearExceedBudgets = budgets
      .map((budget) => {
        const totalSpent = budget.spendings.reduce(
          (total, spending) => total + (spending.spent || 0),
          0
        );
        const remainingBalance = budget.amount - totalSpent;
        return { id: budget.id, remainingBalance, amount: budget.amount }; // Include budget.amount here
      })
      .filter((budget) => {
        const threshold = budget.amount * 0.25; // Use budget.amount here
        return budget.remainingBalance <= threshold && budget.remainingBalance > 0;
      });
                 
      // Show alerts for newly exceeded budgets
    newExceededBudgets.forEach((budget) => {
      if (!exceededBudgets.some((b) => b.id === budget.id)) {
        showExceedAlert(budget.exceedAmount);
      }
    });

    // Show alerts for budgets near exceeding
    newNearExceedBudgets.forEach((budget) => {
      if (!nearExceedBudgets.some((b) => b.id === budget.id)) {
        showNearExceedAlert(budget.remainingBalance);
      }
    });

    // Update states
    setExceededBudgets(newExceededBudgets);
    setNearExceedBudgets(newNearExceedBudgets);
  }, [budgets]); // Trigger when budgets change

  return (
    <Layout isAdmin={false} username="JohnDoe">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Add New Budget Plan Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add New Budget Plan
          </button>
        </div>

        {/* Current Budget Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {budgets.map((budget) => {
            const totalSpent = budget.spendings.reduce(
              (total, spending) => total + (spending.spent || 0),
              0
            );
            const exceedAmount = totalSpent - budget.amount;
            const remainingBalance = budget.amount - totalSpent;

            return (
              <div
                key={budget.id}
                className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
              >
                {/* Budget Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    {budget.month || budget.budgetName} Budget: ${budget.amount}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaPen className="text-blue-600 hover:text-blue-700 cursor-pointer" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash className="text-red-600 hover:text-red-700 cursor-pointer" />
                    </button>
                  </div>
                </div>

                {/* Spending Categories */}
                <div className="mt-4">
                  {budget.spendings.map((spending) => (
                    <div
                      key={spending.id}
                      className="flex justify-between items-center mb-4"
                    >
                      <p className="text-gray-600 dark:text-gray-300">
                        {spending.category}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Budgeted: ${spending.amount}
                        </p>
                        <input
                          type="number"
                          value={spending.spent || 0}
                          onChange={(e) =>
                            handleUpdateSpending(
                              budget.id,
                              spending.id,
                              "spent",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-20 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Spent"
                        />
                        <button
                          onClick={() =>
                            handleDeleteSpending(budget.id, spending.id)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash className="text-red-600 hover:text-red-700 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exceed Amount */}
                {exceedAmount > 0 && (
                  <p className="text-red-600 dark:text-red-400 mt-4">
                    Exceed Amount: ${exceedAmount.toFixed(2)}
                  </p>
                )}

                {/* Remaining Balance */}
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  Remaining Balance: ${remainingBalance.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Add Budget Form Pop-up */}
        {showForm && (
          <AddBudgetForm
            onClose={() => setShowForm(false)}
            onAddBudget={handleAddBudget}
          />
        )}

        {/* Edit Budget Form Pop-up */}
        {editingBudget && (
          <AddBudgetForm
            budget={editingBudget}
            onClose={() => setEditingBudget(null)}
            onAddBudget={handleEditBudget}
          />
        )}
      </div>
    </Layout>
  );
};

export default Budget;