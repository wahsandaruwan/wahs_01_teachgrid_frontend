import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import {
  TrendingUp,
  CheckCircle,
  Users,
  FileText,
  CalendarClock,
  Megaphone,
  Activity,
  Calendar
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

// Helpers 
const isToday = (dateStr) => {
  if (!dateStr) return false;

  const today = new Date();
  const date = new Date(dateStr);

  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

// StatBox
const StatBox = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow border border-blue-300 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-4">
      <p className="text-gray-600 font-medium">{title}</p>
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
    </div>
    <h2 className="text-3xl font-bold text-lime-900 mb-2">{value}</h2>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

// QuickActions
const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-300">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={20} className="text-blue-500" />
        <p className="text-gray-600 font-semibold text-lg">Quick Actions</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/teacher/leave")}
          className="w-full border border-orange-200 rounded-3xl p-3 bg-orange-100 hover:bg-orange-200 transition-all flex items-center justify-center gap-2"
        >
          <Calendar size={18} className="text-orange-500" />
          Apply Leave
        </button>

        <button
          onClick={() => navigate("/teacher/attendance")}
          className="w-full border border-green-300 rounded-3xl p-3 bg-green-100 hover:bg-green-200 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} className="text-green-500" />
          View Attendance
        </button>
      </div>
    </div>
  );
};

// ReliefDuties
const ReliefDuties = ({ data }) => {
  const navigate = useNavigate();

  const hasTodayRelief =
    data && isToday(data.attendance?.date);

  if (!hasTodayRelief) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border border-blue-300">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <CalendarClock size={20} className="text-blue-500" />
          Today’s Relief Duty
        </h3>

        <div className="text-center py-8">
          <CalendarClock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            No relief duties scheduled for today
          </p>
        </div>

        <button
          onClick={() => navigate("/teacher/relief-duty")}
          className="w-full border border-blue-300 py-3 rounded-3xl bg-blue-100 hover:bg-blue-200 transition-all"
        >
          View All Relief Duties
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-300">
      <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
        <CalendarClock size={20} className="text-blue-500" />
        Today’s Relief Duty
      </h3>

      <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-5 rounded-xl border mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-lg mb-1">
              {data.subject} — Class {data.grade}
            </p>
            <p className="text-sm bg-white px-3 py-1 rounded-full inline-block border">
              Period {data.period}
            </p>
          </div>

          <span className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg">
            Today
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/teacher/relief-duty")}
        className="w-full border border-blue-300 py-3 rounded-3xl bg-blue-100 hover:bg-blue-200 transition-all"
      >
        View All Relief Duties
      </button>
    </div>
  );
};

// AnnouncementPreview 
const AnnouncementPreview = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-300 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Megaphone size={20} className="text-orange-500" />
          Latest Announcement
        </h3>

        {!data ? (
          <p className="text-gray-500 text-center py-8">
            No announcements available
          </p>
        ) : (
          <div className="bg-purple-100 p-5 rounded-xl border-l-4 border-red-400">
            <h4 className="font-bold mb-2">{data.title}</h4>
            <p className="text-sm mb-2">{data.description}</p>
            <p className="text-xs bg-white px-3 py-1 rounded-full inline-block">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/teacher/announcements")}
        className="mt-6 w-full border border-purple-300 py-3 rounded-3xl bg-purple-100 hover:bg-purple-200 transition-all"
      >
        View All Announcements
      </button>
    </div>
  );
};

// Main Dashboard 
function Dashboard() {
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
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading dashboard...</p>;
  if (error) return <p className="p-10 text-center text-red-600">{error}</p>;

  return (
    <>
      <Header title="Teacher Dashboard" />

      <main className="p-8 space-y-8 min-h-screen bg-[#F7F8FC]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox
            title="Attendance"
            value={(dashboard?.presentCount || 0) + (dashboard?.lateCount || 0)}
            subtitle="Present + Late"
            icon={<TrendingUp size={20} className="text-blue-500" />}
          />
          <StatBox
            title="Approved Leaves"
            value={dashboard?.approvedLeaves || 0}
            subtitle="This academic year"
            icon={<CheckCircle size={20} className="text-green-500" />}
          />
          <StatBox
            title="Relief Duties"
            value={dashboard?.reliefDuties || 0}
            subtitle="Completed this year"
            icon={<Users size={20} className="text-indigo-500" />}
          />
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReliefDuties data={dashboard?.upcomingRelief} />
          <AnnouncementPreview data={dashboard?.latestAnnouncement} />
        </div>
      </main>
    </>
  );
}

export default Dashboard;
