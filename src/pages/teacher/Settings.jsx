import React, { useState, useEffect, useRef } from "react";
import {
  Loader2,
  X,
  Copyright,
  Save,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Lock,
  ShieldAlert,
  Plus,
  Trash2,
} from "lucide-react";
import axios from "axios";
import Header from "../../components/Header";
import { useUser } from "../../contexts/UserContext";

const PasswordResetModal = ({
  isOpen,
  onClose,
  onReset,
  resetting,
  passwords,
  setPasswords,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate minimum length for security
    if (passwords.newPassword.length < 6) {
      onReset(e, "New password must be at least 6 characters long!");
      return;
    }
    onReset(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Lock size={24} />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Security Update
        </h3>
        <p className="text-slate-500 text-sm mb-8">
          Confirm your current password to set a new one.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.oldPassword || ""}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 transition-all bg-slate-50/50"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPassword || ""}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 transition-all bg-slate-50/50"
              placeholder="Min. 6 characters"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword || ""}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:border-indigo-500 transition-all bg-slate-50/50"
              placeholder="Re-type new password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={resetting}
            className="w-full bg-slate-900 text-white font-bold py-5 mt-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {resetting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShieldAlert size={16} />
            )}
            {resetting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Displays success / error messages to the user
const StatusModal = ({ status, onClose }) => {
  if (!status || !status.text) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-6 max-w-[280px] w-full shadow-2xl text-center">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${status.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={32} />
          ) : (
            <AlertCircle size={32} />
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {status.type === "success" ? "Success!" : "Error"}
        </h3>
        <p className="text-slate-500 text-[11px] leading-relaxed mb-6">
          {status.text}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-[9px] uppercase tracking-widest text-white bg-slate-900 active:scale-95 transition-transform"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const TeacherSettings = () => {
  const { user, setUser } = useUser();
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNum: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetting, setResetting] = useState(false);

  const fileInputRef = useRef(null);
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3301";

  const getErrorMessage = (error) =>
    error.response?.data?.message ||
    error.message ||
    "Action failed. Please try again.";

  // Fetch teacher profile information
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/teacher/profile`, {
          withCredentials: true,
        });
        if (res.data) setTeacherData(res.data);
      } catch (error) {
        setStatus({ type: "error", text: getErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API_BASE_URL]);

  // Handles profile image selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setStatus({ type: "error", text: "Image size should be less than 2MB" });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setUpdating(true);
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/teacher/update-avatar`,
          { image: reader.result },
          { withCredentials: true },
        );
        if (res.data.success) {
          const newAvatar = res.data.avatar;
          setTeacherData((prev) => ({ ...prev, avatar: newAvatar }));
          if (setUser) setUser({ ...user, avatar: newAvatar });
          setStatus({ type: "success", text: "Profile picture updated!" });
        }
      } catch (error) {
        setStatus({ type: "error", text: getErrorMessage(error) });
      } finally {
        setUpdating(false);
      }
    };
  };

  // Handles removal of the current profile picture
  const handleDeleteAvatar = async (e) => {
    e.stopPropagation();
    setUpdating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/teacher/update-avatar`,
        { image: "" },
        { withCredentials: true },
      );
      if (res.data.success) {
        setTeacherData((prev) => ({ ...prev, avatar: "" }));
        if (setUser) setUser((prev) => ({ ...prev, avatar: "" }));
        setStatus({ type: "success", text: "Profile picture removed!" });
      }
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error) });
    } finally {
      setUpdating(false);
    }
  };

  // Handles general profile info updates
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/teacher/update-profile`,
        {
          name: teacherData.name,
          phoneNum: teacherData.phoneNum,
          address: teacherData.address,
        },
        { withCredentials: true },
      );
      if (res.data?.success) {
        setStatus({ type: "success", text: "Profile updated successfully!" });
        if (setUser) setUser({ ...user, name: teacherData.name });
        setIsEditing(false);
      }
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error) });
    } finally {
      setUpdating(false);
    }
  };

  // Handles password reset API request
  const handlePasswordReset = async (e, validationMsg = null) => {
    if (e) e.preventDefault();
    if (validationMsg) {
      setStatus({ type: "error", text: validationMsg });
      return;
    }
    setResetting(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/teacher/reset-password`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true },
      );
      if (res.data?.success) {
        setStatus({ type: "success", text: res.data.message });
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setIsPwModalOpen(false);
      }
    } catch (error) {
      setStatus({ type: "error", text: getErrorMessage(error) });
    } finally {
      setResetting(false);
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
      {/* UI Modal Components */}
      <StatusModal
        status={status}
        onClose={() => setStatus({ type: "", text: "" })}
      />
      <PasswordResetModal
        isOpen={isPwModalOpen}
        onClose={() => setIsPwModalOpen(false)}
        onReset={handlePasswordReset}
        resetting={resetting}
        passwords={passwords}
        setPasswords={setPasswords}
      />

      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-grow">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-400 w-full relative">
            <div className="absolute -bottom-12 left-10">
              <div className="relative group">
                {/* Main Avatar Display */}
                <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-2xl border border-white/50 overflow-hidden relative">
                  <div className="w-full h-full bg-slate-100 rounded-[1.4rem] flex items-center justify-center text-indigo-600 overflow-hidden relative">
                    {teacherData.avatar ? (
                      <>
                        <img
                          src={teacherData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-rose-600/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer backdrop-blur-sm"
                          onClick={handleDeleteAvatar}
                        >
                          <Trash2 size={18} className="text-white" />
                          <span className="text-[9px] text-white font-bold uppercase">
                            Remove
                          </span>
                        </div>
                      </>
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                </div>

                {/* Hidden File Input Trigger Button */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-xl border-2 border-white shadow-lg hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all z-20"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          <div className="pt-16 px-10 pb-10">
            {/* User Intro Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {teacherData.name || "Teacher"}
                </h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                  <Mail size={14} /> {teacherData.email}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${isEditing ? "bg-rose-50 text-rose-600" : "bg-slate-900 text-white shadow-md hover:shadow-lg active:scale-95"}`}
                >
                  {isEditing ? "Cancel Edit" : "Edit Details"}
                </button>
                {!isEditing && (
                  <button
                    onClick={() => setIsPwModalOpen(true)}
                    className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
                  >
                    Do you want to reset password?
                  </button>
                )}
              </div>
            </div>

            {/* Profile Information Form */}
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={teacherData.name || ""}
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
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={teacherData.phoneNum || ""}
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
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    rows="3"
                    value={teacherData.address || ""}
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
              {isEditing && (
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {updating ? "Saving Profile..." : "Save Changes"}
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
