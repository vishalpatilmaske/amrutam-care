import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getMyDoctorProfile = createAsyncThunk(
  "doctor/getMyDoctorProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/doctor/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.doctor;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctor profile"
      );
    }
  }
);

export const getMyAvailability = createAsyncThunk(
  "doctor/getMyAvailability",
  async (date = "", { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const params = date ? { date } : {};
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/doctor/availability`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      console.log(response.data);
      return response.data.availability;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch availability"
      );
    }
  }
);

export const addSlots = createAsyncThunk(
  "doctor/addSlots",
  async ({ date, slots }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/doctor/slots`,
        { date, slots },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.availability;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add slots"
      );
    }
  }
);

export const deleteSlot = createAsyncThunk(
  "doctor/deleteSlot",
  async ({ date, slotId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/doctor/slots/${date}/${slotId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { date, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete slot"
      );
    }
  }
);

export const getDoctorAvailableSlotsForUsers = createAsyncThunk(
  "doctor/getDoctorAvailableSlotsForUsers",
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/doctor/available-slots/${doctorId}`,
        { params: { date } }
      );
      return response.data.slots;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch available slots"
      );
    }
  }
);

const initialState = {
  doctorProfile: null,
  availability: [],
  availableSlots: [],
  loading: false,
  error: null,
  success: false,
  message: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    resetDoctorState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET MY DOCTOR PROFILE
      .addCase(getMyDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorProfile = action.payload;
      })
      .addCase(getMyDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET MY AVAILABILITY
      .addCase(getMyAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(getMyAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD SLOTS
      .addCase(addSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.availability = action.payload;
        state.message = "Slots added successfully";
      })
      .addCase(addSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // DELETE SLOT
      .addCase(deleteSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        // Update availability state (remove the deleted slot)
        const { date } = action.payload;
        state.availability = state.availability.map((day) =>
          day.date === date
            ? {
                ...day,
                slots: day.slots.filter(
                  (s) => `${s._id}` !== action.meta.arg.slotId
                ),
              }
            : day
        );
      })
      .addCase(deleteSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // GET DOCTOR AVAILABLE SLOTS FOR USERS
      .addCase(getDoctorAvailableSlotsForUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorAvailableSlotsForUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload;
      })
      .addCase(getDoctorAvailableSlotsForUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
