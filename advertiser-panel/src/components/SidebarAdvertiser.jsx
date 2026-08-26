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
        <aside className="w-64 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl border-r border-white/10 h-screen text-slate-100 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 h-16 bg-[#0B132B]/80 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-sky-500/30">
                        7
                    </div>
                    <div>
                        <div className="text-sm font-extrabold tracking-tight text-white uppercase italic">RULE 7 MEDIA</div>
                        <div className="text-[10px] font-semibold text-sky-400 tracking-wider uppercase">Advertiser Portal</div>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button 
                    onClick={onClose}
                    className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 text-slate-400 hover:text-white"
                    aria-label="Close menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1.5 p-3 overflow-y-auto">
                {items.map((it) => {
                    const active = isActive(it.to);
                    return (
                        <Link 
                            key={it.to} 
                            to={it.to} 
                            onClick={onClose}
                            className={`
                                flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold tracking-wide
                                ${active 
                                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 border border-sky-400/30 translate-x-1' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100 hover:translate-x-1'
                                }
                            `}
                        >
                            <span className="text-lg flex-shrink-0 opacity-90">{it.icon}</span>
                            <span className="truncate">{it.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
