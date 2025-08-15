import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/authSlice";
import AuthPage from "../pages/auth/AuthPage";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import UserDashboard from "../pages/dashboards/UserDashboard";
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import UserLayout from "../layouts/UserLayout";
import ManageDoctors from "../pages/admin/ManageDoctors";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageAppointments from "../pages/admin/ManageAppointments";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  // Restore session on mount
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && location.pathname === "/auth") {
      const role = user.role;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "user") {
        navigate("/user-dashboard");
      }
    }
  }, [user, location.pathname, navigate]);

  return null;
};

const AppRouter = () => {
  return (
    <Router>
      <AppContent />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-doctors" element={<ManageDoctors />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="appointments" element={<ManageAppointments />} />
        </Route>
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute allowedRoles={["doctor"]}>
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
