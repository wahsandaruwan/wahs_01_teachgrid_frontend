import React, { useState, useEffect, useCallback } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`);

const subjects = [
  "",
  "Sinhala",
  "Maths",
  "Buddhism",
  "English",
  "Science",
  "History",
  "Geography",
  "Civic Education",
  "Business Studies",
  "Information Technology",
  "Art",
  "Music",
  "Dance",
  "Drama",
  "P.T.S.",
  "Health Education",
];

const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];

// use Vite env instead of hard-coded localhost
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/timetables`;

const createInitialData = () =>
  periods.map(() => {
    const row = {};
    days.forEach((d) => {
      row[d] = { subject: "", teacher: "" };
    });
    return row;
  });

const TimeTable = () => {
  const [timetables, setTimetables] = useState({});
  const [selectedGrade, setSelectedGrade] = useState("Grade 6");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  const currentTimetable = timetables[selectedGrade] || createInitialData();

  // Fetch timetable
  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      setStatus("");
      setStatusType("info");

      try {
        const res = await fetch(`${API_URL}/${selectedGrade}`, {
          credentials: "include",
        });

        if (!res.ok) {
          setTimetables((prev) => ({
            ...prev,
            [selectedGrade]: createInitialData(),
          }));
          return;
        }

        const data = await res.json();
        setTimetables((prev) => ({
          ...prev,
          [selectedGrade]: data.table || createInitialData(),
        }));
      } catch (error) {
        console.error(error);
        setStatus("Failed to load timetable");
        setStatusType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedGrade]);

  // Save timetable
  const saveTimetable = useCallback(async () => {
    setSaving(true);
    setStatus("");
    setStatusType("info");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          grade: selectedGrade,
          table: currentTimetable,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.message || "Save failed");
        setStatusType("error");
        return;
      }

      setStatus("Timetable saved successfully!");
      setStatusType("success");
    } catch (error) {
      setStatus("Server error");
      setStatusType("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(""), 3000);
    }
  }, [selectedGrade, currentTimetable]);

  // Update cell value
  const handleChange = (pIndex, day, field) => (e) => {
    const value = e.target.value;

    setTimetables((prev) => {
      const updated = [...currentTimetable];
      updated[pIndex] = {
        ...updated[pIndex],
        [day]: {
          ...updated[pIndex][day],
          [field]: value,
        },
      };
      return { ...prev, [selectedGrade]: updated };
    });
  };

  const statusClasses =
    statusType === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : statusType === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-slate-50 text-slate-600 border-slate-200";

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        Loading timetable...
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Heading */}
      <div className="mb-6 border-b border-indigo-300/60 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
              Time Table
            </span>
          </h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Weekly Schedule Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Grade:</span>
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="appearance-none rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-slate-800
                         shadow-sm pl-5 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                         hover:border-indigo-300 transition"
            >
              {grades.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Status bar + Save button */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {status && (
          <div
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${statusClasses}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                statusType === "success"
                  ? "bg-emerald-500"
                  : statusType === "error"
                  ? "bg-red-500"
                  : "bg-slate-400"
              }`}
            />
            {status}
          </div>
        )}

        <button
          onClick={saveTimetable}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm 
                     hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {saving ? "💾 Saving..." : "💾 Save Timetable"}
        </button>
      </div>

      {/* Timetable Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full text-xs">
            <thead className="sticky top-0 z-10 bg-indigo-50">
              <tr className="border-b border-slate-200 text-indigo-700">
                <th className="border-r px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide">
                  Period
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="border-r border-slate-200 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {periods.map((period, pIndex) => (
                <tr
                  key={period}
                  className={pIndex % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="border-r border-slate-200 px-3 py-3 text-[11px] font-semibold text-slate-700 whitespace-nowrap">
                    {period}
                  </td>
                  {days.map((day) => (
                    <td
                      key={day}
                      className="border-r border-slate-200 px-2 py-2 font-semibold"
                    >
                      <select
                        value={currentTimetable[pIndex][day].subject}
                        onChange={handleChange(pIndex, day, "subject")}
                        className="mb-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800 shadow-sm focus:ring-1 focus:ring-indigo-400 font-semibold"
                      >
                        {subjects.map((s) => (
                          <option key={s || "none"} value={s}>
                            {s || "Select subject"}
                          </option>
                        ))}
                      </select>
                      <input
                        value={currentTimetable[pIndex][day].teacher}
                        onChange={handleChange(pIndex, day, "teacher")}
                        placeholder="Teacher name"
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-400 font-semibold"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
