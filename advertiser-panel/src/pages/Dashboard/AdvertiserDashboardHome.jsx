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
            <div className="space-y-6 text-neutral-50">
                <div className="text-center py-8">
                    <div className="text-lg">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 text-neutral-50">
                <div className="text-center py-8">
                    <div className="text-lg text-red-400">Error loading dashboard</div>
                    <div className="text-sm text-gray-400 mt-2">{error}</div>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-sky-400 rounded-lg text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-neutral-50">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <button
                            className="bg-sky-400 px-3 py-2 rounded-lg shadow-lg text-xs"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            📅 {filter.startDate.toLocaleDateString()} -{" "}
                            {filter.endDate.toLocaleDateString()}
                        </button>
                        {showDatePicker && (
                            <div className="absolute z-10 mt-2 text-gray-700">
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
                        className="rounded-lg px-3 py-2 bg-sky-400 text-xs"
                        value={filter.region}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                    >
                        {regions.map((r) => (
                            <option key={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-950 rounded-lg shadow-lg px-4 py-3">
                    <div className="text-sm">Active Campaigns</div>
                    <div className="text-2xl font-bold text-sky-400">
                        {filteredCampaigns.filter((c) => c.status === "active").length}
                    </div>
                </div>
                <div className="bg-blue-950 rounded-lg shadow-lg px-4 py-3">
                    <div className="text-sm">Total Impressions</div>
                    <div className="text-2xl font-bold text-sky-400">{summary.impressions}</div>
                    <div className="h-10">
                        <Line data={sparkData} options={sparkOptions} />
                    </div>
                </div>
                <div className="bg-blue-950 rounded-lg shadow-lg px-4 py-3">
                    <div className="text-sm">Total Clicks</div>
                    <div className="text-2xl font-bold text-sky-400">{summary.clicks}</div>
                    <div className="h-10">
                        <Line data={sparkData} options={sparkOptions} />
                    </div>
                </div>
                <div className="bg-blue-950 rounded-lg shadow-lg px-4 py-3">
                    <div className="text-sm">CTR</div>
                    <div className="text-2xl font-bold text-sky-400">{summary.ctr}</div>
                </div>
            </div>

            {/* Top Performing Ads */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Top Performing Ads</h3>
                <div className="grid grid-cols-3 gap-4">
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
            <div>
                <h3 className="text-lg font-semibold mb-3">Recent Uploads & Approval Status</h3>
                <div className="overflow-auto">
                    <table className="w-full text-left rounded-lg shadow-lg border-separate border-spacing-y-2">
                        <thead className="text-sm bg-sky-400 rounded-lg shadow-lg">
                            <tr>
                                <th className="px-4 py-2 text-left">Campaign</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUploads.map((c) => (
                                <tr key={c.id} className="text-xs bg-blue-950 rounded-lg shadow-lg">
                                    <td className="px-4 py-2">{c.id}</td>
                                    <td className="px-4 py-2">
                                        {new Date(c.created_at || c.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span>
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
