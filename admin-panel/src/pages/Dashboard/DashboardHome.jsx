import { useEffect, useState } from "react";
import { usersAPI, uploadsAPI, drawsAPI, adsAPI } from "../../api/api";

export default function DashboardHome() {
    const [stats, setStats] = useState({
        users: { total: 0, roles: {} },
        uploads: { today: 0, week: 0, month: 0 },
        draws: { active: 0, total: 0 },
        ads: { active: 0, total: 0 },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                const [users, uploads, draws, ads] = await Promise.all([
                    usersAPI.getUsers().catch(() => []),
                    uploadsAPI.getUploads().catch(() => []),
                    drawsAPI.getDraws().catch(() => []),
                    adsAPI.getAds().catch(() => []),
                ]);

                // Users breakdown by role
                const roles = users.reduce((acc, user) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                }, {});

                // Uploads by timeframe
                const now = new Date();
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const startOfWeek = new Date(startOfDay);
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const uploadsToday = uploads.filter(u => new Date(u.created_at) >= startOfDay).length;
                const uploadsWeek = uploads.filter(u => new Date(u.created_at) >= startOfWeek).length;
                const uploadsMonth = uploads.filter(u => new Date(u.created_at) >= startOfMonth).length;

                setStats({
                    users: { total: users.length, roles },
                    uploads: { today: uploadsToday, week: uploadsWeek, month: uploadsMonth },
                    draws: { active: draws.length, total: draws.length },
                    ads: { active: ads.filter(a => a.active).length, total: ads.length },
                });
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <div className="p-6 text-neutral-50">Loading dashboard...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats.users.total} details={stats.users.roles} />
                <StatCard title="Uploads Today" value={stats.uploads.today} />
                <StatCard title="Uploads This Week" value={stats.uploads.week} />
                <StatCard title="Uploads This Month" value={stats.uploads.month} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Draws" value={stats.draws.total} />
                <StatCard title="Active Ads" value={stats.ads.active} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Ads" value={stats.ads.total} />
            </div>

            <QuickLinks />
        </div>
    );
}

function StatCard({ title, value, details }) {
    return (
        <div className="bg-blue-950 p-4 rounded-lg shadow-lg text-neutral-50">
            <div className="text-sm">{title}</div>
            <div className="text-2xl text-cyan-500 font-bold">{value}</div>
            {details && (
                <div className="text-xs mt-2">
                    {Object.entries(details).map(([role, count]) => (
                        <div key={role}>{role}: {count}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

function QuickLinks() {
    const links = [
        { label: "Add User", href: "/users/add" },
        { label: "Manage Draws", href: "/draws" },
        { label: "Manage Ads", href: "/ads" },
    ];

    return (
        <div className="bg-blue-950 p-4 rounded shadow flex gap-4">
            {links.map(link => (
                <a
                    key={link.label}
                    href={link.href}
                    className="bg-sky-400 text-neutral-50 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
}
