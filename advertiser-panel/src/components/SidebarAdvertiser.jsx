import { Link, useLocation } from "react-router-dom";

export default function SidebarAdvertiser({ onClose }) {
    const location = useLocation();
    
    const items = [
        { to: "/advertiser", label: "Overview", icon: "📊" },
        { to: "/advertiser/campaigns", label: "Campaigns", icon: "🎯" },
        { to: "/advertiser/media", label: "Media", icon: "📁" },
        { to: "/advertiser/geo", label: "Geo Target", icon: "🗺️" },
        { to: "/advertiser/analytics", label: "Analytics", icon: "📈" },
        { to: "/advertiser/ad-placements", label: "Ad Placements", icon: "📺" },
        { to: "/advertiser/billing", label: "Billing", icon: "💳" },
        { to: "/advertiser/account", label: "Account", icon: "👤" },
    ];

    const isActive = (path) => {
        if (path === "/advertiser") return location.pathname === "/advertiser";
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="w-64 bg-slate-900 shadow-lg border-r border-slate-700 h-screen text-neutral-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 h-14 md:h-16 bg-blue-950 border-b border-slate-700 flex-shrink-0">
                <div className="text-base md:text-lg font-bold truncate">Advertiser Panel</div>
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
            <nav className="flex-1 flex flex-col gap-1 p-2 md:p-3 overflow-y-auto">
                {items.map((it) => (
                    <Link 
                        key={it.to} 
                        to={it.to} 
                        onClick={onClose}
                        className={`
                            flex items-center gap-2 md:gap-3 px-2 py-2 md:px-3 md:py-3 rounded-lg transition-colors text-sm md:text-base
                            ${isActive(it.to) 
                                ? 'bg-sky-600 text-white' 
                                : 'hover:bg-sky-400 text-neutral-300'
                            }
                        `}
                    >
                        <span className="text-lg md:text-xl flex-shrink-0">{it.icon}</span>
                        <span className="font-medium truncate">{it.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
