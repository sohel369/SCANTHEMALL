import { useEffect, useState, useRef } from "react";
import { billboardsAPI } from "../../api/api";

const GLOBAL_REGIONS = [
    "Worldwide (Global)",
    "United Kingdom (UK)",
    "United States (USA)",
    "Canada (CA)",
    "Australia (AU)",
    "European Union (EU)",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Japan",
    "Singapore",
    "United Arab Emirates (UAE)",
    "London Metro",
    "New York Tri-State",
    "California (State)",
    "Sydney & NSW",
    "Melbourne & VIC",
    "Toronto & GTA"
];

export default function GeoTargetingPage() {
    const [zones, setZones] = useState([]);
    const [exclude, setExclude] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("advertiser_excluded_zips") || "[]");
        } catch {
            return [];
        }
    });
    const [selectedRegion, setSelectedRegion] = useState("");
    const [regionSearch, setRegionSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [zip, setZip] = useState("");
    const [previewRegion, setPreviewRegion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTargetZones();

        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function loadTargetZones() {
        try {
            setLoading(true);
            const data = await billboardsAPI.getBillboards();
            if (Array.isArray(data) && data.length > 0) {
                const mappedZones = data.map(b => ({
                    id: b.id,
                    name: b.advertiser_name || b.postal_code || "Target Zone",
                    zips: b.postal_code ? [b.postal_code] : [],
                    active: b.active ?? true,
                    estimatedReach: calculateReach(b.advertiser_name || b.postal_code)
                }));
                setZones(mappedZones);
                setPreviewRegion(mappedZones[0]);
            } else {
                setZones([]);
            }
        } catch (err) {
            console.error("Failed to load target zones from backend:", err);
        } finally {
            setLoading(false);
        }
    }

    function calculateReach(name) {
        if (!name) return 35000;
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i);
            hash |= 0;
        }
        return 25000 + Math.abs(hash % 125000);
    }

    async function addZone() {
        if (!selectedRegion && !zip.trim()) {
            return alert("Please select a Region or enter a ZIP/Postal Code.");
        }
        
        const zoneName = selectedRegion || `Zone (${zip.trim().toUpperCase()})`;
        const postalCode = zip.trim().toUpperCase() || selectedRegion;

        try {
            setSubmitting(true);
            const created = await billboardsAPI.createBillboard({
                advertiser_name: zoneName,
                postal_code: postalCode,
                active: true
            });

            const newZone = {
                id: created.id || Date.now(),
                name: created.advertiser_name || zoneName,
                zips: created.postal_code ? [created.postal_code] : [postalCode],
                active: true,
                estimatedReach: calculateReach(zoneName)
            };

            setZones(prev => [newZone, ...prev]);
            setPreviewRegion(newZone);
            setZip("");
            setSelectedRegion("");
            setIsDropdownOpen(false);
        } catch (err) {
            alert("Failed to save targeting zone to database: " + err.message);
        } finally {
            setSubmitting(false);
        }
    }

    function excludeZip() {
        const cleanZip = zip.trim().toUpperCase();
        if (!cleanZip) return alert("Enter ZIP/Postal Code to exclude.");
        if (exclude.includes(cleanZip)) return alert("This ZIP code is already in your exclusions list.");
        
        const updated = [...exclude, cleanZip];
        setExclude(updated);
        localStorage.setItem("advertiser_excluded_zips", JSON.stringify(updated));
        setZip("");
    }

    function removeExcludedZip(zipToRemove) {
        const updated = exclude.filter(z => z !== zipToRemove);
        setExclude(updated);
        localStorage.setItem("advertiser_excluded_zips", JSON.stringify(updated));
    }

    async function toggleZoneStatus(id, currentStatus) {
        try {
            const newStatus = !currentStatus;
            await billboardsAPI.updateBillboard(id, { active: newStatus });
            setZones(prev => prev.map(z => z.id === id ? { ...z, active: newStatus } : z));
        } catch (err) {
            alert("Failed to update status: " + err.message);
        }
    }

    async function removeZone(id) {
        if (!confirm("Are you sure you want to delete this target zone?")) return;
        try {
            await billboardsAPI.deleteBillboard(id);
            const next = zones.filter(z => z.id !== id);
            setZones(next);
            if (previewRegion?.id === id) {
                setPreviewRegion(next[0] || null);
            }
        } catch (err) {
            alert("Failed to remove zone from database: " + err.message);
        }
    }

    const filteredRegions = GLOBAL_REGIONS.filter(r => 
        r.toLowerCase().includes(regionSearch.toLowerCase())
    );

    const totalEstimatedReach = zones
        .filter(z => z.active)
        .reduce((sum, z) => sum + (z.estimatedReach || 0), 0);

    return (
        <div className="space-y-8 text-slate-100 font-sans">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
                        Geo-Targeting <span className="text-sky-400">& Audience Zones</span>
                    </h1>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                        Define geographic regions, zip codes, and exclusions for campaign delivery.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 px-4 py-2.5 rounded-2xl">
                    <span className="text-[11px] uppercase font-bold text-slate-400">Total Active Reach:</span>
                    <span className="text-sm font-black text-emerald-400">{totalEstimatedReach.toLocaleString()} users</span>
                </div>
            </div>

            {/* Create Targeting Zone Widget */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-2xl backdrop-blur-xl space-y-4 relative z-30">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="text-sky-400">📍</span> Create Targeting Zone
                    </h3>
                    <span className="text-[11px] font-bold text-sky-400/80 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
                        Connected to PostgreSQL
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                    {/* Custom Responsive Dropdown for Region Selection */}
                    <div className="sm:col-span-4 relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                            className="w-full h-12 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-white/15 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-sky-500 transition-all flex items-center justify-between text-left cursor-pointer"
                        >
                            <span className={selectedRegion ? "text-white font-bold truncate" : "text-slate-400 truncate"}>
                                {selectedRegion || "-- Select Country / Region --"}
                            </span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {/* Responsive Popup Menu with max-height & clean scrollbar */}
                        {isDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 w-full max-w-sm sm:max-w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                                {/* Search filter inside dropdown */}
                                <div className="p-2.5 border-b border-white/10 bg-slate-950/60">
                                    <input
                                        type="text"
                                        value={regionSearch}
                                        onChange={(e) => setRegionSearch(e.target.value)}
                                        placeholder="Search country / region..."
                                        className="w-full h-9 px-3 text-xs bg-slate-800/90 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                                        autoFocus
                                    />
                                </div>

                                <div className="max-h-52 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedRegion("");
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                                    >
                                        -- Clear Selection --
                                    </button>
                                    {filteredRegions.length > 0 ? (
                                        filteredRegions.map((r, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedRegion(r);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                                    selectedRegion === r
                                                        ? 'bg-sky-500/20 text-sky-400 font-bold'
                                                        : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                                                }`}
                                            >
                                                <span>{r}</span>
                                                {selectedRegion === r && (
                                                    <span className="text-sky-400 text-xs">✓</span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                            No regions match "{regionSearch}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ZIP / Postcode Input */}
                    <div className="sm:col-span-4">
                        <input
                            type="text"
                            className="w-full h-12 px-4 rounded-xl bg-slate-800/90 border border-white/15 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-all"
                            placeholder="or Enter ZIP/Postcode (e.g. 90210, SW1A 1AA)"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addZone()}
                        />
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-4 flex gap-2">
                        <button
                            onClick={addZone}
                            disabled={submitting}
                            className="flex-1 h-12 px-4 bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <span>+ Add Zone</span>
                        </button>

                        <button
                            onClick={excludeZip}
                            title="Exclude this ZIP from targeting"
                            className="h-12 px-4 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                            Exclude ZIP
                        </button>
                    </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <span className="text-amber-400">💡</span> Tip: Use ZIP/Postal codes for hyper-local ad serving or select a Region for national sweepstakes reach.
                </div>
            </div>

            {/* Active Target Zones Grid */}
            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                        Active Target Zones ({zones.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-slate-400 font-semibold text-xs animate-pulse">
                        Loading targeting zones from database...
                    </div>
                ) : zones.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center text-slate-400 text-xs">
                        No target zones added yet. Select a region above or enter a ZIP code to create your first targeting zone!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {zones.map(z => (
                            <div
                                key={z.id}
                                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 shadow-xl ${
                                    previewRegion?.id === z.id 
                                        ? 'bg-slate-900 border-sky-500 shadow-sky-500/10 ring-1 ring-sky-500/50' 
                                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                                            <span>📍</span> {z.name}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                            z.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${z.active ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                                            {z.active ? 'Active' : 'Paused'}
                                        </span>
                                    </div>

                                    <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                                        <span>Postal Code:</span>
                                        <span className="font-mono text-sky-300 font-bold">{(z.zips || []).join(", ") || "ALL"}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center justify-between">
                                        <span>Est. Audience Reach:</span>
                                        <span className="text-emerald-400 font-bold">{(z.estimatedReach || 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                    <button
                                        onClick={() => setPreviewRegion(z)}
                                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 border border-white/10 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                                    >
                                        View Radar
                                    </button>
                                    <button
                                        onClick={() => toggleZoneStatus(z.id, z.active)}
                                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                    >
                                        {z.active ? 'Pause' : 'Resume'}
                                    </button>
                                    <button
                                        onClick={() => removeZone(z.id)}
                                        className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Excluded ZIPs Section */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-white/10 space-y-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="text-red-400">🚫</span> Excluded ZIP / Postal Codes
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                    {exclude.length > 0 ? (
                        exclude.map((z, i) => (
                            <div key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-mono font-bold text-red-300 flex items-center gap-2">
                                <span>{z}</span>
                                <button 
                                    onClick={() => removeExcludedZip(z)}
                                    className="text-red-400 hover:text-white font-black cursor-pointer text-sm leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-slate-400 italic">No postal codes excluded. All areas within active zones will receive impressions.</div>
                    )}
                </div>
            </div>

            {/* Dynamic Map & Reach Visualizer */}
            {previewRegion && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-sky-500/30 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-black text-white uppercase italic flex items-center gap-2">
                                <span className="text-sky-400">📡</span> Live Geographic Radar: {previewRegion.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">Approximate impressions radius & billboard placement cluster.</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            {(previewRegion.estimatedReach || 0).toLocaleString()} Potential Users
                        </span>
                    </div>

                    <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
                        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                        <div className="w-48 h-48 rounded-full border border-sky-500/30 animate-ping absolute opacity-25" />
                        <div className="w-32 h-32 rounded-full border-2 border-sky-400/40 bg-sky-500/10 flex items-center justify-center relative z-10">
                            <div className="w-4 h-4 rounded-full bg-sky-400 shadow-lg shadow-sky-400/80 animate-pulse" />
                        </div>
                        <div className="absolute bottom-4 left-4 text-[11px] font-mono text-slate-400 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                            Zone: <span className="text-white font-bold">{previewRegion.name}</span> | Coverage: <span className="text-emerald-400 font-bold">100% Operational</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
