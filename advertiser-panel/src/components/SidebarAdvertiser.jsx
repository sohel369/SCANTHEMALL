import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    Target, 
    FolderKanban, 
    Globe2, 
    BarChart3, 
    Tv2, 
    CreditCard, 
    UserCheck,
    Sparkles,
    X
} from "lucide-react";

export default function SidebarAdvertiser({ onClose }) {
    const location = useLocation();
    
    const items = [
        { to: "/advertiser", label: "Overview", Icon: LayoutDashboard },
        { to: "/advertiser/campaigns", label: "Campaigns", Icon: Target },
        { to: "/advertiser/media", label: "Media", Icon: FolderKanban },
        { to: "/advertiser/geo", label: "Geo Target", Icon: Globe2 },
        { to: "/advertiser/analytics", label: "Analytics", Icon: BarChart3 },
        { to: "/advertiser/ad-placements", label: "Ad Placements", Icon: Tv2 },
        { to: "/advertiser/billing", label: "Billing", Icon: CreditCard },
        { to: "/advertiser/account", label: "Account", Icon: UserCheck },
    ];

    const isActive = (path) => {
        if (path === "/advertiser") return location.pathname === "/advertiser";
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="w-64 bg-[#0B1120]/95 backdrop-blur-2xl shadow-2xl border-r border-white/10 h-screen text-slate-100 flex flex-col">
            {/* Header / Brand */}
            <div className="flex items-center justify-between px-5 py-4 h-20 bg-[#070D1B]/90 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-[#FF3D00] flex items-center justify-center font-black text-white text-sm shadow-lg shadow-sky-500/25">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-black tracking-tighter text-white uppercase italic">RULE 7 MEDIA</div>
                        <div className="text-[10px] font-extrabold text-sky-400 tracking-widest uppercase">Advertiser Portal</div>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button 
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors flex-shrink-0 text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Close menu"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 flex flex-col gap-1.5 p-3.5 overflow-y-auto custom-scrollbar">
                {items.map((it) => {
                    const active = isActive(it.to);
                    const IconComponent = it.Icon;
                    return (
                        <Link 
                            key={it.to} 
                            to={it.to} 
                            onClick={onClose}
                            className={`
                                flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 text-xs sm:text-sm font-bold tracking-wide group
                                ${active 
                                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xl shadow-sky-500/25 border border-sky-400/40 translate-x-1 font-extrabold' 
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white hover:translate-x-1'
                                }
                            `}
                        >
                            <IconComponent className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                active ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                            }`} />
                            <span className="truncate">{it.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
