import React, { useState, useEffect } from "react";
import {
  Loader2,
  Edit3,
  X,
  Copyright,
  Phone,
  MapPin,
  Save,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import Header from "../../components/Header";

// --- Popup Modal Component
const StatusModal = ({ status, onClose }) => {
  if (!status.text) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${status.type === "success"
                ? "bg-emerald-50 text-emerald-500"
                : "bg-rose-50 text-rose-500"
              }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={44} />
            ) : (
              <AlertCircle size={44} />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {status.type === "success" ? "Great Success!" : "Oops! Error"}
          </h3>

          <p className="text-slate-500 text-sm mb-8">{status.text}</p>

          <button
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-white ${status.type === "success" ? "bg-emerald-500" : "bg-rose-500"
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherSettings = () => {
  // State variables for data and UI control
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNum: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3301";

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/teachers/profile`, {
          withCredentials: true,
        });
        if (res.data) setTeacherData(res.data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setStatus({
          type: "error",
          text: "Could not load profile. Please refresh.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API_BASE_URL]);

  // 2. Save Updated Profile Data to Database
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ type: "", text: "" });

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/teachers/update-profile`,
        {
          name: teacherData.name,
          phoneNum: teacherData.phoneNum,
          address: teacherData.address,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setStatus({
          type: "success",
          text: "Your profile has been updated successfully!",
        });
        setIsEditing(false);
      } else {
        throw new Error(res.data.message || "Failed to update");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Connection error.";
      console.error("Update Error:", error);
      setStatus({ type: "error", text: message });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
      <Header title="Account Settings" />

      <StatusModal
        status={status}
        onClose={() => setStatus({ type: "", text: "" })}
      />

      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-400 w-full relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-xl">
                <div className="w-full h-full bg-slate-100 rounded-[1.4rem] flex items-center justify-center text-indigo-600">
                  <User size={40} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-10 pb-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {teacherData.name || "Teacher"}
                </h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                  <Mail size={14} /> {teacherData.email}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest ${isEditing
                    ? "bg-rose-50 text-rose-600"
                    : "bg-slate-900 text-white"
                  }`}
              >
                {isEditing ? "Cancel" : "Edit Details"}
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={teacherData.name}
                      onChange={(e) =>
                        setTeacherData({ ...teacherData, name: e.target.value })
                      }
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-600"
                      required
                    />
                  ) : (
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700">
                      {teacherData.name}
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={teacherData.phoneNum}
                      onChange={(e) =>
                        setTeacherData({
                          ...teacherData,
                          phoneNum: e.target.value,
                        })
                      }
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-600"
                    />
                  ) : (
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700">
                      {teacherData.phoneNum || "N/A"}
                    </div>
                  )}
                </div>

                {/* Fixed Email View */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Email (Fixed)
                  </label>
                  <div className="px-5 py-3 bg-slate-100 rounded-2xl text-sm text-slate-400">
                    {teacherData.email}
                  </div>
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    rows="3"
                    value={teacherData.address}
                    onChange={(e) =>
                      setTeacherData({
                        ...teacherData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-600 resize-none"
                  />
                ) : (
                  <div className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700">
                    {teacherData.address || "Not provided"}
                  </div>
                )}
              </div>

              {/* Show Save Button */}
              {isEditing && (
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {updating ? "Saving..." : "Commit Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        <Copyright size={12} className="inline mr-1" />{" "}
        {new Date().getFullYear()} TEACHGRID.
      </footer>
    </div>
  );
};

export default TeacherSettings;
