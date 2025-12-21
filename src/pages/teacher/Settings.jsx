import { useState } from 'react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Teacher Name',
    email: 'teacher@email.com',
    phone: '077 123 4567',
    avatar: null,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const rowStyle = darkMode 
    ? 'flex items-center justify-between px-6 py-5 cursor-pointer transition-all duration-200 border-gray-700/50 hover:bg-gray-700/30'
    : 'flex items-center justify-between px-6 py-5 cursor-pointer transition-all duration-200 border-gray-100 hover:bg-gray-50';

  return (
    <main
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your personal information and preferences
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </span>
          </button>
        </header>

        {/* Profile Summary */}
        <section
          className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} rounded-3xl shadow-2xl divide-y ${darkMode ? 'divide-gray-700/50' : 'divide-gray-100'} overflow-hidden`}
        >
<div className="flex flex-col items-center text-center gap-4 py-10">

    {/* Avatar */}
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 blur-md"></div>
      <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/10 bg-gradient-to-br from-blue-500 to-purple-600">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt="Profile avatar"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {getInitials(profile.name)}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-2 rounded-full cursor-pointer shadow-lg">
            📷
            <input hidden type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
      )}
    </div>

    {/* Name */}
    {isEditing ? (
      <input
        name="name"
        value={profile.name}
        onChange={handleChange}
        className={`px-4 py-2 rounded-xl border text-lg font-semibold text-center ${
          darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-300'
        }`}
      />
    ) : (
      <h2 className="text-xl font-bold">{profile.name}</h2>
    )}

    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      Professional Educator
    </p>

    <button
      onClick={() => setIsEditing(!isEditing)}
      className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
        isEditing ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
      }`}
    >
      {isEditing ? 'Save' : 'Edit'}
    </button>

  </div>

          {/* Email */}
          <div className={rowStyle}>
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-blue-600/20' : 'bg-blue-50'} flex items-center justify-center transition-colors`}>
                <span className="text-2xl">📧</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">Email Address</p>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="teacher@school.com"
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'
                    }`}
                  />
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{profile.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className={rowStyle}>
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-green-600/20' : 'bg-green-50'} flex items-center justify-center transition-colors`}>
                <span className="text-2xl">📱</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">Contact Number</p>
                {isEditing ? (
                  <input
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="077 123 4567"
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'
                    }`}
                  />
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{profile.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className={rowStyle}>
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-2xl ${darkMode ? 'bg-purple-600/20' : 'bg-purple-50'} flex items-center justify-center transition-colors`}>
                <span className="text-2xl">🏠</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">Address</p>
                {isEditing ? (
                  <input name="address" type="text" value={profile.address} onChange={handleChange} placeholder="123 Street, City" className={`w-full px-3 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'}`} />
                ) : (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{profile.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;