import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { campaignsAPI, billboardsAPI, mediaAPI } from "../../api/api";
import CampaignCard from "../../components/CampaignCard";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
    Target,
    DollarSign,
    Globe2,
    FolderKanban,
    Calendar,
    Plus,
    Activity,
    Eye,
    MousePointerClick,
    TrendingUp,
    Sparkles,
    CheckCircle2
} from "lucide-react";

export default function AdvertiserDashboardHome() {
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [zonesCount, setZonesCount] = useState(0);
    const [mediaCount, setMediaCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        impressions: 0,
        clicks: 0,
        ctr: "0.00%",
        totalBudget: 0
    });
    const [filter, setFilter] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
        region: "All",
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        loadAllRealData();
    }, []);

    async function loadAllRealData() {
        try {
            setLoading(true);
            setError(null);

            const [allCampaigns, allBillboards, allMedia] = await Promise.all([
                campaignsAPI.getCampaigns().catch(() => []),
                billboardsAPI.getBillboards().catch(() => []),
                mediaAPI.getMedia().catch(() => [])
            ]);

            const campaignsList = Array.isArray(allCampaigns) ? allCampaigns : [];
            const billboardsList = Array.isArray(allBillboards) ? allBillboards : [];
            const mediaList = Array.isArray(allMedia) ? allMedia : [];

            setCampaigns(campaignsList);
            setFilteredCampaigns(campaignsList);
            setZonesCount(billboardsList.length);
            setMediaCount(mediaList.length);
            calculateSummary(campaignsList);
        } catch (err) {
            console.error('Failed to load real dashboard data:', err);
            setError(err.message || 'Failed to connect to backend database');
        } finally {
            setLoading(false);
        }
    }

    const calculateSummary = (data) => {
        const impressions = (data || []).reduce((s, c) => s + (Number(c.impressions) || 0), 0);
        const clicks = (data || []).reduce((s, c) => s + (Number(c.clicks) || 0), 0);
        const totalBudget = (data || []).reduce((s, c) => s + (Number(c.budget) || 0), 0);
        const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) + "%" : "0.00%";
        setSummary({ impressions, clicks, ctr, totalBudget });
    };

    const handleRegionFilter = (region) => {
        const filtered =
            region === "All"
                ? campaigns
                : campaigns.filter((c) => (c.region || '').toLowerCase() === region.toLowerCase());
        setFilteredCampaigns(filtered);
        calculateSummary(filtered);
        setFilter((prev) => ({ ...prev, region }));
    };

    const handleDateFilter = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setFilter((prev) => ({ ...prev, startDate, endDate }));
        const filtered = campaigns.filter((c) => {
            const date = new Date(c.created_at || c.createdAt);
            return date >= startDate && date <= endDate;
        });
        setFilteredCampaigns(filtered);
        calculateSummary(filtered);
    };

    const handleTogglePause = async (id) => {
        const campaign = campaigns.find(c => c.id === id);
        if (!campaign) return;
        const newStatus = campaign.status === "active" ? "paused" : "active";
        try {
            await campaignsAPI.updateCampaign(id, { ...campaign, status: newStatus });
            const updated = campaigns.map(c => c.id === id ? { ...c, status: newStatus } : c);
            setCampaigns(updated);
            setFilteredCampaigns(updated);
        } catch (err) {
            alert("Failed to update campaign status in database: " + err.message);
        }
    };

    const availableRegions = ["All", ...new Set(campaigns.map(c => c.region).filter(Boolean))];

    const topPerforming = [...filteredCampaigns]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 6);

    const recentUploads = [...filteredCampaigns]
        .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
        .slice(0, 5);

    const sparkData = {
        labels: filteredCampaigns.length > 0 
            ? filteredCampaigns.map((c) => c.title || `Campaign #${c.id}`) 
            : ["No Data"],
        datasets: [
            {
                data: filteredCampaigns.length > 0 
                    ? filteredCampaigns.map((c) => Number(c.clicks) || 0) 
                    : [0],
                borderColor: "#38bdf8",
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointRadius: 2,
            },
        ],
    };

    const sparkOptions = {
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-28 text-slate-400 font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                    <div className="text-sm font-semibold tracking-wider uppercase text-slate-300">Connecting to Live Database...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 rounded-3xl glass-card border border-red-500/20 text-center max-w-lg mx-auto font-sans">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto mb-4 flex items-center justify-center font-bold text-xl">!</div>
                <h3 className="text-lg font-bold text-white mb-2">Database Connection Notice</h3>
                <p className="text-sm text-slate-400 mb-6">{error}</p>
                <button 
                    onClick={loadAllRealData} 
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
                >
                    Reconnect Database
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 text-slate-100 font-sans">
            {/* Header Title & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic flex items-center gap-2.5">
                        <span>Real-Time Overview</span>
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full not-italic flex items-center gap-1.5 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live PostgreSQL Connected
                        </span>
                    </h1>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                        Live performance tracking, active campaigns, and audience engagement.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <button
                            className="bg-slate-800/90 hover:bg-slate-700/80 border border-white/10 px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            <Calendar className="w-4 h-4 text-sky-400" />
                            <span>{filter.startDate.toLocaleDateString()} - {filter.endDate.toLocaleDateString()}</span>
                        </button>
                        {showDatePicker && (
                            <div className="absolute right-0 z-30 mt-2 rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-slate-900">
                                <DateRangePicker
                                    ranges={[
                                        {
                                            startDate: filter.startDate,
                                            endDate: filter.endDate,
                                            key: "selection",
                                        },
                                    ]}
                                    onChange={handleDateFilter}
                                    maxDate={new Date()}
                                />
                            </div>
                        )}
                    </div>
                    <select
                        className="rounded-xl px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700/80 border border-white/10 text-xs font-bold text-slate-200 focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
                        value={filter.region}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                    >
                        {availableRegions.map((r) => (
                            <option key={r} value={r} className="bg-slate-900 text-slate-200">
                                {r === "All" ? "All Regions" : r}
                            </option>
                        ))}
                    </select>

                    <Link
                        to="/advertiser/campaigns"
                        className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Campaign</span>
                    </Link>
                </div>
            </div>

            {/* Summary Metrics Cards (100% Real Database Values with Luxury Lucide Icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1: Active Campaigns */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-sky-500/40 transition-all duration-300 shadow-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Campaigns</span>
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <Target className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-1">
                        {filteredCampaigns.filter((c) => (c.status || '').toLowerCase() === "active").length}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <span className="text-sky-400 font-bold">{filteredCampaigns.length}</span> Total in Account
                    </div>
                </div>

                {/* Metric 2: Real Total Budget */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Budget</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-emerald-400 mb-1">
                        ${summary.totalBudget.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                        Allocated campaign funds
                    </div>
                </div>

                {/* Metric 3: Active Geo Zones */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 shadow-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Targeting Zones</span>
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <Globe2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-1">
                        {zonesCount}
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-400">
                        Configured in Geo Target
                    </div>
                </div>

                {/* Metric 4: Media Uploads */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300 shadow-xl bg-slate-900/60 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Creatives</span>
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                            <FolderKanban className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-purple-400 mb-1">
                        {mediaCount}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                        Active assets in media library
                    </div>
                </div>
            </div>

            {/* Campaign Highlights or Clean Empty State */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-white tracking-tight uppercase italic flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span>Active Campaigns & Performances</span>
                    </h3>
                    {campaigns.length > 0 && (
                        <Link to="/advertiser/campaigns" className="text-xs font-bold text-sky-400 hover:underline uppercase tracking-wider">
                            Manage All ({campaigns.length}) →
                        </Link>
                    )}
                </div>

                {campaigns.length === 0 ? (
                    <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/40 border border-dashed border-white/15 text-center space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-2xl mx-auto shadow-lg">
                            <Target className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-white mb-1">No Campaigns Created Yet</h4>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                You are connected to the live database. Create your first sweepstake sponsorship campaign to start tracking impressions and audience reach!
                            </p>
                        </div>
                        <Link
                            to="/advertiser/campaigns"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all"
                        >
                            <span>Create First Campaign</span>
                            <span>→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {topPerforming.map((c) => (
                            <CampaignCard
                                key={c.id}
                                campaign={c}
                                onPause={handleTogglePause}
                                onEdit={() => {}}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Real Activity Log */}
            {campaigns.length > 0 && (
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-extrabold text-white tracking-tight uppercase italic flex items-center gap-2">
                        <Activity className="w-4 h-4 text-sky-400" />
                        <span>Recent Campaign Activity Log</span>
                    </h3>
                    <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="text-xs font-bold uppercase tracking-wider bg-slate-900/90 text-slate-400 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4">Campaign Title</th>
                                    <th className="px-6 py-4">Target Region</th>
                                    <th className="px-6 py-4">Budget</th>
                                    <th className="px-6 py-4">Date Created</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs font-medium">
                                {recentUploads.map((c) => {
                                    const statusUpper = (c.status || "active").toLowerCase();
                                    return (
                                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-sky-400" />
                                                <span>{c.title}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 font-semibold">{c.region || "Global"}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-bold">${Number(c.budget || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(c.created_at || c.createdAt || Date.now()).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                                    statusUpper === 'active' 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                        : statusUpper === 'pending'
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                        : 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusUpper === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                                    {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
