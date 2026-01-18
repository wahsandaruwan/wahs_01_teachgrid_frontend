import { useUser } from "../contexts/UserContext";

const Header = ({ title }) => {
  const { user } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-sm font-medium text-gray-900">
            {user?.name}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {user?.role || "guest"}
          </span>
        </div>

        <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold uppercase overflow-hidden border border-gray-100 shadow-sm">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            (user?.name || "U")
              .split(" ")
              .filter(Boolean)
              .map((part) => part.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
