import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SavingsAllocation from "./SavingsAllocation";

const GoalList = ({ goals, fetchGoals }) => {
  const calculateProgress = (savedAmount, targetAmount) => {
    return ((savedAmount / targetAmount) * 100).toFixed(2);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleEdit = async (goal) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Goal",
      html:
        `<input id="title" class="swal2-input" placeholder="Title" value="${goal.title}">` +
        `<input id="targetAmount" class="swal2-input" placeholder="Target Amount" value="${goal.targetAmount}">` +
        `<input id="deadline" class="swal2-input" placeholder="Deadline" type="date" value="${new Date(goal.deadline).toISOString().split('T')[0]}">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: document.getElementById("title").value,
          targetAmount: document.getElementById("targetAmount").value,
          deadline: document.getElementById("deadline").value,
        };
      },
    });

    if (formValues) {
      try {
        await axios.patch(
          `http://localhost:5000/api/goals/${goal._id}`,
          {
            title: formValues.title,
            targetAmount: formValues.targetAmount,
            deadline: formValues.deadline,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchGoals(); // Refresh the goals list
        Swal.fire("Updated!", "Your goal has been updated.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update the goal.", "error");
      }
    }
  };

  const handleDelete = async (goalId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/goals/${goalId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchGoals(); // Refresh the goals list
        Swal.fire("Deleted!", "Your goal has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete the goal.", "error");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Goals</h2>
        <SavingsAllocation goals={goals} onAllocationComplete={fetchGoals} />
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.savedAmount, goal.targetAmount);
            const progressColor = getProgressColor(progress);

            return (
              <div
                key={goal._id}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {goal.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Target: <span className="font-semibold">${goal.targetAmount}</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Saved: <span className="font-semibold">${goal.savedAmount}</span>
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`${progressColor} h-3 rounded-full`}
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {progress}% completed
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GoalList;