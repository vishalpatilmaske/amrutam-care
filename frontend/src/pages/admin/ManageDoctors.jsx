import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors, resetAuthState } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const ManageDoctors = () => {
  const dispatch = useDispatch();
  const { allDoctors, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllDoctors());
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#3a643b]">Manage Doctors</h2>
        <button
          onClick={() => navigate("/admin/create-doctor")}
          className="bg-[#3a643b] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2f4f2f] transition cursor-pointer"
        >
          Create Doctor Profile
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Loading doctors...</div>
      ) : allDoctors.length === 0 ? (
        <div className="text-center text-gray-600">No doctors found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-[#3a643b] mb-2">
                {doctor.userId.name}
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Specialization:</span>{" "}
                {doctor.specialization}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Experience:</span>{" "}
                {doctor.experience} years
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
