import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon
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

  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark')

  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 shadow-lg p-6 flex flex-col justify-between min-h-screen border-r border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-900 dark:bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold uppercase">
            {(user?.name || 'T')
              .split(' ')
              .filter(Boolean)
              .map((part) => part.charAt(0))
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white leading-tight">{user?.name || 'Teacher'}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">{user?.email || 'teacher@example.com'}</p>
          </div>
        </div>

        {/* Role Badge and Theme Toggle */}
        <div className="flex items-center justify-between mb-8">
          <span className="inline-block bg-gray-100 dark:bg-slate-800 text-black dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-md capitalize tracking-wider">
            {user?.role || 'teacher'}
          </span>
          
          {/* Dark Mode Toggle Button */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 transition-all active:scale-90"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-800 mb-6" />

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2.5 w-full text-left rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive 
                    ? 'bg-black dark:bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
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
            `flex items-center gap-3 p-2.5 rounded-xl transition-all text-sm font-medium ${
              isActive 
                ? 'bg-black dark:bg-indigo-600 text-white shadow-md' 
                : 'text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
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
          className="flex items-center gap-3 p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl w-full text-left text-sm font-medium transition-all"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default TeacherNavbar