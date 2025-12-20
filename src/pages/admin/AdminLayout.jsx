import { Outlet } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar'

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <AdminNavbar />
      <div className="ml-72 flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout




