import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa"; // Import close icon from React Icons
import Swal from "sweetalert2";

const BudgetRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/budgets/recommendations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Response from backend:", response.data);
      setRecommendations(response.data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    }
  };

  const deleteRecommendation = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This recommendation will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      timer: 10000, // 10 sec timer
      timerProgressBar: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/budgets/recommendations/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          Swal.fire({
            title: "Deleted!",
            text: "The recommendation has been removed.",
            icon: "success",
            timer: 1000, // 1-second delay before disappearing
            showConfirmButton: false,
          });
  
          // Remove from UI
          setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
        } catch (error) {
          console.error("Error deleting recommendation:", error);
          Swal.fire("Error!", "Failed to delete recommendation.", "error");
        }
      }
    });
  };
  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-10">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Budget Recommendations</h2>
      {recommendations.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
          {recommendations.slice(0, 3).map((rec, index) => (
            <div key={rec.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
              <div>
                {rec.category ? (
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>{rec.category} (Month: {rec.month}):</strong> {rec.message}
                  </p>
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Overall Budget (Month: {rec.month}):</strong> {rec.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteRecommendation(rec.id)} // Pass `rec.id`
                className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"              >
                <FaTimes /> {/* Close icon */}
              </button>
            </div>
          ))}
          {recommendations.length > 3 && (
            <div className="space-y-3">
              {recommendations.slice(3).map((rec, index) => (
                <div key={rec.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                  <div>
                    {rec.category ? (
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong>{rec.category} (Month: {rec.month}):</strong> {rec.message}
                      </p>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong>Overall Budget (Month: {rec.month}):</strong> {rec.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteRecommendation(rec.id)} // Pass `rec.id`
                    className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <FaTimes /> {/* Close icon */}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-800 dark:text-gray-200">No recommendations available.</p>
      )}
    </div>
  );
};

export default BudgetRecommendations;