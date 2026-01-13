import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
   API CONFIG
======================= */
const API = import.meta.env.VITE_API_BASE_URL;

/* =======================
   TOP BAR
======================= */
const TopBar = () => (
  <header className="flex justify-between items-center bg-white p-5 rounded-xl shadow">
    <h2 className="text-2xl font-semibold text-gray-800">
      Teacher Dashboard
    </h2>

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

/* =======================
   STAT BOX
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
        <div
          className="h-full bg-black rounded-full"
          style={{ width: value }}
        />
      </div>
    )}

    {subtitle && (
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    )}
  </div>
);

/* =======================
   QUICK ACTIONS
======================= */
const QuickActions = () => {
  const navigate = useNavigate();

  return (
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
  );
};

/* =======================
   RELIEF DUTIES
======================= */
const ReliefDuties = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarClock size={20} />
          Upcoming Relief Duties
        </h3>

        {!data ? (
          <p className="text-sm text-gray-500 mt-4">
            No upcoming relief duties
          </p>
        ) : (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg flex justify-between">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <Clock size={18} />
                {data.startTime} – {data.endTime}
              </p>
              <p className="text-gray-600">
                {data.subject} - {data.grade}
              </p>
            </div>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
              {new Date(data.date).toLocaleDateString()}
            </span>
          </div>
        )}
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
const AnnouncementPreview = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Megaphone size={20} />
          Latest Announcement
        </h3>

        {!data ? (
          <p className="text-sm text-gray-500 mt-4">
            No announcements available
          </p>
        ) : (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-red-600">
            <h4 className="font-semibold text-gray-800">
              {data.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {data.description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
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
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${API}/api/dashboard/teacher/dashboard`,
          { withCredentials: true }
        );
        setDashboard(res.data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-10">Loading dashboard...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;

  return (
    <main className="flex-1 p-10 space-y-8 bg-gray-50">
      <TopBar />

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">
          Welcome back!
        </h2>
        <p className="text-sm opacity-90">
          Here's your overview for today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          title="Attendance Rate"
          value={`${dashboard.attendanceRate}%`}
          icon={<TrendingUp size={20} className="text-gray-500" />}
          bar
        />

        <StatBox
          title="Approved Leaves"
          value={dashboard.approvedLeaves}
          subtitle="This academic year"
          icon={<CheckCircle size={20} className="text-gray-500" />}
        />

        <StatBox
          title="Relief Duties"
          value={dashboard.reliefDuties}
          subtitle="Completed this year"
          icon={<Users size={20} className="text-gray-500" />}
        />

        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReliefDuties data={dashboard.upcomingRelief} />
        <AnnouncementPreview data={dashboard.latestAnnouncement} />
      </div>
    </main>
  );
}
