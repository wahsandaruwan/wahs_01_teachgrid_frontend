import React, { useState, useEffect } from 'react';
import { Loader2, Edit3, X, Copyright, Phone, MapPin, Save, User, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Header from '../../components/Header';

const TeacherSettings = () => {
  const [teacherData, setTeacherData] = useState({ name: "", email: "", address: "", phoneNum: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get Profile details
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/teachers/profile`);
        if (res.data) setTeacherData(res.data);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data?.message || err.message);
        // Demo data
        setTeacherData({
          name: "Teacher Name",
          email: "teacher@techgrid.com",
          address: "Sample Address, Sri Lanka",
          phoneNum: "07XXXXXXXX"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [API_BASE_URL]);

  //  Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setStatus({ type: "", text: "" });

    try {
      const { name, phoneNum, address } = teacherData;
      const res = await axios.patch(`${API_BASE_URL}/api/teachers/update-profile`, { name, phoneNum, address });
      
      setStatus({ 
        type: "success", 
        text: res.data?.message || "Profile updated successfully!" 
      });
      setIsEditing(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong. Please check your connection.";
      setStatus({ 
        type: "error", 
        text: errorMsg 
      });
    } finally {
      setUpdating(false);
      setTimeout(() => setStatus({ type: "", text: "" }), 4000);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#334155] flex flex-col">
      <Header title="My Settings" />
      
      <main className="max-w-4xl mx-auto px-6 py-10 flex-grow w-full">
        
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header Banner */}
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
                <h2 className="text-2xl font-bold text-slate-900">{teacherData.name}</h2>
                <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mt-1">
                   <Mail size={14} /> {teacherData.email}
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                  isEditing ? 'bg-rose-50 text-rose-600' : 'bg-slate-900 text-white hover:bg-indigo-600'
                }`}
              >
                {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
              </button>
            </div>

            {/* Status Feedback */}
            {status.text && (
              <div className={`mb-6 p-4 rounded-2xl text-[11px] font-bold border flex items-center gap-3 animate-in fade-in ${
                status.type === "success" 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                  : "bg-rose-50 border-rose-100 text-rose-700"
              }`}>
                {status.type === "success" ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                {status.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={teacherData.name} 
                      onChange={(e) => setTeacherData({...teacherData, name: e.target.value})} 
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-600 outline-none transition-all text-sm font-medium" 
                      required 
                    />
                  ) : (
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 border border-transparent">
                      {teacherData.name}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Phone Number</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={teacherData.phoneNum} 
                      onChange={(e) => setTeacherData({...teacherData, phoneNum: e.target.value})} 
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-600 outline-none transition-all text-sm font-medium" 
                    />
                  ) : (
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 border border-transparent flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" /> {teacherData.phoneNum || "Not provided"}
                    </div>
                  )}
                </div>

                {/* Fixed Email Display */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Email Address (Read Only)</label>
                  <div className="px-5 py-3 bg-slate-100 rounded-2xl text-sm font-medium text-slate-400 flex items-center gap-2 border border-transparent cursor-not-allowed">
                    <Mail size={14} /> {teacherData.email}
                  </div>
                </div>
              </div>

              {/* Home Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Home Address</label>
                {isEditing ? (
                  <textarea 
                    rows="3" 
                    value={teacherData.address} 
                    onChange={(e) => setTeacherData({...teacherData, address: e.target.value})} 
                    className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-600 outline-none transition-all text-sm font-medium resize-none" 
                  />
                ) : (
                  <div className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 border border-transparent flex items-start gap-2">
                    <MapPin size={14} className="text-slate-400 mt-1" /> {teacherData.address || "No address provided"}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                    {updating ? "Saving Changes..." : "Save Profile Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-[10px] font-medium tracking-widest uppercase">
         <Copyright size={12} className="inline mr-1" /> {new Date().getFullYear()} TEACHGRID. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default TeacherSettings;