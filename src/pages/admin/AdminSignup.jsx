import React, { useState } from "react";
import TechGridLogo from "../../assets/TechGrid.png";

const AdminSignup = () => {
  // Use environment variable for API URL
  const apiUrl = import.meta.env.VITE_API_URL; 

  // States for form fields
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [showSuccessDialog, setShowSuccessDialog] = useState(false); 
  const [createdUserName, setCreatedUserName] = useState(""); 
  const [responseMessage, setResponseMessage] = useState("");
  const [emailSentStatus, setEmailSentStatus] = useState(true);

  // Error states
  const [errors, setErrors] = useState({}); 
  const [generalError, setGeneralError] = useState(""); 

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    setGeneralError(""); 

    // Role validation
    if (!role) newErrors.role = "Please select a role.";

    // Name validation
    if (!name) newErrors.name = "Name is required.";

    // Date of Birth validation
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";

    // Address validation
    if (!address) newErrors.address = "Address is required.";

    // Phone number validation
    if (!phoneNum) newErrors.phoneNum = "Contact Number is required.";
    else if (!/^\d+$/.test(phoneNum)) {
      newErrors.phoneNum = "Contact Number must contain only digits.";
    }

    // Email validation
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";

    // Password validation
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    // Subject validation: Only required if role is Teacher
    if (role.toLowerCase() === "teacher" && !subject) {
        newErrors.subject = "Please select an expertise subject.";
    }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // validate before sending
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError("");

    try {
      // Convert phone number to integer
      const phoneNumber = parseInt(phoneNum, 10);
      if (isNaN(phoneNumber)) {
        setErrors({ phoneNum: "Contact Number must be a valid number." });
        setLoading(false);
        return;
      }

      // Send POST request to API
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNum: phoneNumber,
          role: role.toLowerCase(),
          dateOfBirth,
          address,
          subjects: role.toLowerCase() === "teacher" ? [subject] : [],
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        // Show success dialog
        setCreatedUserName(name);
        setResponseMessage(data.message); 
        setEmailSentStatus(data.emailSent);
        setShowSuccessDialog(true);

        // Reset form fields
        setRole("");
        setName("");
        setDateOfBirth("");
        setAddress("");
        setPhoneNum("");
        setEmail("");
        setPassword("");
        setErrors({});
        setGeneralError("");
      } else {
        // Display API error message
        setGeneralError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoading(false);
      setGeneralError("Server connection failed. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E5F0FF] px-4 py-6">
      {/* Logo Section */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50 dark:bg-black">
          <img
            src={TechGridLogo}
            alt="TechGrid Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-black mt-2">TechGrid</h2>
        <p className="text-sm text-gray-500">Teacher Management System</p>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create User Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-4">
          Fill in the user's details to create an account
        </p>

        {/* Display general error if any */}
        {generalError && (
          <p className="text-red-500 text-sm mb-3 text-center">{generalError}</p>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.role ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
            >
              <option value="">Select Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter user's full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Subject Field - Only visible if Role is Teacher */}
          {role === "Teacher" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Expertise</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              >
                <option value="">Select Subject</option>
                {/* Use the same SUBJECT_OPTIONS you have in your Attendance component */}
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Geography">Geography</option>
                <option value="ICT">ICT</option>
                <option value="ART">ART</option>
                <option value="Music">Music</option>
                <option value="Health Education">Health Education</option>
                <option value="Civics">Civics</option>
                {/* ... other options */}
              </select>
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>
          )}

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter user's address"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.phoneNum ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter user's contact number (digits only)"
            />
            {errors.phoneNum && <p className="text-red-500 text-xs mt-1">{errors.phoneNum}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Enter user's email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 w-full px-3 py-2 bg-gray-100 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-black focus:outline-none`}
              placeholder="Set initial password for user"
            />
            {/* Toggle show/hide password */}
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
          <div className="text-center">
            {/* Dynamic Icon based on Email Status */}
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${emailSentStatus ? 'bg-green-100' : 'bg-amber-100'}`}>
              {emailSentStatus ? (
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-2xl">⚠️</span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {emailSentStatus ? "Success!" : "Action Required"}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {responseMessage}
            </p>

            <button
              onClick={() => setShowSuccessDialog(false)}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${emailSentStatus ? 'bg-black hover:bg-gray-800' : 'bg-amber-600 hover:bg-amber-700'}`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default AdminSignup;
