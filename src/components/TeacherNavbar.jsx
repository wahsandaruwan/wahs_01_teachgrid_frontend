import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const navItems = [
  {
    path: '/teacher/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2 7-7 7 7 2 2v7a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2v-7z" />
      </svg>
    )
  },
  {
    path: '/teacher/timetable',
    label: 'Timetable',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    )
  },
  {
    path: '/teacher/attendance',
    label: 'Attendance Records',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M9 8h6m-7 8H6a2 2 0 01-2-2V6a2 2 0 012-2h5.5a2 2 0 011.415.586l3.5 3.5A2 2 0 0117 9.5V18a2 2 0 01-2 2H7z" />
      </svg>
    )
  },
  {
    path: '/teacher/leave',
    label: 'Leave Management',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    )
  },
  {
    path: '/teacher/relief-duty',
    label: 'Relief Assignment',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    path: '/teacher/announcements',
    label: 'Announcements',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M9 16h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    path: '/teacher/reports',
    label: 'Reports',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H7a2 2 0 00-2 2v12a2 2 0 002 2h6m4-16h2a2 2 0 012 2v5m-6 3h6m-6 4h6m-6-8h6" />
      </svg>
    )
  },
  {
    path: '/teacher/settings',
    label: 'Settings',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>
    )
  }
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

  if (!user || user.role !== 'teacher') {
    return null
  }

  const handleSignOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      {/* Mobile drawer state (CSS-only) */}
      <input id="teacher-nav-drawer" type="checkbox" className="peer sr-only" aria-hidden="true" />

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-[60] flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-100/95">
        <label
          htmlFor="teacher-nav-drawer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900"
          aria-label="Open navigation menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>

        <div className="min-w-0 flex-1 px-3">
          <div className="truncate text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-black">
            H/Meegasara Maha Vidyalaya
          </div>
        </div>

        {/* Dark Mode Toggle (same behavior as desktop) */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-700 dark:hover:bg-slate-200 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          title="Toggle Dark Mode"
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

      {/* Mobile overlay (tap to close) */}
      <label
        htmlFor="teacher-nav-drawer"
        className="fixed inset-0 z-[55] hidden bg-black/40 backdrop-blur-sm peer-checked:block md:hidden"
        aria-label="Close navigation menu"
      />

      <aside className="fixed left-0 top-0 z-[70] flex h-screen w-72 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-100 px-6 py-6 shadow-lg dark:shadow-slate-900/50 transition-transform duration-300 -translate-x-full peer-checked:translate-x-0 md:translate-x-0">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-black">
          H/Meegasara Maha Vidyalaya
        </h1>
        <button 
          onClick={() => setIsDark(!isDark)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          title="Toggle Dark Mode"
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

      {/* Profile Card */}
      <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-100 p-5 text-center shadow-sm dark:shadow-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-xl shadow-indigo-300/50 dark:shadow-indigo-900/50 overflow-hidden ring-2 ring-slate-100/50 dark:ring-slate-700/50">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={`${user.name}'s avatar`}
              className="h-full w-full object-cover rounded-full"
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            (user?.name || 'T')
              .split(' ')
              .filter(Boolean)
              .map((part) => part.charAt(0))
              .join('')
              .slice(0, 2)
              .toUpperCase()
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-black truncate">{user.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-800 truncate max-w-[14rem]">{user.email}</p>
        <span className="mt-3 inline-flex items-center rounded-full bg-slate-900 dark:bg-indigo-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
          Teacher
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-600 dark:to-indigo-700 text-white shadow-lg shadow-slate-900/30 dark:shadow-indigo-500/50 ring-2 ring-slate-200/50 dark:ring-indigo-400/30'
                  : 'text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`mr-3 flex-shrink-0 transition-all ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-sm" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center rounded-xl border-2 border-red-200 dark:border-red-800/50 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:shadow-md hover:shadow-red-500/10 active:scale-[0.98] bg-gradient-to-r bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
      </aside>
    </>
  )
}

export default TeacherNavbar
