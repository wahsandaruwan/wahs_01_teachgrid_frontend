import { Link } from 'react-router-dom'

const NotAuthorized = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.455 18.545A8 8 0 1118.545 5.455 8 8 0 015.455 18.545z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Not Authorized</h1>
        <p className="mt-3 text-sm text-slate-500">
          You need administrator access to view this area. Please contact your system administrator if you believe this
          is incorrect.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Go Home
          </Link>
          <Link
            to="/teacher/dashboard"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Teacher Dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotAuthorized


