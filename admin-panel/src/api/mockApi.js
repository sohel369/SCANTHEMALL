// src/api/mockApi.js

// --- small async delay to simulate backend ---
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// --- seed data once ---
function ensureSeed() {
  if (!localStorage.getItem("__seeded")) {
    const users = [
      { id: "u_1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active", createdAt: new Date().toISOString() },
      { id: "u_2", name: "Bob Lee", email: "bob@example.com", role: "advertiser", status: "active", createdAt: new Date().toISOString() },
      { id: "u_3", name: "Charlie Smith", email: "charlie@example.com", role: "user", status: "active", createdAt: new Date().toISOString() },
    ];

    const uploads = [
      { id: "up_1", userId: "u_3", thumbnail: "https://picsum.photos/150?1", status: "pending", createdAt: new Date().toISOString() },
      { id: "up_2", userId: "u_3", thumbnail: "https://picsum.photos/150?2", status: "approved", createdAt: new Date().toISOString() },
      { id: "up_3", userId: "u_4", thumbnail: "https://picsum.photos/150?3", status: "approved", createdAt: new Date(Date.now() - 2*24*3600*1000).toISOString() },
      { id: "up_4", userId: "u_4", thumbnail: "https://picsum.photos/150?4", status: "approved", createdAt: new Date(Date.now() - 10*24*3600*1000).toISOString() },
    ];

    const draws = [
      { id: "d_1", title: "Luxury Car Giveaway", prize: "2025 Tesla Model Y", entries: 1500, status: "active", createdAt: new Date().toISOString(), endsAt: new Date(Date.now() + 7*24*3600*1000).toISOString() },
      { id: "d_2", title: "Holiday Trip Draw", prize: "7 Days Maldives", entries: 850, status: "active", createdAt: new Date().toISOString(), endsAt: new Date(Date.now() + 14*24*3600*1000).toISOString() },
    ];

    const ads = [
      { id: "ad_1", platform: "Facebook", slot: "leaderboard", region: "Los Angeles", price: 150, active: true, impressions: 1200, clicks: 50, language: "EN", startDate: new Date().toISOString().split("T")[0], endDate: new Date(Date.now()+30*24*3600*1000).toISOString().split("T")[0], creativeLink: "https://picsum.photos/300/100" },
      { id: "ad_2", platform: "Instagram", slot: "rectangle", region: "New York", price: 90, active: true, impressions: 900, clicks: 30, language: "EN", startDate: new Date().toISOString().split("T")[0], endDate: new Date(Date.now()+15*24*3600*1000).toISOString().split("T")[0], creativeLink: "https://picsum.photos/150/150" },
    ];

    const policies = [
      { id: "privacy", title: "Privacy Policy", content: "We value your privacy.", versions: [] },
      { id: "terms", title: "Terms of Service", content: "Use of this site is subject to terms.", versions: [] },
      { id: "cookie", title: "Cookie Policy", content: "We use cookies to enhance experience.", versions: [] },
    ];

    const notifications = [
      { id: 1, text: "Welcome to Admin Dashboard!", type: "announcement", date: new Date().toISOString(), read: false },
      { id: 2, text: "Server CPU usage high!", type: "alert", date: new Date().toISOString(), read: false },
      { id: 3, text: "Email sent to user@example.com", type: "log", date: new Date().toISOString(), read: true },
      { id: 4, text: "SMS failed to +1234567890", type: "log", date: new Date().toISOString(), read: false },
    ];

    const settings = { uploadLimitPerDay: 20, adRotationSeconds: 60, enableMultiLang: false, emailFrom: "no-reply@example.com" };
    const audit = [{ id: 1, ts: new Date().toISOString(), action: "seed_data", detail: "Initialized mock database" }];

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("uploads", JSON.stringify(uploads));
    localStorage.setItem("draws", JSON.stringify(draws));
    localStorage.setItem("ads", JSON.stringify(ads));
    localStorage.setItem("policies", JSON.stringify(policies));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("audit", JSON.stringify(audit));
    localStorage.setItem("__seeded", "true");
  }
}

ensureSeed();

// --- API functions ---
export async function getData(key) {
  await delay();
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export async function saveData(key, data) {
  await delay();
  localStorage.setItem(key, JSON.stringify(data));
}

export function recordAudit(action, detail) {
  const audits = JSON.parse(localStorage.getItem("audit") || "[]");
  audits.unshift({ id: Date.now(), ts: new Date().toISOString(), action, detail });
  localStorage.setItem("audit", JSON.stringify(audits.slice(0,100)));
}

// --- Reset DB ---
export async function resetMockDB() {
  localStorage.removeItem("__seeded");
  ensureSeed();
}

// --- Notification Helpers ---
export async function markNotificationRead(id) {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  const next = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  await saveData("notifications", next);
  return next;
}

export async function markAllNotificationsRead() {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  const next = notifications.map(n => ({ ...n, read: true }));
  await saveData("notifications", next);
  return next;
}
