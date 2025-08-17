import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDoctor, resetAuthState } from "../../redux/authSlice";

const CreateDoctor = () => {
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    mode: "online",
    experience: "",
    consultationFee: "",
    bio: "",
    phone: "",
    clinicAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(resetAuthState());

    // Basic client-side validation
    const requiredFields = [
      "name",
      "email",
      "password",
      "specialization",
      "mode",
      "experience",
      "consultationFee",
      "phone",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        dispatch({
          type: "auth/createDoctor/rejected",
          payload: `Please fill in the ${field} field.`,
        });
        return;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      dispatch({
        type: "auth/createDoctor/rejected",
        payload: "Please enter a valid email address.",
      });
      return;
    }

    // Validate experience and consultationFee as numbers
    if (isNaN(formData.experience) || formData.experience < 0) {
      dispatch({
        type: "auth/createDoctor/rejected",
        payload: "Experience must be a valid number.",
      });
      return;
    }
    if (isNaN(formData.consultationFee) || formData.consultationFee < 0) {
      dispatch({
        type: "auth/createDoctor/rejected",
        payload: "Consultation fee must be a valid number.",
      });
      return;
    }

    // Dispatch createDoctor thunk
    dispatch(createDoctor(formData));
  };

  // Reset form on successful creation
  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        mode: "online",
        experience: "",
        consultationFee: "",
        bio: "",
        phone: "",
        clinicAddress: "",
      });
      // Optionally reset auth state after a delay to clear success message
      const timer = setTimeout(() => {
        dispatch(resetAuthState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#3a643b]">
        Create Doctor Profile
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="name"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="email"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="password"
          >
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
          />
        </div>

        {/* Specialization */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="specialization"
          >
            Specialization *
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
          />
        </div>

        {/* Consultation Mode */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="mode"
          >
            Consultation Mode *
          </label>
          <select
            id="mode"
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
          >
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="experience"
          >
            Experience (Years) *
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
            min="0"
          />
        </div>

        {/* Consultation Fee */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="consultationFee"
          >
            Consultation Fee ($) *
          </label>
          <input
            type="number"
            id="consultationFee"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
            min="0"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="phone"
          >
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            required
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
            rows="4"
          ></textarea>
        </div>

        {/* Clinic Address */}
        <div className="md:col-span-2">
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="clinicAddress"
          >
            Clinic Address
          </label>
          <input
            type="text"
            id="clinicAddress"
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3a643b]"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3a643b] hover:bg-[#2e4f2e]"
            }`}
          >
            {loading ? "Creating..." : "Create Doctor Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDoctor;
