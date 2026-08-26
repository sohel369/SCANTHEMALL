import { useEffect, useState } from "react";
import { campaignsAPI, analyticsAPI } from "../../api/api";
import CampaignCard from "../../components/CampaignCard";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function AdvertiserDashboardHome() {
    console.log('AdvertiserDashboardHome component rendered');
    
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        impressions: 0,
        clicks: 0,
        ctr: "0.00%",
    });
    const [filter, setFilter] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
        region: "All",
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    // mock region list for filtering
    const regions = ["All", "North America", "Europe", "Asia", "Oceania"];

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                console.log('Loading campaigns...');
                const allCampaigns = await campaignsAPI.getCampaigns();
                console.log('Campaigns loaded:', allCampaigns);
                setCampaigns(allCampaigns || []);
                setFilteredCampaigns(allCampaigns || []);
                calculateSummary(allCampaigns);
            } catch (error) {
                console.error('Failed to load campaigns:', error);
                setError(error.message);
                setCampaigns([]);
                setFilteredCampaigns([]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const calculateSummary = (data) => {
        const impressions = (data || []).reduce((s, c) => s + (c.impressions || 0), 0);
        const clicks = (data || []).reduce((s, c) => s + (c.clicks || 0), 0);
        const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) + "%" : "0.00%";
        setSummary({ impressions, clicks, ctr });
    };

    const handleRegionFilter = (region) => {
        const filtered =
            region === "All"
                ? campaigns
                : campaigns.filter((c) => c.region === region);
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

    const topPerforming = [...filteredCampaigns]
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

    const recentUploads = [...filteredCampaigns]
        .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
        .slice(0, 5);

    // Tiny sparkline data
    const sparkData = {
        labels: filteredCampaigns.map((c) => c.name),
        datasets: [
            {
                data: filteredCampaigns.map((c) => c.clicks),
                borderColor: "#3b82f6",
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointRadius: 0,
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
            <div className="flex items-center justify-center py-24 text-slate-400 font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                    <div className="text-sm font-semibold tracking-wider uppercase text-slate-300">Loading Dashboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 rounded-2xl glass-card border border-red-500/20 text-center max-w-lg mx-auto font-sans">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto mb-4 flex items-center justify-center font-bold text-xl">!</div>
                <h3 className="text-lg font-bold text-white mb-2">Error Loading Dashboard</h3>
                <p className="text-sm text-slate-400 mb-6">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 text-slate-100 font-sans">
            {/* Header Title & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Overview & Performance</h1>
                    <p className="text-xs font-medium text-slate-400 mt-1">Real-time metrics, campaigns tracking, and audience engagement</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <button
                            className="bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            <span className="text-sky-400">📅</span> {filter.startDate.toLocaleDateString()} -{" "}
                            {filter.endDate.toLocaleDateString()}
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
                        className="rounded-xl px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
                        value={filter.region}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                    >
                        {regions.map((r) => (
                            <option key={r} className="bg-slate-900 text-slate-200">{r} Region</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1 */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Campaigns</span>
                        <span className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center text-sm">🎯</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-1">
                        {filteredCampaigns.filter((c) => c.status === "active").length}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <span>● Live in circulation</span>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Impressions</span>
                        <span className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">👁️</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-2">
                        {summary.impressions.toLocaleString()}
                    </div>
                    <div className="h-9">
                        <Line data={sparkData} options={sparkOptions} />
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Clicks</span>
                        <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-sm">👆</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-white mb-2">
                        {summary.clicks.toLocaleString()}
                    </div>
                    <div className="h-9">
                        <Line data={sparkData} options={sparkOptions} />
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Click Through Rate</span>
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">📈</span>
                    </div>
                    <div className="text-3xl font-black tracking-tight text-emerald-400 mb-1">
                        {summary.ctr}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                        Average conversion performance
                    </div>
                </div>
            </div>

            {/* Top Performing Ads */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-white tracking-tight">Top Performing Campaigns</h3>
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Top 5 Selection</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {topPerforming.map((c) => (
                        <CampaignCard
                            key={c.id}
                            campaign={c}
                            onPause={() => { }}
                            onEdit={() => { }}
                        />
                    ))}
                </div>
            </div>

            {/* Recent Uploads */}
            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">Recent Activity Log</h3>
                <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-xs font-bold uppercase tracking-wider bg-slate-900/90 text-slate-400 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">Campaign ID</th>
                                <th className="px-6 py-4">Date Created</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs font-medium">
                            {recentUploads.map((c) => {
                                const statusUpper = (c.status || "active").toLowerCase();
                                return (
                                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-200">{c.id}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(c.created_at || c.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
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
        </div>
    );
}
