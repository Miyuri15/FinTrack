import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiCreditCard,
  FiBarChart,
  FiUsers,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const MenuBar = ({ isAdmin }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate(); // For redirecting after logout

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside className="w-64 bg-[#eef3f6] dark:bg-gray-900 text-text-light dark:text-white h-min-screen p-4 shadow-md">
      <ul className="space-y-4">
        <MenuItem
          to={isAdmin ? "/admindashboard" : "/userdashboard"}
          icon={<FiHome />}
          text="Dashboard"
        />
        {!isAdmin && (
          <MenuItem
            to="/budget"
            icon={<FiClipboard />}
            text="Budget Planning"
          />
        )}
        <MenuItem
          to={isAdmin ? "/adminTransactions" : "/userTransactions"}
          icon={<FiCreditCard />}
          text="Transactions"
        />
        <MenuItem to="/reports" icon={<FiFileText />} text="Reports" />
        <MenuItem to="/analytics" icon={<FiBarChart />} text="Analytics" />
        {isAdmin && (
          <MenuItem to="/admin/users" icon={<FiUsers />} text="All Users" />
        )}
        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium transition-all duration-300
                      hover:bg-blue-800 hover:text-white dark:hover:bg-blue-400 w-full text-left"
          >
            <FiLogOut />
            <span>LogOut</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

const MenuItem = ({ to, icon, text }) => {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium transition-all duration-300
                  hover:bg-blue-800 hover:text-white dark:hover:bg-blue-400"
      >
        {icon}
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default MenuBar;