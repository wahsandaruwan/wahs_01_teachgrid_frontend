import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TechGridLogo from "../components/TechGrid.png";

const SignInPage = () => {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [loading, setLoading] = useState(false);

  // Error states for specific fields
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Password validation rule
  const isValidPassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Validate form
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
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "Password must have 8+ chars, 1 uppercase, 1 number, and 1 special symbol."
      );
      valid = false;
    }

    return valid;
  };

 
  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "teacher") {
          navigate("/teacher-dashboard");
        } else if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          setGeneralError("Unknown role. Please contact support.");
        }
      } else {
        setGeneralError(data.error?.message || "Invalid credentials.");
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

          

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
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
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Forgot password available only for{" "}
            <span className="text-indigo-600 font-medium">Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
