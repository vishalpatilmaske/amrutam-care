import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/authSlice";
import { FaUsers, FaUserMd, FaCalendarAlt, FaClock } from "react-icons/fa";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { allUsers, loading: usersLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Separate users by role
  const totalUsers = allUsers.filter((u) => u.role === "user").length;
  const totalDoctors = allUsers.filter((u) => u.role === "doctor").length;

  // Static appointments data (replace later with API)
  const appointments = [
    {
      patient: "John Doe",
      doctor: "Dr. Sharma",
      date: "2025-08-14",
      time: "10:00 AM",
      status: "Booked",
    },
    {
      patient: "Priya Singh",
      doctor: "Dr. Mehta",
      date: "2025-08-13",
      time: "2:30 PM",
      status: "Completed",
    },
    {
      patient: "Amit Verma",
      doctor: "Dr. Patel",
      date: "2025-08-12",
      time: "11:15 AM",
      status: "Cancelled",
    },
  ];

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FaUsers />,
      color: "#3a643b",
    },
    {
      title: "Total Doctors",
      value: totalDoctors,
      icon: <FaUserMd />,
      color: "#3a643b",
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <FaCalendarAlt />,
      color: "#3a643b",
    },
    {
      title: "Pending Appointments",
      value: appointments.filter((a) => a.status === "Booked").length,
      icon: <FaClock />,
      color: "#3a643b",
    },
  ];

  return (
    <div className="p-6 bg-[#fcfffc] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#3a643b]">
        Admin Dashboard
      </h1>

      {usersLoading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-5 flex items-center gap-4 border border-gray-100"
              >
                <div
                  className="p-4 rounded-full"
                  style={{ backgroundColor: stat.color, color: "#fff" }}
                >
                  {stat.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{stat.value}</h2>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Appointments */}
          <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-[#3a643b]">
              Recent Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-[#3a643b] text-white">
                    <th className="px-4 py-2 text-left">Patient</th>
                    <th className="px-4 py-2 text-left">Doctor</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{appt.patient}</td>
                      <td className="px-4 py-2">{appt.doctor}</td>
                      <td className="px-4 py-2">{appt.date}</td>
                      <td className="px-4 py-2">{appt.time}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          appt.status === "Booked"
                            ? "text-blue-600"
                            : appt.status === "Completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {appt.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
