import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import { fetchAllLeaves, fetchLeaveStats, updateLeaveStatus } from '../../services/leaveService'

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([])
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedToday: 0,
    rejectedToday: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedReason, setSelectedReason] = useState('') // For viewing full reason
  const [showReasonModal, setShowReasonModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const leavesData = await fetchAllLeaves()
      const statsData = await fetchLeaveStats()
      setLeaves(Array.isArray(leavesData) ? leavesData : [])
      setStats({
        pendingRequests: statsData?.pendingRequests || 0,
        approvedToday: statsData?.approvedToday || 0,
        rejectedToday: statsData?.rejectedToday || 0
      })
    } catch (error) {
      console.error('Error loading leave data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveStatus(id, status)
      loadData()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700'
      case 'Rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-orange-100 text-orange-700'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-4 h-4 mr-1" />
      case 'Rejected': return <AlertCircle className="w-4 h-4 mr-1" />
      default: return <Clock className="w-4 h-4 mr-1" />
    }
  }

  return (
    <>
      <Header title="Leave Management" />
      <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="border border-blue-200 rounded-xl hover:shadow-md transition">  
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            subtitle="Awaiting approval"
            icon={<Calendar className="text-blue-400" size={25} />}
          />
          </div>
          <div className="border border-blue-300 rounded-xl hover:shadow-md transition">
          <StatCard
            title="Approved Today"
            value={stats.approvedToday}
            subtitle="Requests approved"
            icon={<CheckCircle2 className="text-green-500" size={25} />}
          />
          </div>
          <div className="border border-blue-300 rounded-xl hover:shadow-md transition">
          <StatCard
            title="Rejected Today"
            value={stats.rejectedToday}
            subtitle="Requests rejected"
            icon={<Clock className="text-orange-500" size={25} />}
          />
          </div>
      </div>

        {/* Leave Requests Table Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-3s00 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="text-gray-900" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Leave Requests</h3>
            </div>
            <p className="text-gray-500">Review and approve teacher leave applications</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max border-collapse">
              <thead>
                <tr className="bg-violet-100 border-b border-violet-400">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Teacher</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Dates</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Days</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Reason</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Documents</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {leave.teacher?.initials || leave.teacher?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{leave.teacher?.name || 'Unknown'}</p>
                          <p className="text-xs text-blue-600 font-medium">{leave.teacher?.subject || 'Staff'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{leave.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} - {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">{leave.days}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate flex items-center justify-between">
                      <span className="truncate">{leave.reason}</span>
                      <button
                        onClick={() => {
                          setSelectedReason(leave.reason)
                          setShowReasonModal(true)
                        }}
                        className="ml-2 text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare size={16} /> View
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(leave.status)}`}>
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {Array.isArray(leave.documents) && leave.documents.length > 0 ? (
                        <button 
                          onClick={() => window.open(leave.documents[0].filePath, '_blank')}
                          className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={16} /> View ({leave.documents.length})
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {leave.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                              className="px-3 py-1 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-gray-300 text-white rounded-lg text-sm font-bold cursor-not-allowed" disabled>Approve</button>
                            <button className="px-3 py-1 bg-gray-300 text-white rounded-lg text-sm font-bold cursor-not-allowed" disabled>Reject</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for viewing full reason */}
        {showReasonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 max-w-full">
              <h3 className="text-lg font-bold mb-4">Leave Reason</h3>
              <p className="text-gray-700 break-words">{selectedReason}</p>
              <button
                onClick={() => setShowReasonModal(false)}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  </div>
)

export default LeaveManagement