import { Outlet } from 'react-router-dom'
import TeacherNavbar from '../../components/TeacherNavbar'

const TeacherLayout = () => {
  return (
    <div className="flex font-sans bg-[#fafbfc] min-h-screen">
      <TeacherNavbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default TeacherLayout




