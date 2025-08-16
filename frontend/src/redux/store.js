import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import doctorReducer from "./doctorSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
  },
});
