import Header from '../../components/Header'

const Dashboard = () => {
  return (
    <>
      <Header title="Dashboard" />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">Dashboard content will be implemented here.</p>
        </div>
      </div>
    </>
  )
}

export default Dashboard

