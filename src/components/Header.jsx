import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Header = ({ title }) => {
  const { user } = useUser();

  // Role-based routes (same logic as your previous code)
  const NAV_LINKS = {
    announcements:
      user?.role === "admin"
        ? "/admin/announcements"
        : user?.role === "teacher"
        ? "/teacher/announcements"
        : "/",

    settings:
      user?.role === "admin"
        ? "/admin/settings"
        : user?.role === "teacher"
        ? "/teacher/settings"
        : "/",
  };

  // Avatar initials
  const getInitials = (name = "User") =>
    name
      .split(" ")
      .filter(Boolean)
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-6 lg:px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Page Title */}
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Notification Bell */}
        <Link
          to={NAV_LINKS.announcements}
          className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
          aria-label="Announcements"
        >
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
        </Link>

        {/* User Info */}
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-sm font-semibold text-gray-900">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {user?.role || "guest"}
          </span>
        </div>

        {/* Avatar → Settings */}
        <Link
          to={NAV_LINKS.settings}
          className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold uppercase overflow-hidden border border-gray-200 shadow-md hover:scale-105 transition-transform"
          aria-label="Profile Settings"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(user?.name)
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
