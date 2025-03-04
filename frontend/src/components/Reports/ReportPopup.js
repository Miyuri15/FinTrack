import React from "react";

export default function ReportPopup({ reportData, onClose, onDownload, isAdmin }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Generated Report</h2>
        <p>Generate Date: {reportData.generateDate}</p>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              {/* Conditionally render Username column for admins */}
              {isAdmin && <th className="p-2 border">Username</th>}
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Tags</th>
            </tr>
          </thead>
          <tbody>
            {reportData.transactions.map((t) => (
              <tr key={t._id} className="border">
                <td className="p-2 border">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                {/* Conditionally render Username cell for admins */}
                {isAdmin && (
                  <td className="p-2 border">
                    {t.user ? t.user.username : "Unknown User"}
                  </td>
                )}
                <td className="p-2 border">{t.category}</td>
                <td className="p-2 border">{t.type}</td>
                <td className="p-2 border">{t.amount}</td>
                <td className="p-2 border">{t.tags.join(", ")}</td>
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