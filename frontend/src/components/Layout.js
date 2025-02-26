// components/Layout.js
import React from "react";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";

const Layout = ({ children, isAdmin, username }) => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-gray-900 text-text-light dark:text-white">
      <MenuBar isAdmin={isAdmin} />
      <div className="flex-grow">
        <Navbar username={username} />
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;