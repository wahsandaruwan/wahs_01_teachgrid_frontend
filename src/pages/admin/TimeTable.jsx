import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Header from "../../components/Header";

// Configure axios instance with base API URL from environment variables
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Predefined constants for dropdown options and validation
const GRADES = [6, 7, 8, 9, 10, 11]; // Available grade levels
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; // Class sections
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // School week days
const SUBJECTS = ["Sinhala", "Maths", "English", "Science", "History", "Geography", 
  "ICT", "Art", "Music", "Health Education", "Civics"]; // Curriculum subjects

const Timetable = () => {
  // State for fetched data
  const [teachers, setTeachers] = useState([]); // List of available teachers
  const [timetables, setTimetables] = useState([]); // All timetable entries from backend
  
  // State for grade/section filters
  const [gradeNumber, setGradeNumber] = useState("6"); // Selected grade (default: 6)
  const [gradeSection, setGradeSection] = useState("A"); // Selected section (default: A)
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState(null); // Entry being deleted

  // State for form inputs (controlled form)
  const [form, setForm] = useState({
    teacher: "", // Teacher ID (references teacher document)
    grade: "6A", // Combined grade format (e.g., "6A", "11B")
    subject: "", // Subject name
    dayOfWeek: "Monday", // Selected day
    period: 1, // Period number (1-8)
  });

  // Initial data load on component mount
  useEffect(() => {
    // Fetch teachers list for dropdown
    api.get("/timetable/teachers")
      .then((res) => setTeachers(res.data?.data || []))
      .catch((err) => console.error(err));

    // Load all timetable entries
    loadTimetables();
  }, []); // Empty dependency array = runs once on mount

  // Auto-update form grade field when filters change
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      grade: `${gradeNumber}${gradeSection}`, // Format: "6A", "11B", etc.
    }));
  }, [gradeNumber, gradeSection]);

  // Memoized function to fetch timetable data (prevents unnecessary re-renders)
  const loadTimetables = useCallback(async () => {
    try {
      const res = await api.get("/timetable");
      setTimetables(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load timetables", err);
    }
  }, []);

  // Generic form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "period" ? Number(value) : value, // Convert period to number
    }));
  };

  // Form submission handler with client-side validation
  const submit = async (e) => {
    e.preventDefault();
    
    // Client-side validation before API call
    if (!form.teacher || !form.subject) {
      toast.error("Teacher and subject are required");
      return;
    }
    if (form.period < 1 || form.period > 8) {
      toast.error("Period must be between 1-8");
      return;
    }
    
    try {
      await api.post("/timetable", form); // POST new timetable entry
      toast.success("Timetable entry added successfully!");
      loadTimetables(); // Refresh table data
      // Reset form to initial state (preserving current grade selection)
      setForm({
        teacher: "",
        grade: `${gradeNumber}${gradeSection}`,
        subject: "",
        dayOfWeek: "Monday",
        period: 1,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving timetable");
    }
  };

  // Open delete confirmation modal with selected entry
  const openDeleteModal = (entry) => {
    setDeletingEntry(entry);
    setShowDeleteModal(true);
  };

  // Close delete modal and clear selection
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingEntry(null);
  };

  // Confirm and execute delete operation
  const confirmDelete = async () => {
    if (!deletingEntry?._id) return;
    
    try {
      await api.delete(`/timetable/${deletingEntry._id}`); // DELETE by ID
      toast.success("Timetable entry deleted successfully!");
      loadTimetables(); // Refresh table data
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting timetable entry");
    }
    closeDeleteModal();
  };

  // Filter timetable entries for currently selected grade/section
  const filteredTimetables = timetables.filter(
    (t) => t.grade === `${gradeNumber}${gradeSection}`
  );

  return (
    <>
      {/* Page header */}
      <Header title="Timetable Management" />
      
      {/* Global toast notifications with custom styling */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#36393f',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={closeDeleteModal}
          />
          
          {/* Modal dialog with confirmation UI */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-sm z-50 border-4 border-purple-500/30 max-h-[90vh] overflow-y-auto">
            {/* Modal Header with warning icon */}
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/10 border-2 border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Timetable Entry</h3>
                  <p className="text-sm text-gray-500 mt-1">Grade {deletingEntry?.grade} - {deletingEntry?.subject}</p>
                </div>
              </div>
            </div>
            
            {/* Modal Body with confirmation message */}
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed text-base">
                This action cannot be undone. Are you sure you want to delete this timetable entry?
              </p>
            </div>
            
            {/* Modal Footer with action buttons */}
            <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        {/* GRADE/SECTION FILTERS & CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex gap-2">
            {/* Grade dropdown filter */}
            <select
              value={gradeNumber}
              onChange={(e) => setGradeNumber(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            {/* Section dropdown filter */}
            <select
              value={gradeSection}
              onChange={(e) => setGradeSection(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              {SECTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={loadTimetables}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm transition"
          >
            🔄 Refresh
          </button>

          {/* Current filter display */}
          <h3 className="ml-auto text-gray-700 text-sm font-medium">
            Viewing timetable for:{" "}
            <span className="font-semibold text-gray-900">
              Grade {gradeNumber} - {gradeSection}
            </span>
          </h3>
        </div>

        {/* ADD NEW TIMETABLE ENTRY FORM */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-blue-50">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            ➕ Add Timetable Entry
          </h2>

          <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
            {/* Teacher selection (references teacher collection) */}
            <select
              name="teacher"
              value={form.teacher}
              onChange={handleChange}
              required
              className="p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Subject selection */}
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="">Select Subject</option>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Day of week selection */}
            <select
              name="dayOfWeek"
              value={form.dayOfWeek}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            {/* Period number input (1-8) */}
            <input
              type="number"
              name="period"
              min="1"
              max="8"
              value={form.period}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />

            {/* Submit button spans full width on mobile */}
            <button
              type="submit"
              className="md:col-span-3 bg-gradient-to-r from-violet-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              ➕ Add Entry
            </button>
          </form>
        </div>

        {/* TIMETABLE DISPLAY TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-50">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">
            {/* Table header with days of week */}
            <thead className="bg-gradient-to-r from-violet-500 to-sky-500 text-white">
              <tr>
                <th className="border p-4 text-center font-semibold">Period</th>
                {DAYS.map((day) => (
                  <th key={day} className="border p-4 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table body - 8 periods × 5 days grid */}
            <tbody>
              {[...Array(8)].map((_, period) => (
                <tr key={period} className="hover:bg-blue-50 transition">
                  {/* Period number column */}
                  <td className="border p-3 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-center pr-4">
                    {period + 1}
                  </td>
                  
                  {/* Day columns with timetable entries */}
                  {DAYS.map((day) => {
                    // Find matching timetable entry for this cell
                    const entry = filteredTimetables.find(
                      (t) => t.dayOfWeek === day && t.period === period + 1
                    );
                    
                    return (
                      <td
                        key={day}
                        className="border p-3 text-center text-gray-700 relative min-w-[120px]"
                      >
                        {entry ? (
                          /* Entry exists - show subject, teacher, and delete button */
                          <div className="group cursor-pointer" onClick={() => openDeleteModal(entry)}>
                            <div className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                              {entry.subject} {/* Subject name */}
                            </div>
                            <div className="text-xs text-gray-500">
                              {entry.teacher?.name} {/* Teacher name (populated reference) */}
                            </div>
                            {/* Hover-activated delete button */}
                            <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 -m-1">
                              🗑️
                            </button>
                          </div>
                        ) : (
                          /* Empty cell placeholder */
                          <span className="text-gray-400 font-medium">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timetable;