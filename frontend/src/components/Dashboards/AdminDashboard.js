import React, { useEffect, useState } from "react";
import { FiUsers, FiUser, FiBarChart } from "react-icons/fi";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Card from "./Card";
import Layout from "../Layout";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersResponse = await fetch("http://localhost:5000/api/auth/all", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch all budgets
        const budgetsResponse = await fetch("http://localhost:5000/api/budgets/all", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!budgetsResponse.ok) throw new Error("Failed to fetch budgets");
        const budgetsData = await budgetsResponse.json();
        setBudgets(budgetsData);

        // Fetch all transactions
        const transactionsResponse = await fetch("http://localhost:5000/api/transactions/allTransactions", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!transactionsResponse.ok) throw new Error("Failed to fetch transactions");
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Process data for charts
  const processChartData = () => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString("default", { month: "short" });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }

      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else if (transaction.type === "expense") {
        monthlyData[month].expense += transaction.amount;
      }
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map((month) => monthlyData[month].income);
    const expenseData = labels.map((month) => monthlyData[month].expense);

    return { labels, incomeData, expenseData };
  };

  const { labels, incomeData, expenseData } = processChartData();

  const transactionsData = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#10b981",
        borderColor: "#10b981",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        borderWidth: 1,
      },
    ],
  };

  const activeUsersBudgetData = {
    labels: budgets.map((budget) => budget.month),
    datasets: [
      {
        label: "Active Users",
        data: budgets.map((budget) => budget.amount),
        borderColor: "#3b82f6",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <Layout isAdmin={true}>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 sm:mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card title="Total Users" value={users.length} icon={<FiUsers />} />
          <Card title="Total Budgets" value={budgets.length} icon={<FiBarChart />} />
          <Card title="Total Transactions" value={transactions.length} icon={<FiUser />} />
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
              Transactions Overview
            </h2>
            <Bar data={transactionsData} />
          </div>
          <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
              Active Users with Budget
            </h2>
            <Line data={activeUsersBudgetData} />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
            All Users
          </h2>
          <table className="w-full text-text-light dark:text-gray-200">
            <thead>
              <tr className="bg-blue-50 dark:bg-gray-700">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import { FiUsers, FiUser, FiBarChart } from "react-icons/fi";
// import { Line, Bar } from "react-chartjs-2";
// import "chart.js/auto";
// import Card from "./Card";
// import Layout from "../Layout";
// import { useAuth } from "../../context/AuthContext";

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch all users
//         const usersResponse = await fetch("http://localhost:5000/api/auth/all", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const usersData = await usersResponse.json();
//         setUsers(usersData);

//         // Fetch all budgets
//         const budgetsResponse = await fetch("http://localhost:5000/api/budgets/all", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const budgetsData = await budgetsResponse.json();
//         setBudgets(budgetsData);

//         // Fetch all transactions
//         const transactionsResponse = await fetch("http://localhost:5000/api/transactions/allTransactions", {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         const transactionsData = await transactionsResponse.json();
//         setTransactions(transactionsData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user.token]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Process data for charts
//   const processChartData = () => {
//     const monthlyData = {};

//     transactions.forEach((transaction) => {
//       const date = new Date(transaction.date);
//       const month = date.toLocaleString("default", { month: "short" });

//       if (!monthlyData[month]) {
//         monthlyData[month] = { income: 0, expense: 0 };
//       }

//       if (transaction.type === "income") {
//         monthlyData[month].income += transaction.amount;
//       } else if (transaction.type === "expense") {
//         monthlyData[month].expense += transaction.amount;
//       }
//     });

//     const labels = Object.keys(monthlyData);
//     const incomeData = labels.map((month) => monthlyData[month].income);
//     const expenseData = labels.map((month) => monthlyData[month].expense);

//     return { labels, incomeData, expenseData };
//   };

//   const { labels, incomeData, expenseData } = processChartData();

//   const transactionsData = {
//     labels: labels,
//     datasets: [
//       {
//         label: "Income",
//         data: incomeData,
//         backgroundColor: "#10b981",
//         borderColor: "#10b981",
//         borderWidth: 1,
//       },
//       {
//         label: "Expenses",
//         data: expenseData,
//         backgroundColor: "#ef4444",
//         borderColor: "#ef4444",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const activeUsersBudgetData = {
//     labels: budgets.map((budget) => budget.month),
//     datasets: [
//       {
//         label: "Active Users",
//         data: budgets.map((budget) => budget.amount),
//         borderColor: "#3b82f6",
//         fill: false,
//         tension: 0.4,
//       },
//     ],
//   };

//   return (
//     <Layout isAdmin={true}>
//       <div className="p-4 sm:p-6 lg:p-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 sm:mb-8">
//           Admin Dashboard
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//           <Card title="Total Users" value={users.length} icon={<FiUsers />} />
//           <Card title="Total Budgets" value={budgets.length} icon={<FiBarChart />} />
//           <Card title="Total Transactions" value={transactions.length} icon={<FiUser />} />
//         </div>

//         <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
//             <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
//               Transactions Overview
//             </h2>
//             <Bar data={transactionsData} />
//           </div>
//           <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
//             <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
//               Active Users with Budget
//             </h2>
//             <Line data={activeUsersBudgetData} />
//           </div>
//         </div>

//         <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
//           <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
//             All Users
//           </h2>
//           <table className="w-full text-text-light dark:text-gray-200">
//             <thead>
//               <tr className="bg-blue-50 dark:bg-gray-700">
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id} className="border-b dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700">
//                   <td className="p-3">{user.username}</td>
//                   <td className="p-3">{user.email}</td>
//                   <td className="p-3">{user.role}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminDashboard;