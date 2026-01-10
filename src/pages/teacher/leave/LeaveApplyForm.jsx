import { useState, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X, Upload } from 'lucide-react'

const LeaveApplyForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    documents: []
  })
  const [errors, setErrors] = useState({})
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const fileInputRef = useRef(null)

  const leaveTypes = ['Annual Leave', 'Medical Leave', 'Personal Leave', 'Emergency Leave']

  const validateForm = () => {
    const newErrors = {}
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (!formData.reason.trim()) newErrors.reason = 'Please provide a reason for leave'
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end < start) newErrors.endDate = 'End date must be after start date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit?.(formData)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() }
  }

  const formatDate = (date) => {
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${m}/${d}/${date.getFullYear()}`
  }

  const handleDateClick = (day, isStart) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const formatted = formatDate(selected)
    if (isStart) {
      setFormData(p => ({ ...p, startDate: formatted }))
      setShowStartCalendar(false)
      setErrors(p => ({ ...p, startDate: '' }))
    } else {
      setFormData(p => ({ ...p, endDate: formatted }))
      setShowEndCalendar(false)
      setErrors(p => ({ ...p, endDate: '' }))
    }
  }

  const navigateMonth = (dir) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + dir)
    setCurrentMonth(newMonth)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(f => {
      const valid = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'].includes(f.type)
      const sizeOk = f.size <= 10 * 1024 * 1024
      return valid && sizeOk
    })
    setFormData(p => ({ ...p, documents: [...p.documents, ...validFiles] }))
  }

  const removeFile = (idx) => {
    setFormData(p => ({ ...p, documents: p.documents.filter((_, i) => i !== idx) }))
  }

  const CalendarComponent = ({ isStart }) => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-sm font-semibold text-gray-900">{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
          <button type="button" onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear()
            return (
              <button key={day} type="button" onClick={() => handleDateClick(day, isStart)}
                className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${isToday ? 'bg-blue-500 text-white font-semibold' : 'hover:bg-blue-50 text-gray-700'}`}>
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">+ Apply for Leave</h2>
        <p className="text-sm text-gray-600">Submit a new leave request for approval</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Leave Type <span className="text-red-500">*</span></label>
          <select value={formData.leaveType} onChange={(e) => { setFormData(p => ({ ...p, leaveType: e.target.value })); setErrors(p => ({ ...p, leaveType: '' })) }}
            className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.leaveType ? 'border-red-400' : 'border-gray-200'}`}>
            <option value="">Select leave type</option>
            {leaveTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.leaveType && <p className="mt-2 text-sm text-red-500">{errors.leaveType}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Start Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="text" placeholder="mm/dd/yyyy" value={formData.startDate} onFocus={() => setShowStartCalendar(true)} readOnly
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${errors.startDate ? 'border-red-400' : 'border-gray-200'}`} />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {showStartCalendar && <><div className="fixed inset-0 z-40" onClick={() => setShowStartCalendar(false)} /><CalendarComponent isStart={true} /></>}
            {errors.startDate && <p className="mt-2 text-sm text-red-500">{errors.startDate}</p>}
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-3">End Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="text" placeholder="mm/dd/yyyy" value={formData.endDate} onFocus={() => setShowEndCalendar(true)} readOnly
                className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${errors.endDate ? 'border-red-400' : 'border-gray-200'}`} />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {showEndCalendar && <><div className="fixed inset-0 z-40" onClick={() => setShowEndCalendar(false)} /><CalendarComponent isStart={false} /></>}
            {errors.endDate && <p className="mt-2 text-sm text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Reason for Leave <span className="text-red-500">*</span></label>
          <textarea placeholder="Please provide details about your leave request..." rows={4} value={formData.reason}
            onChange={(e) => { setFormData(p => ({ ...p, reason: e.target.value })); setErrors(p => ({ ...p, reason: '' })) }}
            className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.reason ? 'border-red-400' : 'border-gray-200'}`} />
          {errors.reason && <p className="mt-2 text-sm text-red-500">{errors.reason}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Supporting Documents (Optional)</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" />
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-blue-600 mb-2">Click to upload files</p>
              <p className="text-xs text-gray-500">PDF, DOC, or PNG/JPG up to 10MB</p>
            </div>
          </div>
          {formData.documents.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.documents.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 truncate">{f.name}</span>
                  <button type="button" onClick={() => removeFile(i)} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? "Submitting Request..." : "Submit Leave Request"}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default LeaveApplyForm