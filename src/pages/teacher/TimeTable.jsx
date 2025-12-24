import React, { useState, useEffect } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`);
const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];

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
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");

  const currentTimetable = timetables[selectedGrade] || createInitialData();

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

  const statusClasses =
    statusType === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-slate-50 text-slate-600 border-slate-200";

  if (loading)
    return (
      <div className="p-10 flex justify-center text-slate-500 text-sm tracking-wide">
        Loading timetable...
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Weekly Time Table
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Organized class schedule overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-600">Select Grade:</label>
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            >
              {grades.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <span className="absolute right-3 inset-y-0 flex items-center text-xs text-slate-400 pointer-events-none">
              ▼
            </span>
          </div>
        </div>
      </div>

      {status && (
        <div
          className={`mb-6 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm ${statusClasses}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              statusType === "error" ? "bg-red-500" : "bg-slate-400"
            }`}
          />
          {status}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-indigo-600 text-white shadow-sm">
              <tr>
                <th className="px-4 py-3 border-r border-indigo-500 font-semibold tracking-wide text-xs uppercase">
                  Period
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="border-r border-indigo-500 px-4 py-3 font-semibold tracking-wide text-xs uppercase"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {periods.map((period, pIndex) => (
                <tr
                  key={period}
                  className={`transition ${
                    pIndex % 2 === 0 ? "bg-white" : "bg-slate-50"
                  } hover:bg-indigo-50/50`}
                >
                  <td className="px-4 py-3 border-r border-slate-200 font-semibold text-slate-700 whitespace-nowrap text-xs">
                    {period}
                  </td>
                  {days.map((day) => (
                    <td
                      key={day}
                      className="px-4 py-3 border-r border-slate-200 align-top"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-800">
                          {currentTimetable[pIndex][day]?.subject || "—"}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {currentTimetable[pIndex][day]?.teacher || ""}
                        </span>
                      </div>
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
