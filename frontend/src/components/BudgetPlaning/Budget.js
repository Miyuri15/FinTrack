import React, { useState, useEffect } from "react";
import AddBudgetForm from "./AddBudgetForm";
import Layout from "../Layout";
import { FaPen, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Budget = () => {
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('/api/budgets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBudgets(data);
        } else {
          console.error('Error fetching budgets');
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  const handleAddBudget = async (newBudget) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newBudget),
      });
      if (response.ok) {
        const data = await response.json();
        setBudgets([...budgets, data]);
        setShowForm(false);
      } else {
        console.error('Error creating budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleEditBudget = async (updatedBudget) => {
    try {
      const response = await fetch(`/api/budgets/${updatedBudget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedBudget),
      });
      if (response.ok) {
        const data = await response.json();
        const updatedBudgets = budgets.map((budget) =>
          budget.id === data.id ? data : budget
        );
        setBudgets(updatedBudgets);
        setEditingBudget(null);
      } else {
        console.error('Error updating budget');
      }
    } catch (error) {
      console.error('Error updating budget:', error);
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
          const response = await fetch(`/api/budgets/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const updatedBudgets = budgets.filter((budget) => budget.id !== id);
            setBudgets(updatedBudgets);
            Swal.fire("Deleted!", "Your budget has been deleted.", "success");
          } else {
            console.error('Error deleting budget');
          }
        } catch (error) {
          console.error('Error deleting budget:', error);
        }
      }
    });
  };

  return (
    <Layout isAdmin={false} username="JohnDoe">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add New Budget Plan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {budget.category} Budget: ${budget.amount}
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
              <p className="text-gray-600 dark:text-gray-300">
                Start Date: {new Date(budget.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                End Date: {new Date(budget.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {showForm && (
          <AddBudgetForm
            onClose={() => setShowForm(false)}
            onAddBudget={handleAddBudget}
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