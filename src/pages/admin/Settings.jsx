import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Trash2,
  Loader2,
  Edit3,
  Search,
  Mail,
  Phone,
  MapPin,
  X,
  Lock,
  ShieldCheck,
  Plus,
  Save,
  ChevronRight,
  AlertCircle,
  User,
  Settings2,
  CheckCircle2,
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();

  // Core Data States
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phoneNum: "",
    address: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [status, setStatus] = useState({ type: "", text: "", show: false });

  // UI/Modal States
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);

  // Form States
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    address: "",
    phoneNum: "",
    password: "",
  });

  // Updated tempAdminData to include password
  const [tempAdminData, setTempAdminData] = useState({
    name: "",
    phoneNum: "",
    address: "",
    password: "", // Added password field
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const showToast = useCallback((type, text) => {
    setStatus({ type, text, show: true });
    setTimeout(() => setStatus({ type: "", text: "", show: false }), 3000);
  }, []);

  // Initial Data Fetch
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const config = { withCredentials: true };
      const [adminRes, teachersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/data`, config),
        axios.get(`${API_BASE_URL}/api/admin/teachers`, config),
      ]);
      if (adminRes.data?.success)
        setAdminData(adminRes.data.UserData || adminRes.data.admin);
      if (teachersRes.data?.success)
        setTeachers(teachersRes.data.teachers || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      showToast("error", "Failed to sync data");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Admin Update
  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/admin/update`,
        tempAdminData,
        { withCredentials: true }
      );
      if (res.data?.success) {
        // Update local admin state (excluding password)
        setAdminData((prev) => ({
          ...prev,
          name: tempAdminData.name,
          phoneNum: tempAdminData.phoneNum,
          address: tempAdminData.address,
        }));
        showToast("success", "Profile & Security updated! Check your email.");
        setShowAdminEditModal(false);
      }
    } catch (error) {
      console.error("Update Error:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to update admin"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Teacher Update
  const handleTeacherUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/admin/teachers/${selectedTeacher._id}`,
        teacherForm,
        { withCredentials: true }
      );
      if (res.data?.success) {
        setTeachers((prev) =>
          prev.map((t) =>
            t._id === selectedTeacher._id ? { ...t, ...teacherForm } : t
          )
        );
        showToast("success", "Faculty record updated & email sent");
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Teacher Update Error:", error);
      showToast("error", error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Delete Teacher
  const handleDeleteTeacher = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/admin/teachers/${selectedTeacher._id}`,
        { withCredentials: true }
      );
      if (res.data?.success) {
        setTeachers((prev) =>
          prev.filter((t) => t._id !== selectedTeacher._id)
        );
        showToast("success", "Teacher removed from system");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      showToast("error", "Deletion failed");
    }
  };

  const handleSearchTrigger = () => {
    setActiveSearch(searchQuery);
  };

  const arialFont = { fontFamily: "Arial, Helvetica, sans-serif" };

  if (loading)
    return (
      <div
        className="h-screen flex items-center justify-center bg-[#F9FAFB]"
        style={arialFont}
      >
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-10" style={arialFont}>
      {/* STATUS TOAST */}
      {status.show && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md">
          <div
            className={`bg-white border ${
              status.type === "success"
                ? "border-emerald-100"
                : "border-red-100"
            } rounded-[2.5rem] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300`}
          >
            <div
              className={`w-20 h-20 ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-500"
                  : "bg-red-50 text-red-500"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={40} strokeWidth={2.5} />
              ) : (
                <AlertCircle size={40} strokeWidth={2.5} />
              )}
            </div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-2">
              {status.type === "success" ? "Success!" : "Failed"}
            </h3>
            <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-widest leading-relaxed">
              {status.text}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* ADMIN PROFILE SECTION */}
        <div className="bg-gray-100 rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center group">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner transition-colors">
                <User size={40} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {adminData.name}
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-400 flex items-center gap-1 font-medium">
                  <Mail size={14} /> {adminData.email}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-3">
            <button
              onClick={() => {
                setTempAdminData({
                  name: adminData.name,
                  phoneNum: adminData.phoneNum,
                  address: adminData.address,
                  password: "",
                });
                setShowAdminEditModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-indigo-600 hover:text-white text-white rounded-xl text-xs font-bold transition-all border border-gray-100"
            >
              <Edit3 size={14} /> Edit My Profile
            </button>
            <div className="flex gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {adminData.address || "No Address"}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} /> {adminData.phoneNum || "No Phone"}
              </span>
            </div>
          </div>
        </div>

        {/* TEACHER TABLE SECTION */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col xl:flex-row justify-between items-center gap-6 bg-gray-50/30">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-gray-900">
                Manage Teacher
              </h3>
              <p className="text-gray-400 text-xs font-medium">
                Manage teacher credentials and system access.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
              <div className="relative flex items-center w-full md:w-96 group">
                <Search
                  className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by teacher name..."
                  className="w-full pl-12 pr-28 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchTrigger()}
                />
                <button
                  onClick={handleSearchTrigger}
                  className="absolute right-2 px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase rounded-lg"
                >
                  Search
                </button>
              </div>
              <button
                onClick={() => navigate("/admin/signup")}
                className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-lg w-full md:w-auto"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase">Add Teacher</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase text-gray-400">
                <tr>
                  <th className="px-10 py-5">Staff Member</th>
                  <th className="px-10 py-5">Email Address</th>
                  <th className="px-10 py-5">Office Location</th>
                  <th className="px-10 py-5 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teachers
                  .filter((t) =>
                    t.name.toLowerCase().includes(activeSearch.toLowerCase())
                  )
                  .map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-indigo-50/30 transition-all group"
                    >
                      <td className="px-10 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white border border-gray-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">
                            {t.name?.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-gray-800">
                            {t.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-5 text-sm text-gray-500 font-medium">
                        {t.email}
                      </td>
                      <td className="px-10 py-5 text-sm text-gray-400 italic font-medium">
                        {t.address || "Global Access"}
                      </td>
                      <td className="px-10 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedTeacher(t);
                              setTeacherForm({
                                name: t.name,
                                email: t.email,
                                address: t.address || "",
                                phoneNum: t.phoneNum || "",
                                password: "",
                              });
                              setShowEditModal(true);
                            }}
                            className="p-2 text-indigo-500 bg-white rounded-lg border border-gray-100 hover:bg-indigo-500 hover:text-white"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTeacher(t);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-500 bg-white rounded-lg border border-gray-100 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADMIN EDIT MODAL (UPDATED WITH PASSWORD) */}
      {showAdminEditModal && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div
            className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200"
            style={arialFont}
          >
            <button
              onClick={() => setShowAdminEditModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="mb-8">
              <h3 className="text-2xl font-bold tracking-tight">My Settings</h3>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">
                Update your personal identity & security
              </p>
            </div>
            <form onSubmit={handleAdminUpdate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={tempAdminData.name}
                  onChange={(e) =>
                    setTempAdminData({ ...tempAdminData, name: e.target.value })
                  }
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-indigo-50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={tempAdminData.phoneNum}
                  onChange={(e) =>
                    setTempAdminData({
                      ...tempAdminData,
                      phoneNum: e.target.value,
                    })
                  }
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-indigo-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                  Address
                </label>
                <input
                  type="text"
                  value={tempAdminData.address}
                  onChange={(e) =>
                    setTempAdminData({
                      ...tempAdminData,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-indigo-50"
                />
              </div>

              {/* NEW PASSWORD FIELD */}
              <div className="space-y-1.5 pt-2 border-t border-gray-50">
                <label className="text-[11px] font-bold text-red-500 uppercase ml-1 flex items-center gap-1">
                  <Lock size={12} /> New Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={tempAdminData.password}
                  onChange={(e) =>
                    setTempAdminData({
                      ...tempAdminData,
                      password: e.target.value,
                    })
                  }
                  className="w-full p-3.5 bg-red-50/10 border border-red-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 ring-red-50"
                />
                <p className="text-[9px] text-gray-400 ml-1">
                  Min. 6 characters with one uppercase letter recommended.
                </p>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                {updating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Save & Send Email
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-10 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="mb-8 flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                {teacherForm.name?.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  Edit Staff Profile
                </h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Update credentials & notify member
                </p>
              </div>
            </div>
            <form onSubmit={handleTeacherUpdate} className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-1/3 text-[11px] font-bold text-gray-500 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={teacherForm.name}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, name: e.target.value })
                  }
                  className="md:w-2/3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-1/3 text-[11px] font-bold text-gray-500 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, email: e.target.value })
                  }
                  className="md:w-2/3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-1/3 text-[11px] font-bold text-gray-500 uppercase">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={teacherForm.phoneNum || ""}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, phoneNum: e.target.value })
                  }
                  className="md:w-2/3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <label className="md:w-1/3 text-[11px] font-bold text-gray-500 uppercase">
                  Office Address
                </label>
                <input
                  type="text"
                  value={teacherForm.address}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, address: e.target.value })
                  }
                  className="md:w-2/3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold outline-none"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 pt-3 border-t border-gray-50 mt-4">
                <label className="md:w-1/3 text-[11px] font-bold text-red-500 uppercase flex items-center gap-1">
                  <Lock size={12} /> New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={teacherForm.password}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, password: e.target.value })
                  }
                  className="md:w-2/3 p-3 bg-red-50/20 border border-red-100 rounded-xl text-sm font-semibold outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full mt-6 py-4 bg-[#0a035f] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Syncing...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Update & Notify Teacher
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={30} />
            </div>
            <h4 className="text-xl font-bold mb-2 uppercase text-gray-900 tracking-tight">
              Delete Account?
            </h4>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
              Are you sure you want to remove{" "}
              <span className="text-indigo-600 font-bold">
                {selectedTeacher?.name}
              </span>
              ? This action is permanent.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3.5 bg-gray-100 text-gray-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200"
              >
                Abort
              </button>
              <button
                onClick={handleDeleteTeacher}
                className="py-3.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
