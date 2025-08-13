import React from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/NavBar";

const DoctorLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      {/* <DoctorSidebar /> */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DoctorLayout;
