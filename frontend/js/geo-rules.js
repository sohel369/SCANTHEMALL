/**
 * Geo-targeting and Compliance Logic for Gotta Scan Them All
 * Handles allowed countries, state-level exclusions (USA), 
 * and specific messaging for regions.
 */

const GEO_CONFIG = {
    // Countries prioritized for the campaign
    allowed: [
        'GB', 'IE', 'DE', 'FR', 'US', 'CA', 'NZ', 'ES', 'IT', 'AU', 
        'NL', 'SE', 'PT', 'BE', 'AT', 'PL', 'HU', 'CZ'
    ],
    
    // USA State-level exclusions
    usaExclusions: ['FL', 'NY', 'RI'],
    
    // Countries to block entirely with a polite message
    blocked: [
        'JP', 'PH', 'ID', 'VN', 'PK', // Geo-block list 12-15
        'IN', 'CN', 'RU', 'TR', 'UA', 'KZ', // List 16-18 + Red countries
        // Middle East / Other high risk (Optional addition based on prompt)
        'SA', 'AE', 'QA', 'KW', 'OM', 'BH' 
    ]
};

async function initGeoTargeting() {
    const container = document.getElementById('rules-container');
    if (!container) return;

    try {
        // Using ipapi.co for geo-detection
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code; // HR for Croatia, US for USA, etc.
        const region = data.region_code; // State code for US (NY, CA, etc.)

        let contentHtml = '';
        let isBlocked = GEO_CONFIG.blocked.includes(country);

        // Check for specific US state exclusions
        if (country === 'US' && GEO_CONFIG.usaExclusions.includes(region)) {
            isBlocked = true;
        }

        if (isBlocked) {
            contentHtml = renderBlockedUI(country, region);
            // Optionally, we could redirect or hide the whole page.
            // For now, we update the rules container or show an overlay.
            showBlockingOverlay();
        } else {
            contentHtml = renderAllowedUI(country, data.country_name);
        }

        container.innerHTML = contentHtml;
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
        console.error('Geo-Targeting Error:', error);
        // Fallback to default EU rules if detection fails
        container.innerHTML = renderAllowedUI('EU', 'Global');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

function renderBlockedUI(country, region) {
    const isUsaExclusion = country === 'US' && GEO_CONFIG.usaExclusions.includes(region);
    const regionName = isUsaExclusion ? `the state of ${region}` : 'your country';
    
    return `
        <div class="text-center py-16 px-6 bg-zinc-900/50 rounded-[2.5rem] border border-red-500/20 shadow-2xl">
            <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="globe" class="text-red-500 w-8 h-8"></i>
            </div>
            <h3 class="text-3xl font-black mb-6 uppercase tracking-tighter">🌍 Opportunity Not Available</h3>
            <p class="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed">
                Due to local regulations and sweepstakes laws, the current campaign is not available in <strong>${regionName}</strong> at this time. ❤️
            </p>
            <p class="mt-8 text-sm font-bold text-zinc-500 uppercase tracking-widest">
                Check back soon as we expand our global reach.
            </p>
        </div>
    `;
}

function renderAllowedUI(country, countryName) {
    let title = `${countryName} Participation Rules`;
    let details = '';
    let color = '#FF3D00';
    let icon = 'shield-check';

    // Specific logic mapping based on buyer instructions
    if (['NL', 'SE', 'PT'].includes(country)) {
        title = `🇳🇱/🇸🇪/🇵🇹 Main Sweepstakes Rules`;
        details = 'NO PURCHASE NECESSARY. NPN + Free AMOE (Alternative Method of Entry). Low-risk promotion, GDPR compliant.';
        color = '#22C55E'; // Green light
    } 
    else if (['PL', 'HU', 'CZ', 'BE'].includes(country)) {
        title = `${countryName} Participation Rules`;
        details = 'Skill test required for winners. Register where required. Moderate risk compliance active.';
        color = '#EAB308'; // Yellow light
    }
    else if (country === 'US') {
        title = `🇺🇸 United States Official Rules`;
        details = 'NO PURCHASE NECESSARY. Free AMOE. Referrals pending unlock after 100 successful scans. Excludes FL, NY, RI.';
        icon = 'star';
    }
    else if (country === 'AU') {
        title = `🇦🇺 Australian Rules & Compliance`;
        details = 'NO PURCHASE NECESSARY. Includes mandatory Skill Test for grand prize winners. Statutory permits waived where applicable.';
        icon = 'award';
    }
    else if (country === 'GB') {
        title = `🇬🇧 United Kingdom Prize Draw Rules`;
        details = 'Tax-free winnings as per UK law. Compliant with Free Prize Draw regulations. No purchase required to win.';
        icon = 'crown';
    }
    else if (['IE', 'DE', 'FR', 'ES', 'IT', 'AT'].includes(country)) {
        title = `${countryName} Official Rules`;
        details = 'Low-risk promotion. Fully GDPR compliant. No local permits required for entry. Support our partners and win.';
    }
    else if (country === 'CA') {
        title = `🇨🇦 Canadian Rules (Incl. Quebec)`;
        details = 'Skill-testing question required. Available in Quebec. Supporting cross-border participation.';
    }
    else {
        // General fallback
        title = `Global Participation Rules`;
        details = 'Sweepstakes active. No purchase necessary. Void where prohibited by local law.';
    }

    return `
        <div class="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-[${color}] opacity-5 blur-3xl"></div>
            <div class="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <i data-lucide="${icon}" style="color:${color}" class="w-8 h-8"></i>
                </div>
                <div>
                    <div class="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span class="px-3 py-1 bg-[${color}]/10 text-[${color}] text-[10px] font-black uppercase tracking-widest rounded-full">Detected: ${country}</span>
                        <h3 class="text-2xl font-black uppercase tracking-tighter text-white">${title}</h3>
                    </div>
                    <p class="text-zinc-400 text-lg leading-relaxed max-w-2xl">${details}</p>
                    
                    <div class="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                        <div class="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i> Local Laws Applied
                        </div>
                        <div class="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <i data-lucide="check-circle" class="w-3 h-3 text-green-500"></i> GDPR/Privacy Compliant
                        </div>
                        <div class="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <i data-lucide="lock" class="w-3 h-3 text-zinc-600"></i> Secure Data Vault
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showBlockingOverlay() {
    // Create an overlay that prevents interacting with the page if blocked
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(10,10,12,0.98);
        backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    overlay.innerHTML = `
        <div class="max-w-xl text-center">
            <div class="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                <i data-lucide="globe" class="text-zinc-500 w-12 h-12"></i>
            </div>
            <h1 class="text-5xl font-black text-white uppercase tracking-tighter mb-6">Region<br><span class="text-zinc-600">Unavailable</span></h1>
            <p class="text-xl text-zinc-400 leading-relaxed mb-10">
                Our scan missions and prize categories are currently restricted in your region due to local sweepstakes regulations. 🌍
            </p>
            <div class="flex flex-col gap-4">
                <button onclick="window.location.href='index.html'" class="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform">
                    Return to Lobby
                </button>
                <p class="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">We value your privacy and compliance above all else.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    // Disable scrolling
    document.body.style.overflow = 'hidden';
}

// Auto-init on load
document.addEventListener('DOMContentLoaded', initGeoTargeting);
