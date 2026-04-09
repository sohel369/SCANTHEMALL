import { useState, useEffect } from "react";
import { getData, saveData, recordAudit } from "../../api/mockApi";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getData("notifications").then((d) => setNotifications(d || []));
  }, []);

  async function sendNotification() {
    if (!message.trim()) return;
    
    setSending(true);
    const n = {
      id: Date.now(),
      text: message,
      type: "announcement",
      date: new Date().toISOString(),
      read: false,
    };
    const next = [n, ...notifications];
    setNotifications(next);
    await saveData("notifications", next);
    recordAudit("send_notification", message);
    setMessage("");
    setSending(false);
  }

  function markAsRead(id) {
    const next = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(next);
    saveData("notifications", next);
  }

  function deleteNotification(id) {
    const next = notifications.filter(n => n.id !== id);
    setNotifications(next);
    saveData("notifications", next);
  }

  function markAllAsRead() {
    const next = notifications.map(n => ({ ...n, read: true }));
    setNotifications(next);
    saveData("notifications", next);
  }

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    switch(type) {
      case 'announcement': return 'bg-blue-900 border-blue-700';
      case 'alert': return 'bg-red-900 border-red-700';
      case 'log': return 'bg-slate-800 border-slate-700';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'announcement':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'log':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 text-neutral-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-sm text-neutral-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-neutral-300 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Broadcast Message */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Broadcast Announcement
        </h3>
        <div className="block sm:flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendNotification()}
            className="flex-1 mb-3 sm:mb-0 px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-neutral-400"
            placeholder="Type your announcement message..."
            disabled={sending}
          />
          <button
            onClick={sendNotification}
            disabled={sending || !message.trim()}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700">
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'announcement', label: 'Announcements', count: notifications.filter(n => n.type === 'announcement').length },
          { key: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
          { key: 'log', label: 'Logs', count: notifications.filter(n => n.type === 'log').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 font-medium transition-colors relative ${
              filter === tab.key
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                filter === tab.key ? 'bg-sky-900 text-sky-200' : 'bg-slate-700 text-neutral-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-neutral-400">No notifications to display</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`${getTypeColor(n.type)} border rounded-lg p-4 transition-all ${
                !n.read ? 'border-l-4' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 ${n.type === 'alert' ? 'text-red-400' : n.type === 'announcement' ? 'text-blue-400' : 'text-neutral-400'}`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        n.type === 'announcement' ? 'bg-blue-800 text-blue-200' :
                        n.type === 'alert' ? 'bg-red-800 text-red-200' :
                        'bg-slate-700 text-neutral-300'
                      }`}>
                        {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 bg-sky-400 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-neutral-200">{n.text}</p>
                    <p className="text-xs text-neutral-400 mt-2">
                      {new Date(n.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 hover:bg-red-900 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4 text-neutral-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
