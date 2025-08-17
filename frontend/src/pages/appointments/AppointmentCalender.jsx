import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Assuming axios for API calls

const FarmerSchedulerUI = () => {
  const location = useLocation();
  const { doctor } = location.state || {};
  const [currentMonth, setCurrentMonth] = useState(new Date("2025-08-17")); // Start with August 17, 2025
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingState, setBookingState] = useState(null); // null, "locking", "confirming", "booked", "released"

  const dispatch = useDispatch();

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDeleteConfirm = () => {
    setOperationToDelete(null);
  };

  const handleLockSlot = async (slot) => {
    if (doctor && slot && !slot.isBooked) {
      setBookingState("locking");
      setSelectedSlot(slot);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/appointment/lock`,
          {
            doctorId: doctor._id,
            date: slot.date,
            time: slot.time.trim(),
            duration: slot.duration,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Adjust auth as needed
          }
        );
        if (response.data.status) {
          setBookingState("confirming");
          // Simulate a confirmation code (replace with actual backend response if it provides one)
          const confirmationCode = "ABC123";
          alert(
            `Slot locked for 5 minutes. Confirmation code: ${confirmationCode}. Please confirm within 5 minutes.`
          );
        } else {
          alert(response.data.message);
          setBookingState(null);
        }
      } catch (error) {
        console.log(error);
        alert("Failed to lock slot. Please try again.");
        setBookingState(null);
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedSlot && bookingState === "confirming") {
      try {
        const response = await axios.post(
          "/api/confirm-booking",
          {
            doctorId: doctor._id,
            date: selectedSlot.date,
            time: selectedSlot.time.trim(),
            duration: selectedSlot.duration,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.status) {
          setBookingState("booked");
          alert("Appointment confirmed successfully!");
          setSelectedSlot(null);
          // Optionally refresh doctor data or navigate
        } else {
          alert(response.data.message);
          handleReleaseSlot(); // Release if confirmation fails
        }
      } catch (error) {
        alert("Failed to confirm booking. Slot released.");
        handleReleaseSlot();
      }
    }
  };

  const handleReleaseSlot = async () => {
    if (selectedSlot && bookingState === "confirming") {
      try {
        const response = await axios.post(
          "/api/release-slot",
          {
            doctorId: doctor._id,
            date: selectedSlot.date,
            time: selectedSlot.time.trim(),
            duration: selectedSlot.duration,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.status) {
          setBookingState("released");
          alert("Slot released.");
          setSelectedSlot(null);
        }
      } catch (error) {
        alert("Failed to release slot.");
      }
    }
  };

  const currentMonthStr = currentMonth.toISOString().slice(0, 7); // YYYY-MM (e.g., "2025-08")
  const availableSlots =
    doctor?.availability
      ?.filter((day) => day.date.startsWith(currentMonthStr))
      .flatMap((day) =>
        day.slots
          .filter((slot) => !slot.isBooked)
          .map((slot) => ({
            ...slot,
            date: day.date,
            id: slot._id,
          }))
      ) || [];

  const daysWithSlots =
    doctor?.availability
      ?.filter((day) => day.date.startsWith(currentMonthStr))
      .map((day) => new Date(day.date).getDate()) || [];

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const totalDays = lastDay.getDate();
  const firstDayIndex = firstDay.getDay();

  return (
    <div className="h-screen bg-[#344e41] text-white p-4 overflow-y-auto">
      {/* Header + Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="bg-white text-[#344e41] px-4 py-2 rounded-md text-lg font-bold shadow hover:bg-gray-200"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="bg-white text-[#344e41] px-4 py-2 rounded-md text-lg font-bold shadow hover:bg-gray-200"
        >
          →
        </button>
      </div>

      {/* Calendar with Available Slots Highlight */}
      <div className="bg-[#5a7c6b] rounded-xl shadow-inner p-4 mb-8">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold p-2 bg-[#344e41]">
              {day}
            </div>
          ))}
          {Array.from({ length: 42 }, (_, index) => {
            const d = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              1
            );
            d.setDate(1 - d.getDay() + index);
            const dayNum = d.getDate();
            const isCurrentMonth = d.getMonth() === currentMonth.getMonth();
            const hasSlot = isCurrentMonth && daysWithSlots.includes(dayNum);

            return (
              <div
                key={index}
                className={`p-2 ${
                  isCurrentMonth ? "bg-[#5a7c6b]" : "bg-gray-600"
                } hover:bg-green-600 cursor-pointer ${
                  hasSlot ? "bg-yellow-600" : ""
                }`}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Doctor Info and Slots */}
      <div className="px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{doctor?.userId.name}</h2>
          <p className="text-gray-300">
            {doctor?.specialization} - {doctor?.mode}
          </p>
          <p className="text-sm text-gray-400">{doctor?.bio}</p>
          <p className="text-gray-300">Fee: ₹{doctor?.consultationFee}</p>
          <p className="text-gray-300">Clinic: {doctor?.clinicAddress}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg
              className="text-white text-6xl"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l-2 2h-4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4l-2-2z"></path>
              <path d="M12 2v4h4M6 10h12M6 14h12M6 18h12"></path>
            </svg>
            <h2 className="text-3xl font-bold">Available Slots</h2>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrevMonth}
              className="bg-white text-[#344e41] px-3 py-1 rounded-md font-semibold shadow hover:bg-gray-200"
            >
              ←
            </button>
            <span className="text-xl font-medium">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={handleNextMonth}
              className="bg-white text-[#344e41] px-3 py-1 rounded-md font-semibold shadow hover:bg-gray-200"
            >
              →
            </button>
          </div>
        </div>

        <div className="bg-[#294036] rounded-xl shadow-lg p-6">
          {availableSlots.length === 0 ? (
            <p className="text-center text-lg">
              No available slots for this month.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gradient-to-br from-[#5a7c6b] to-[#3d5d50] hover:from-[#4b6b5a] hover:to-[#2e473c] text-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.03] min-h-[130px] relative"
                >
                  <div className="text-base font-semibold mb-1">
                    {slot.time.trim()} - {slot.duration} mins
                  </div>
                  <div className="text-xs leading-tight">
                    <span className="font-semibold">Date:</span> {slot.date}
                  </div>
                  <button
                    onClick={() => handleLockSlot(slot)}
                    className="mt-4 w-full bg-[#3a643b] text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    disabled={slot.isBooked || bookingState === "locking"}
                  >
                    {bookingState === "locking" && selectedSlot?.id === slot.id
                      ? "Locking..."
                      : slot.isBooked
                      ? "Booked"
                      : "Book Appointment"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {bookingState === "confirming" && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-[#344e41]">
              Confirm Appointment
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Slot locked for 5 minutes. Please confirm your booking. Enter
              confirmation code (if required) or click confirm.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReleaseSlot}
                className="px-4 py-2 bg-gray-300 text-[#344e41] font-semibold rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {operationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-[#344e41]">
              Delete Operation?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this operation?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOperationToDelete(null)}
                className="px-4 py-2 bg-gray-300 text-[#344e41] font-semibold rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerSchedulerUI;
