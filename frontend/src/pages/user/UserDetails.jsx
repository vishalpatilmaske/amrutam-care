import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
  const { id: doctorId } = useParams();
  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [otpStep, setOtpStep] = useState(false);

  const loadSlots = async () => {
    const { data } = await axios.get(
      `${API}/doctors/${doctorId}/availability`,
      {
        params: { date },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSlots(data.slots || []);
  };

  useEffect(() => {
    loadSlots(); /* eslint-disable-next-line */
  }, [date, doctorId]);

  const lockSlot = async (slot) => {
    const { data } = await axios.post(
      `${API}/appointments/lock`,
      {
        doctorId,
        date,
        time: slot.time,
        duration: slot.duration,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.status) {
      setSelected(slot);
      setOtpStep(true); // mock OTP step
    } else {
      alert(data.message || "Failed to lock slot");
      loadSlots();
    }
  };

  const confirm = async () => {
    const { data } = await axios.post(
      `${API}/appointments/confirm`,
      {
        doctorId,
        date,
        time: selected.time,
        duration: selected.duration,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (data.status) {
      alert("Appointment booked!");
      setOtpStep(false);
      setSelected(null);
      loadSlots();
    } else {
      alert(data.message || "Failed to confirm");
    }
  };

  const cancelLock = async () => {
    if (!selected) return;
    await axios.post(
      `${API}/appointments/release`,
      {
        doctorId,
        date,
        time: selected.time,
        duration: selected.duration,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOtpStep(false);
    setSelected(null);
    loadSlots();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#3a643b] mb-6">Doctor Details</h1>

      <div className="bg-white rounded shadow p-4 mb-4">
        <label className="block text-sm text-gray-600 mb-1">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Available Slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-500">No free slots for this date.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {slots.map((s) => (
              <button
                key={s._id}
                onClick={() => lockSlot(s)}
                className="border rounded px-3 py-2 hover:bg-[#3a643b] hover:text-white"
              >
                {s.time} • {s.duration}m
              </button>
            ))}
          </div>
        )}
      </div>

      {otpStep && selected && (
        <div className="mt-4 bg-white rounded shadow p-4">
          <p className="mb-3">
            We’ve locked <b>{selected.time}</b> for{" "}
            <b>{selected.duration} min</b>. Enter mock OTP to confirm (or just
            click Confirm).
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirm}
              className="bg-[#3a643b] text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
            <button onClick={cancelLock} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
