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
  Clock,
  Megaphone,
  User
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;



/* stat box */
const StatBox = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
    <div className="flex justify-between items-center">
      <p className="text-gray-600 font-medium">{title}</p>
      {icon}
    </div>
    <h2 className="text-3xl font-bold mt-3">{value}</h2>
    {subtitle && (
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    )}
  </div>
);

/* quick action buttons */
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

/* relief duty card view */
const ReliefDuties = ({ data }) => {
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarClock size={20} /> Upcoming Relief Duty
        </h3>
        <p className="text-sm text-gray-500 mt-4">
          No upcoming relief duties
        </p>
      </div>
    );
  }

  const date = data.attendance?.date
    ? new Date(data.attendance.date).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <CalendarClock size={20} /> Upcoming Relief Duty
      </h3>

      <div className="mt-4 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">
            {data.subject} — Class {data.grade}
          </p>
          <p className="text-xs text-gray-500">
            Period {data.period}
          </p>
        </div>

        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
          {date}
        </span>
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

 


/* Announcement card view */
const AnnouncementPreview = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Megaphone size={20} /> Latest Announcement
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

/*main dashboard */
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
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-10">Loading dashboard...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;

  /* normalize upcoming relief */
  const upcomingRelief = dashboard.upcomingRelief;


  return (
   <>
      <Header title="Teacher Dashboard" />

      <main className="p-8 bg-gray-50 min-h-screen space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold">Welcome back!</h2>
          <p className="text-sm opacity-90">
            Here's your overview for today.
          </p>
        </div>
    

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          title="All Attendance Count "
          value={`${dashboard.attendanceCount}`}
          icon={<TrendingUp size={20} className="text-gray-500" />}
          
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
        <ReliefDuties data={upcomingRelief} />
        <AnnouncementPreview data={dashboard.latestAnnouncement} />
      </div>
    </main>
    </>
  );
}
