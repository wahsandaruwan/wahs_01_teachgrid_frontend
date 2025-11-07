import React from "react";
import { CalendarClock, User } from "lucide-react";

export default function Reliefduties() {
  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CalendarClock size={20} />  
          Upcoming Relief Duties
        </h3>
        <p className="text-gray-500 text-sm">Your assigned substitute teaching schedule</p>

        <div className="mt-4 space-y-4">

          {/* CARD ITEM */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-start justify-between">
            <div>
              <p className="font-semibold">09:00 AM - 10:00 AM</p>
              <p className="text-gray-600 flex items-center gap-1">
                <User size={16}/> Mathematics - Grade 8A
              </p>
              <p className="text-sm text-gray-400">Covering for Ms. Anderson</p>
            </div>

            
            <span className="inline-block w-auto text-xs bg-blue-600 text-white px-2 py-[2px] rounded-md whitespace-nowrap">
              2024-01-15
            </span>
          </div>

        </div>
      </div>

      <button className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100">
        View All Relief Duties
      </button>
    </div>
  );
}
