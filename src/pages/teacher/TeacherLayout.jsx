import { Outlet } from 'react-router-dom'
import TeacherNavbar from '../../components/TeacherNavbar'

const TeacherLayout = () => {
  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden font-sans bg-[#fafbfc]">
      <TeacherNavbar />
      <div className="ml-0 md:ml-72 flex min-w-0 flex-1 flex-col overflow-hidden pt-14 md:pt-0">
        <Outlet />
      </div>
    </div>
  )
}

export default TeacherLayout




