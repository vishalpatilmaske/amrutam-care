import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const commonClasses =
    "block px-4 py-2 rounded-md transition-colors duration-200 hover:bg-[#3a643b] hover:text-white";
  const activeClasses = "bg-[#3a643b] text-white font-semibold";

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Manage Doctors", path: "/admin/manage-doctors" },
      { name: "Manage Users", path: "/admin/manage-users" },
      { name: "Appointments", path: "/admin/appointments" },
    ],
    doctor: [
      { name: "Dashboard", path: "/doctor" },
      { name: "My Appointments", path: "/doctor/appointments" },
      { name: "Manage Availability", path: "/doctor/availability" },
    ],
    user: [
      { name: "Dashboard", path: "/user" },
      { name: "My Appointments", path: "/user/appointments" },
      { name: "Doctors", path: "/user/doctors" },
    ],
  };

  return (
    <div
      className="h-screen w-64 p-4"
      style={{ backgroundColor: "#fcfffc", borderRight: "1px solid #e5e7eb" }}
    >
      <h2 className="text-xl font-bold mb-6 text-[#3a643b]">Amrutam Care</h2>

      <nav className="flex flex-col gap-2">
        {menuItems[user?.role]?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${commonClasses} ${isActive ? activeClasses : "text-gray-700"}`
            }
            end={item.path === "/admin"}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
