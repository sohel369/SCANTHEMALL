/**
 * app.js - Main Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded - GTSA Initializing Modules");

    // --- Page-Specific Initializations (Task: Prevent Conflicts) ---
    const path = window.location.pathname;

    // A. Instagram / Upload Page (Upload logic + Bingo results + Ads)
    if (path.includes("instagram_upload_page") || path.includes("upload")) {
        console.log("GTSA: Upload logic active");
        if (typeof initUpload === 'function') initUpload();
    }

    // Initialize Billboard Game if container exists
    if (document.getElementById('bingo-container')) {
        console.log("GTSA: Billboard Game detected, initializing...");
        if (typeof initBillboard === 'function') initBillboard();
    }

    if (path.includes("instagram_upload_page") || path.includes("upload") || document.getElementById('ad-container')) {
        if (typeof initAds === 'function') initAds();
    }

    // B. Global Ad Rotation (Task: Standardize across all pages)
    if (document.querySelectorAll(".ad-placeholder").length > 0) {
        console.log("GTSA: Ad Module Active");
        if (typeof initAds === 'function') initAds();
    }

    // C. Register Page (User Creation)
    if (path.includes("registration") || path.includes("welcome")) {
        console.log("GTSA: Registration Handler Active");
    }

    // Finalize all alerts replacement
    function showPremiumToast(message, type = "success") {
        const toast = document.createElement('div');
        toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm";
        const icon = type === "success" ? "check-circle" : "alert-circle";
        const gradient = type === "success" ? "from-green-600/90 to-emerald-600/90" : "from-red-600/90 to-orange-600/90";
        
        toast.innerHTML = `
            <div class="bg-gradient-to-r ${gradient} backdrop-blur-xl text-white px-6 py-4 rounded-2xl font-bold border border-white/20 shadow-2xl flex items-center space-x-4 animate-bounce">
                <i data-lucide="${icon}" class="w-6 h-6"></i>
                <span class="text-sm tracking-wide uppercase">${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // 2. Registration and Entry Form Logic (DEPRECATED: Use page-specific modules for auth)
    // --- Removed redundant handler to prevent session key conflicts ---

    // Export to global scope for other scripts
    window.showPremiumToast = showPremiumToast;

    // 3. Fix Internal Links for Local Browsing (Remap absolute to relative .html)
    const links = document.querySelectorAll('a[href*="scanthemall.com"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Match scanthemall.com/endpoint to local endpoint.html
        const mapping = {
            'index': 'index.html',
            'welcome': 'GTSA_FInal_Welcome_Page_(About_US).html',
            'prizes': 'prize.html',
            'analysis': 'position.html',
            'register': 'registration_with_video.html',
            'blog': 'blog.html',
            'contact': 'Final_contact_page.html',
            'privacy': 'privacy.html',
            'terms': 'GTSA Final Terms No Advertising.html'
        };

        for (const [key, val] of Object.entries(mapping)) {
            if (href.endsWith(key)) {
                link.setAttribute('href', val);
                break;
            }
        }
    });

    // 4. Global Location System (Country, State, Area Code, Country Code)
    const countryEl = document.getElementById('country') || document.getElementById('countrySelect');
    const stateEl = document.getElementById('state') || document.getElementById('stateSelect');
    const areaEl = document.getElementById('area-code') || document.getElementById('areaCode');
    const countryCodeEl = document.getElementById('country-code') || document.getElementById('countryCode');
    const postalEl = document.getElementById('postal') || document.getElementById('postalCode');

    if (countryEl && stateEl) {
        const locationData = {
            "USA": {
                code: "+1",
                areas: ["212", "310", "415", "602", "702"],
                states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
            },
            "UK": {
                code: "+44",
                areas: ["020", "0121", "0113", "0161", "0131"],
                states: ["England", "Scotland", "Wales", "Northern Ireland", "Greater London", "West Midlands", "Greater Manchester", "West Yorkshire", "Hampshire", "Kent"]
            },
            "Canada": {
                code: "+1",
                areas: ["416", "604", "514", "780", "403"],
                states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"]
            },
            "Australia": {
                code: "+61",
                areas: ["02", "03", "07", "08"],
                states: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"]
            },
            "Germany": { code: "+49", states: ["Bavaria", "Berlin", "Hamburg", "Hesse", "Saxony"] },
            "France": { code: "+33", states: ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Nouvelle-Aquitaine"] },
            "Spain": { code: "+34", states: ["Madrid", "Catalonia", "Andalusia", "Valencia"] },
            "Italy": { code: "+39", states: ["Lombardy", "Lazio", "Campania", "Sicily"] },
            "Ireland": { code: "+353", states: ["Leinster", "Munster", "Connacht", "Ulster"] },
            "Portugal": { code: "+351", states: ["Lisbon", "Porto", "Algarve"] },
            "New Zealand": { code: "+64", states: ["Auckland", "Wellington", "Canterbury"] },
            "Netherlands": { code: "+31", states: ["North Holland", "South Holland", "Utrecht"] },
            "Sweden": { code: "+46", states: ["Stockholm", "Västra Götaland", "Skåne"] },
            "Austria": { code: "+43", states: ["Vienna", "Salzburg", "Tyrol"] },
            "Poland": { code: "+48", states: ["Masovian", "Lesser Poland", "Lower Silesian"] },
            "Brazil": { code: "+55", states: ["São Paulo", "Rio de Janeiro", "Minas Gerais"] },
            "Mexico": { code: "+52", states: ["Mexico City", "Jalisco", "Nuevo León"] },
            "Turkey": { code: "+90", states: ["Istanbul", "Ankara", "Izmir"] },
            "South Korea": { code: "+82", states: ["Seoul", "Busan", "Incheon"] }
        };

        // Populate Countries if empty
        if (countryEl.options.length <= 1) {
            Object.keys(locationData).sort().forEach(country => {
                const opt = document.createElement('option');
                opt.value = country;
                opt.innerText = country;
                countryEl.appendChild(opt);
            });
        }

        countryEl.addEventListener('change', (e) => {
            const country = e.target.value;
            // Handle mappings for short codes (AUS -> Australia, etc.)
            const countryKey = country === 'AUS' ? 'Australia' : 
                               country === 'CAN' ? 'Canada' : country;
            
            const data = locationData[countryKey];
            
            // Update States
            stateEl.innerHTML = '<option value="" disabled selected>Select State</option>';
            if (data) {
                data.states.sort().forEach(state => {
                    const opt = document.createElement('option');
                    opt.value = state;
                    opt.innerText = state;
                    stateEl.appendChild(opt);
                });
            }

            // Update Country Code
            if (countryCodeEl && data) {
                countryCodeEl.value = data.code;
            }

            // Update Area Codes
            if (areaEl) {
                areaEl.innerHTML = '<option value="">Area Code</option>';
                if (data && data.areas) {
                    data.areas.forEach(area => {
                        const opt = document.createElement('option');
                        opt.value = area;
                        opt.innerText = `(${area})`;
                        areaEl.appendChild(opt);
                    });
                }
            }
        });

        // --- IP-Based Country Detection Optimized for Speed ---
        async function detectLocation() {
            try {
                // Abort request after 2 seconds to prevent site hang
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error('Location detection failed');
                
                const data = await response.json();
                const detectedCountry = data.country_name;

                const countryMap = {
                    "United States": "USA",
                    "United Kingdom": "UK",
                    "Canada": "Canada",
                    "Australia": "Australia",
                    "Germany": "Germany",
                    "France": "France",
                    "Spain": "Spain",
                    "Italy": "Italy",
                    "Ireland": "Ireland",
                    "New Zealand": "New Zealand",
                    "Brazil": "Brazil",
                    "Mexico": "Mexico"
                };

                const mappedValue = countryMap[detectedCountry];
                
                if (mappedValue && (locationData[mappedValue] || mappedValue === 'USA' || mappedValue === 'UK')) {
                    let valueToSelect = mappedValue;
                    if (![...countryEl.options].some(opt => opt.value === mappedValue)) {
                        if (mappedValue === 'Australia') valueToSelect = 'AUS';
                        if (mappedValue === 'Canada') valueToSelect = 'CAN';
                    }

                    countryEl.value = valueToSelect;
                    countryEl.dispatchEvent(new Event('change'));
                    console.log(`GTSA (Global): Detected country: ${detectedCountry} -> ${valueToSelect}`);
                }
            } catch (error) {
                console.warn("GTSA (Global): IP Detection timed out or failed. Falling back to default.");
                // Default to Australia if detection fails to keep site responsive
                if (countryEl.value === "" || countryEl.value === "Select Country") {
                    countryEl.value = "Australia";
                    countryEl.dispatchEvent(new Event('change'));
                }
            }
        }

        detectLocation();
    }

    // Note: Image Fallback System is now handled by js/image-handler.js in the head of HTML files for better coverage.

    // 6. Social Share Logic
    window.shareToPlatform = function(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("Check out Scanthemall - The ultimate luxury hunt! 🏎️💨");
        let shareUrl = '';

        if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (platform === 'x' || platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        } else if (platform === 'whatsapp') {
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        } else if (platform === 'instagram') {
            // Instagram doesn't support direct sharing via URL like others.
            // Usually, we redirect to the upload page or the profile.
            window.location.href = 'instagram_upload_page.html';
            return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,location=0,menubar=0,scrollbars=1,status=1,resizable=1');
        } else {
            console.error("GTSA: Share platform not supported:", platform);
        }
    };

    // Auto-attach to button elements with share classes (prevents conflict with footer profile links)
    document.querySelectorAll('button.share-facebook').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('facebook'); });
    });
    document.querySelectorAll('button.share-x, button.share-twitter').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('x'); });
    });
    document.querySelectorAll('button.share-instagram').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('instagram'); });
    });
    document.querySelectorAll('button.share-whatsapp').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('whatsapp'); });
    });

    // Simple Header Scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.background = (window.scrollY > 50) ? 'rgba(10, 10, 10, 0.95)' : 'rgba(10, 10, 10, 0.8)';
            header.style.padding = (window.scrollY > 50) ? '0.5rem 2rem' : '0 2rem';
        }
    });

    // Note: Responsive scaling is now handled via CSS in responsive.js
});
