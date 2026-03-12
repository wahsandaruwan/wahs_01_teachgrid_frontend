import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

// Axios instance with base API URL from environment variables
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Static data for filters
const GRADES = [6, 7, 8, 9, 10, 11];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Timetable = () => {
  // Store all timetable records from backend
  const [timetables, setTimetables] = useState([]);

  // Selected grade number (6–11)
  const [gradeNumber, setGradeNumber] = useState("6");

  // Selected grade section (A–J)
  const [gradeSection, setGradeSection] = useState("A");

  // Selected teacher ID (empty = all teachers)
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // Load timetable data when component mounts
  useEffect(() => {
    loadTimetables();
  }, []);

  // Fetch timetable data from backend
  const loadTimetables = async () => {
    try {
      const res = await api.get("/timetable");
      setTimetables(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load timetables", err);
    }
  };

  // 🔹 Extract unique teachers from timetable list
  // Uses Map to remove duplicate teachers by ID
  const teachers = [
    ...new Map(
      timetables
        .filter((t) => t.teacher)
        .map((t) => [t.teacher._id, t.teacher])
    ).values(),
  ];

  // 🔹 Filter timetable records by grade, section, and teacher
  const filteredTimetables = timetables.filter((t) => {
    // Match grade like "6A", "7B", etc.
    const matchGrade = t.grade === `${gradeNumber}${gradeSection}`;

    // Match teacher if selected
    const matchTeacher = selectedTeacher
      ? t.teacher?._id === selectedTeacher
      : true;

    return matchGrade && matchTeacher;
  });

  return (
    <>
      {/* Page header */}
      <Header title="View Timetable" />

      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        
        {/* 🔹 FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">

          {/* Grade number selector */}
          <select
            value={gradeNumber}
            onChange={(e) => setGradeNumber(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          {/* Grade section selector */}
          <select
            value={gradeSection}
            onChange={(e) => setGradeSection(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            {SECTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Teacher filter dropdown */}
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="p-2 border rounded-md bg-white min-w-[220px]"
          >
            <option value="">All Teachers</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Refresh timetable data */}
          <button
            onClick={loadTimetables}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm"
          >
            🔄 Refresh
          </button>

          {/* Display selected grade info */}
          <span className="ml-auto text-sm font-medium">
            Grade {gradeNumber} - {gradeSection}
          </span>
        </div>

        {/* 🔹 TIMETABLE TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">

            {/* Table header */}
            <thead className="bg-gradient-to-r from-violet-500 to-sky-500 text-white">
              <tr>
                <th className="border p-3 text-center">Period</th>
                {DAYS.map((day) => (
                  <th key={day} className="border p-3 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              {/* Create 8 periods */}
              {[...Array(8)].map((_, p) => (
                <tr key={p}>
                  
                  {/* Period number column */}
                  <td className="border p-3 text-center font-medium bg-blue-50">
                    {p + 1}
                  </td>

                  {/* Timetable cells per day */}
                  {DAYS.map((day) => {
                    // Find matching timetable entry
                    const entry = filteredTimetables.find(
                      (t) =>
                        t.dayOfWeek === day &&
                        Number(t.period) === p + 1
                    );

                    return (
                      <td key={day} className="border p-3 text-center">
                        {entry ? (
                          <>
                            {/* Subject name */}
                            <div className="font-semibold">
                              {entry.subject}
                            </div>

                            {/* Teacher name */}
                            <div className="text-xs text-gray-500">
                              {entry.teacher?.name}
                            </div>
                          </>
                        ) : (
                          // Empty cell
                          <span className="text-gray-400">—</span>
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