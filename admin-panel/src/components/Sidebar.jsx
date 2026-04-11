import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, onClose }) {
    const location = useLocation();
    
    const links = [
        { path: "/", label: "Dashboard", icon: "📊" },
        { path: "/users", label: "Users", icon: "👥" },
        { path: "/uploads", label: "Uploads", icon: "🖼️" },
        { path: "/draws", label: "Draws", icon: "🎟️" },
        { path: "/ads", label: "Ads", icon: "📣" },
        { path: "/policy", label: "Policy", icon: "📄" },
        { path: "/notifications", label: "Notifications", icon: "🔔" },
        { path: "/settings", label: "Settings", icon: "⚙️" },
    ];

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-700 h-screen flex flex-col text-neutral-50">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 h-14 md:h-16 bg-blue-950 border-b border-slate-700 flex-shrink-0">
                <div className="font-bold text-base md:text-lg truncate">Gotta Scan Admin</div>
                {/* Close button for mobile */}
                <button 
                    onClick={onClose}
                    className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Close menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-2 md:p-3 overflow-y-auto">
                {links.map((l) => (
                    <Link
                        key={l.path}
                        to={l.path}
                        onClick={onClose}
                        className={`
                            flex items-center gap-2 md:gap-3 px-2 py-2 md:px-3 md:py-3 rounded-lg transition-colors text-sm md:text-base
                            ${isActive(l.path) 
                                ? 'bg-sky-600 text-white' 
                                : 'hover:bg-blue-950 text-neutral-300'
                            }
                        `}
                    >
                        <span className="text-lg md:text-xl flex-shrink-0">{l.icon}</span>
                        <span className="font-medium truncate">{l.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-2 md:p-3 border-t border-slate-700 flex-shrink-0">
                <button
                    onClick={() => {
                        onLogout();
                        onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-2 py-2 md:px-3 md:py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium text-sm md:text-base"
                >
                    <span className="text-lg md:text-xl">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
