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

//StatBox Component 
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

//QuickActions Component
const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-blue-500" />
          <p className="text-gray-600 font-semibold text-lg">Quick Actions</p>
        </div>
        <FileText size={20} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/teacher/leave")}
          className="w-full border border-orange-200 rounded-3xl p-3 bg-orange-100 hover:bg-orange-200 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <Calendar size={18} className="text-orange-500" />
          Apply Leave
        </button>

        <button
          onClick={() => navigate("/teacher/attendance")}
          className="w-full border border-green-300 rounded-3xl p-3 bg-green-100 hover:bg-green-200 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <CheckCircle size={18} className="text-green-500" />
          View Attendance
        </button>
      </div>
    </div>
  );
};

//ReliefDuties Component
const ReliefDuties = ({ data }) => {
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border border-blue-300 hover:shadow-md transition-all duration-200">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-gray-800">
          <CalendarClock size={20} className="text-blue-500" />
          Upcoming Relief Duty
        </h3>

        <div className="text-center py-8">
          <CalendarClock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No upcoming relief duties</p>
        </div>

        <button
          onClick={() => navigate("/teacher/relief-duty")}
          className="mt-6 w-full border border-blue-300 py-3 rounded-3xl text-sm font-semibold bg-blue-100 hover:bg-blue-200 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Users size={16} className="text-blue-500" />
          View All Relief Duties
        </button>
      </div>
    );
  }

  const date = data.attendance?.date
    ? new Date(data.attendance.date).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-300 hover:shadow-md transition-all duration-200">
      <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-gray-800">
        <CalendarClock size={20} className="text-blue-500" />
        Upcoming Relief Duty
      </h3>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-lg text-gray-800 mb-1">
              {data.subject} — Class {data.grade}
            </p>
            <p className="text-sm font-medium text-blue-600 bg-white px-3 py-1 rounded-full inline-block border">
              Period {data.period}
            </p>
          </div>

          <span className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg font-medium ml-4">
            {date}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/teacher/relief-duty")}
        className="w-full border border-blue-300 py-3 rounded-3xl text-sm font-semibold bg-blue-100 hover:bg-blue-200 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Users size={16} className="text-blue-500" />
        View All Relief Duties
      </button>
    </div>
  );
};

//AnnouncementPreview Component
const AnnouncementPreview = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 text-gray-800">
          <Megaphone size={20} className="text-orange-500" />
          Latest Announcement
        </h3>

        {!data ? (
          <div className="text-center py-8">
            <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-2">No announcements available</p>
            <p className="text-sm text-gray-400">Check back later for updates</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-purple-50 p-5 rounded-xl border-l-4 border-red-400">
              <h4 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
                {data.title}
              </h4>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {data.description}
              </p>
              <p className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full inline-block">
                {new Date(data.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/teacher/announcements")}
        className="w-full border border-purple-300 py-3 rounded-3xl text-sm font-semibold bg-purple-100 hover:bg-purple-200 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
      >
        <FileText size={16} className="text-orange-500" />
        View All Announcements
      </button>
    </div>
  );
};

//Main Dashboard 
function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API}/api/dashboard/teacher/dashboard`, {
          withCredentials: true,
        });
        setDashboard(res.data);
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return (
      <p className="p-10 text-center text-gray-600 font-medium">
        Loading dashboard...
      </p>
    );

  if (error)
    return (
      <p className="p-10 text-center text-red-600 font-medium">{error}</p>
    );

  return (
    <>
      <Header title="Teacher Dashboard" />

      <main className="p-8 space-y-8 min-h-screen bg-[#F7F8FC]">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-purple-100 text-lg">
            Manage your teaching schedule and responsibilities
          </p>
        </div>

        {/* Overview Section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBox
              title="Attendance"
              value={dashboard?.presentCount + dashboard?.lateCount || 0}
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
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReliefDuties data={dashboard?.upcomingRelief} />
          <AnnouncementPreview data={dashboard?.latestAnnouncement} />
        </div>
      </main>
    </>
  );
}

export default Dashboard;
