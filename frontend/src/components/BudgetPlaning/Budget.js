import React, { useState, useEffect } from "react";
import AddBudgetForm from "./AddBudgetForm";
import Layout from "../Layout";
import { FaLightbulb, FaPen, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Budget = () => {
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budgets/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      } else {
        console.error("Error fetching budgets");
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleEditBudget = async (updatedBudget) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/budgets/${updatedBudget._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedBudget),
        }
      );
      if (response.ok) {
        fetchBudgets();
        setEditingBudget(null);
      } else {
        console.error("Error updating budget");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDeleteBudget = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/budgets/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.ok) {
            fetchBudgets();
            Swal.fire("Deleted!", "Your budget has been deleted.", "success");
          } else {
            console.error("Error deleting budget");
          }
        } catch (error) {
          console.error("Error deleting budget:", error);
        }
      }
    });
  };

  const handleUpdateSpentAmount = async (budgetId, spendingId, spentAmount) => {
    if (isNaN(spentAmount) || spentAmount < 0) return;
  
    try {
      // Update the spent amount in the local state first
      const updatedBudgets = budgets.map((budget) => {
        if (budget._id === budgetId) {
          return {
            ...budget,
            spendings: budget.spendings.map((spending) =>
              spending._id === spendingId
                ? { ...spending, spent: spentAmount }
                : spending
            ),
          };
        }
        return budget;
      });
      setBudgets(updatedBudgets);
  
      // Send the updated spent amount to the backend
      const response = await fetch(
        `http://localhost:5000/api/budgets/${budgetId}/spendings/${spendingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ spentAmount }), // Send the spent amount
        }
      );
  
      if (response.ok) {
        const updatedBudget = await response.json();
        const totalSpent = updatedBudget.spendings.reduce(
          (sum, spending) => sum + spending.spent,
          0
        );
  
        if (totalSpent > updatedBudget.amount) {
          Swal.fire({
            title: "Budget Exceeded!",
            text: `You have exceeded your budget by $${
              totalSpent - updatedBudget.amount
            }.`,
            icon: "error",
            timer: 2000,
          });
        } else if (totalSpent >= updatedBudget.amount * 0.95) {
          Swal.fire({
            title: "Near Budget Limit!",
            text: "You are close to exceeding your budget.",
            icon: "warning",
            timer: 2000,
          });
        }
      } else {
        console.error("Error updating spent amount");
      }
    } catch (error) {
      console.error("Error updating spent amount:", error);
    }
  };
  
  const handleDeleteSpending = async (budgetId, spendingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/budgets/${budgetId}/spendings/${spendingId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.ok) {
            fetchBudgets();
            Swal.fire(
              "Deleted!",
              "Spending category has been deleted.",
              "success"
            );
          } else {
            console.error("Error deleting spending category");
          }
        } catch (error) {
          console.error("Error deleting spending category:", error);
        }
      }
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Recommendation Portal Button */}
        <div className="text-center mb-6">
                  <Link
                    to="/recommendations"
                    className="bg-green-600 text-white text-xl font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaLightbulb /> Budget Planning Recommendations
                  </Link>
                </div>
        {/* Centered and large button */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white text-xl font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            Add New Budget Plan
          </button>
        </div>
        <div className="grid gap-6 mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            // Calculate total spent for the current budget
            const totalSpent = budget.spendings.reduce(
              (sum, spending) => sum + spending.spent,
              0
            );
            const exceededAmount = totalSpent > budget.amount ? totalSpent - budget.amount : 0;

            return (
              <div
                key={budget._id}
                className="bg-white rounded-lg shadow-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700 p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {budget.budgetName}: ${budget.amount}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {budget.spendings.map((spending) => (
                  <div
                    key={spending._id}
                    className="flex justify-between items-center mb-4 text-gray-700 dark:text-gray-300"
                  >
                    <span>{spending.category}: ${spending.amount}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={spending.spent}
                        onChange={(e) =>
                          handleUpdateSpentAmount(
                            budget._id,
                            spending._id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        onClick={() =>
                          handleDeleteSpending(budget._id, spending._id)
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Display the exceeded amount at the bottom of the card */}
                {exceededAmount > 0 && (
                  <div className="mt-4 text-red-600 font-semibold">
                    Exceeded by: ${exceededAmount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {showForm && (
          <AddBudgetForm
            onClose={() => setShowForm(false)}
            onAddBudget={handleEditBudget}
          />
        )}
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
