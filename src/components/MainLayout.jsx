import React from 'react';
import TopBar from './TopBar';
import BottomNavbar from './BottomNavbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto bg-white shadow-md pb-24 relative min-h-[calc(100vh-112px)]">
        {children}
      </main>

      {/* Bottom Sticky Navigation */}
      <BottomNavbar />
    </div>
  );
}
