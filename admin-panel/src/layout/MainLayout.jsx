import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuditLogPanel from "../components/AuditLogPanel";

export default function MainLayout({ children, logout }) {
    const [auditCollapsed, setAuditCollapsed] = useState(true); // Default collapsed
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <Sidebar onLogout={logout} onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col w-full min-w-0">
                <Topbar 
                    title="Admin Console" 
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className="flex-1 flex relative overflow-hidden">
                    {/* Main Content Area */}
                    <div className="flex-1 p-4 md:p-6 overflow-x-hidden overflow-y-auto">
                        {children}
                    </div>
                    
                    {/* Audit Log Panel - Completely hidden on mobile, fixed on desktop */}
                    <div className={`
                        hidden lg:block
                        fixed right-0 top-16 h-[calc(100vh-64px)] transition-all duration-300 z-30
                        ${auditCollapsed ? 'w-12' : 'w-96'}
                    `}>
                        <div className="h-full p-4">
                            <AuditLogPanel 
                                isCollapsed={auditCollapsed}
                                onToggleCollapse={() => setAuditCollapsed(!auditCollapsed)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
