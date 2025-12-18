const reliefAssignments = [
  { id: 1, subject: 'English', grade: 'Grade 9C', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, subject: 'Science', grade: 'Grade 7A', time: '12:30 PM', status: 'Awaiting' }
]

const ReliefDuty = () => {
  return (
    <main className="flex-1 p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Relief Duty</h1>
        <p className="text-gray-600">Track and manage your assigned relief classes.</p>
      </header>

      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2>
          <p className="text-sm text-gray-500">Classes where you are scheduled as a relief teacher.</p>
        </div>
        <div className="space-y-3">
          {reliefAssignments.map((assignment) => (
            <article key={assignment.id} className="border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{assignment.subject}</p>
                <p className="text-sm text-gray-500">
                  {assignment.grade} · {assignment.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  assignment.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {assignment.status}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
        <p className="text-sm text-gray-500 mb-4">Let admins know when you are free to cover classes.</p>
        <form className="flex flex-col gap-4 md:flex-row">
          <input type="date" className="border rounded-xl px-4 py-2 flex-1" />
          <select className="border rounded-xl px-4 py-2 flex-1">
            <option value="">Select time slot</option>
            <option value="morning">Morning</option>
            <option value="midday">Midday</option>
            <option value="afternoon">Afternoon</option>
          </select>
          <button type="button" className="bg-black text-white rounded-xl px-4 py-2">
            Update Availability
          </button>
        </form>
      </section>
    </main>
  )
}

export default ReliefDuty



