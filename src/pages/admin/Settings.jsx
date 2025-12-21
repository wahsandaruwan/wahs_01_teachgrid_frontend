import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Loader2, Edit3, X, Copyright, AlertTriangle, Phone, MapPin, UserPlus, Save } from 'lucide-react';
import axios from 'axios';
import Header from '../../components/Header';

const Settings = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({ name: "", email: "", address: "", phoneNum: "" });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const demoTeachers = [
    { _id: "1", name: "Teacher 01", email: "teacher01@gmail.com", phoneNum: "0712345678", address: "Address 01" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [adminRes, teachersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/profile`).catch(() => null),
          axios.get(`${API_BASE_URL}/api/teachers`).catch(() => null)
        ]);
        
        if (adminRes && adminRes.data) {
          setAdminData(adminRes.data);
        } else {
          setAdminData({ name: "Demo Admin", email: "admin@techgrid.com", address: "No. 45, Colombo 07", phoneNum: "0771234567" });
        }

        if (teachersRes && Array.isArray(teachersRes.data)) {
          setTeachers(teachersRes.data.length > 0 ? teachersRes.data : demoTeachers);
        } else {
          setTeachers(demoTeachers);
        }
      } catch {
        setTeachers(demoTeachers);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/update-profile`, adminData);
      setStatus({ type: "success", text: "Profile updated successfully" });
      setIsEditingAdmin(false);
    } catch {
      setStatus({ type: "success", text: "Saved to local session" });
      setIsEditingAdmin(false);
    } finally {
      setUpdating(false);
      setTimeout(() => setStatus({ type: "", text: "" }), 3000);
    }
  };

  const handleEditClick = (teacher) => {
    setSelectedTeacher({ ...teacher });
    setShowEditModal(true);
  };

  const handleTeacherUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.patch(`${API_BASE_URL}/api/teachers/${selectedTeacher._id}`, selectedTeacher);
      setTeachers(prev => prev.map(t => t._id === selectedTeacher._id ? selectedTeacher : t));
      setStatus({ type: "success", text: "Teacher details updated!" });
      setShowEditModal(false);
    } catch {
      setTeachers(prev => prev.map(t => t._id === selectedTeacher._id ? selectedTeacher : t));
      setShowEditModal(false);
    } finally {
      setUpdating(false);
      setTimeout(() => setStatus({ type: "", text: "" }), 3000);
    }
  };

  const confirmDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/teachers/${selectedTeacher._id}`);
      setTeachers(prev => prev.filter(t => t._id !== selectedTeacher._id));
    } catch {
      setTeachers(prev => prev.filter(t => t._id !== selectedTeacher._id));
    } finally {
      setShowDeleteModal(false);
      setSelectedTeacher(null);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#334155] flex flex-col">
      <Header title="Settings" />
      
      <main className="max-w-7xl mx-auto px-6 py-2 flex-grow w-full mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-4">
          
          {/* Admin Profile Section */}
          <div className="lg:col-span-4 sticky top-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">Personal Information</h2>
                <button 
                  onClick={() => setIsEditingAdmin(!isEditingAdmin)} 
                  className={`p-2 rounded-lg transition-all ${isEditingAdmin ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}
                >
                  {isEditingAdmin ? <X size={18} /> : <Edit3 size={18} />}
                </button>
              </div>

              <div className="p-6">
                {!isEditingAdmin ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-xl shadow-indigo-100">
                        {adminData.name.charAt(0)}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{adminData.name}</h3>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{adminData.email}</p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex items-start gap-3">
                        <Phone size={16} className="text-slate-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p>
                          <p className="text-sm font-semibold text-slate-700">{adminData.phoneNum}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-slate-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Address</p>
                          <p className="text-sm font-semibold text-slate-700 leading-relaxed">{adminData.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <input type="text" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all" placeholder="Full Name" />
                    <input type="text" value={adminData.phoneNum} onChange={(e) => setAdminData({...adminData, phoneNum: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all" placeholder="Phone Number" />
                    <textarea rows="3" value={adminData.address} onChange={(e) => setAdminData({...adminData, address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all resize-none" placeholder="Address" />
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">
                      {updating ? "Saving..." : "Update Admin Profile"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Table & Button Section */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800">Staff Directory</h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {teachers.length} Instructors
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Instructor Details</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teachers.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                          <div className="text-slate-400 text-xs">{t.email}</div>
                        </td>
                        <td className="px-6 py-5 text-slate-500 text-[11px] font-medium max-w-[150px] truncate">
                          {t.address}
                        </td>
                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                          <button onClick={() => handleEditClick(t)} className="p-2 text-slate-600 hover:text-indigo-600 transition-all bg-slate-50 rounded-lg">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => confirmDelete(t)} className="p-2 text-slate-600 hover:text-rose-600 transition-all bg-slate-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="flex justify-end">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2 w-fit">
                <div className="flex items-center gap-3">
                  {status.text && (
                    <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold animate-in fade-in">
                      {status.text}
                    </div>
                  )}
                  <button 
                    onClick={() => navigate('/admin/signup')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm active:scale-95 tracking-wide"
                  >
                    <UserPlus size={14} /> 
                    <span>Add New Teacher</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Teacher Details */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">Edit Teacher Records</h4>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleTeacherUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" value={selectedTeacher.name} onChange={(e) => setSelectedTeacher({...selectedTeacher, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" value={selectedTeacher.email} onChange={(e) => setSelectedTeacher({...selectedTeacher, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" value={selectedTeacher.phoneNum || ""} onChange={(e) => setSelectedTeacher({...selectedTeacher, phoneNum: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Home Address</label>
                <textarea rows="2" value={selectedTeacher.address || ""} onChange={(e) => setSelectedTeacher({...selectedTeacher, address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl text-sm border focus:border-indigo-600 outline-none transition-all resize-none" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl text-[10px] uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all">
                  <Save size={14}/> {updating ? "Saving..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100">
                <AlertTriangle size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Confirm Removal</h4>
              <p className="text-sm text-slate-500">Are you sure you want to remove <span className="text-slate-900 font-bold">{selectedTeacher?.name}</span>?</p>
              <div className="flex gap-3 mt-8 w-full">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-slate-50 text-slate-600 font-bold rounded-xl text-[10px] uppercase tracking-widest">Keep</button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-rose-100 transition-all">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-slate-400 text-[10px] font-medium tracking-widest uppercase">
               <Copyright size={12} className="inline mr-1" /> {new Date().getFullYear()} TEACHGRID. ALL RIGHTS RESERVED.
            </footer>
    </div>
  );
};

export default Settings;