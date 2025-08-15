import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">
        {user?.role === "admin"
          ? "Welcome Admin Dashbord"
          : "Welcome Doctor Dashborad"}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
