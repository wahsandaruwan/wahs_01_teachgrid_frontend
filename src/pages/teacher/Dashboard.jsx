import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle,
  Users,
  FileText,
  CalendarClock,
  Clock,
  Megaphone,
  User
} from "lucide-react";

/* =======================
   TOP BAR
======================= */
const TopBar = () => {
  return (
    <header className="flex justify-between items-center bg-white p-5 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-gray-800">Teacher Dashboard</h2>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Megaphone size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

/* =======================
   STAT BOX (REUSABLE)
======================= */
const StatBox = ({ title, value, subtitle, icon, bar }) => (
  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
    <div className="flex justify-between items-center">
      <p className="text-gray-600 font-medium">{title}</p>
      {icon}
    </div>

    <h2 className="text-3xl font-bold mt-3">{value}</h2>

    {bar && (
      <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
        <div className="h-full bg-black rounded-full w-[20%]"></div>
      </div>
    )}

    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

/* =======================
   CARD VIEWS
======================= */
const CardViews = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatBox
        title="Attendance Rate"
        value="92%"
        icon={<TrendingUp size={20} className="text-gray-500" />}
        bar
      />

      <StatBox
        title="Approved Leaves"
        value="3 / 5"
        subtitle="This academic year"
        icon={<CheckCircle size={20} className="text-gray-500" />}
      />

      <StatBox
        title="Relief Duties"
        value="12"
        subtitle="Completed this year"
        icon={<Users size={20} className="text-gray-500" />}
      />

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium">Quick Actions</p>
          <FileText size={20} className="text-gray-500" />
        </div>

        <button
          onClick={() => navigate("/teacher/leave")}
          className="w-full mt-4 border border-gray-300 rounded-lg p-2 hover:bg-gray-100"
        >
          Apply Leave
        </button>

        <button
          onClick={() => navigate("/teacher/attendance")}
          className="w-full mt-3 border border-gray-300 rounded-lg p-2 hover:bg-gray-100"
        >
          View Attendance
        </button>
      </div>
    </div>
  );
};

/* =======================
   RELIEF DUTIES
======================= */
const ReliefDuties = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarClock size={20} /> Upcoming Relief Duties
        </h3>

        <p className="text-gray-500 text-sm">Your assigned substitute duties</p>

        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <Clock size={18} /> 09:00 AM – 10:00 AM
              </p>
              <p className="text-gray-600">Mathematics - Grade 8A</p>
              <p className="text-sm text-gray-400">
                Covering for Ms. Anderson
              </p>
            </div>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              2024-01-15
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/teacher/relief-duty")}
        className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
      >
        View All Relief Duties
      </button>
    </div>
  );
};

/* =======================
   ANNOUNCEMENTS
======================= */
const AnnouncementPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Megaphone size={20} /> Latest Announcements
        </h3>

        <p className="text-gray-500 text-sm">Important updates</p>

        <div className="mt-4">
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-600">
            <h4 className="font-semibold text-gray-800">
              Staff Meeting – Jan 20
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Mandatory meeting for semester updates.
            </p>
            <p className="text-xs text-gray-400 mt-1">2024-01-10</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/teacher/announcements")}
        className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
      >
        View All Announcements
      </button>
    </div>
  );
};

/* =======================
   MAIN DASHBOARD
======================= */
export default function TeacherDashboard() {
  return (
    <main className="flex-1 p-10 space-y-8 bg-gray-50">
      <TopBar />

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">
          Welcome back, Sama Perera!
        </h2>
        <p className="text-sm opacity-90">
          Here's your overview for today.
        </p>
      </div>

      <CardViews />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReliefDuties />
        <AnnouncementPreview />
      </div>
    </main>
  );
}
