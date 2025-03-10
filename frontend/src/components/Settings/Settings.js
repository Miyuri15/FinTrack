import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout";

const Settings = () => {
      const { user } = useAuth(); // Get the logged-in user from the context
    
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/categories", {
        name: newCategory,
        limit: newLimit,
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
      setNewLimit("");
      Swal.fire("Success!", "Category added successfully!", "success");
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire("Error!", "Failed to add category.", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      Swal.fire("Success!", "Category deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error!", "Failed to delete category.", "error");
    }
  };

  return (
    <Layout isAdmin={true}>
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Manage Categories</h2>
      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="number"
            placeholder="Limit"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Add Category
        </button>
      </form>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category._id} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-800 dark:text-white">{category.name} - Limit: {category.limit}</span>
            <button
              onClick={() => handleDeleteCategory(category._id)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default Settings;