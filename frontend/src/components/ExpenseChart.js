import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const ExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/transactions", {
      headers: { Authorization: token },
    });

    const expenses = res.data.filter((t) => t.type === "expense");

    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const formattedData = Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: COLORS[index % COLORS.length],
    }));

    setData(formattedData);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md mt-4">
      <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
      {data.length > 0 ? (
        <PieChart width={400} height={300}>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>No expense data available.</p>
      )}
    </div>
  );
};

export default ExpenseChart;
