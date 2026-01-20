import { CheckCircle, Clock } from 'lucide-react'

const LeaveHistory = ({ leaveHistory = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Leave History</h2>
        <p className="text-sm text-gray-600">Track the status of your leave requests</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100 bg-cyan-100 dark:bg-cyan-200">
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Dates</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Days</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Reason</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No leave history found
                </td>
              </tr>
            ) : (
              leaveHistory.map((leave, index) => (
                <tr 
                  // Uses MongoDB's unique _id as the React key
                  key={leave._id || index} 
                  className={`border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                    {leave.leaveType || leave.type}
                  </td>
                  
                  {/* Formats backend ISO date strings into readable mm/dd/yyyy format */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">
                      {leave.totalDays || leave.days}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{leave.reason}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ${
                      leave.status === 'Approved'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : leave.status === 'Rejected'
                        ? 'bg-red-100 text-red-700 border border-red-200'
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
                  
                  {/* Formats the automatic "appliedAt" timestamp from the database */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {new Date(leave.appliedAt || leave.submitted).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing {leaveHistory.length} of {leaveHistory.length} requests</p>
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
  )
}

export default LeaveHistory