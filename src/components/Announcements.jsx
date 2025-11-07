import React from "react";
import { Megaphone, AlertCircle } from "lucide-react";  

export default function Announcements() {
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Megaphone size={20} />  
          Latest Announcements
        </h3>
        <p className="text-gray-500 text-sm">Important updates from administration</p>

        <div className="mt-4 space-y-6">
          <div className="border-l-4 pl-4">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle size={18} /> Staff Meeting - January 20th
            </h4>
            <p className="text-sm text-gray-600">
              Mandatory staff meeting to discuss upcoming semester changes.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full">high</span>
              <p className="text-xs text-gray-400">2024-01-10</p>
            </div>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
        View All Announcements
      </button>
    </div>
  );
}
