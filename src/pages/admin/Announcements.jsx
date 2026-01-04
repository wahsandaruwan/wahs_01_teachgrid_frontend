import Header from '../../components/Header'
import {
  Megaphone,
  AlertTriangle,
  Bell,
  Plus,
  Search,
  Calendar,
  Edit3,
  Trash2,
  X,
  CheckCircle,
} from 'lucide-react'
import { useState, useEffect, useCallback, useMemo } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Announcements = () => {
  const [activeTab, setActiveTab] = useState('view')
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
  })
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: '',
  })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [announcements, setAnnouncements] = useState([])

  // Toast notification state
  const [toast, setToast] = useState({
    type: '', // 'success' | 'error' | 'info'
    message: '',
    visible: false,
  })

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: null,
  })

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
    if (activeTab === 'view') {
      const id = setTimeout(fetchAnnouncements, 300)
      return () => clearTimeout(id)
    }
  }, [activeTab, fetchAnnouncements])

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      priority: '',
    })
    setEditingId(null)
  }

  // Toast helper
  const showToast = (type, message) => {
    setToast({ type, message, visible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 4000)
  }

  const handlePublish = async () => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category ||
      !formData.priority
    ) {
      showToast('error', 'Please fill in all required fields before publishing.')
      return
    }

    try {
      setLoading(true)
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `${API_BASE_URL}/api/announcements/${editingId}`
        : `${API_BASE_URL}/api/announcements`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to save announcement')

      resetForm()
      setActiveTab('view')
      showToast(
        'success',
        editingId 
          ? 'Announcement updated successfully.' 
          : 'Announcement published successfully.'
      )
      fetchAnnouncements()
    } catch (err) {
      showToast('error', err.message || 'Unable to save the announcement.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    setConfirmDialog({
      open: true,
      title: 'Delete Announcement',
      description: 'This action cannot be undone. Are you sure you want to delete this announcement?',
      onConfirm: async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/announcements/${id}`,
            { method: 'DELETE' }
          )
          if (!res.ok) throw new Error('Failed to delete announcement.')
          setAnnouncements(prev => prev.filter(a => a._id !== id))
          showToast('success', 'Announcement deleted successfully.')
        } catch (err) {
          showToast('error', err.message || 'Unable to delete the announcement.')
        } finally {
          setConfirmDialog(prev => ({ ...prev, open: false }))
        }
      },
    })
  }

  const startEdit = ann => {
    setEditingId(ann._id)
    setFormData({
      title: ann.title,
      content: ann.content,
      category: ann.category,
      priority: ann.priority,
    })
    setActiveTab('create')
  }

  const categories = ['Meeting', 'Technology', 'Schedule', 'Safety', 'Development']
  const priorities = ['normal', 'high']

  return (
    <>
      <Header title="Announcements" />

      <div className="flex-1 min-h-screen bg-white p-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Announcements"
            value={stats.total}
            subtitle="All time"
            icon={<Megaphone className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="High Priority"
            value={stats.highPriority}
            subtitle="Urgent notices"
            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            title="Published Today"
            value={stats.today}
            subtitle="New posts"
            icon={<Bell className="w-5 h-5 text-emerald-600" />}
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-white shadow-md rounded-xl p-1 mb-6 border">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'view'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Megaphone size={16} />
            View All
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Plus size={16} />
            {editingId ? 'Edit' : 'Create New'}
          </button>
        </div>

        {/* View Tab */}
        {activeTab === 'view' && (
          <div className="bg-white rounded-2xl shadow-md border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-indigo-600" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Manage Announcements
                  </h2>
                  <p className="text-xs text-slate-500">
                    View, edit, and manage all announcements
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6 p-3 bg-slate-50 rounded-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  placeholder="Search announcements..."
                  value={filters.search}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={filters.priority}
                onChange={e =>
                  setFilters(prev => ({ ...prev, priority: e.target.value }))
                }
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent outline-none"
              >
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="normal">Normal</option>
              </select>
              <select
                value={filters.category}
                onChange={e =>
                  setFilters(prev => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* List */}
            <div className="space-y-3">
              {announcements.map(ann => (
                <AnnouncementCard
                  key={ann._id}
                  announcement={ann}
                  onEdit={() => startEdit(ann)}
                  onDelete={() => handleDelete(ann._id)}
                />
              ))}

              {announcements.length === 0 && (
                <div className="text-center py-12">
                  <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-slate-500 mb-1">
                    No announcements found
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust filters or create a new announcement
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create / Edit Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-md border p-6 w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-1.5 h-8 rounded-full ${
                  editingId ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? 'Edit Announcement' : 'Create Announcement'}
                </h2>
                <p className="text-xs text-slate-500">
                  {editingId
                    ? 'Update the existing announcement'
                    : 'Share an update with your staff'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="ml-auto p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <form className="space-y-4">
              <FormInput
                label="Title"
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter announcement title"
                required
              />

              <FormSelect
                label="Category"
                value={formData.category}
                onChange={e =>
                  setFormData(prev => ({ ...prev, category: e.target.value }))
                }
                options={categories}
                placeholder="Select category"
              />

              <FormTextarea
                label="Content"
                value={formData.content}
                onChange={e =>
                  setFormData(prev => ({ ...prev, content: e.target.value }))
                }
                placeholder="Write the announcement details..."
                rows={5}
              />

              <FormSelect
                label="Priority"
                value={formData.priority}
                onChange={e =>
                  setFormData(prev => ({ ...prev, priority: e.target.value }))
                }
                options={priorities.map(p => ({
                  value: p,
                  label: p === 'high' ? 'High ⚠️' : 'Normal',
                }))}
                placeholder="Select priority"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow hover:shadow-md hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Bell size={16} />
                      {editingId ? 'Update' : 'Publish'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`
            fixed bottom-6 right-6 z-50 max-w-sm w-80 px-5 py-4 rounded-2xl shadow-2xl text-sm flex items-start gap-3 border backdrop-blur-sm
            ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-900 border-emerald-200/50'
                : 'bg-red-500/10 text-red-900 border-red-200/50'
            }
          `}
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.type === 'success' && (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
            {toast.type === 'error' && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(prev => ({ ...prev, visible: false }))}
            className="flex-shrink-0 p-1 ml-2 -mr-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 w-full max-w-md p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 pt-0.5">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {confirmDialog.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {confirmDialog.description}
                </p>
              </div>
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                className="flex-shrink-0 p-2 ml-auto text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* Reusable components remain unchanged */
const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 shadow-md border bg-white">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-[11px] font-medium text-slate-600">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
    </div>
  </div>
)

const AnnouncementCard = ({ announcement, onEdit, onDelete }) => {
  const isHigh = announcement.priority === 'high'
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-8 rounded-full ${
              isHigh ? 'bg-red-500' : 'bg-indigo-500'
            }`}
          />
          <h3 className="text-base font-semibold text-slate-900">
            {announcement.title}
          </h3>
          <span className="px-2.5 py-1 text-[10px] font-medium bg-indigo-50 text-indigo-700 rounded-full">
            {announcement.category}
          </span>
          {isHigh && (
            <span className="px-2.5 py-1 text-[10px] font-semibold bg-red-500 text-white rounded-full">
              ⚠ High
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        {announcement.content}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-[10px] font-semibold">
            AD
          </div>
          <span>Admin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          {new Date(announcement.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Edit3 size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  )
}

const FormInput = ({ label, value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent outline-none"
    />
  </div>
)

const FormTextarea = ({ label, value, onChange, placeholder, rows }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent outline-none resize-vertical min-h-[90px]"
    />
  </div>
)

const FormSelect = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map(opt => {
        const valueProp = opt.value || opt
        const labelProp = opt.label || opt
        return (
          <option key={valueProp} value={valueProp}>
            {labelProp}
          </option>
        )
      })}
    </select>
  </div>
)

export default Announcements;
