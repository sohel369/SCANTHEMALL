// src/api/mockApi.js

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

/* ------------------------------------------------------------------------
   INITIAL SEED DATA
------------------------------------------------------------------------ */
function seedData() {
    if (localStorage.getItem("__mock_seeded")) return;

    const users = [
        { id: "u_1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active", createdAt: new Date().toISOString() },
        { id: "u_2", name: "Bob Lee", email: "bob@example.com", role: "advertiser", status: "active", createdAt: new Date().toISOString() },
        { id: "u_3", name: "Charlie Smith", email: "charlie@example.com", role: "user", status: "active", createdAt: new Date().toISOString() },
        { id: "u_4", name: "Dana Park", email: "dana@example.com", role: "advertiser", status: "suspended", createdAt: new Date().toISOString() },
    ];

    const uploads = [
        { id: "up_1", userId: "u_3", thumbnail: "https://picsum.photos/id/237/300/200", status: "approved", createdAt: new Date().toISOString() },
        { id: "up_2", userId: "u_3", thumbnail: "https://picsum.photos/id/1025/300/200", status: "pending", createdAt: new Date().toISOString() },
    ];

    const ads = [
        { id: "ad_1", platform: "Facebook", slot: "leaderboard", region: "Los Angeles", price: 120, active: true, impressions: 1200 },
        { id: "ad_2", platform: "Instagram", slot: "rectangle", region: "New York", price: 90, active: true, impressions: 980 },
        { id: "ad_3", platform: "YouTube", slot: "skyscraper", region: "London", price: 150, active: false, impressions: 550 },
    ];

    const draws = [
        { id: "d_1", title: "Luxury Car Giveaway", prize: "Tesla Model Y", entries: 1200, status: "active", endsAt: new Date(Date.now() + 10 * 86400000).toISOString() },
        { id: "d_2", title: "Gold Bullion Bonanza", prize: "1kg Gold Bar", entries: 800, status: "complete", endsAt: new Date(Date.now() - 86400000).toISOString(), winnerId: "u_3" },
    ];

    const regions = ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Global"];

    const titles = [
        "Summer Splash Promo",
        "Holiday Giveaway",
        "Tech Expo Campaign",
        "Luxury Spa Week",
        "Fitness Frenzy",
        "Food Festival 2025",
        "Back-to-School Deals",
    ];

    const now = new Date();
    const campaigns = titles.map((title, i) => {
        const start = new Date(now.getTime() - Math.random() * 60 * 24 * 3600 * 1000);
        const endsAt = new Date(start.getTime() + (15 + Math.random() * 30) * 24 * 3600 * 1000);
        const impressions = Math.floor(Math.random() * 80000 + 2000);
        const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05));
        const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.2));
        const statusPool = ["active", "pending", "paused"];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const status = statusPool[Math.floor(Math.random() * statusPool.length)];

        return {
            id: `c_${Date.now()}_${i}`,
            title,
            region,
            budget: Math.floor(Math.random() * 5000 + 1000),
            start: start.toISOString(),
            endsAt: endsAt.toISOString(),
            status,
            impressions,
            clicks,
            conversions,
            media: "sample_banner.jpg",
            createdAt: start.toISOString(),
        };
    });

    const geo_zones = [
        { id: "z_1", name: "Los Angeles County", zips: ["90001", "90002"], estimatedReach: 35000 },
        { id: "z_2", name: "New York Metro", zips: ["10001", "10002"], estimatedReach: 50000 },
    ];

    const exclusions = ["90210", "11201"];

    const policies = [
        { id: "privacy", title: "Privacy Policy", content: "We value your privacy. No personal data is shared with third parties." },
        { id: "terms", title: "Terms of Service", content: "By participating, you agree to abide by sweepstake rules and conditions." },
        { id: "faq", title: "FAQ", content: "Q: How do I participate?\nA: Upload billboard photos to gain entries." },
    ];

    const notifications = [
        { id: "n_1", text: "Welcome to Gotta Scan Admin Dashboard!", date: new Date().toISOString() },
        { id: "n_2", text: "Advertiser campaign performance updated weekly.", date: new Date().toISOString() },
    ];

    const invoices = [
        { id: "inv_1", date: new Date().toISOString(), amount: 450, status: "Paid", fileUrl: "" },
        { id: "inv_2", date: new Date().toISOString(), amount: 900, status: "Pending", fileUrl: "" },
    ];

    const settings = {
        uploadLimitPerDay: 20,
        adRotationSeconds: 60,
        enableMultiLang: false,
        emailFrom: "no-reply@gottascan.com",
    };

    const advertiser_account = {
        company: "Acme Corp",
        contact: "marketing@acme.com",
        billingEmail: "billing@acme.com",
    };

    const audit = [
        { id: 1, ts: new Date().toISOString(), action: "seed_data", detail: "Mock data initialized" },
    ];

    const media = [
        {
            id: "m_demo_1",
            name: "Leaderboard_Ad.jpg",
            url: "https://via.placeholder.com/728x90?text=Leaderboard+Ad",
            tag: "Leaderboard",
            size: 120,
            format: "image/jpeg",
            status: "approved",
            createdAt: new Date().toISOString(),
        },
        {
            id: "m_demo_2",
            name: "Sidebar_Ad.png",
            url: "https://via.placeholder.com/300x250?text=Sidebar+Ad",
            tag: "Sidebar",
            size: 95,
            format: "image/png",
            status: "pending",
            createdAt: new Date().toISOString(),
        },
    ];

    const data = {
        users, uploads, ads, draws, campaigns,
        geo_zones, exclusions, policies, notifications,
        invoices, settings, advertiser_account, audit, media,
    };

    for (const [k, v] of Object.entries(data)) {
        localStorage.setItem(k, JSON.stringify(v));
    }

    localStorage.setItem("__mock_seeded", "true");
}

seedData();

/* ------------------------------------------------------------------------
   BASIC MOCK API FUNCTIONS
------------------------------------------------------------------------ */
export async function getData(key) {
    await delay();
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
}

export async function saveData(key, data) {
    await delay();
    localStorage.setItem(key, JSON.stringify(data));
    recordAudit("save_data", key);
}

export function recordAudit(action, detail) {
    const logs = JSON.parse(localStorage.getItem("audit") || "[]");
    logs.unshift({ id: Date.now(), ts: new Date().toISOString(), action, detail });
    localStorage.setItem("audit", JSON.stringify(logs.slice(0, 100)));
}

/* ------------------------------------------------------------------------
   EXTENDED MEDIA UPLOAD HANDLING
------------------------------------------------------------------------ */
export async function uploadMedia(fileList = []) {
    await delay(500);
    const existing = (await getData("media")) || [];
    const processed = [];

    for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i];
        const id = `m_${Date.now()}_${i}`;
        const url = URL.createObjectURL(f);
        const tag = guessTagFromName(f.name);
        const size = Math.round(f.size / 1024);
        const format = f.type || "unknown";

        // Basic validation mock
        if (size > 5000) {
            recordAudit("upload_failed", `${f.name} too large`);
            continue;
        }

        processed.push({
            id, name: f.name, url, size, format, tag,
            status: "pending", createdAt: new Date().toISOString(),
        });
    }

    const next = [...processed, ...existing];
    await saveData("media", next);
    recordAudit("upload_media", `${processed.length} files`);
    return processed;
}

export async function approveMedia(id) {
    const media = (await getData("media")) || [];
    const next = media.map(m => m.id === id ? { ...m, status: "approved" } : m);
    await saveData("media", next);
    recordAudit("approve_media", id);
}

export async function deleteMedia(id) {
    const media = (await getData("media")) || [];
    const next = media.filter(m => m.id !== id);
    await saveData("media", next);
    recordAudit("delete_media", id);
}

/* ------------------------------------------------------------------------
   UTILITIES
------------------------------------------------------------------------ */
export async function resetMockDB() {
    localStorage.clear();
    seedData();
}

export async function simulateApiCall(endpoint, payload = {}) {
    await delay();
    recordAudit("api_call", endpoint);
    return { success: true, endpoint, payload };
}

function guessTagFromName(name) {
    const lower = name.toLowerCase();
    if (lower.includes("leaderboard")) return "Leaderboard";
    if (lower.includes("sidebar")) return "Sidebar";
    if (lower.includes("banner")) return "Banner";
    if (lower.includes("video")) return "Video Ad";
    return "General";
}
