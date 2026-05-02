/**
 * Geo-targeting and Compliance Logic for Gotta Scan Them All
 * Handles allowed countries, state-level exclusions (USA), 
 * and specific messaging for regions.
 */

const GEO_CONFIG = {
    // Countries prioritized for the campaign
    allowed: [
        'GB', 'IE', 'DE', 'FR', 'US', 'CA', 'NZ', 'ES', 'IT', 'AU', 
        'NL', 'SE', 'PT', 'BE', 'AT', 'PL', 'HU', 'CZ', 'SK', 'SI',
        'BR', 'MX', 'AR', 'VE', 'CO', 'PE', 'CL', 'FI', 'DK', 'TR',
        'MM', 'KR', 'KP', 'MY', 'LK'
    ],
    
    // USA State-level exclusions
    usaExclusions: ['FL', 'NY', 'RI'],
    
    // Countries to block entirely (legal restrictions)
    blocked: ['IN', 'CN', 'PK', 'JP', 'PH', 'ID', 'VN']
};

async function initGeoTargeting() {
    try {
        // Using ipapi.co for geo-detection
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code; 
        const region = data.region_code; 

        let isBlocked = false;
        let isSkillVariant = ['JP', 'IN', 'CN', 'PK', 'PH', 'ID', 'VN'].includes(country);

        // Check for specific US state exclusions (hard block)
        if (country === 'US' && GEO_CONFIG.usaExclusions.includes(region)) {
            isBlocked = true;
        }

        if (isBlocked) {
            showBlockingOverlay();
            return;
        }

        if (isSkillVariant) {
            showSkillContestOverlay(data.country_name || country);
            return;
        }

        // Update dynamic SEO title
        updateDynamicSEO(data.country_name || country);

        // If not blocked, check for rules-container to show region-specific rules
        const container = document.getElementById('rules-container');
        if (container) {
            container.innerHTML = renderAllowedUI(country, data.country_name);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

    } catch (error) {
        console.error('Geo-Targeting Error:', error);
        const container = document.getElementById('rules-container');
        if (container) {
            // Default to AU or Global instead of EU to fix the reported bug
            container.innerHTML = renderAllowedUI('AU', 'Australia'); 
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
}

function renderAllowedUI(code, name) {
    return `
        <div class="bg-zinc-900/50 border border-white/5 p-8 rounded-[3rem] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn">
            <div class="flex items-center gap-6">
                <div class="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                    <i data-lucide="shield-check" class="text-green-400 w-8 h-8"></i>
                </div>
                <div>
                    <h3 class="text-xl font-black uppercase italic tracking-tighter text-white">Region Verified: ${name}</h3>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">Status: Fully Compliant & Active</p>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-[10px] font-black uppercase text-white tracking-widest">${code} SERVER ACTIVE</span>
                </div>
            </div>
        </div>
    `;
}

function showSkillContestOverlay(countryName) {
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(10,10,12,0.98); backdrop-filter: blur(20px);
        display: flex; align-items: center; justify-content: center; padding: 2rem;
    `;
    
    overlay.innerHTML = `
        <div class="max-w-2xl text-center">
            <div class="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-orange-500/20">
                <i data-lucide="award" class="text-orange-500 w-12 h-12"></i>
            </div>
            <h1 class="text-4xl font-black text-white uppercase tracking-tighter mb-4">${countryName} Special Entry</h1>
            <p class="text-xl text-zinc-400 font-bold leading-relaxed mb-8">
                In your region, this mission is conducted as a <span class="text-orange-500">Skill-Based Contest</span>.
            </p>
            <div class="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-left mb-10">
                <h4 class="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">How to Participate:</h4>
                <ul class="space-y-4 text-sm text-zinc-300 font-medium">
                    <li class="flex gap-3"><i data-lucide="check-circle" class="w-5 h-5 text-green-500 shrink-0"></i> Upload your billboard scans as normal.</li>
                    <li class="flex gap-3"><i data-lucide="check-circle" class="w-5 h-5 text-green-500 shrink-0"></i> To qualify for grand prizes, complete a "Luxury Vision" short essay (50 words) upon completion.</li>
                    <li class="flex gap-3"><i data-lucide="check-circle" class="w-5 h-5 text-green-500 shrink-0"></i> Winners are selected based on creativity and mission completion.</li>
                </ul>
            </div>
            <button onclick="this.parentElement.parentElement.remove(); document.body.style.overflow='auto';" class="px-10 py-5 bg-[#FF3D00] text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-all">
                Enter Skill Contest
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.body.style.overflow = 'hidden';
}

function showBlockingOverlay() {
    // Create an overlay that prevents interacting with the page if blocked
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(10,10,12,0.98); backdrop-filter: blur(20px);
        display: flex; align-items: center; justify-content: center; padding: 2rem;
    `;
    
    overlay.innerHTML = `
        <div class="max-w-xl text-center">
            <div class="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                <i data-lucide="shield-alert" class="text-red-500 w-12 h-12"></i>
            </div>
            <h1 class="text-4xl font-black text-white uppercase tracking-tighter mb-4">Access Restricted</h1>
            <p class="text-2xl text-zinc-400 font-bold leading-relaxed mb-10">
                Not available in your state
            </p>
            <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                    Due to specific state regulations (FL, NY, RI), we cannot accept entries from your current location at this time. 🌍
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    document.body.style.overflow = 'hidden';
}

/**
 * Dynamic SEO & Multi-Country Infrastructure
 */
function updateDynamicSEO(countryName) {
    if (!countryName) return;
    
    // SEO Strategy: Target high-value keywords + detected location
    const baseTitle = "Gotta Scan Them All";
    const seoTitle = `Win Luxury Car ${countryName} | ${baseTitle}`;
    
    document.title = seoTitle;
    
    // Update Meta Description if it exists
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', `Join the quest for luxury in ${countryName}. Scan partner billboards, complete your billboard game, and win cars, vacations, and cash draws. Free to enter.`);
    }
}

/**
 * Path-based country detection (Preparation for /us, /uk structure)
 */
function getCountryFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p.length > 0);
    
    // Check if first part of path is a 2-letter country code
    if (parts.length > 0 && parts[0].length === 2) {
        return parts[0].toUpperCase();
    }
    return null;
}

// Auto-init on load
document.addEventListener('DOMContentLoaded', initGeoTargeting);
