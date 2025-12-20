const announcements = [
  {
    id: 1,
    title: 'Staff Meeting',
    detail: 'Monthly staff meeting scheduled for January 28 at 2 PM in the main hall.',
    status: 'New'
  },
  {
    id: 2,
    title: 'Exam Timetable',
    detail: 'Grade 10 mock examination timetable released. Please review your invigilation slots.',
    status: 'Read'
  }
]

const Announcements = () => {
  return (
    <main className="flex-1 p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Announcements</h1>
        <p className="text-gray-600">Stay up to date with school-wide communications.</p>
      </header>

      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Latest Updates</h2>
            <p className="text-sm text-gray-500">Messages shared by the administration.</p>
          </div>
          <button className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Mark all as read
          </button>
        </div>
        <div className="space-y-3">
          {announcements.map((item) => (
            <article key={item.id} className="border rounded-xl p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Announcements




