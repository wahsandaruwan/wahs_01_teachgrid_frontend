import Header from '../../components/Header'

const quickStats = [
  { label: 'Today\'s Classes', value: '5', helper: 'Across 3 grades' },
  { label: 'Pending Tasks', value: '3', helper: 'Lesson plans & grading' },
  { label: 'Messages', value: '4', helper: 'New announcements' }
]

const upcomingLessons = [
  { subject: 'Mathematics', grade: 'Grade 8A', time: '09:00 AM', room: 'Room 205' },
  { subject: 'Physics', grade: 'Grade 11B', time: '11:00 AM', room: 'Lab 2' },
  { subject: 'History', grade: 'Grade 10C', time: '01:30 PM', room: 'Room 108' }
]

const TeacherDashboard = () => {
  return (
    <>
      <Header title="Teacher Dashboard" />
      <main className="flex-1 p-10 space-y-8 bg-gray-50">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-3xl font-semibold text-gray-900">Overview</h1>
          <p className="text-gray-600">Overview of your schedule, tasks, and communication.</p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickStats.map((stat) => (
            <article key={stat.label} className="bg-white rounded-2xl shadow p-6">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-4xl font-bold mt-2">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.helper}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Lessons</h2>
            <p className="text-sm text-gray-500 mb-4">Stay prepared for your next classes</p>
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.subject + lesson.time} className="flex items-center justify-between border rounded-xl p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{lesson.subject}</p>
                    <p className="text-sm text-gray-500">{lesson.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{lesson.time}</p>
                    <p className="text-xs text-gray-500">{lesson.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="bg-white rounded-2xl p-6 shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Get to frequently used tools faster</p>
            <div className="grid grid-cols-1 gap-3">
              {['Mark Attendance', 'Apply for Leave', 'Share Announcement', 'Upload Lesson Plan'].map((action) => (
                <button
                  key={action}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-left font-medium text-gray-700 hover:bg-gray-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </article>
        </section>
      </main>
    </>
  )
}

export default TeacherDashboard



