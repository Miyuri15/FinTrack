import React from "react";
import { Link } from "react-router-dom";

const MenuBar = ({ isAdmin }) => {
  return (
    <div className="bg-blue-900 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">FinTrack</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="block hover:bg-blue-700 p-2 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/budget-planning" className="block hover:bg-blue-700 p-2 rounded">
            Budget Planning
          </Link>
        </li>
        <li>
          <Link to="/transactions" className="block hover:bg-blue-700 p-2 rounded">
            Transactions
          </Link>
        </li>
        <li>
          <Link to="/reports" className="block hover:bg-blue-700 p-2 rounded">
            Reports
          </Link>
        </li>
        <li>
          <Link to="/analytics" className="block hover:bg-blue-700 p-2 rounded">
            Analytics
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/admin/users" className="block hover:bg-blue-700 p-2 rounded">
              All Users
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MenuBar;