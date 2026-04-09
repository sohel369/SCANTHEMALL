import { useEffect, useState } from "react";
import { campaignsAPI, analyticsAPI } from "../../api/api";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function AnalyticsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [analytics, setAnalytics] = useState({ total_uploads: 0, unique_users: 0 });
    const [selectedRange, setSelectedRange] = useState("30d");

    useEffect(() => {
        async function fetchData() {
          try {
            const campaignsData = await campaignsAPI.getCampaigns();
            setCampaigns(campaignsData || []);
            
            const analyticsData = await analyticsAPI.getAnalytics();
            setAnalytics(analyticsData || { total_uploads: 0, unique_users: 0 });
          } catch (err) {
            console.error("Failed to load analytics:", err);
          }
        }
        fetchData();
    }, []);

    // Generate mock time-series analytics data
    const analyticsData = (c) => {
        const points = selectedRange === "7d" ? 7 : selectedRange === "90d" ? 12 : 30;
        return new Array(points).fill(0).map((_, i) => ({
            day: `Day ${i + 1}`,
            impressions: Math.floor(c.impressions / points + Math.random() * 200),
            clicks: Math.floor(c.clicks / points + Math.random() * 50),
            engagement: Math.floor((c.clicks / (c.impressions || 1)) * 100 + Math.random() * 5),
        }));
    };

    const aggregated = campaigns.reduce((acc, c) => {
        acc.impressions += c.impressions || 0;
        acc.clicks += c.clicks || 0;
        acc.conversions += c.conversions || 0;
        return acc;
    }, { impressions: 0, clicks: 0, conversions: 0 });

    const roi = aggregated.conversions
        ? ((aggregated.conversions * 5) / (aggregated.clicks || 1)).toFixed(2)
        : "N/A";

    // CSV Export
    function exportCSV() {
        const rows = campaigns.map(c => ({
            title: c.title,
            region: c.region,
            impressions: c.impressions,
            clicks: c.clicks,
            conversions: c.conversions,
        }));
        const keys = Object.keys(rows[0] || {});
        const csv = [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "analytics.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    // PDF Export
    function exportPDF() {
        window.print();
    }

    return (
        <div className="space-y-6 text-neutral-50">
            <h2 className="text-xl font-semibold">Analytics & Reports</h2>

            {/* Filters */}
            <div className="flex gap-3 items-center">
                <label className="text-sm">Analytics Range:</label>
                <select
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                    className="px-2 py-2 rounded-lg text-xs bg-sky-400"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-blue-950 p-4 rounded-lg shadow-lg">
                    <div>Total Impressions</div>
                    <div className="text-2xl font-semibold">{aggregated.impressions.toLocaleString()}</div>
                </div>
                <div className="bg-blue-950 p-4 rounded-lg shadow-lg">
                    <div>Total Clicks</div>
                    <div className="text-2xl font-semibold">{aggregated.clicks.toLocaleString()}</div>
                </div>
                <div className="bg-blue-950 p-4 rounded-lg shadow-lg">
                    <div>Total Conversions</div>
                    <div className="text-2xl font-semibold">{aggregated.conversions.toLocaleString()}</div>
                </div>
                <div className="bg-blue-950 p-4 rounded-lg shadow-lg">
                    <div>ROI (Est.)</div>
                    <div className="text-2xl font-semibold">{roi}</div>
                </div>
            </div>

            {/* Chart: Impressions vs Clicks */}
            <div className="bg-blue-950 p-4 rounded shadow">
                <h3 className="font-medium mb-3">Performance Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={analyticsData(aggregated)}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="impressions" stroke="#3b82f6" name="Impressions" />
                        <Line type="monotone" dataKey="clicks" stroke="#10b981" name="Clicks" />
                        <Line type="monotone" dataKey="engagement" stroke="#f59e0b" name="Engagement %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart: Regional Performance */}
            <div className="bg-blue-950 p-4 rounded shadow">
                <h3 className="font-medium mb-3">Regional Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={campaigns.map(c => ({
                            region: c.region,
                            impressions: c.impressions,
                            clicks: c.clicks,
                            conversions: c.conversions
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="impressions" fill="#3b82f6" name="Impressions" />
                        <Bar dataKey="clicks" fill="#10b981" name="Clicks" />
                        <Bar dataKey="conversions" fill="#f59e0b" name="Conversions" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Heatmap Placeholder */}
            <div className="bg-blue-950 p-4 rounded shadow">
                <h3 className="font-medium mb-2">Regional Heatmap</h3>
                <div className="text-sm mb-3">
                    Visualizing engagement density by region. (Map integration coming soon)
                </div>
                <div className="w-full bg-sky-400 h-64 rounded flex items-center justify-center">
                    🗺️ Heatmap Preview Placeholder
                </div>
            </div>

            {/* Export Buttons */}
            <div className="mt-4">
                <button onClick={exportPDF} className="px-3 py-1 rounded-lg bg-sky-400 text-sm">
                    Export to PDF
                </button>
                <button onClick={exportCSV} className="ml-2 px-3 py-1 rounded-lg bg-sky-400 text-sm">
                    Export to CSV
                </button>
            </div>
        </div>
    );
}
