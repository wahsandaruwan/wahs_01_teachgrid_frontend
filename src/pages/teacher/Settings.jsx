import { useState } from 'react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex-1 p-10 space-y-6 transition-colors duration-300`}>
      
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Settings</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Update your profile and notification preferences.</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* Profile Section */}
      <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 space-y-6 transition-colors duration-300`}>
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Basic information about your account.</p>
        </div>

        <form className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          />
          <input
            type="email"
            placeholder="Email"
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          />
          <input
            type="text"
            placeholder="Phone"
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          />
          <select
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          >
            <option value="">Notification preference</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 md:col-span-2 transition"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* Additional Settings Example */}
      <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 space-y-6 transition-colors duration-300`}>
        <div>
          <h2 className="text-xl font-semibold">Security</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Manage password and two-factor authentication.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2">
          <input
            type="password"
            placeholder="Current Password"
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          />
          <input
            type="password"
            placeholder="New Password"
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'} border rounded-xl px-4 py-2 transition-colors duration-300`}
          />
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 md:col-span-2 transition"
          >
            Update Password
          </button>
        </form>
      </section>
    </main>
  );
};

export default Settings;
