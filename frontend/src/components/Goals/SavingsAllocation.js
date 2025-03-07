import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SavingsAllocation = ({ goals, onAllocationComplete }) => {
  const { user } = useAuth();
  const [income, setIncome] = useState("");
  const [allocations, setAllocations] = useState({});

  const handleIncomeChange = (e) => {
    setIncome(e.target.value);
  };

  const handleAllocationChange = (goalId, amount) => {
    setAllocations((prevAllocations) => ({
      ...prevAllocations,
      [goalId]: amount,
    }));
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging: Log the token

      const allocationData = Object.keys(allocations).map((goalId) => ({
        goalId,
        amount: parseFloat(allocations[goalId]),
      }));

      const res = await axios.post(
        "http://localhost:5000/api/goals/allocate",
        { userId: user.userId, allocation: allocationData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear input fields after successful allocation
      setIncome("");
      setAllocations({});

      // Notify parent component to refresh goals
      onAllocationComplete();
    } catch (err) {
      console.error("Error:", err); // Debugging: Log the error
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Allocate Savings from Income
      </h3>
      <form onSubmit={handleIncomeSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Income
          </label>
          <input
            type="number"
            placeholder="Enter your monthly income"
            value={income}
            onChange={handleIncomeChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        {goals.map((goal) => (
          <div key={goal._id}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {goal.title} (Target: ${goal.targetAmount})
            </label>
            <input
              type="number"
              placeholder={`Amount to allocate to ${goal.title}`}
              value={allocations[goal._id] || ""}
              onChange={(e) => handleAllocationChange(goal._id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Allocate Savings
        </button>
      </form>
    </div>
  );
};

export default SavingsAllocation;