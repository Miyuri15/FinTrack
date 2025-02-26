import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiClipboard, FiCreditCard, FiBarChart, FiUsers, FiFileText, FiLogOut } from "react-icons/fi";

const MenuBar = ({ isAdmin }) => {
  return (
<aside className="w-64 bg-[#eef3f6] dark:bg-gray-900 text-text-light dark:text-white h-min-screen p-4 shadow-md">
  {/* <h2 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-8">FinTrack</h2> */}
  <ul className="space-y-4">
    <MenuItem
        to={isAdmin ? "/admindashboard" : "/userdashboard"}
        icon={<FiHome />}
        text="Dashboard"
      />
    {!isAdmin &&<MenuItem to="/budget-planning" icon={<FiClipboard />} text="Budget Planning" />}
    <MenuItem to="/transactions" icon={<FiCreditCard />} text="Transactions" />
    <MenuItem to="/reports" icon={<FiFileText />} text="Reports" />
    <MenuItem to="/analytics" icon={<FiBarChart />} text="Analytics" />
    {isAdmin && <MenuItem to="/admin/users" icon={<FiUsers />} text="All Users" />}
    <MenuItem to="/logout" icon={<FiLogOut />} text="LogOut" />

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
