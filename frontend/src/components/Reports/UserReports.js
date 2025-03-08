import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../ThemeContext";
import Layout from "../Layout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReportPopup from "./ReportPopup"; // Import the ReportPopup component

export default function UserReports({ username }) {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    tags: "",
  });
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions", {
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
  }, []);

  // Apply filters
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

  // Generate report
  const generateReport = () => {
    const report = {
      username: user.username,
      generateDate: new Date().toLocaleDateString(),
      filtersApplied: filters,
      transactions: filteredTransactions,
    };
    setReportData(report);
    setShowReportPopup(true); // Show the report popup
  };

  // Download report as PDF
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text(`Username: ${reportData.username}`, 10, 10);
    doc.text(`Generate Date: ${reportData.generateDate}`, 10, 20);
    doc.text(`Filters Applied: ${JSON.stringify(reportData.filtersApplied)}`, 10, 30);

    const headers = [["Date", "Category", "Type", "Amount", "Tags"]];
    const data = reportData.transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.category,
      t.type,
      t.amount,
      t.tags.join(", "),
    ]);

    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
    });

    doc.save(`Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <Layout isAdmin={false} username={username}>
      <div className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Report Portal</h1>
          <button
            onClick={generateReport}
            className="p-4 bg-blue-800 text-white  hover:bg-blue-600 text-xl font-semibold rounded-lg"
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
                <td className="p-2 border dark:border-gray-600">{t.category}</td>
                <td className="p-2 border dark:border-gray-600">{t.type}</td>
                <td className="p-2 border dark:border-gray-600">{t.amount}</td>
                <td className="p-2 border dark:border-gray-600">{t.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Popup */}
      {showReportPopup && (
        <ReportPopup
          reportData={reportData}
          onClose={() => setShowReportPopup(false)}
          onDownload={downloadReport}
          isAdmin={false}
        />
      )}
    </Layout>
  );
}