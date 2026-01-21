import Header from '../../components/Header'
import { AiOutlineSound, AiFillWarning, AiFillBell } from 'react-icons/ai'
import { FiSearch, FiCalendar } from 'react-icons/fi'
import { useState, useEffect, useCallback, useMemo } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Announcements = () => {
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
  })
  const [announcements, setAnnouncements] = useState([])

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    return {
      total: announcements.length,
      highPriority: announcements.filter(a => a.priority === 'high').length,
      today: announcements.filter(
        a => new Date(a.createdAt).toDateString() === today
      ).length,
    }
  }, [announcements])

  const fetchAnnouncements = useCallback(async () => {
    try {
      const query = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value)
      })

      const res = await fetch(
        `${API_BASE_URL}/api/announcements?${query.toString()}`
      )
      if (!res.ok) throw new Error('Failed to fetch announcements')
      const data = await res.json()
      setAnnouncements(data)
    } catch (err) {
      console.error(err)
    }
  }, [filters])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const categories = ['Meeting', 'Technology', 'Schedule', 'Safety', 'Development']

  return (
    <>
      <Header title="Announcements" />

      <div className="flex-1 min-h-screen bg-slate-50 p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total"
            value={stats.total}
            subtitle="All time"
            icon={<AiOutlineSound className="w-6 h-6 text-blue-600" />}
            bg="bg-white border border-blue-200"
          />
          <StatCard
            title="High Priority"
            value={stats.highPriority}
            subtitle="Urgent"
            icon={<AiFillWarning className="w-6 h-6 text-red-500" />}
            bg="bg-white border border-blue-200"
          />
          <StatCard
            title="Today"
            value={stats.today}
            subtitle="New"
            icon={<AiFillBell className="w-6 h-6 text-green-500" />}
            bg="bg-white border border-blue-200"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <AiOutlineSound className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Announcements
                </h2>
                <p className="text-xs text-slate-500">Latest updates</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search..."
                value={filters.search}
                onChange={e =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none"
              />
            </div>
            <select
              value={filters.priority}
              onChange={e =>
                setFilters(prev => ({ ...prev, priority: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 cursor-pointer"
            >
              <option value="">All Priority</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal</option>
            </select>
            <select
              value={filters.category}
              onChange={e =>
                setFilters(prev => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="space-y-3">
            {announcements.map(ann => (
              <AnnouncementCard key={ann._id} announcement={ann} />
            ))}

            {announcements.length === 0 && (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8">
                <AiOutlineSound className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-600 mb-1">
                  No announcements
                </h3>
                <p className="text-xs text-slate-400">Adjust filters to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const StatCard = ({ title, value, subtitle, icon, bg }) => (
  <div
    className={`relative overflow-hidden rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${bg}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-100">
        {icon}
      </div>
    </div>
  </div>
)

const AnnouncementCard = ({ announcement }) => {
  const isHigh = announcement.priority === 'high'

  const categoryColors = {
    Meeting: 'bg-pink-500 text-white',
    Technology: 'bg-blue-600 text-white',
    Schedule: 'bg-purple-500 text-white',
    Safety: 'bg-orange-500 text-white',
    Development: 'bg-green-600 text-white',
  }

  return (
    <div className="group bg-white border border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-1">
          <div
            className={`w-1.5 h-6 rounded-full ${
              isHigh ? 'bg-red-500' : 'bg-blue-500'
            }`}
          />
          <h3 className="text-sm font-semibold text-slate-900 pr-2 flex-1 min-w-0 truncate">
            {announcement.title}
          </h3>
          <span
            className={`px-3 py-1 text-[11px] font-medium rounded-full ${
              categoryColors[announcement.category] || 'bg-blue-600 text-white'
            }`}
          >
            {announcement.category}
          </span>
          {isHigh && (
            <span className="flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-full bg-red-500 text-white">
              <AiFillWarning size={12} className="shrink-0" />
              High
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
        {announcement.content}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
            AD
          </div>
          <span className="text-xs text-slate-500">Admin</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <FiCalendar size={12} className="text-green-600" />
          <span>
            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Announcements