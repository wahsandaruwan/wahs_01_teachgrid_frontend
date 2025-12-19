import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  Bell,
  Settings,
  LogOut
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/teacher/dashboard' },
  { label: 'Attendance Records', icon: <Calendar size={20} />, path: '/teacher/attendance' },
  { label: 'Leave Management', icon: <ClipboardList size={20} />, path: '/teacher/leave' },
  { label: 'Relief Duty', icon: <Users size={20} />, path: '/teacher/relief-duty' },
  { label: 'Announcements', icon: <Bell size={20} />, path: '/teacher/announcements' }
]

const TeacherNavbar = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold uppercase">
            {(user?.name || 'T')
              .split(' ')
              .filter(Boolean)
              .map((part) => part.charAt(0))
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{user?.name || 'Teacher'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'teacher@example.com'}</p>
          </div>
        </div>

        <span className="inline-block bg-gray-100 text-black text-xs font-medium px-2 py-1 rounded-full mb-10 capitalize">
          {user?.role || 'teacher'}
        </span>

        <div className="border-t border-gray-200 mb-6" />

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 w-full text-left rounded-md transition ${
                  isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <NavLink
          to="/teacher/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md transition ${
              isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings size={18} /> Settings
        </NavLink>

        <button
          type="button"
          onClick={async () => {
            await logout()
            navigate('/', { replace: true })
          }}
          className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-100 rounded-md w-full text-left"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default TeacherNavbar



