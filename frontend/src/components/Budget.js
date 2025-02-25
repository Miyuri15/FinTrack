export default function Budget(){
    return<>
     <div>
      <h1>Budget Page</h1>
      <p>Here is your budget overview.</p>
    </div>
    </>
}



// import { useState, useEffect } from "react";
// import axios from "axios";

// const Budget = () => {
//   const [budgets, setBudgets] = useState([]);
//   const [category, setCategory] = useState("");
//   const [amount, setAmount] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchBudgets();
//   }, []);

//   const fetchBudgets = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//         console.error("No token found! Redirecting to login...");
//         window.location.href = "/login"; // Redirect if no token
//         return;
//     }

//     try {
//         const res = await axios.get("http://localhost:5000/api/budgets", {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         setBudgets(res.data);
//     } catch (error) {
//         console.error("Error fetching budgets:", error.response?.data || error.message);
//     }
// };

//   const handleAddOrUpdateBudget = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const budgetData = { category, amount, endDate };

//     try {
//       if (editingId) {
//         await axios.put(
//           `http://localhost:5000/api/budgets/${editingId}`,
//           budgetData,
//           config
//         );
//         setEditingId(null);
//       } else {
//         await axios.post(
//           "http://localhost:5000/api/budgets",
//           budgetData,
//           config
//         );
//       }
//       setCategory("");
//       setAmount("");
//       setEndDate("");
//       fetchBudgets();
//     } catch (error) {
//       console.error(
//         "Error adding/updating budget:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const handleEdit = (budget) => {
//     setEditingId(budget._id);
//     setCategory(budget.category);
//     setAmount(budget.amount);
//     setEndDate(budget.endDate.split("T")[0]);
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found");
//       return;
//     }
//     try {
//       await axios.delete(`http://localhost:5000/api/budgets/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchBudgets();
//     } catch (error) {
//       console.error(
//         "Error deleting budget:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-100 rounded-md">
//       <h2 className="text-xl font-bold mb-4">Budgets</h2>
//       <form onSubmit={handleAddOrUpdateBudget} className="flex gap-2 mb-4">
//         <input
//           className="border p-2 rounded"
//           type="text"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//         />
//         <input
//           className="border p-2 rounded"
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//         <input
//           className="border p-2 rounded"
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           required
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           type="submit"
//         >
//           {editingId ? "Update" : "Add"}
//         </button>
//       </form>
//       <ul>
//         {budgets.map((budget) => (
//           <li
//             key={budget._id}
//             className="bg-white p-3 rounded-md shadow-md flex justify-between mb-2"
//           >
//             <span>
//               {budget.category} - ${budget.amount} (Until{" "}
//               {new Date(budget.endDate).toLocaleDateString()})
//             </span>
//             <div>
//               <button
//                 className="text-blue-500 mr-2"
//                 onClick={() => handleEdit(budget)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="text-red-500"
//                 onClick={() => handleDelete(budget._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Budget;
