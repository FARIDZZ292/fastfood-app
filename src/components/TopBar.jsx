import React from 'react';
import { MapPin, ChevronDown, Bell } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3 flex.5 flex items-center justify-between">
        {/* Delivery Address info */}
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] tracking-wider text-orange-500 font-extrabold uppercase leading-none">Kirim ke</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-bold text-gray-800 tracking-tight">Jl. Soekarno Hatta 15A</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
        </button>
      </div>
    </div>
  );
}
