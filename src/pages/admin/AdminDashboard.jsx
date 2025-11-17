import { Outlet } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar'

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminNavbar />
      <div className="ml-72 flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard

