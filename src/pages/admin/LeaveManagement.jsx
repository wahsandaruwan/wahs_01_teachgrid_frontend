import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  Eye,
  Undo2,
  AlertCircle
} from 'lucide-react'
import { fetchAllLeaves, fetchLeaveStats, updateLeaveStatus } from '../../services/leaveService'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3301';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([])
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedToday: 0,
    rejectedToday: 0,
    averageResponse: 0
  })
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const leavesData = await fetchAllLeaves()
      const statsData = await fetchLeaveStats()
      setLeaves(Array.isArray(leavesData) ? leavesData : [])
      setStats(statsData || {
        pendingRequests: 0,
        approvedToday: 0,
        rejectedToday: 0,
        averageResponse: 0
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
      loadData() // Refresh data
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
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            subtitle="Awaiting approval"
            icon={<Calendar className="text-gray-400" size={20} />}
          />
          <StatCard
            title="Approved Today"
            value={stats.approvedToday}
            subtitle="Requests approved"
            icon={<CheckCircle2 className="text-green-500" size={20} />}
          />
          <StatCard
            title="Rejected Today"
            value={stats.rejectedToday}
            subtitle="Requests rejected"
            icon={<Clock className="text-orange-500" size={20} />}
          />
          <StatCard
            title="Average Response"
            value={stats.averageResponse}
            subtitle="Days to process"
            icon={<FileText className="text-gray-400" size={20} />}
          />
        </div>

        {/* Leave Requests Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="text-gray-900" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Leave Requests Management</h3>
            </div>
            <p className="text-gray-500">Review and approve teacher leave applications</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Teacher</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Dates</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Days</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reason</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Documents</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {leave.teacher?.initials || leave.teacher?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{leave.teacher?.name || 'Unknown Teacher'}</p>
                          <p className="text-xs text-blue-600 font-medium">{leave.teacher?.subject || 'Staff'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{leave.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} - {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-center">{leave.days}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(leave.status)}`}>
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {/* Check if documents exist and is an array with items */}
                      {Array.isArray(leave.documents) && leave.documents.length > 0 ? (
                        <button 
                          onClick={() => {
                            const fileUrl = leave.documents[0].filePath;
                            window.open(fileUrl, '_blank');
                          }}
                          className="..."
                        >
                          <Eye size={16} className="mr-1" />
                          View ({leave.documents.length})
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {leave.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 bg-gray-300 text-white rounded-lg text-sm font-bold cursor-not-allowed"
                              disabled
                            >
                              Approve
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-300 text-white rounded-lg text-sm font-bold cursor-not-allowed"
                              disabled
                            >
                              Reject
                            </button>
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
      </div>
    </>
  )
}

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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







