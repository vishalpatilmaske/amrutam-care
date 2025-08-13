import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, resetAuthState } from "../../redux/authSlice";

const initial = { name: "", email: "", password: "" };

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initial);
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector(
    (state) => state.auth
  );

  // handel changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        await dispatch(registerUser({ ...form })).unwrap();
        setMode("login");
      } else {
        await dispatch(
          loginUser({ email: form.email, password: form.password })
        ).unwrap();
      }
      setForm(initial);
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setForm(initial);
    dispatch(resetAuthState());
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur shadow-2xl rounded-3xl px-8 py-14 flex flex-col justify-center transition-all">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center drop-shadow-md">
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border border-green-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border border-green-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border border-green-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-gradient-to-r from-green-500 to-yellow-400 text-white rounded-xl py-3 text-xl font-bold mt-4 shadow-md transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
          }`}
        >
          {loading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Create Account"}
        </button>
        {error && (
          <p className="text-red-500 text-center text-sm mt-2">{error}</p>
        )}
        {success && message && (
          <p className="text-green-500 text-center text-sm mt-2">{message}</p>
        )}
      </form>
      <div className="text-md mt-8 text-green-700 text-center font-semibold">
        {mode === "login" ? (
          <>
            New to Amrutam Care?{" "}
            <button
              className="underline ml-1 transition-all hover:text-yellow-600"
              onClick={() => handleModeSwitch("signup")}
              type="button"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              className="underline ml-1 transition-all hover:text-yellow-600"
              onClick={() => handleModeSwitch("login")}
              type="button"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
