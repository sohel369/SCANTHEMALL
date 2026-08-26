import { useState } from "react";
import SidebarAdvertiser from "../components/SidebarAdvertiser";
import TopbarAdvertiser from "../components/TopbarAdvertiser";

export default function AdvertiserLayout({ children, user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  console.log('AdvertiserLayout rendered with user:', user);
  console.log('Children:', children);
  
  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
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

      <div className="flex-1 flex flex-col w-full min-w-0 z-10">
        <TopbarAdvertiser 
          user={user} 
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
