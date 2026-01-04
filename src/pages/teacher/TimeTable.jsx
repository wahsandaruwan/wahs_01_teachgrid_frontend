import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

const GRADES = [6, 7, 8, 9, 10, 11];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [gradeNumber, setGradeNumber] = useState("6");
  const [gradeSection, setGradeSection] = useState("A");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    loadTimetables();
  }, []);

  const loadTimetables = async () => {
    try {
      const res = await api.get("/timetable");
      setTimetables(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load timetables", err);
    }
  };

  // 🔹 Extract unique teachers for dropdown
  const teachers = [
    ...new Map(
      timetables
        .filter((t) => t.teacher)
        .map((t) => [t.teacher._id, t.teacher])
    ).values(),
  ];

  const filteredTimetables = timetables.filter((t) => {
    const matchGrade = t.grade === `${gradeNumber}${gradeSection}`;
    const matchTeacher = selectedTeacher
      ? t.teacher?._id === selectedTeacher
      : true;

    return matchGrade && matchTeacher;
  });

  return (
    <>
      <Header title="View Timetable" />

      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <select
            value={gradeNumber}
            onChange={(e) => setGradeNumber(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <select
            value={gradeSection}
            onChange={(e) => setGradeSection(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            {SECTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* 👨‍🏫 TEACHER DROPDOWN */}
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

          <button
            onClick={loadTimetables}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm"
          >
            🔄 Refresh
          </button>

          <span className="ml-auto text-sm font-medium">
            Grade {gradeNumber} - {gradeSection}
          </span>
        </div>

        {/* TIMETABLE TABLE */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border p-3 text-left">Day</th>
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="border p-3 text-center">
                    Period {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className="border p-3 font-medium bg-blue-50">
                    {day}
                  </td>
                  {[...Array(8)].map((_, p) => {
                    const entry = filteredTimetables.find(
                      (t) => t.dayOfWeek === day && t.period === p + 1
                    );

                    return (
                      <td key={p} className="border p-3 text-center">
                        {entry ? (
                          <>
                            <div className="font-semibold">
                              {entry.subject}
                            </div>
                            <div className="text-xs text-gray-500">
                              {entry.teacher?.name}
                            </div>
                          </>
                        ) : (
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
    </>
  );
};

export default Timetable;
