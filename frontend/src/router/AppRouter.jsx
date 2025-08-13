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

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/auth" />;
  }
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/auth" />;
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
        navigate("/admin-dashboard");
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
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
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
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
