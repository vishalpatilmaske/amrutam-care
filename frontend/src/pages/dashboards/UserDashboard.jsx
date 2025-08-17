import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllDoctors } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const allDoctors = useSelector((state) => state.auth.allDoctors);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");

  // Fetch doctors on mount
  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  // Get unique specializations for filter dropdown
  const specializations = [
    "all",
    ...new Set(allDoctors.map((doctor) => doctor.specialization)),
  ];

  // Filter and search doctors
  const filteredDoctors = allDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedSpecialization === "all" ||
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or specialization"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="w-full md:w-1/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec === "all" ? "All Specializations" : spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.userId.name}
              </h2>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-500 text-sm mt-1">{doctor.bio}</p>
              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-medium">Experience:</span>{" "}
                  {doctor.experience} years
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Fee:</span> ₹
                  {doctor.consultationFee}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mode:</span> {doctor.mode}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span> {doctor.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Clinic:</span>{" "}
                  {doctor.clinicAddress}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate("/user/book-appointment", {
                    state: { doctor: doctor },
                  })
                }
                className="cursor-pointer mt-4 w-full bg-[#3a643b] text-white py-2 rounded-lg  transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No doctors found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
