import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './contexts/UserContext'
import SignInPage from './pages/SignInPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminReliefAssignment from './pages/admin/AdminReliefAssignment'
import Attendance from './pages/admin/Attendance'
import LeaveManagement from './pages/admin/LeaveManagement'
import Announcements from './pages/admin/Announcements'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import TeacherLayout from './pages/teacher/TeacherLayout'
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherLeaveManagement from './pages/teacher/leave/LeaveManagement'
import TeacherReliefDuty from './pages/teacher/ReliefDuty'
import TeacherAnnouncements from './pages/teacher/Announcements'
import TeacherSettings from './pages/teacher/Settings'

import NotAuthorized from './pages/NotAuthorized'

const App = () => {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>

      {/* PUBLIC ROUTE → SIGN IN PAGE */}
      <Route path="/" element={<SignInPage />} />

      {/* If not logged in, block admin and teacher routes */}
      {!user && (
        <>
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="/teacher/*" element={<Navigate to="/" replace />} />
        </>
      )}

      {/* ADMIN ROUTES */}
      {user?.role === 'admin' ? (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="relief-assignment" element={<AdminReliefAssignment />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<NotAuthorized />} />
      )}

      {/* TEACHER ROUTES */}
      {user?.role === 'teacher' ? (
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="leave" element={<TeacherLeaveManagement />} />
          <Route path="relief-duty" element={<TeacherReliefDuty />} />
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>
      ) : (
        <Route path="/teacher/*" element={<NotAuthorized />} />
      )}
    </Routes>
  )
}

export default App;
