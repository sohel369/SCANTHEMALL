import React from "react";

export default function Topbar({ title = "Admin Console", onMenuClick }) {
    return (
        <div className="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 border-b bg-blue-950 h-14 md:h-16 sticky top-0 z-20 flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3 text-neutral-50 min-w-0 flex-1">
                {/* Mobile menu button */}
                <button 
                    onClick={onMenuClick}
                    className="p-1.5 md:p-2 hover:bg-slate-800 rounded-lg lg:hidden transition-colors flex-shrink-0"
                    aria-label="Open menu"
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-sm md:text-base lg:text-lg font-semibold truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <div className="text-xs md:text-sm text-neutral-50">
                    <span className="hidden sm:inline">Signed in as </span>
                    <span className="font-medium">Admin</span>
                </div>
            </div>
        </div>
    );
}
