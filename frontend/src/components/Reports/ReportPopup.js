import React from "react";

export default function ReportPopup({ reportData, onClose, onDownload, isAdmin }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Generated Report</h2>
        <p className="dark:text-white">Generate Date: {reportData.generateDate}</p>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 border dark:border-gray-600">Date</th>
              {/* Conditionally render Username column for admins */}
              {isAdmin && <th className="p-2 border dark:border-gray-600">Username</th>}
              <th className="p-2 border dark:border-gray-600">Category</th>
              <th className="p-2 border dark:border-gray-600">Type</th>
              <th className="p-2 border dark:border-gray-600">Amount</th>
              <th className="p-2 border dark:border-gray-600">Tags</th>
            </tr>
          </thead>
          <tbody>
            {reportData.transactions.map((t) => (
              <tr key={t._id} className="border dark:border-gray-600">
                <td className="p-2 border dark:border-gray-600 dark:text-white">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                {/* Conditionally render Username cell for admins */}
                {isAdmin && (
                  <td className="p-2 border dark:border-gray-600 dark:text-white">
                    {t.user ? t.user.username : "Unknown User"}
                  </td>
                )}
                <td className="p-2 border dark:border-gray-600 dark:text-white">{t.category}</td>
                <td className="p-2 border dark:border-gray-600 dark:text-white">{t.type}</td>
                <td className="p-2 border dark:border-gray-600 dark:text-white">{t.amount}</td>
                <td className="p-2 border dark:border-gray-600 dark:text-white">{t.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onDownload}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
          >
            Download Report
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}