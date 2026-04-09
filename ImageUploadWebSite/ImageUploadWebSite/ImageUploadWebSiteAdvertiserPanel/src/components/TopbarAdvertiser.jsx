export default function TopbarAdvertiser({ user, onLogout, onMenuClick }) {
  return (
    <div className="flex items-center justify-between px-3 py-3 md:px-4 md:py-4 bg-blue-950 text-neutral-50 h-14 md:h-16 sticky top-0 z-20 border-b border-slate-700 flex-shrink-0">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
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
        <h2 className="text-sm md:text-base lg:text-lg font-semibold truncate">Advertiser Dashboard</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="text-xs md:text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
          {user?.email || "Advertiser"}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="bg-sky-500 hover:bg-sky-600 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 rounded transition-colors whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
