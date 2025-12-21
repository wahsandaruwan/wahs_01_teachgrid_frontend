import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import TechGridLogo from "../assets/TechGrid.png";
import { useUser } from "../contexts/UserContext"; 

const SignInPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUser(); 

  // Backend URL 
 const apiUrl = "http://localhost:3301";


  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
        credentials: "include", // required so the http-only JWT cookie is set
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        const roleFromBackend = data.role?.toLowerCase();

        if (roleFromBackend && roleFromBackend !== role.toLowerCase()) {
          setGeneralError("Selected role does not match your account role.");
          return;
        }

        // Hydrate the user context from the backend profile
        let userFromDb = null;
        try {
          userFromDb = await refreshUser();
        } catch (err) {
          console.error("Failed to refresh user after login", err);
        }

        if (!userFromDb) {
          setGeneralError("Unable to load your profile. Please try again.");
          return;
        }

        // Navigate based on the authoritative role from the database
        const finalRole = (userFromDb.role || roleFromBackend || "").toLowerCase();
        if (finalRole === "teacher") navigate("/teacher/dashboard");
        else if (finalRole === "admin") navigate("/admin/dashboard");
        else navigate("/");
      } else {
        let message = data.message || "Login failed. Please try again.";
        if (message.toLowerCase().includes("email")) message = "Invalid email! User not found.";
        if (message.toLowerCase().includes("password")) message = "Invalid password!";
        setGeneralError(message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      setGeneralError("Server connection failed. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E5F0FF] px-4 py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 flex items-center justify-center">
          <img src={TechGridLogo} alt="TechGrid Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-3xl font-bold text-black mt-2">TechGrid</h2>
        <p className="text-sm text-gray-500">Teacher Management System</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Enter your credentials to access your dashboard
        </p>

        {generalError && (
          <p className="text-red-500 text-sm mb-3 text-center">{generalError}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your email"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9c2.14 0 4.11.67 5.75 1.8M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </span>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default SignInPage;