import { Outlet } from 'react-router-dom'
import TeacherNavbar from '../../components/TeacherNavbar'

const TeacherLayout = () => {
  return (
    <div className="flex font-sans bg-[#fafbfc] min-h-screen">
      <TeacherNavbar />
      <div className="ml-72 flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default TeacherLayout




