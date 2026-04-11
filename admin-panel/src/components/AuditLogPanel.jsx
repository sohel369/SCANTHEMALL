import { useEffect, useState } from "react";
import { auditAPI } from "../api/api";

export default function AuditLogPanel({ isCollapsed, onToggleCollapse }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLogs();
        // Refresh logs every 30 seconds
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    async function fetchLogs() {
        try {
            const data = await auditAPI.getAuditLogs(100, 0);
            setLogs(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getActionIcon = (action) => {
        if (action.includes('create') || action.includes('add') || action.includes('registration')) {
            return (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            );
        }
        if (action.includes('update') || action.includes('edit')) {
            return (
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            );
        }
        if (action.includes('delete') || action.includes('remove')) {
            return (
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            );
        }
        if (action.includes('login') || action.includes('auth')) {
            return (
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    };

    const getActionColor = (action) => {
        if (action.includes('create') || action.includes('add') || action.includes('registration')) return 'text-green-400';
        if (action.includes('update') || action.includes('edit')) return 'text-blue-400';
        if (action.includes('delete') || action.includes('remove')) return 'text-red-400';
        if (action.includes('login') || action.includes('auth')) return 'text-purple-400';
        return 'text-neutral-400';
    };

    const filteredLogs = filter === 'all' ? logs : logs.filter(log => {
        if (filter === 'create') return log.action.includes('create') || log.action.includes('add') || log.action.includes('registration');
        if (filter === 'update') return log.action.includes('update') || log.action.includes('edit');
        if (filter === 'delete') return log.action.includes('delete') || log.action.includes('remove');
        return true;
    });

    if (isCollapsed) {
        return (
            <div className="h-full flex items-start justify-center pt-4">
                <button
                    onClick={onToggleCollapse}
                    className="bg-slate-800 text-neutral-50 p-3 rounded-lg shadow-lg hover:bg-slate-700 transition-all border border-slate-700 hover:border-sky-500 group"
                    title="Show Audit Log"
                >
                    <svg className="w-5 h-5 group-hover:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-800 text-neutral-50 rounded-lg shadow-xl border border-slate-700 flex flex-col overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-4 border-b border-slate-600">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-600 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Audit Log</h3>
                            <p className="text-xs text-neutral-400">{logs.length} total events</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchLogs}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                            title="Refresh"
                            disabled={loading}
                        >
                            <svg className={`w-4 h-4 group-hover:text-sky-400 transition-colors ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                            title="Collapse Panel"
                        >
                            <svg className="w-4 h-4 group-hover:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-3 bg-slate-750 border-b border-slate-700">
                {[
                    { key: 'all', label: 'All', icon: '📋' },
                    { key: 'create', label: 'Create', icon: '✨' },
                    { key: 'update', label: 'Update', icon: '✏️' },
                    { key: 'delete', label: 'Delete', icon: '🗑️' }
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                            filter === f.key
                                ? 'bg-sky-600 text-white shadow-lg scale-105'
                                : 'bg-slate-700 text-neutral-300 hover:bg-slate-600 hover:text-white'
                        }`}
                    >
                        <span className="mr-1">{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Logs List with Custom Scrollbar */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-sky-400 mb-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-neutral-400">Loading audit logs...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-3 bg-red-900/20 rounded-full mb-3">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-400 font-medium mb-2">Failed to load logs</p>
                        <p className="text-xs text-neutral-400 mb-3">{error}</p>
                        <button 
                            onClick={fetchLogs} 
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-3 bg-slate-700 rounded-full mb-3">
                            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-neutral-400 font-medium">No audit logs yet</p>
                        <p className="text-xs text-neutral-500 mt-1">Activity will appear here</p>
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className="bg-slate-900 rounded-lg p-3 border border-slate-700 hover:border-sky-600 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 p-1.5 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold ${getActionColor(log.action)}`}>
                                        {log.action.replace(/_/g, ' ').toUpperCase()}
                                    </div>
                                    {log.user_email && (
                                        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="truncate">{log.user_email}</span>
                                        </div>
                                    )}
                                    {log.details && (
                                        <div className="text-xs text-neutral-300 mt-2 p-2 bg-slate-800 rounded border border-slate-700 break-words">
                                            {log.details.length > 120 
                                                ? log.details.substring(0, 120) + '...' 
                                                : log.details}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {new Date(log.created_at).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Stats */}
            {!loading && !error && logs.length > 0 && (
                <div className="p-3 bg-slate-750 border-t border-slate-700">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400">
                            Showing {filteredLogs.length} of {logs.length}
                        </span>
                        <span className="text-neutral-500">
                            Auto-refresh: 30s
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
