export default function TopbarAdvertiser({ user, onLogout, onMenuClick }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-[#0F172A]/80 backdrop-blur-xl text-slate-100 h-16 sticky top-0 z-20 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-white/10 rounded-xl lg:hidden transition-colors flex-shrink-0 text-slate-300"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-white truncate">Advertiser Console</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* User Pill */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[180px]">{user?.email || "Advertiser"}</span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="bg-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 border border-white/10 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
