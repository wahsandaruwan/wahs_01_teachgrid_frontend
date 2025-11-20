import { useState } from 'react'
import { Calendar, CheckCircle, Clock, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

const leaveHistory = [
  { 
    id: 1, 
    type: 'Annual Leave', 
    dates: '2024-01-15 - 2024-01-17', 
    days: 3,
    reason: 'Personal vacation',
    status: 'Approved',
    submitted: '2024-01-01'
  },
  { 
    id: 2, 
    type: 'Medical Leave', 
    dates: '2024-01-22', 
    days: 1,
    reason: 'Medical appointment',
    status: 'Pending',
    submitted: '2024-01-15'
  }
]

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('history')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const handleDateClick = (day, isStartDate) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const formattedDate = formatDate(selectedDate)
    
    if (isStartDate) {
      setStartDate(formattedDate)
      setShowStartCalendar(false)
    } else {
      setEndDate(formattedDate)
      setShowEndCalendar(false)
    }
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const CalendarComponent = ({ isStartDate }) => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-80">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-sm font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentMonth.getMonth() &&
                           new Date().getFullYear() === currentMonth.getFullYear()
            
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day, isStartDate)}
                className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                  isToday
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'hover:bg-blue-50 text-gray-700'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br  p-6">
       <h1 className="text-2xl  mb-6">Leave Management</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Available Leave</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">15</p>
          <p className="text-sm text-gray-500">Days remaining this year</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Used Leave</h3>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">10</p>
          <p className="text-sm text-gray-500">Days taken this year</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-yellow-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Pending</h3>
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">1</p>
          <p className="text-sm text-gray-500">Awaiting approval</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">This Month</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">2</p>
          <p className="text-sm text-gray-500">Days taken</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('apply')}
          className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'apply'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:shadow-md'
          }`}
        >
          Apply for Leave
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:shadow-md'
          }`}
        >
          My Leave History
        </button>
      </div>

      {/* Content */}
      {activeTab === 'apply' ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">+ Apply for Leave</h2>
            <p className="text-sm text-gray-600">Submit a new leave request for approval</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Leave Type</label>
              <select className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option>Select leave type</option>
                <option>Annual Leave</option>
                <option>Medical Leave</option>
                <option>Personal Leave</option>
                <option>Emergency Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Start Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={startDate}
                    onFocus={() => setShowStartCalendar(true)}
                    readOnly
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {showStartCalendar && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowStartCalendar(false)}
                    />
                    <CalendarComponent isStartDate={true} />
                  </>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-3">End Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={endDate}
                    onFocus={() => setShowEndCalendar(true)}
                    readOnly
                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {showEndCalendar && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowEndCalendar(false)}
                    />
                    <CalendarComponent isStartDate={false} />
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Reason for Leave</label>
              <textarea
                placeholder="Please provide details about your leave request..."
                rows={4}
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Supporting Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="px-6 py-3 text-sm font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Upload Files
                  </button>
                  <p className="text-xs text-gray-500 mt-3">PDF, DOC, or PNG up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Submit Request
              </button>
              <button
                type="button"
                className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Leave History</h2>
            <p className="text-sm text-gray-600">Track the status of your leave requests</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Dates</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Days</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Reason</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, index) => (
                  <tr 
                    key={leave.id} 
                    className={`border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">{leave.type}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{leave.dates}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">
                        {leave.days}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{leave.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ${
                        leave.status === 'Approved'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {leave.status === 'Approved' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{leave.submitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 2 of 2 requests</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default LeaveManagement


