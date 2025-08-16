import React from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/NavBar";
import { Outlet } from "react-router-dom";

const UserLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
