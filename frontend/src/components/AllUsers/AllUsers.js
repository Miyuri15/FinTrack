import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Layout from "../Layout";
import { FiUserX, FiUserCheck } from "react-icons/fi";

export default function AllUsers() {
  const { user } = useAuth(); // Get the logged-in user from the context
  const [users, setUsers] = useState([]); // State to store all users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/all", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, [user.token]);


const handleRestrictUser = async (userId, isRestricted) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/auth/${userId}/restrict`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isRestricted: !isRestricted }),
      }
    );

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, isRestricted: !isRestricted } : u
        )
      );
    } else {
      setError("Failed to update user status");
    }
  } catch (error) {
    setError("Error updating user status");
  }
};


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout isAdmin={true}>
      <div className="p-8 bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
        <h1 className="text-2xl font-bold mb-6">All Users</h1>

        {/* Users Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-3 border">{user.username}</td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.role}</td>
                <td className="p-3 border">
                  <button
                    onClick={() =>
                      handleRestrictUser(user._id, user.isRestricted)
                    }
                    className={`flex items-center gap-2 p-2 rounded justify-center ${
                      user.isRestricted
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    {user.isRestricted ? (
                      <>
                        <FiUserCheck />
                        <span>Unrestrict</span>
                      </>
                    ) : (
                      <>
                        <FiUserX />
                        <span>Restrict</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}