import React from "react";
import { Megaphone, User , Eye , Bell , AlertTriangle } from "lucide-react";

// Priority color helper
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-600";
    case "Medium":
      return "bg-black";
    case "Low":
      return "bg-blue-600";
    default:
      return "bg-gray-400";
  }
};

// TopBar
const TopBar = () => {
  return (
    <header className="flex justify-between items-center bg-white p-5 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-gray-800">Announcements</h2>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Megaphone size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

// Stats Boxes
const StatBox = ({ title, value, valueClass, subTitle, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow border">
    <div className="flex items-center justify-between">
      <p className="text-gray-1000 font-medium">{title}</p>
      <div className="text-gray-500">{icon}</div>
    </div>

    <h2 className={`text-3xl font-semibold mt-2 ${valueClass}`}>{value}</h2>
    <h2 className="text-gray-500 text-sm mt-2">{subTitle}</h2>
  </div>
);


// Announcements List Component
const AnnouncementList = () => {
  const announcements = [
    {
      title: "Staff Meeting - January 20th",
      description:
        "Mandatory staff meeting to discuss semester updates, new policies, and improvements.",
      date: "2024-01-10",
      priority: "High",
    },
    {
      title: "New Semester Guidelines Released",
      description:
        "Updated curriculum and staff responsibilities are now available.",
      date: "2024-01-09",
      priority: "Medium",
    },
    {
      title: "Library System Update",
      description: "Scheduled maintenance on Friday evening.",
      date: "2024-01-07",
      priority: "Low",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Megaphone size={20} /> Staff Announcements
      </h2>

      {announcements.map((a, i) => (
        <div
          key={i}
          className="p-5 bg-gray-50 rounded-xl border-l-4 border-gray-800 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{a.title}</h3>

            <span
              className={`text-xs text-white px-2 py-1 rounded-md ${getPriorityColor(
                a.priority
              )}`}
            >
              {a.priority}
            </span>
          </div>

          <p className="text-gray-600 text-sm mt-1">{a.description}</p>
          <p className="text-gray-400 text-xs mt-1">{a.date}</p>
        </div>
      ))}
    </div>
  );
};

// Main Announcements Page Layout
export default function TeacherAnnouncements() {
  return (
    <main className="flex-1 p-10 space-y-8 bg-gray-100 min-h-screen">
      <TopBar />

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox title="Total Announcements" value="5" subTitle={"This month"} icon={<Megaphone size={15} />}/>
        <StatBox title="High Priority" value="2" valueClass="text-red-600" subTitle={"Uregent Notices"} icon={<AlertTriangle size={15} />} />
        <StatBox title="Avg. Read Rate" value="75%" subTitle={"Staff Engagement"}  icon={<Eye size={15} />}/>
        <StatBox title="Unread" value="2" subTitle={"New Annoucement"} icon={<Bell size={15} />}/>
      </div>

      

      {/* Announcements */}
      <AnnouncementList />
    </main>
  );
}