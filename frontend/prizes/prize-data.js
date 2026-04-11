// ============================================================
// GTSA Prize Data Engine — prize-data.js
// Loads geo-targeted prize provider data from Firebase
// Prize providers upload branding/offers via prize-admin.html
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBb4q5dU4ccoRtK_c98chs1BMXoqcC222g",
    authDomain: "scanthemall-c1475.firebaseapp.com",
    databaseURL: "https://scanthemall-c1475-default-rtdb.firebaseio.com",
    projectId: "scanthemall-c1475",
    storageBucket: "scanthemall-c1475.appspot.com",
    messagingSenderId: "1040707976422",
    appId: "1:1040707976422:web:883018fc54b7ac5c8f8f27",
    measurementId: "G-11LB2NBCGJ"
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ─── GEO-DETECT ─────────────────────────────────────────────
/**
 * Returns the user's detected country/region codes via ipapi.co
 * Falls back to "global" if detection fails.
 */
export async function detectRegion() {
    try {
        const res  = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        return {
            country:    (data.country || "GLOBAL").toUpperCase(),
            region:     (data.region  || "").toUpperCase(),
            city:       (data.city    || "").toUpperCase(),
            continentCode: (data.continent_code || "").toUpperCase()
        };
    } catch {
        return { country: "GLOBAL", region: "", city: "", continentCode: "" };
    }
}

// ─── PRIZE-CATEGORY SLUGS ───────────────────────────────────
export const PRIZE_CATEGORIES = {
    elitecar:       "Elite Car",
    ultimateescape: "Ultimate Escape",
    luxuryfashion:  "Luxury Fashion",
    goldentreasure: "Golden Treasure",
    healthglow:     "Health Glow"
};

// ─── DEFAULT FALLBACK DATA (shown when no regional provider) ─
export const DEFAULT_PRIZE_DATA = {
    elitecar: {
        providerName:    "Scan Them All Global",
        providerLogo:    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        heroImage:       "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
        heroTagline:     "Win an Elite Performance Vehicle",
        prizeSubtitle:   "The ultimate four-wheeled symbol of prestige and power — fully bespoke for the global winner.",
        prizeValue:      "$75,000+",
        accentColor:     "#FF3D00",
        galleryImages:   [
            "https://images.unsplash.com/photo-1573950940509-d924ee3fd345?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon: "car", label: "Premium Model", value: "Sport Edition" },
            { icon: "zap", label: "0-100 km/h",   value: "Under 4 Seconds" },
            { icon: "globe", label: "Delivery",     value: "Worldwide" },
            { icon: "shield", label: "Warranty",    value: "5 Year Cover" }
        ],
        offerHeadline:   "Become an Elite Car Winner",
        offerBody:       "Upload your screenshots, accumulate entries, and win the vehicle of your dreams. Our elite car prize is exclusively available to top-tier scan participants.",
        ctaText:         "Enter to Win",
        ctaLink:         "../index.html",
        partnerOffer:    null
    },
    ultimateescape: {
        providerName:    "Scan Them All Global",
        providerLogo:    "",
        heroImage:       "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1600&q=80",
        heroTagline:     "Win the Ultimate Escape",
        prizeSubtitle:   "All-inclusive first-class travel to the Maldives, Bora Bora, or the Swiss Alps — for two.",
        prizeValue:      "$30,000+",
        accentColor:     "#0EA5E9",
        galleryImages:   [
            "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon: "plane",  label: "Class",        value: "First Class Flights" },
            { icon: "hotel",  label: "Accommodation", value: "5-Star Resort" },
            { icon: "users",  label: "For",           value: "Two Travellers" },
            { icon: "calendar", label: "Duration",    value: "7 - 14 Nights" }
        ],
        offerHeadline:   "Your Dream Holiday Awaits",
        offerBody:       "Choose your destination. We cover everything — flights, accommodation, transfers and exclusive experiences.",
        ctaText:         "Claim Your Escape",
        ctaLink:         "../index.html",
        partnerOffer:    null
    },
    luxuryfashion: {
        providerName:    "Scan Them All Global",
        providerLogo:    "",
        heroImage:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
        heroTagline:     "Win Luxury Fashion & Timepieces",
        prizeSubtitle:   "Designer handbags, Swiss watches and couture accessories from the world's most exclusive brands.",
        prizeValue:      "$15,000+",
        accentColor:     "#D4A017",
        galleryImages:   [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon: "watch",   label: "Timepiece",    value: "Swiss Luxury" },
            { icon: "shopping-bag", label: "Handbag", value: "Designer Label" },
            { icon: "star",    label: "Tier",         value: "Premium Curated" },
            { icon: "gift",    label: "Delivery",     value: "Insured & Global" }
        ],
        offerHeadline:   "Wear the Prize",
        offerBody:       "From Swiss timepieces to haute couture handbags — every prize in this category is hand-selected for global prestige.",
        ctaText:         "Win Fashion Now",
        ctaLink:         "../index.html",
        partnerOffer:    null
    },
    goldentreasure: {
        providerName:    "Scan Them All Global",
        providerLogo:    "",
        heroImage:       "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80",
        heroTagline:     "Win Physical Gold & Silver",
        prizeSubtitle:   "Investment-grade bullion bars and coins — delivered securely to your door or vault worldwide.",
        prizeValue:      "$20,000+",
        accentColor:     "#F59E0B",
        galleryImages:   [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1624365169198-38255b22cad8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon: "layers",  label: "Purity",       value: "999.9 Fine Gold" },
            { icon: "shield",  label: "Certified",    value: "Assay Guaranteed" },
            { icon: "lock",    label: "Delivery",     value: "Vault or Courier" },
            { icon: "trending-up", label: "Asset",    value: "Investment Grade" }
        ],
        offerHeadline:   "Real Wealth. Real Prizes.",
        offerBody:       "Gold never goes out of style. Win tangible, investment-grade precious metal assets that hold and grow in value.",
        ctaText:         "Claim Your Gold",
        ctaLink:         "../index.html",
        partnerOffer:    null
    },
    healthglow: {
        providerName:    "Scan Them All Global",
        providerLogo:    "",
        heroImage:       "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
        heroTagline:     "Win a Health & Wellness Package",
        prizeSubtitle:   "Premium wellness retreats, spa packages, fitness equipment and health supplements from leading brands.",
        prizeValue:      "$10,000+",
        accentColor:     "#22C55E",
        galleryImages:   [
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon: "heart",   label: "Wellness",     value: "Spa & Retreat" },
            { icon: "activity", label: "Fitness",     value: "Premium Equipment" },
            { icon: "sun",     label: "Supplements",  value: "Leading Brands" },
            { icon: "smile",   label: "Experience",   value: "Transformative" }
        ],
        offerHeadline:   "Invest in Your Best Self",
        offerBody:       "Your health is your greatest asset. Win a complete wellness transformation package curated by leading global health brands.",
        ctaText:         "Start Your Glow Journey",
        ctaLink:         "../index.html",
        partnerOffer:    null
    }
};

// ─── LOAD GEO-TARGETED PRIZE DATA ───────────────────────────
/**
 * Loads prize data for a given category and region.
 * Priority: city → region → country → continent → global → default
 */
export async function loadPrizeData(category, geo) {
    const lookupKeys = [
        `prizes/${category}/${geo.country}_${geo.region}_${geo.city}`,
        `prizes/${category}/${geo.country}_${geo.region}`,
        `prizes/${category}/${geo.country}`,
        `prizes/${category}/GLOBAL`
    ].filter(k => !k.includes("__")); // remove empty segments

    for (const key of lookupKeys) {
        try {
            const snap = await get(ref(db, key));
            if (snap.exists()) {
                console.log(`[PrizeData] Loaded from Firebase: ${key}`);
                return { ...DEFAULT_PRIZE_DATA[category], ...snap.val() };
            }
        } catch (e) {
            console.warn("[PrizeData] Firebase read error:", e);
        }
    }

    console.log(`[PrizeData] Using default data for: ${category}`);
    return DEFAULT_PRIZE_DATA[category];
}

export { db, ref, set };
