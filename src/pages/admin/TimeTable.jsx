import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

const GRADES = [6, 7, 8, 9, 10, 11];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SUBJECTS = ["Sinhala", "Maths", "English", "Science", "History", "Geography", 
  "ICT", "Art", "Music","Health Education", "Civics"];

const Timetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [gradeNumber, setGradeNumber] = useState("6");
  const [gradeSection, setGradeSection] = useState("A");

  const [form, setForm] = useState({
    teacher: "",
    grade: "6A",
    subject: "",
    dayOfWeek: "Monday",
    period: 1,
  });

  useEffect(() => {
    api.get("/timetable/teachers")
      .then((res) => setTeachers(res.data?.data || []))
      .catch((err) => console.error(err));

    loadTimetables();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      grade: `${gradeNumber}${gradeSection}`,
    }));
  }, [gradeNumber, gradeSection]);

  const loadTimetables = async () => {
    try {
      const res = await api.get("/timetable");
      setTimetables(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load timetables", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "period" ? Number(value) : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/timetable", form);
      alert("Timetable entry added successfully!");
      loadTimetables();
      setForm({
        teacher: "",
        grade: `${gradeNumber}${gradeSection}`,
        subject: "",
        dayOfWeek: "Monday",
        period: 1,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error saving timetable");
    }
  };

  //Delete function
  const deleteEntry = async (entryId) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) {
      return;
    }

    try {
      await api.delete(`/timetable/${entryId}`);
      alert("Timetable entry deleted successfully!");
      loadTimetables();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting timetable entry");
    }
  };

  const filteredTimetables = timetables.filter(
    (t) => t.grade === `${gradeNumber}${gradeSection}`
  );

  return (
    <>
      <Header title="Timetable Management" />

      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        {/* FILTER SECTION */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex gap-2">
            <select
              value={gradeNumber}
              onChange={(e) => setGradeNumber(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

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

          <button
            onClick={loadTimetables}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm transition"
          >
            🔄 Refresh
          </button>

          <h3 className="ml-auto text-gray-700 text-sm font-medium">
            Viewing timetable for:{" "}
            <span className="font-semibold text-gray-900">
              Grade {gradeNumber} - {gradeSection}
            </span>
          </h3>
        </div>

        {/* ADD FORM */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-blue-50">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            ➕ Add Timetable Entry
          </h2>

          <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
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

            <input
              type="number"
              name="period"
              min="1"
              max="8"
              value={form.period}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />

            <button
              type="submit"
              className="md:col-span-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              ➕ Add Entry
            </button>
          </form>
        </div>

        {/* TIMETABLE TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-50">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="border p-4 text-left font-semibold">Day</th>
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="border p-4 text-center font-semibold">
                    Period {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="hover:bg-blue-50 transition">
                  <td className="border p-3 font-medium bg-gradient-to-r from-blue-50 to-indigo-50">
                    {day}
                  </td>
                  {[...Array(8)].map((_, p) => {
                    const entry = filteredTimetables.find(
                      (t) => t.dayOfWeek === day && t.period === p + 1
                    );
                    return (
                      <td
                        key={p}
                        className="border p-3 text-center text-gray-700 relative"
                      >
                        {entry ? (
                          <div className="group cursor-pointer">
                            <div className="font-semibold text-sm text-gray-900 mb-1">
                              {entry.subject}
                            </div>
                            <div className="text-xs text-gray-500">
                              {entry.teacher?.name}
                            </div>
                            {/* Delete Button */}
                            <button
                              onClick={() => deleteEntry(entry._id)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-lg group-hover:opacity-100 opacity-0 transition-all duration-200"
                              title="Delete Entry"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
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
    </>
  );
};

export default Timetable;
