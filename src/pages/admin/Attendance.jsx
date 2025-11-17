import Header from '../../components/Header'

const Attendance = () => {
  return (
    <>
      <Header title="Attendance Records" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Attendance Records
          </h2>
          <p className="text-gray-600">Attendance records will be implemented here.</p>
        </div>
      </div>
    </>
  )
}

export default Attendance

