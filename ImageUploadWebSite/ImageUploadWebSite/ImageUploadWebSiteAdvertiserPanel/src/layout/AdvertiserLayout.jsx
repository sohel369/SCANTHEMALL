import { useState } from "react";
import SidebarAdvertiser from "../components/SidebarAdvertiser";
import TopbarAdvertiser from "../components/TopbarAdvertiser";

export default function AdvertiserLayout({ children, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  console.log('AdvertiserLayout rendered with user:', user);
  console.log('Children:', children);
  
  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <SidebarAdvertiser onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col w-full min-w-0">
        <TopbarAdvertiser 
          user={user} 
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 p-3 md:p-4 lg:p-6 overflow-x-hidden overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
