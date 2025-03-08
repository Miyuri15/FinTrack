import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout";
import GoalForm from "./GoalForm";
import GoalList from "./GoalList";
import axios from "axios";

export default function Goals() {
  const { user } = useAuth();
  const userId = user.userId;
  const [goals, setGoals] = useState([]);

  // Fetch goals from the backend
  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/goals?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch goals when the component mounts or when userId changes
  useEffect(() => {
    fetchGoals();
  }, [userId]);

  // Handle new goal addition
  const handleGoalAdded = (newGoal) => {
    fetchGoals(); // Refresh the list of goals
  };

  return (
    <Layout>
      <div>
        <div className="font-bold text-3xl mb-6">
        <h1>FinTrack - Goals and Savings</h1>
        </div>

        <GoalForm onGoalAdded={handleGoalAdded} />
        <GoalList goals={goals} fetchGoals={fetchGoals} />
      </div>
    </Layout>
  );
}