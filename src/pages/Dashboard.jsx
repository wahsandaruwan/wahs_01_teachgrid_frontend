import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { TrendingUp, CheckCircle, Users, FileText, CalendarClock, Clock, Megaphone, Bell, User } from "lucide-react";
import TeachNavigationBar from "../components/TeachNavigationbar"; // assuming this stays external


// TOPBAR COMPONENT

function TopBar() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 w-full">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}



// CARDVIEWS COMPONENT

function Cardviews() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Attendance */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Attendance Rate</p>
          <TrendingUp size={20} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mt-3">20%</h2>

        <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
          <div className="h-full bg-black rounded-full w-[20%]"></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">This month</p>
      </div>

      {/* Approved Leaves */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Approved Leaves</p>
          <CheckCircle size={20} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mt-3">3/5</h2>
        <p className="text-sm text-gray-500 mt-1">This academic year</p>
      </div>

      {/* Relief Duties */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Relief Duties</p>
          <Users size={20} className="text-gray-500" />
        </div>
        <h2 className="text-3xl font-bold mt-3">12</h2>
        <p className="text-sm text-gray-500 mt-1">Completed this year</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Quick Actions</p>
          <FileText size={20} className="text-gray-500" />
        </div>

        <button
          onClick={() => navigate("/leave")}
          className="w-full mt-4 border border-gray-300 rounded-lg p-2 hover:bg-gray-100"
        >
          Apply Leave
        </button>

        <button
          onClick={() => navigate("/attendance")}
          className="w-full mt-3 border border-gray-300 rounded-lg p-2 hover:bg-gray-100"
        >
          View Attendance
        </button>
      </div>

    </div>
  );
}



// RELIEFDUTIES COMPONENT

function Reliefduties() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarClock size={20} />
          Upcoming Relief Duties
        </h3>
        <p className="text-gray-500 text-sm">Your assigned substitute teaching schedule</p>

        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <Clock size={20} className="text-gray-600" />
                09:00 AM - 10:00 AM
              </p>
              <p className="text-gray-600 flex">Mathematics - Grade 8A</p>
              <p className="text-sm text-gray-400">Covering for Ms. Anderson</p>
            </div>

            <span className="inline-block text-xs bg-blue-600 text-white px-2 py-[2px] rounded-md">
              2024-01-15
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/relief")}
        className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
      >
        View All Relief Duties
      </button>
    </div>
  );
}



// ANNOUNCEMENTS COMPONENT

function Announcements() {
  const navigate = useNavigate();
  const priority = "High";

  const getPriorityColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-800";
      case "Medium":
        return "bg-black";
      case "Low":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Megaphone size={20} />
          Latest Announcements
        </h3>
        <p className="text-gray-500 text-sm">Important updates from administration</p>

        <div className="mt-4 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-800">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">
                Staff Meeting - January 20th
              </h4>

              <span
                className={`inline-block text-xs text-white px-2 py-[2px] rounded-md ${getPriorityColor(priority)}`}
              >
                {priority}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              Mandatory staff meeting to discuss upcoming semester changes.
            </p>

            <p className="text-xs text-gray-400 mt-1">2024-01-10</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/announcement")}
        className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
      >
        View All Announcements
      </button>
    </div>
  );
}



// MAIN DASHBOARD COMPONENT

export default function Dashboard() {
  const AttendancePage = () => <div className="p-10 text-2xl font-semibold">Attendance Records Page</div>;
  const LeavePage = () => <div className="p-10 text-2xl font-semibold">Leave Management Page</div>;
  const ReliefPage = () => <div className="p-10 text-2xl font-semibold">Relief Duty Page</div>;
  const AnnouncementPage = () => <div className="p-10 text-2xl font-semibold">Announcement Page</div>;
  const SettingsPage = () => <div className="p-10 text-2xl font-semibold">Settings Page</div>;
  const LogoutPage = () => <div className="p-10 text-2xl font-semibold text-red-600">You have been logged out</div>;

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <TeachNavigationBar />

        <div className="flex-1 flex flex-col">
          <TopBar />

          <main className="flex-1 p-4 space-y-6 overflow-auto">
            <Routes>

              {/* Default Dashboard */}
              <Route
                path="/"
                element={
                  <>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
                      <h2 className="text-2xl font-semibold">Welcome back, Sama Perera!</h2>
                      <p className="text-sm opacity-90">Here's your overview for today.</p>
                    </div>

                    <Cardviews />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      <Reliefduties />
                      <Announcements />
                    </div>
                  </>
                }
              />

              {/* Other Pages */}
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/relief" element={<ReliefPage />} />
              <Route path="/announcement" element={<AnnouncementPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/logout" element={<LogoutPage />} />

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
