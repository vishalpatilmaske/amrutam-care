import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const AvailabilitySlots = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const [date, setDate] = useState("2025-08-16");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [slots, setSlots] = useState([]);
  const dispatch = useDispatch();

  const fetchDay = async () => {
    if (!date) return;
    const { data } = await axios.get(`${API}/doctors/me/availability`, {
      params: { date },
      headers: { Authorization: `Bearer ${token}` },
    });
    setSlots(data.availability?.slots || []);
  };

  useEffect(() => {
    fetchDay();
  }, [date]);

  const addSlot = async (e) => {
    e.preventDefault();
    if (!date || !time) return;
    await axios.post(
      `${API}/doctors/me/availability/slots`,
      { date, slots: [{ time, duration: Number(duration) }] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTime("");
    await fetchDay();
  };

  const deleteSlot = async (slotId) => {
    await axios.delete(
      `${API}/doctors/me/availability/slots/${date}/${slotId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchDay();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#3a643b] mb-6">
        Manage Availability
      </h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm text-gray-600 mb-1">Select Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <form
        onSubmit={addSlot}
        className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Time (e.g., 09:00 AM)
          </label>
          <input
            type="text"
            placeholder="09:00 AM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            {[30, 60, 90, 120].map((d) => (
              <option key={d} value={d}>
                {d} min
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-[#3a643b] text-white px-4 py-2 rounded"
          >
            Add Slot
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Slots on {date || "—"}</h2>
        {!date ? (
          <p className="text-gray-500">Pick a date to view slots.</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500">No slots for this date.</p>
        ) : (
          <ul className="divide-y">
            {slots.map((s) => (
              <li
                key={s._id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {s.time} · {s.duration} min
                  </p>
                  <p className="text-sm">
                    {s.isBooked ? (
                      <span className="text-red-600">Booked</span>
                    ) : s.lockedUntil ? (
                      <span className="text-amber-600">Locked</span>
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </p>
                </div>
                {!s.isBooked && (
                  <button
                    onClick={() => deleteSlot(s._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AvailabilitySlots;
