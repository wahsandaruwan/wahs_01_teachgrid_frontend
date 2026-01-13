import React, { useEffect } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import { Toaster } from 'react-hot-toast';


import SignInPage from './pages/SignInPage';
import NotAuthorized from './pages/NotAuthorized';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReliefAssignment from './pages/admin/AdminReliefAssignment';
import Attendance from './pages/admin/Attendance';
import LeaveManagement from './pages/admin/LeaveManagement';
import Announcements from './pages/admin/Announcements';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import AdminSignup from './pages/admin/AdminSignup';
import AdminTimeTable from './pages/admin/TimeTable'; 
import TeacherLayout from './pages/teacher/TeacherLayout';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherLeaveManagement from './pages/teacher/leave/LeaveManagement';
import TeacherReliefDuty from './pages/teacher/ReliefDuty';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherSettings from './pages/teacher/Settings';
import TeacherTimeTable from './pages/teacher/TimeTable'; 

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) return <NotAuthorized />;

  return children;
};

const App = () => {
  // Check Dark Mode status when the app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white rounded-xl shadow-lg border border-gray-100 dark:border-slate-700',
          duration: 4000,
        }}
      />
    <Routes>
      <Route path="/" element={<SignInPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="timetable" element={<AdminTimeTable />} /> {/* New route */}
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<LeaveManagement />} />
        <Route path="relief-assignment" element={<AdminReliefAssignment />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="signup" element={<AdminSignup />} />
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <PrivateRoute role="teacher">
            <TeacherLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="timetable" element={<TeacherTimeTable />} /> {/* New route */}
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="leave" element={<TeacherLeaveManagement />} />
        <Route path="relief-duty" element={<TeacherReliefDuty />} />
        <Route path="announcements" element={<TeacherAnnouncements />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotAuthorized />} />
    </Routes>
    </>
  );
};

export default App;