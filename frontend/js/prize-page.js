/**
 * prize-page.js — Shared Prize Page Engine for GTSA
 * Each prize page sets window.PRIZE_SLUG and loads this script.
 * This script renders the full page UI and loads geo-targeted
 * Firebase data for the prize provider in that region.
 */

// ── Firebase (CDN, loaded inline below) ─────────────────────
// ── Prize Defaults ───────────────────────────────────────────
const PRIZE_DEFAULTS = {
    elitecar: {
        heroTagline:   "Win an Elite Performance Vehicle",
        prizeSubtitle: "The ultimate four-wheeled symbol of prestige — fully bespoke for the global winner.",
        prizeValue:    "$75,000+",
        accentColor:   "#FF3D00",
        heroImage:     "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1573950940509-d924ee3fd345?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon:"car",      label:"Model",      value:"Sport Edition" },
            { icon:"zap",      label:"0-100 km/h", value:"Under 4 Sec" },
            { icon:"globe",    label:"Delivery",   value:"Worldwide" },
            { icon:"shield",   label:"Warranty",   value:"5 Year Cover" }
        ],
        offerHeadline: "Become an Elite Car Winner",
        offerBody:     "Upload your screenshots, accumulate entries, and win the vehicle of your dreams. Our elite car prize is exclusively available to top-tier scan participants.",
        ctaText:       "Enter to Win",
        ctaLink:       "../index.html",
        providerName:  "Scan Them All Global",
        providerLogo:  "",
        partnerOffer:  null
    },
    ultimateescape: {
        heroTagline:   "Win the Ultimate Escape",
        prizeSubtitle: "All-inclusive first-class travel to the Maldives, Bora Bora, or the Swiss Alps — for two.",
        prizeValue:    "$30,000+",
        accentColor:   "#0EA5E9",
        heroImage:     "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1600&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon:"plane",    label:"Class",    value:"First Class Flights" },
            { icon:"hotel",    label:"Stay",     value:"5-Star Resort" },
            { icon:"users",    label:"For",      value:"Two Travellers" },
            { icon:"calendar", label:"Duration", value:"7–14 Nights" }
        ],
        offerHeadline: "Your Dream Holiday Awaits",
        offerBody:     "First class flights, 5-star accommodation, exclusive experiences — all covered.",
        ctaText:       "Claim Your Escape",
        ctaLink:       "../index.html",
        providerName:  "Scan Them All Global",
        providerLogo:  "",
        partnerOffer:  null
    },
    luxuryfashion: {
        heroTagline:   "Win Luxury Fashion & Timepieces",
        prizeSubtitle: "Designer handbags, Swiss watches and couture accessories from the world's most exclusive brands.",
        prizeValue:    "$15,000+",
        accentColor:   "#D4A017",
        heroImage:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon:"watch",        label:"Timepiece", value:"Swiss Luxury" },
            { icon:"shopping-bag", label:"Handbag",   value:"Designer Label" },
            { icon:"star",         label:"Tier",      value:"Premium Curated" },
            { icon:"gift",         label:"Delivery",  value:"Insured & Global" }
        ],
        offerHeadline: "Wear the Prize",
        offerBody:     "From Swiss timepieces to haute couture — every prize hand-selected for global prestige.",
        ctaText:       "Win Fashion Now",
        ctaLink:       "../index.html",
        providerName:  "Scan Them All Global",
        providerLogo:  "",
        partnerOffer:  null
    },
    goldentreasure: {
        heroTagline:   "Win Physical Gold & Silver",
        prizeSubtitle: "Investment-grade bullion bars and coins — delivered to your door or secure vault, globally.",
        prizeValue:    "$20,000+",
        accentColor:   "#F59E0B",
        heroImage:     "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1624365169198-38255b22cad8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon:"layers",      label:"Purity",    value:"999.9 Fine Gold" },
            { icon:"shield",      label:"Certified", value:"Assay Guaranteed" },
            { icon:"lock",        label:"Delivery",  value:"Vault or Courier" },
            { icon:"trending-up", label:"Asset",     value:"Investment Grade" }
        ],
        offerHeadline: "Real Wealth. Real Prizes.",
        offerBody:     "Win tangible, investment-grade precious metals that hold and grow in value over time.",
        ctaText:       "Claim Your Gold",
        ctaLink:       "../index.html",
        providerName:  "Scan Them All Global",
        providerLogo:  "",
        partnerOffer:  null
    },
    healthglow: {
        heroTagline:   "Win a Health & Wellness Package",
        prizeSubtitle: "Premium wellness retreats, spa packages, elite fitness equipment and health supplements from leading brands.",
        prizeValue:    "$10,000+",
        accentColor:   "#22C55E",
        heroImage:     "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
        galleryImages: [
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
        ],
        features: [
            { icon:"heart",    label:"Wellness",    value:"Spa & Retreat" },
            { icon:"activity", label:"Fitness",     value:"Elite Equipment" },
            { icon:"sun",      label:"Supplements", value:"Premium Brands" },
            { icon:"smile",    label:"Experience",  value:"Transformative" }
        ],
        offerHeadline: "Invest in Your Best Self",
        offerBody:     "A complete wellness transformation package curated by the world's leading health brands.",
        ctaText:       "Start Your Glow Journey",
        ctaLink:       "../index.html",
        providerName:  "Scan Them All Global",
        providerLogo:  "",
        partnerOffer:  null
    }
};

const PRIZE_LABELS = {
    elitecar:       "🚗 Elite Car",
    ultimateescape: "✈️ Ultimate Escape",
    luxuryfashion:  "👜 Luxury Fashion",
    goldentreasure: "🥇 Golden Treasure",
    healthglow:     "💚 Health Glow"
};

// ── Hex to RGB helper ────────────────────────────────────────
function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '255,61,0';
}

// ── Pill nav HTML ────────────────────────────────────────────
function pillNav(active) {
    return Object.entries(PRIZE_LABELS).map(([slug, label]) =>
        `<a href="${slug}.html" class="prize-pill${slug === active ? ' active' : ''}" id="pill-${slug}">${label}</a>`
    ).join('');
}

// ── Feature cards HTML ───────────────────────────────────────
function featureCards(features) {
    return features.map(f => `
        <div class="feature-card">
            <div class="feat-icon"><i data-lucide="${f.icon}"></i></div>
            <div class="feat-label">${f.label}</div>
            <div class="feat-value">${f.value}</div>
        </div>
    `).join('');
}

// ── Gallery HTML ─────────────────────────────────────────────
function galleryHTML(images) {
    return images.map(src => `
        <div class="gallery-item">
            <img src="${src}" alt="Prize Image" loading="lazy">
        </div>
    `).join('');
}

// ── Full page HTML ───────────────────────────────────────────
function buildPageHTML(slug, data) {
    const accent    = data.accentColor || '#FF3D00';
    const accentRgb = hexToRgb(accent);
    const title     = PRIZE_LABELS[slug]?.replace(/^..\s/,'') || slug;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title id="doc-title">${data.heroTagline} | Scan Them All</title>
<meta name="description" content="${data.prizeSubtitle}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,600;0,700;0,900;1,900&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest"></script>
<style id="anti-flicker">.auth-login,.auth-signup,#login-btn,#signup-btn{opacity:0!important;visibility:hidden!important;}</style>
<style>
:root{--accent:${accent};--accent-rgb:${accentRgb};}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#050505;color:#fff;overflow-x:hidden;}

/* Loading */
#prize-loading{position:fixed;inset:0;z-index:9999;background:#050505;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;transition:opacity 0.6s;}
#prize-loading.fade-out{opacity:0;pointer-events:none;}
.dot{width:8px;height:8px;border-radius:50%;background:var(--accent);animation:db 0.8s ease infinite alternate;}
@keyframes db{to{transform:translateY(-6px);}}

/* Header */
.site-header{position:sticky;top:0;z-index:100;background:rgba(5,5,5,0.88);backdrop-filter:blur(14px);border-bottom:1px solid rgba(var(--accent-rgb),0.25);}

/* Prize nav pills */
.prize-nav{display:flex;gap:0.5rem;flex-wrap:wrap;overflow-x:auto;padding-bottom:0.25rem;}
.prize-nav::-webkit-scrollbar{display:none;}
.prize-pill{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#71717a;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:9999px;padding:0.4rem 0.9rem;text-decoration:none;transition:all 0.2s;white-space:nowrap;}
.prize-pill:hover,.prize-pill.active{color:var(--accent);border-color:var(--accent);background:rgba(var(--accent-rgb),0.08);}

/* Hero */
.prize-hero{position:relative;min-height:90vh;display:flex;align-items:flex-end;overflow:hidden;}
.hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:brightness(0.33);transform:scale(1.04);transition:transform 8s ease;}
.prize-hero:hover .hero-bg{transform:scale(1);}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,5,1) 0%,rgba(5,5,5,0.35) 55%,transparent 100%);}
.hero-content{position:relative;z-index:2;padding:4rem 1.5rem;max-width:1200px;margin:0 auto;width:100%;}

/* Geo badge */
.geo-badge{display:inline-flex;align-items:center;gap:0.4rem;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:9999px;padding:0.3rem 0.75rem;}
.geo-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:gping 1.5s infinite;}
@keyframes gping{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.5;}}

/* Provider badge */
.provider-badge{display:inline-flex;align-items:center;gap:0.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:9999px;padding:0.5rem 1.25rem;}
.provider-logo{height:36px;max-width:120px;object-fit:contain;filter:brightness(0) invert(1);}

/* Value box */
.value-box{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:1rem;padding:1rem 1.5rem;}

/* Progress */
.progress-wrap{flex:1;}
.progress-bar{height:4px;background:rgba(255,255,255,0.06);border-radius:9999px;overflow:hidden;margin-top:0.6rem;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),#FFB300);border-radius:9999px;width:0%;transition:width 1.5s ease-out;}

/* CTA */
.cta-btn{display:inline-flex;align-items:center;gap:0.6rem;background:var(--accent);color:#fff;font-weight:900;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase;padding:1rem 2.5rem;border-radius:9999px;text-decoration:none;transition:all 0.3s;box-shadow:0 8px 30px rgba(var(--accent-rgb),0.4);}
.cta-btn:hover{opacity:0.85;transform:translateY(-2px);}
.cta-outline{display:inline-flex;align-items:center;gap:0.6rem;background:transparent;color:#fff;font-weight:700;font-size:0.875rem;letter-spacing:0.08em;text-transform:uppercase;padding:1rem 2rem;border-radius:9999px;border:1px solid rgba(255,255,255,0.2);text-decoration:none;transition:all 0.3s;}
.cta-outline:hover{border-color:var(--accent);color:var(--accent);}

/* Features */
.features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;}
@media(min-width:640px){.features-grid{grid-template-columns:repeat(4,1fr);}}
.feature-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:1rem;padding:1.5rem 1rem;text-align:center;transition:all 0.3s;}
.feature-card:hover{border-color:var(--accent);background:rgba(var(--accent-rgb),0.06);}
.feat-icon{width:2.5rem;height:2.5rem;background:rgba(var(--accent-rgb),0.12);border-radius:0.75rem;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;}
.feat-icon svg{width:1.25rem;height:1.25rem;color:var(--accent);}
.feat-label{font-size:0.625rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a;margin-bottom:0.25rem;}
.feat-value{font-size:1rem;font-weight:700;color:#fff;}

/* Gallery */
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;}
@media(max-width:640px){.gallery-grid{grid-template-columns:1fr;}}
.gallery-item{position:relative;overflow:hidden;border-radius:1rem;aspect-ratio:4/3;}
.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s;}
.gallery-item:hover img{transform:scale(1.08);}

/* Glass */
.glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.07);border-radius:1.5rem;transition:all 0.4s;}
.glass:hover{border-color:var(--accent);background:rgba(var(--accent-rgb),0.04);transform:translateY(-4px);}

/* Partner section */
.partner-section{background:linear-gradient(135deg,rgba(var(--accent-rgb),0.08) 0%,rgba(255,255,255,0.02) 100%);border:1px solid rgba(var(--accent-rgb),0.2);border-radius:2rem;padding:3rem;position:relative;overflow:hidden;}
.partner-section::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:radial-gradient(circle,rgba(var(--accent-rgb),0.1) 0%,transparent 70%);pointer-events:none;}

/* Ad */
.ad-ph{background:repeating-linear-gradient(45deg,#111,#111 10px,#1a1a1a 10px,#1a1a1a 20px);border:1px dashed #333;display:flex;align-items:center;justify-content:center;color:#555;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;font-size:0.625rem;border-radius:0.75rem;}

/* Breadcrumb */
.breadcrumb{display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;color:#71717a;margin-bottom:1rem;}
.breadcrumb a{color:#71717a;text-decoration:none;transition:color 0.2s;}
.breadcrumb a:hover{color:var(--accent);}

/* Responsive */
@media(max-width:768px){
    .hero-content{padding:2rem 1rem;}
    .hide-sm{display:none!important;}
}
@media(min-width:768px){
    .desktop-nav{display:flex!important;align-items:center;}
    .mobile-toggler{display:none!important;}
}
</style>
</head>
<body class="antialiased">

<!-- Loading overlay -->
<div id="prize-loading">
    <div style="display:flex;gap:0.5rem;">
        <div class="dot" style="animation-delay:0s;"></div>
        <div class="dot" style="animation-delay:0.15s;"></div>
        <div class="dot" style="animation-delay:0.3s;"></div>
    </div>
    <p style="font-size:0.75rem;color:#71717a;letter-spacing:0.18em;text-transform:uppercase;">Detecting your region…</p>
</div>

<!-- Top Banner Ad -->
<div style="background:#000;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.04);">
    <div style="max-width:1280px;margin:0 auto;padding:0 1rem;text-align:center;">
        <div class="ad-ph" style="height:90px;max-width:728px;margin:0 auto;">Leaderboard Advertisement</div>
    </div>
</div>

<!-- Header -->
<header class="site-header">
    <div style="max-width:1280px;margin:0 auto;padding:0 1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;height:5rem;">
            <a href="../index.html" style="display:flex;align-items:center;gap:0.6rem;text-decoration:none;">
                <div style="width:2.5rem;height:2.5rem;background:linear-gradient(135deg,#FF3D00,#FFB300);border-radius:0.5rem;display:flex;align-items:center;justify-content:center;">
                    <i data-lucide="camera" style="color:white;width:1.25rem;height:1.25rem;"></i>
                </div>
                <span style="font-size:1.25rem;font-weight:900;letter-spacing:-0.03em;color:#fff;">SCAN<span style="color:#FF3D00;">THEM</span>ALL</span>
            </a>
            <nav class="desktop-nav" style="display:none;gap:2rem;">
                <a href="../index.html"    style="font-size:0.875rem;font-weight:600;color:#fff;text-decoration:none;">Home</a>
                <a href="../prize.html"    style="font-size:0.875rem;font-weight:600;color:var(--accent);text-decoration:none;">Prizes</a>
                <a href="../position.html" style="font-size:0.875rem;font-weight:600;color:#71717a;text-decoration:none;">My Position</a>
                <a href="../calculator.html" style="font-size:0.875rem;font-weight:600;color:#71717a;text-decoration:none;">Calculator</a>
            </nav>
            <div style="display:flex;align-items:center;gap:0.75rem;">
                <a href="../log_in_page_advertising_placeholder.html" id="login-btn" class="auth-login hide-sm" style="font-size:0.875rem;font-weight:600;color:#71717a;text-decoration:none;">Login</a>
                <a href="../registration_with_video.html" id="signup-btn" class="auth-signup" style="font-size:0.875rem;font-weight:700;color:#fff;padding:0.5rem 1.25rem;border-radius:9999px;border:1px solid var(--accent);background:rgba(var(--accent-rgb),0.1);text-decoration:none;">Sign Up</a>
                <a href="prize-admin.html" title="Prize Provider Admin" style="font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;text-decoration:none;border:1px solid rgba(255,255,255,0.1);padding:0.4rem 0.8rem;border-radius:9999px;" class="hide-sm">Admin</a>
                <button id="mobile-toggle" class="mobile-toggler" style="background:none;border:none;color:#fff;cursor:pointer;">
                    <i data-lucide="menu" style="width:1.75rem;height:1.75rem;"></i>
                </button>
            </div>
        </div>
    </div>
    <!-- Mobile Menu -->
    <div id="mobile-menu" style="display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.97);backdrop-filter:blur(20px);padding:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3rem;">
            <span style="font-size:1.5rem;font-weight:900;color:#fff;">SCAN<span style="color:#FF3D00;">THEM</span>ALL</span>
            <button id="mobile-close" style="background:none;border:none;color:#fff;cursor:pointer;"><i data-lucide="x" style="width:2rem;height:2rem;"></i></button>
        </div>
        <nav style="display:flex;flex-direction:column;gap:1.5rem;">
            <a href="../index.html"    style="font-size:1.5rem;font-weight:900;text-transform:uppercase;color:#fff;text-decoration:none;">Home</a>
            <a href="../prize.html"    style="font-size:1.5rem;font-weight:900;text-transform:uppercase;color:var(--accent);text-decoration:none;">Prizes</a>
            <a href="../position.html" style="font-size:1.5rem;font-weight:900;text-transform:uppercase;color:#71717a;text-decoration:none;">My Position</a>
            <a href="../calculator.html" style="font-size:1.5rem;font-weight:900;text-transform:uppercase;color:#71717a;text-decoration:none;">Calculator</a>
            <hr style="border-color:rgba(255,255,255,0.1);">
            <a href="../registration_with_video.html" class="auth-signup" style="font-size:1.25rem;font-weight:700;color:var(--accent);text-decoration:none;">Sign Up</a>
            <a href="prize-admin.html" style="font-size:1rem;font-weight:700;color:#71717a;text-decoration:none;">Prize Provider Admin</a>
        </nav>
    </div>
</header>

<!-- Prize Category Tabs -->
<div style="background:rgba(5,5,5,0.95);border-bottom:1px solid rgba(255,255,255,0.05);padding:0.75rem 0;">
    <div style="max-width:1280px;margin:0 auto;padding:0 1.5rem;">
        <div class="prize-nav">${pillNav(slug)}</div>
    </div>
</div>

<main>
    <!-- ── HERO ── -->
    <section class="prize-hero">
        <div class="hero-bg" id="hero-bg" style="background-image:url('${data.heroImage}');"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <div class="breadcrumb">
                <a href="../prize.html">Prizes</a>
                <i data-lucide="chevron-right" style="width:0.75rem;height:0.75rem;"></i>
                <span>${title}</span>
            </div>
            <div style="margin-bottom:1.25rem;">
                <span class="geo-badge" id="geo-show">
                    <span class="geo-dot"></span>
                    <span id="geo-text">Detecting your region…</span>
                </span>
            </div>
            <div id="provider-wrap" style="margin-bottom:1.5rem;display:${data.providerName !== 'Scan Them All Global' ? 'block' : 'none'};">
                <div class="provider-badge">
                    <img id="provider-logo" class="provider-logo" src="${data.providerLogo}" alt="Provider" onerror="this.style.display='none'">
                    <span style="font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;" id="provider-name-badge">Presented by ${data.providerName}</span>
                </div>
            </div>
            <h1 id="hero-title" style="font-size:clamp(2.25rem,7vw,5rem);font-weight:900;line-height:1;letter-spacing:-0.03em;margin-bottom:1.25rem;">${data.heroTagline}</h1>
            <p id="hero-subtitle" style="font-size:1.0625rem;color:rgba(255,255,255,0.7);max-width:580px;line-height:1.65;margin-bottom:2rem;">${data.prizeSubtitle}</p>
            <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:2rem;flex-wrap:wrap;">
                <div class="value-box">
                    <div style="font-size:0.625rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#71717a;margin-bottom:0.25rem;">Est. Prize Value</div>
                    <div id="prize-value" style="font-size:1.75rem;font-weight:900;">${data.prizeValue}</div>
                </div>
                <div class="progress-wrap hide-sm">
                    <div style="font-size:0.7rem;color:#71717a;letter-spacing:0.08em;text-transform:uppercase;">68% of entries claimed</div>
                    <div class="progress-bar"><div class="progress-fill" id="prog-fill"></div></div>
                </div>
            </div>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                <a href="${data.ctaLink}" id="main-cta" class="cta-btn">${data.ctaText} <i data-lucide="arrow-right" style="width:1rem;height:1rem;display:inline;"></i></a>
                <a href="../calculator.html" class="cta-outline"><i data-lucide="calculator" style="width:1rem;height:1rem;"></i> My Entries</a>
            </div>
        </div>
    </section>

    <!-- ── FEATURES ── -->
    <section style="max-width:1280px;margin:4rem auto 0;padding:0 1.5rem;">
        <div class="features-grid" id="features-grid">${featureCards(data.features)}</div>
    </section>

    <!-- ── AD ── -->
    <div style="max-width:1280px;margin:3rem auto 0;padding:0 1.5rem;text-align:center;">
        <div class="ad-ph" style="height:90px;max-width:728px;margin:0 auto;">Content Rectangle Advertisement</div>
    </div>

    <!-- ── GALLERY ── -->
    <section style="max-width:1280px;margin:4rem auto 0;padding:0 1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:1.25rem;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:1.5rem;">
            <h2 style="font-size:1.75rem;font-weight:900;text-transform:uppercase;letter-spacing:-0.03em;">Prize Gallery</h2>
            <div id="provider-badge-gallery" style="font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);">PROVIDER IMAGES</div>
        </div>
        <div class="gallery-grid" id="gallery-grid">${galleryHTML(data.galleryImages)}</div>
    </section>

    <!-- ── PARTNER OFFER SECTION ── -->
    <section style="max-width:1280px;margin:4rem auto 0;padding:0 1.5rem;">
        <div class="partner-section">
            <div style="max-width:640px;position:relative;z-index:1;">
                <div id="offer-eyebrow" style="font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">PRIZE OFFER</div>
                <h2 id="offer-headline" style="font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;line-height:1.1;margin-bottom:1.25rem;">${data.offerHeadline}</h2>
                <p id="offer-body" style="font-size:1rem;color:#a1a1aa;line-height:1.7;margin-bottom:2rem;">${data.offerBody}</p>
                <div id="partner-offer-block" style="display:${data.partnerOffer ? 'block' : 'none'};background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:1rem;padding:1.5rem;margin-bottom:2rem;">
                    <div style="font-size:0.625rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#71717a;margin-bottom:0.5rem;">SPONSORED PROMOTION</div>
                    <div id="partner-offer-content" style="color:#fff;font-size:0.9375rem;line-height:1.6;">${data.partnerOffer || ''}</div>
                </div>
                <div style="display:flex;gap:1rem;flex-wrap:wrap;">
                    <a href="${data.ctaLink}" class="cta-btn">Start Entering <i data-lucide="chevron-right" style="width:1rem;height:1rem;display:inline;"></i></a>
                    <a href="../prize.html" class="cta-outline">All Prizes</a>
                </div>
            </div>
        </div>
    </section>

    <!-- ── CALCULATOR CTA ── -->
    <section style="max-width:1280px;margin:4rem auto 0;padding:0 1.5rem;">
        <div style="background:linear-gradient(180deg,rgba(var(--accent-rgb),0.06) 0%,rgba(5,5,5,1) 100%);border:1px solid rgba(var(--accent-rgb),0.2);border-radius:2rem;padding:3rem;text-align:center;">
            <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;">MAXIMISE YOUR ENTRIES</div>
            <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:900;text-transform:uppercase;letter-spacing:-0.03em;margin-bottom:1rem;">Use Our Entry Calculator</h2>
            <p style="color:#71717a;max-width:460px;margin:0 auto 2rem;font-size:0.9375rem;line-height:1.6;">See exactly how many draw tickets you accumulate based on your uploads across all social platforms.</p>
            <a href="../calculator.html" class="cta-btn" style="display:inline-flex;"><i data-lucide="calculator" style="width:1rem;height:1rem;"></i> Open Calculator</a>
        </div>
    </section>

    <!-- ── BOTTOM AD ── -->
    <div style="max-width:1280px;margin:4rem auto 0;padding:0 1.5rem;text-align:center;">
        <div class="ad-ph" style="height:250px;max-width:970px;margin:0 auto;">Large Rectangle Advertisement</div>
    </div>
</main>

<!-- ── FOOTER ── -->
<footer style="background:#000;border-top:1px solid rgba(255,255,255,0.05);padding:4rem 0 2rem;margin-top:5rem;">
    <div style="max-width:1280px;margin:0 auto;padding:0 1.5rem;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-bottom:4rem;">
            <div>
                <div style="font-size:1.5rem;font-weight:900;text-transform:uppercase;margin-bottom:1rem;">GOTTA SCAN<br><span style="color:#FF3D00;">THEM ALL</span></div>
                <p style="font-size:0.875rem;color:#6b7280;">The world's first multi-category scan-based sweepstakes platform.</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
                <div>
                    <h4 style="color:#fff;font-weight:700;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1.25rem;">Prize Pages</h4>
                    <ul style="list-style:none;display:flex;flex-direction:column;gap:0.875rem;">
                        <li><a href="elitecar.html"      style="font-size:0.875rem;color:#6b7280;text-decoration:none;">🚗 Elite Car</a></li>
                        <li><a href="ultimateescape.html" style="font-size:0.875rem;color:#6b7280;text-decoration:none;">✈️ Ultimate Escape</a></li>
                        <li><a href="luxuryfashion.html"  style="font-size:0.875rem;color:#6b7280;text-decoration:none;">👜 Luxury Fashion</a></li>
                        <li><a href="goldentreasure.html" style="font-size:0.875rem;color:#6b7280;text-decoration:none;">🥇 Golden Treasure</a></li>
                        <li><a href="healthglow.html"     style="font-size:0.875rem;color:#6b7280;text-decoration:none;">💚 Health Glow</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:#fff;font-weight:700;font-size:0.875rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1.25rem;">Platform</h4>
                    <ul style="list-style:none;display:flex;flex-direction:column;gap:0.875rem;">
                        <li><a href="../index.html"       style="font-size:0.875rem;color:#6b7280;text-decoration:none;">Home</a></li>
                        <li><a href="../calculator.html"  style="font-size:0.875rem;color:#6b7280;text-decoration:none;">Entry Calculator</a></li>
                        <li><a href="prize-admin.html"    style="font-size:0.875rem;color:#6b7280;text-decoration:none;">Provider Admin</a></li>
                        <li><a href="../Final_contact_page.html" style="font-size:0.875rem;color:#6b7280;text-decoration:none;">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.05);font-size:0.625rem;color:#4b5563;letter-spacing:0.1em;text-transform:uppercase;flex-wrap:wrap;gap:1rem;">
            <p>© 2026 RULE 7 MEDIA. ALL RIGHTS RESERVED.</p>
            <a href="../GTSA Final Sweepstake Rules.html" style="color:#4b5563;text-decoration:none;">Sweepstake Rules</a>
        </div>
    </div>
</footer>

<!-- ── SCRIPTS ── -->
<script src="https://unpkg.com/lucide@latest"></script>
<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
    import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

    const SLUG = '${slug}';
    const DEFAULTS = ${JSON.stringify(PRIZE_DEFAULTS)};

    const fbConfig = {
        apiKey:"AIzaSyBb4q5dU4ccoRtK_c98chs1BMXoqcC222g",
        authDomain:"scanthemall-c1475.firebaseapp.com",
        databaseURL:"https://scanthemall-c1475-default-rtdb.firebaseio.com",
        projectId:"scanthemall-c1475",
        storageBucket:"scanthemall-c1475.appspot.com",
        messagingSenderId:"1040707976422",
        appId:"1:1040707976422:web:883018fc54b7ac5c8f8f27"
    };
    const app = initializeApp(fbConfig);
    const db  = getDatabase(app);

    async function detectGeo() {
        try {
            const r = await fetch('https://ipapi.co/json/');
            const d = await r.json();
            return { country:(d.country||'GLOBAL').toUpperCase(), region:(d.region||'').toUpperCase(), city:(d.city||'').toUpperCase(), display: d.city ? d.city+', '+d.country : (d.country||'Global') };
        } catch { return {country:'GLOBAL',region:'',city:'',display:'Global'}; }
    }

    async function loadFirebase(geo) {
        const keys = [
            "prizes/"+SLUG+"/"+geo.country+"_"+geo.region+"_"+geo.city,
            "prizes/"+SLUG+"/"+geo.country+"_"+geo.region,
            "prizes/"+SLUG+"/"+geo.country,
            "prizes/"+SLUG+"/GLOBAL"
        ].filter(k=>!k.includes('__'));
        for(const key of keys){
            try{
                const s = await get(ref(db,key));
                if(s.exists()) return s.val();
            }catch{}
        }
        return null;
    }

    function applyDynamic(data, geo) {
        // Geo badge
        document.getElementById('geo-text').textContent = 'Prizes for: '+geo.display;

        // Update only dynamic fields (static fields were server-rendered)
        if(data.heroTagline)   document.getElementById('hero-title').textContent = data.heroTagline;
        if(data.prizeSubtitle) document.getElementById('hero-subtitle').textContent = data.prizeSubtitle;
        if(data.prizeValue)    document.getElementById('prize-value').textContent = data.prizeValue;
        if(data.offerHeadline) document.getElementById('offer-headline').textContent = data.offerHeadline;
        if(data.offerBody)     document.getElementById('offer-body').textContent = data.offerBody;

        // Hero bg
        if(data.heroImage) document.getElementById('hero-bg').style.backgroundImage = "url('"+data.heroImage+"')";

        // Provider badge
        if(data.providerName && data.providerName !== 'Scan Them All Global') {
            document.getElementById('provider-wrap').style.display='block';
            document.getElementById('provider-name-badge').textContent = 'Presented by '+data.providerName;
            if(data.providerLogo) document.getElementById('provider-logo').src = data.providerLogo;
            document.getElementById('provider-badge-gallery').textContent = data.providerName.toUpperCase()+' IMAGES';
            document.getElementById('offer-eyebrow').textContent = data.providerName.toUpperCase()+' OFFER';
        }

        // Accent colour
        if(data.accentColor){
            document.documentElement.style.setProperty('--accent', data.accentColor);
            const h = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.accentColor);
            if(h) document.documentElement.style.setProperty('--accent-rgb', parseInt(h[1],16)+','+parseInt(h[2],16)+','+parseInt(h[3],16));
        }

        // Gallery
        if(data.galleryImages && data.galleryImages.length){
            document.getElementById('gallery-grid').innerHTML = data.galleryImages.map(s=>'<div class="gallery-item"><img src="'+s+'" alt="Prize" loading="lazy"></div>').join('');
        }

        // Features
        if(data.features && data.features.length){
            document.getElementById('features-grid').innerHTML = data.features.map(f=>'<div class="feature-card"><div class="feat-icon"><i data-lucide="'+f.icon+'"></i></div><div class="feat-label">'+f.label+'</div><div class="feat-value">'+f.value+'</div></div>').join('');
        }

        // Partner offer
        if(data.partnerOffer){
            document.getElementById('partner-offer-block').style.display='block';
            document.getElementById('partner-offer-content').innerHTML = data.partnerOffer;
        }

        // CTA links
        if(data.ctaLink){
            document.getElementById('main-cta').href = data.ctaLink;
        }
        if(data.ctaText){
            document.getElementById('main-cta').innerHTML = data.ctaText+' <i data-lucide="arrow-right" style="width:1rem;height:1rem;display:inline;"></i>';
        }

        lucide.createIcons();
    }

    (async()=>{
        lucide.createIcons();
        // Progress bar
        setTimeout(()=>{ const pf=document.getElementById('prog-fill'); if(pf) pf.style.width='68%'; }, 300);

        const geo = await detectGeo();
        const fbData = await loadFirebase(geo);
        if(fbData) applyDynamic({...DEFAULTS[SLUG],...fbData}, geo);
        else        document.getElementById('geo-text').textContent = 'Prizes for: '+geo.display;

        // Hide loading
        const loader=document.getElementById('prize-loading');
        loader.classList.add('fade-out');
        setTimeout(()=>loader.remove(),700);
    })();

    // Mobile menu
    const tog=document.getElementById('mobile-toggle');
    const cls=document.getElementById('mobile-close');
    const mm=document.getElementById('mobile-menu');
    if(tog) tog.onclick=()=>mm.style.display='block';
    if(cls) cls.onclick=()=>mm.style.display='none';
</script>
<script type="module" src="../js/auth-header.js"></script>
</body>
</html>`;
}

// ── Node.js export (used by build script if needed) ──────────
if (typeof module !== 'undefined') {
    module.exports = { PRIZE_DEFAULTS, PRIZE_LABELS, buildPageHTML };
}
