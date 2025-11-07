import React from "react";
import { Megaphone } from "lucide-react";

export default function Announcements() {
  {/*change lable value*/}
    const priority = "High";

    {/*dynamically assign background based on label*/}
    const getPriorityColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-800";
      case "Medium":
        return "bg-black";
      case "Low":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">

      {/*main topic*/}
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Megaphone size={20} />
          Latest Announcements
        </h3>
        <p className="text-gray-500 text-sm">Important updates from administration</p>

        <div className="mt-4 space-y-6">

          {/*  Announcement Card */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-800">

            {/* Topic */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">
                Staff Meeting - January 20th
              </h4>

            {/*lable of announcement*/}
             <span
                className={`inline-block text-xs text-white px-2 py-[2px] rounded-md whitespace-nowrap ${getPriorityColor(
                  priority
                )}`}
              >
                {priority}
              </span>
            </div>

          {/*massage*/}
            <p className="text-sm text-gray-600 mt-1">
              Mandatory staff meeting to discuss upcoming semester changes.
            </p>

            {/* Date */}
            <p className="text-xs text-gray-400 mt-1">2024-01-10</p>
          </div>

        </div>
      </div>

    {/*view all button*/}
      <button className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
        View All Announcements
      </button>
    </div>
  );
}
