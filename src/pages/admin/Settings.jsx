import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext"; 
import {
  Trash2,
  Loader2,
  Search,
  Mail,
  X,
  Lock,
  Plus,
  Save,
  AlertCircle,
  User,
  CheckCircle2,
  KeyRound,
  MapPin,
  Phone,
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); 
  
  // State for storing admin profile data
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phoneNum: "",
    address: "",
    avatar: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "", show: false });
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [tempAdminData, setTempAdminData] = useState({
    name: "",
    phoneNum: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeSearch, setActiveSearch] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3301";

  // display notification messages (Toast)
  const showToast = useCallback((type, text) => {
    setStatus({ type, text, show: true });
    setTimeout(() => setStatus({ type: "", text: "", show: false }), 3000);
  }, []);

  // fetch all necessary data from the server
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const config = { withCredentials: true };
      const adminRes = await axios.get(`${API_BASE_URL}/api/admin/data`, config);
      const teachersRes = await axios.get(`${API_BASE_URL}/api/admin/teachers`, config);

      if (adminRes.data?.success) {
        const data = adminRes.data.UserData || adminRes.data.admin;
        setAdminData(data);
        setUser(data); 
      }
      if (teachersRes.data?.success) {
        setTeachers(teachersRes.data.teachers || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      showToast("error", "Failed to sync data");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, navigate, showToast, setUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle profile picture selection and upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setUpdating(true);
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/admin/update-avatar`,
          { image: reader.result },
          { withCredentials: true }
        );

        if (res.data?.success) {
          const newAvatarUrl = res.data.avatar;
          setAdminData((prev) => ({ ...prev, avatar: newAvatarUrl }));
          setUser((prevUser) => ({ ...prevUser, avatar: newAvatarUrl }));
          showToast("success", "Profile picture updated!");
        }
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to upload image");
      } finally {
        setUpdating(false);
      }
    };
  };

  // Handle removing the current profile picture
  const handleRemoveAvatar = async () => {
    setUpdating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/update-avatar`,
        { image: "" }, 
        { withCredentials: true }
      );

      if (res.data?.success) {
        setAdminData((prev) => ({ ...prev, avatar: "" }));
        setUser((prevUser) => ({ ...prevUser, avatar: "" }));
        showToast("success", "Avatar removed successfully!");
      }
    } catch (err) {
      console.error("Remove Avatar Error:", err);
      showToast("error", "Server error while removing avatar");
    } finally {
      setUpdating(false);
    }
  };

  // Handle general profile updates and password resets
  const handleAdminUpdate = async (e) => {
    if (e) e.preventDefault();
    
    const isResettingPassword = !!(tempAdminData.newPassword && tempAdminData.newPassword.trim() !== "");

    if (showPassModal) {
      if (!tempAdminData.currentPassword || !tempAdminData.newPassword) {
        showToast("error", "Please fill all password fields");
        return;
      }
      if (tempAdminData.newPassword !== tempAdminData.confirmPassword) {
        showToast("error", "Passwords do not match!");
        return;
      }
    }

    setUpdating(true);
    try {
      const payload = {
        name: tempAdminData.name,
        phoneNum: tempAdminData.phoneNum,
        address: tempAdminData.address,
      };

      if (isResettingPassword) {
        payload.currentPassword = tempAdminData.currentPassword;
        payload.password = tempAdminData.newPassword;
      }

      const res = await axios.patch(
        `${API_BASE_URL}/api/admin/update`,
        payload,
        { withCredentials: true }
      );

      if (res.data?.success) {
        const updatedUser = res.data.UserData || res.data.admin;
        setAdminData(updatedUser);
        setUser(updatedUser); 
        
        const successMsg = isResettingPassword 
          ? "Password reset successfully!" 
          : "Settings Saved Successfully!";
          
        showToast("success", successMsg);

        setShowAdminEditModal(false);
        setShowPassModal(false);
        
        setTempAdminData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));

        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("error", err.response?.data?.message || "Update Failed");
    } finally {
      setUpdating(false);
    }
  };

  // Handle teacher account deletion
  const handleDeleteTeacher = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/admin/teachers/${selectedTeacher._id}`,
        { withCredentials: true }
      );

      if (res.data?.success) {
        setTeachers((prev) => prev.filter((t) => t._id !== selectedTeacher._id));
        showToast("success", "Account Removed");
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Could not delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10">
      {status.show && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/10 backdrop-blur-sm transition-all animate-in fade-in">
          <div
            className={`bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border-t-4 transition-all scale-in-center ${
              status.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mx-auto text-green-500 mb-4" size={50} />
            ) : (
              <AlertCircle className="mx-auto text-red-500 mb-4" size={50} />
            )}
            <h3 className="font-bold text-xl text-gray-800">{status.text}</h3>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 rounded-3xl p-8 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
          <div className="flex items-center gap-6">
            <div className="relative group/avatar">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 overflow-hidden shadow-inner relative transition-transform">
                {adminData.avatar ? (
                  <>
                    <img src={adminData.avatar} alt="Admin" className="w-full h-full object-cover" />
                    <button 
                      onClick={handleRemoveAvatar}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  </>
                ) : (
                  <User size={35} />
                )}
              </div>
              
              <div className="absolute -bottom-2 -right-2">
                <label className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 hover:scale-110 transition-all active:scale-90 flex items-center justify-center">
                  <Plus size={14} className="text-indigo-600" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {adminData.name || "Administrator"}
              </h2>
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <Mail size={13} />
                  <p className="text-xs">{adminData.email}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <MapPin size={13} />
                  <p className="text-xs">{adminData.address || "Add address..."}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setTempAdminData({
                ...adminData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
              setShowAdminEditModal(true);
            }}
            className="bg-black hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            Edit Profile Settings
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-300">
          <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/30">
            <div>
              <h3 className="font-bold text-lg text-gray-800">Staff Management</h3>
              <p className="text-xs text-gray-400 font-medium">Manage teacher records and permissions</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Search teacher..."
                  className="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-indigo-50"
                  onChange={(e) => setActiveSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate("/admin/signup")}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <Plus size={16} /> Add Teacher
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-200 text-[11px] font-bold uppercase text-gray-500">
                <tr>
                  <th className="p-5 px-10">Name</th>
                  <th className="p-5 px-10">Email</th>
                  <th className="p-5 px-10">Address</th>
                  <th className="p-5 text-right px-10">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teachers
                  .filter((t) =>
                    t.name.toLowerCase().includes(activeSearch.toLowerCase())
                  )
                  .map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50/50">
                      <td className="p-5 px-10 font-bold text-gray-700">{t.name}</td>
                      <td className="p-5 px-10 text-gray-500 text-sm font-medium">{t.email}</td>
                      <td className="p-5 px-10 text-gray-400 text-sm italic">{t.address || "N/A"}</td>
                      <td className="p-5 text-right px-10">
                        <button
                          onClick={() => {
                            setSelectedTeacher(t);
                            setShowDeleteModal(true);
                          }}
                          className="text-gray-300 hover:text-red-500 p-2 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdminEditModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full relative shadow-2xl scale-in-center">
            <button
              onClick={() => setShowAdminEditModal(false)}
              className="absolute top-8 right-8 text-gray-300 hover:text-gray-900"
            >
              <X />
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Profile Settings</h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">General Account Update</p>
            </div>
            <form onSubmit={handleAdminUpdate} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                      type="text" required
                      value={tempAdminData.name}
                      onChange={(e) => setTempAdminData({ ...tempAdminData, name: e.target.value })}
                      className="w-full border-gray-100 bg-gray-50 p-4 pl-12 rounded-2xl outline-none font-semibold text-gray-700 focus:ring-2 ring-indigo-50 border transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                      type="text"
                      value={tempAdminData.phoneNum}
                      onChange={(e) => setTempAdminData({ ...tempAdminData, phoneNum: e.target.value })}
                      className="w-full border-gray-100 bg-gray-50 p-4 pl-12 rounded-2xl outline-none font-semibold text-gray-700 focus:ring-2 ring-indigo-50 border transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Home Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input
                      type="text"
                      value={tempAdminData.address}
                      onChange={(e) => setTempAdminData({ ...tempAdminData, address: e.target.value })}
                      className="w-full border-gray-100 bg-gray-50 p-4 pl-12 rounded-2xl outline-none font-semibold text-gray-700 focus:ring-2 ring-indigo-50 border transition-all"
                    />
                  </div>
                </div>
                <div className="pt-2 px-1">
                  <button
                    type="button"
                    onClick={() => setShowPassModal(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center underline-offset-4"
                  >
                    Do you want to reset password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95"
              >
                {updating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save All Changes</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPassModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full border border-gray-100 scale-in-center relative">
            <button onClick={() => setShowPassModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-900">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Reset Password</h4>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Identity Verification Required</p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input
                  type="password"
                  placeholder="Current Password"
                  value={tempAdminData.currentPassword}
                  onChange={(e) => setTempAdminData({ ...tempAdminData, currentPassword: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-11 rounded-xl outline-none text-sm focus:ring-2 ring-indigo-50 transition-all"
                />
              </div>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input
                  type="password"
                  placeholder="New Password"
                  value={tempAdminData.newPassword}
                  onChange={(e) => setTempAdminData({ ...tempAdminData, newPassword: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-11 rounded-xl outline-none text-sm focus:ring-2 ring-indigo-50 transition-all"
                />
              </div>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={tempAdminData.confirmPassword}
                  onChange={(e) => setTempAdminData({ ...tempAdminData, confirmPassword: e.target.value })}
                  className={`w-full bg-gray-50 p-4 pl-11 rounded-xl outline-none text-sm transition-all border ${
                    tempAdminData.confirmPassword && tempAdminData.newPassword !== tempAdminData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-100 focus:ring-2 ring-indigo-50"
                  }`}
                />
              </div>
              {tempAdminData.confirmPassword && tempAdminData.newPassword !== tempAdminData.confirmPassword && (
                <p className="text-[10px] text-red-500 font-bold ml-1">Passwords do not match!</p>
              )}
              <button
                onClick={handleAdminUpdate}
                disabled={updating || !tempAdminData.newPassword || tempAdminData.newPassword !== tempAdminData.confirmPassword}
                className={`w-full p-4 rounded-xl font-bold text-sm mt-4 transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  !tempAdminData.newPassword || tempAdminData.newPassword !== tempAdminData.confirmPassword
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-black text-white hover:bg-zinc-800"
                }`}
              >
                {updating ? <Loader2 className="animate-spin" size={18} /> : "Verify & Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl border border-gray-100 scale-in-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
              <Trash2 size={45} />
            </div>
            <h3 className="font-bold text-2xl text-gray-800 mb-2">Delete Account?</h3>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
              Remove <span className="text-gray-900 font-bold">{selectedTeacher?.name}</span>'s data permanently?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl font-bold">Cancel</button>
              <button
                onClick={handleDeleteTeacher}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95"
              >
                {deleting ? "Removing..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;