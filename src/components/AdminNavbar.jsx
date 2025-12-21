import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const navItems = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2 7-7 7 7 2 2v7a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2v-7z" />
      </svg>
    )
  },
  {
    path: '/admin/attendance',
    label: 'Attendance Records',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M9 8h6m-7 8H6a2 2 0 01-2-2V6a2 2 0 012-2h5.5a2 2 0 011.415.586l3.5 3.5A2 2 0 0117 9.5V18a2 2 0 01-2 2H7z" />
      </svg>
    )
  },
  {
    path: '/admin/leave',
    label: 'Leave Management',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    )
  },
  {
    path: '/admin/relief-assignment',
    label: 'Relief Assignment',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    path: '/admin/announcements',
    label: 'Announcements',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M9 16h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    path: '/admin/reports',
    label: 'Reports',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H7a2 2 0 00-2 2v12a2 2 0 002 2h6m4-16h2a2 2 0 012 2v5m-6 3h6m-6 4h6m-6-8h6" />
      </svg>
    )
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>
    )
  }
]

const AdminNavbar = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  // 1. Theme State එක පාලනය
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark')

  // 2. Class එක toggle කිරීම සහ LocalStorage update කිරීම
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  if (!user || user.role !== 'admin') {
    return null
  }

  const handleSignOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <aside className="fixed left-0 top-0 flex h-full w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 transition-colors duration-300">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Management System</p>
        
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-yellow-400 dark:hover:bg-slate-800 transition-all active:scale-90"
        >
          {isDark ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          {(user.name || 'U')
            .split(' ')
            .filter(Boolean)
            .map((part) => part.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{user.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
        <span className="mt-3 inline-flex items-center rounded-full bg-slate-900 dark:bg-indigo-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {user.role}
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>{item.icon}</span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-6 flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900/30 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </button>
    </aside>
  )
}

export default AdminNavbar