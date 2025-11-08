import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./TopBar";
import Cardviews from "./Cardviews";
import Reliefduties from "./Reliefduties";
import Announcements from "./Announcements";
import TeachNavigationBar from "./TeachNavigationbar";

export default function Dashboard() {
  {/* Temporary sample pages for route navigation */}
  const AttendancePage = () => (
    <div className="p-10 text-2xl font-semibold text-gray-800">
      Attendance Records Page
    </div>
  );

  const LeavePage = () => (
    <div className="p-10 text-2xl font-semibold text-gray-800">
      Leave Management Page
    </div>
  );

  const ReliefPage = () => (
    <div className="p-10 text-2xl font-semibold text-gray-800">
      Relief Duty Page
    </div>
  );

  const AnnouncementPage = () => (
    <div className="p-10 text-2xl font-semibold text-gray-800">
      Announcement Page
    </div>
  );

  const SettingsPage = () => (
    <div className="p-10 text-2xl font-semibold text-gray-800">
      Settings Page
    </div>
  );

  const LogoutPage = () => (
    <div className="p-10 text-2xl font-semibold text-red-600">
      You have been logged out.
    </div>
  );

  return (
    <Router>
      {/* navigation bar include here */}
      <div className="flex h-screen bg-gray-100">
        <TeachNavigationBar />

      {/*tob bar include here*/}
        <div className="flex-1 flex flex-col">
          <TopBar />

          <main className="flex-1 p-4 space-y-6 overflow-auto">
            <Routes>
              {/*Default Dashboard  */}
              <Route
                path="/"
                element={
                  <>


                    {/*greating*/}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
                      <h2 className="text-2xl font-semibold">
                        Welcome back, Sama Perera!
                      </h2>
                      <p className="text-sm opacity-90">
                        Here's your overview for today.
                      </p>
                    </div>

                    {/*card views include here*/}
                    <div className="flex -1 flex flex-col">
                      <Cardviews />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/*relief duties inclide here*/}
                      <Reliefduties />

                      {/*announcement include here*/}
                      <Announcements />
                    </div>
                  </>
                }
              />

              {/* Sample Navigation Pages */}
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
