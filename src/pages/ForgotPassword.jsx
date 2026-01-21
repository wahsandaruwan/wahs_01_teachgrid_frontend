import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TechGridLogo from "../assets/TechGrid.png";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputRefs = useRef([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3301";

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Verification code sent!");
        setStep(2);
      } else {
        toast.error(data.message || "Email not found");
      }
    } catch (err) {
      console.error("Send OTP Error:", err);
      toast.error("Network error. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  // Local Verification 
  const handleVerifyOtp = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      return toast.error("Please enter the 6-digit code");
    }

    setIsOtpVerified(true);
    toast.success("Code entered! Now set your new password.");
  };

  // Final Reset
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otp.join(""),
          newPassword: newPassword,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Password updated successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP or request expired");
      }
    } catch (err) {
      console.error("Reset Error:", err);
      toast.error("Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 font-sans">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center p-2 mb-3 border border-slate-100">
          <img
            src={TechGridLogo}
            alt="TechGrid"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">TeachGrid</h2>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1
              ? "Forgot Password?"
              : isOtpVerified
                ? "Set New Password"
                : "Verify Reset Code"}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {step === 1
              ? "Enter your email and we'll send you a reset code."
              : isOtpVerified
                ? "Choose a strong password for your account."
                : `A 6-digit code has been sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="e.g. user@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:bg-slate-300"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* OTP Section */}
            <div
              className={`flex justify-between gap-2 ${isOtpVerified ? "opacity-40 pointer-events-none" : ""}`}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              ))}
            </div>

            {!isOtpVerified ? (
              <button
                onClick={handleVerifyOtp}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                Verify Reset Code
              </button>
            ) : (
              /* Password Reset Form */
              <form
                onSubmit={handleResetPassword}
                className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wider">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:bg-slate-300"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            {!isOtpVerified && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  Entered wrong email?{" "}
                  <span className="underline">Change email</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
