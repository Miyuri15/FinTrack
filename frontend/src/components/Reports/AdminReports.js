import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout";
import MenuBar from "../MenuBar";
import Navbar from "../Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReportPopup from "./ReportPopup";

export default function AdminReports({ username }) {
  const { user } = useAuth(); // Get the logged-in user from the context
  const isAdmin = user?.role === "admin"; // Determine if the user is an admin
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    tags: "",
    username: "",
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = filters.username
          ? `http://localhost:5000/api/transactions?username=${filters.username}`
          : "http://localhost:5000/api/transactions/all";

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [filters.username]);

  useEffect(() => {
    let filtered = transactions;

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(
        (t) =>
          new Date(t.date) >= new Date(filters.startDate) &&
          new Date(t.date) <= new Date(filters.endDate)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.tags) {
      const tagsArray = filters.tags.split(",");
      filtered = filtered.filter((t) =>
        tagsArray.some((tag) => t.tags.includes(tag))
      );
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const generateReport = () => {
    const report = {
      generateDate: new Date().toLocaleDateString(),
      filtersApplied: filters,
      transactions: filteredTransactions,
    };
    setReportData(report);
    setShowReportPopup(true); // Show the report popup
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text(`Generate Date: ${reportData.generateDate}`, 10, 10);
    doc.text(`Filters Applied: ${JSON.stringify(reportData.filtersApplied)}`, 10, 20);

    const headers = [["Date", "Username", "Category", "Type", "Amount", "Tags"]];
    const data = reportData.transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.user ? t.user.username : "Unknown User",
      t.category,
      t.type,
      t.amount,
      t.tags.join(", "),
    ]);

    autoTable(doc, {
      startY: 30,
      head: headers,
      body: data,
    });

    doc.save(`Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
      <MenuBar isAdmin={isAdmin} />
      <div className="flex-grow">
        <Navbar username={username} />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Report Portal</h1>
            <button
              onClick={generateReport}
              className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 text-xl font-semibold"
            >
              Generate Report
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex space-x-4">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Category"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={filters.tags}
                onChange={(e) =>
                  setFilters({ ...filters, tags: e.target.value })
                }
                className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border dark:border-gray-600">Date</th>
                <th className="p-2 border dark:border-gray-600">Username</th>
                <th className="p-2 border dark:border-gray-600">Category</th>
                <th className="p-2 border dark:border-gray-600">Type</th>
                <th className="p-2 border dark:border-gray-600">Amount</th>
                <th className="p-2 border dark:border-gray-600">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t._id} className="border dark:border-gray-600">
                  <td className="p-2 border dark:border-gray-600">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border dark:border-gray-600">
                    {t.user ? t.user.username : "Unknown User"}
                  </td>
                  <td className="p-2 border dark:border-gray-600">{t.category}</td>
                  <td className="p-2 border dark:border-gray-600">{t.type}</td>
                  <td className="p-2 border dark:border-gray-600">{t.amount}</td>
                  <td className="p-2 border dark:border-gray-600">{t.tags.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Popup */}
      {showReportPopup && (
        <ReportPopup
          reportData={reportData}
          onClose={() => setShowReportPopup(false)}
          onDownload={downloadReport}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}