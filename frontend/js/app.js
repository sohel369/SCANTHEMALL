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

        const phoneEl = document.querySelector('input[name="Phone"]');

        function setDependentFieldsEnabled(enabled) {
            if (stateEl) {
                stateEl.disabled = !enabled;
                stateEl.style.opacity = enabled ? '1' : '0.4';
                stateEl.style.cursor = enabled ? 'pointer' : 'not-allowed';
                if (!enabled) {
                    stateEl.innerHTML = '<option value="" selected>Select Country First</option>';
                    stateEl.value = "";
                }
            }

            if (phoneEl) {
                phoneEl.disabled = !enabled;
                phoneEl.style.opacity = enabled ? '1' : '0.4';
                phoneEl.style.cursor = enabled ? 'pointer' : 'not-allowed';
                phoneEl.placeholder = enabled ? "Phone Number" : "Select Country First";
                if (!enabled) phoneEl.value = "";
            }

            if (areaEl) {
                areaEl.disabled = !enabled;
                areaEl.style.opacity = enabled ? '1' : '0.4';
                areaEl.style.cursor = enabled ? 'pointer' : 'not-allowed';
                if (!enabled) {
                    areaEl.innerHTML = '<option value="" selected>Select Country First</option>';
                    areaEl.value = "";
                }
            }

            if (countryCodeEl) {
                if (!enabled) countryCodeEl.value = "";
            }
        }

        // Force reset and disable fields on initial page load
        if (countryEl) {
            countryEl.value = "";
            countryEl.selectedIndex = 0;
        }
        setDependentFieldsEnabled(false);

        // Country Phone Format Rules & Validation
        const PHONE_RULES = {
            "Australia": { code: "+61", digits: 9, minDigits: 9, maxDigits: 10, placeholder: "e.g. 412 345 678 (9 digits)" },
            "USA": { code: "+1", digits: 10, minDigits: 10, maxDigits: 10, placeholder: "e.g. 555 019 2834 (10 digits)" },
            "Canada": { code: "+1", digits: 10, minDigits: 10, maxDigits: 10, placeholder: "e.g. 416 555 0192 (10 digits)" },
            "UK": { code: "+44", minDigits: 10, maxDigits: 11, placeholder: "e.g. 7123 456789 (10-11 digits)" },
            "Germany": { code: "+49", minDigits: 10, maxDigits: 11, placeholder: "e.g. 15123456789" },
            "France": { code: "+33", digits: 9, minDigits: 9, maxDigits: 9, placeholder: "e.g. 612345678 (9 digits)" },
            "Spain": { code: "+34", digits: 9, minDigits: 9, maxDigits: 9, placeholder: "e.g. 612345678 (9 digits)" },
            "Italy": { code: "+39", minDigits: 9, maxDigits: 10, placeholder: "e.g. 3123456789" },
            "New Zealand": { code: "+64", minDigits: 8, maxDigits: 10, placeholder: "e.g. 212345678" }
        };

        function getPhoneRule(countryName) {
            const normalized = countryName === 'AUS' ? 'Australia' : 
                               countryName === 'CAN' ? 'Canada' : 
                               countryName === 'UK' ? 'UK' : countryName;
            return PHONE_RULES[normalized] || { minDigits: 8, maxDigits: 12, placeholder: "Enter valid phone number" };
        }

        // Create inline error message element below phone input
        function getOrCreatePhoneError() {
            let errEl = document.getElementById('phone-error-msg');
            if (!errEl && phoneEl) {
                errEl = document.createElement('div');
                errEl.id = 'phone-error-msg';
                errEl.style.cssText = `
                    display: none;
                    margin-top: 6px;
                    padding: 8px 14px;
                    background: rgba(220, 38, 38, 0.12);
                    border: 1px solid rgba(220, 38, 38, 0.5);
                    border-radius: 10px;
                    color: #f87171;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;
                errEl.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span id="phone-error-text"></span>
                `;
                errEl.style.display = 'none';
                const container = phoneEl.closest('.space-y-1\\.5') || phoneEl.parentNode.parentNode || phoneEl.parentNode;
                container.appendChild(errEl);
            }
            return errEl;
        }

        function showPhoneError(msg) {
            const errEl = getOrCreatePhoneError();
            if (errEl) {
                const txt = errEl.querySelector('#phone-error-text');
                if (txt) txt.textContent = msg;
                errEl.style.display = 'flex';
            }
            if (phoneEl) {
                phoneEl.style.borderColor = 'rgba(220,38,38,0.8)';
            }
        }

        function clearPhoneError() {
            const errEl = document.getElementById('phone-error-msg');
            if (errEl) errEl.style.display = 'none';
            if (phoneEl) {
                phoneEl.style.borderColor = '';
            }
        }

        // Real-time validation as user types
        if (phoneEl) {
            phoneEl.addEventListener('input', () => {
                const selectedCountry = countryEl ? countryEl.value : '';
                if (!selectedCountry) return;

                const rawDigits = phoneEl.value.replace(/\D/g, '');
                const rule = getPhoneRule(selectedCountry);

                if (!rawDigits) {
                    clearPhoneError();
                    return;
                }

                // While typing: only show error if user has typed more than expected, or on blur
                if (rawDigits.length > rule.maxDigits) {
                    showPhoneError(`❌ Too many digits for ${selectedCountry}! Max ${rule.maxDigits} digits (${rule.placeholder}).`);
                } else {
                    clearPhoneError();
                }
            });

            phoneEl.addEventListener('blur', () => {
                const selectedCountry = countryEl ? countryEl.value : '';
                if (!selectedCountry || !phoneEl.value.trim()) { clearPhoneError(); return; }
                validatePhoneNumber(phoneEl, selectedCountry);
            });
        }

        function validatePhoneNumber(phoneInput, selectedCountry) {
            if (!phoneInput || !selectedCountry) return true;
            const rawDigits = phoneInput.value.replace(/\D/g, '');
            const rule = getPhoneRule(selectedCountry);

            if (!rawDigits) {
                showPhoneError(`Phone number is required for ${selectedCountry}.`);
                return false;
            }

            const exactMatch = rule.digits && rawDigits.length !== rule.digits;
            const rangeMatch = !rule.digits && rule.minDigits && (rawDigits.length < rule.minDigits || rawDigits.length > rule.maxDigits);

            if (exactMatch) {
                showPhoneError(`❌ Invalid ${selectedCountry} number — exactly ${rule.digits} digits needed. (${rule.placeholder})`);
                if (phoneInput) phoneInput.focus();
                return false;
            }

            if (rangeMatch) {
                showPhoneError(`❌ Invalid ${selectedCountry} number — must be ${rule.minDigits}–${rule.maxDigits} digits. (${rule.placeholder})`);
                if (phoneInput) phoneInput.focus();
                return false;
            }

            clearPhoneError();
            return true;
        }

        window.validatePhoneNumber = validatePhoneNumber;

        countryEl.addEventListener('change', (e) => {
            const country = e.target.value;
            if (!country) {
                setDependentFieldsEnabled(false);
                return;
            }

            // Enable fields once country is selected
            setDependentFieldsEnabled(true);

            // Handle mappings for short codes (AUS -> Australia, etc.)
            const countryKey = country === 'AUS' ? 'Australia' : 
                               country === 'CAN' ? 'Canada' : 
                               country === 'UK' ? 'UK' : country;
            
            const data = locationData[countryKey];
            const phoneRule = getPhoneRule(country);

            if (phoneEl) {
                phoneEl.placeholder = phoneRule.placeholder;
                phoneEl.classList.remove('border-red-500');
            }
            
            // Update States
            if (stateEl) {
                stateEl.innerHTML = '<option value="" selected>Select State</option>';
                if (data && data.states) {
                    data.states.sort().forEach(state => {
                        const opt = document.createElement('option');
                        opt.value = state;
                        opt.innerText = state;
                        stateEl.appendChild(opt);
                    });
                }
            }

            // Update Country Code
            if (countryCodeEl && data) {
                countryCodeEl.value = data.code || phoneRule.code || "";
            }

            // Update Area Codes
            if (areaEl) {
                areaEl.innerHTML = '<option value="" selected>Select Area Code</option>';
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

        // 5. Custom State Selection Modal Window Component (In-Window Modal Selector)
        function setupCustomStateModal() {
            if (!stateEl) return;

            let modal = document.getElementById('state-modal-window');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'state-modal-window';
                modal.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden';
                modal.innerHTML = `
                    <div class="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl relative animate-fadeIn">
                        <div class="flex justify-between items-center pb-4 border-b border-white/10 mb-4 flex-shrink-0">
                            <div>
                                <h3 class="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    Select State / Region
                                </h3>
                                <p id="state-modal-country-subtitle" class="text-xs text-zinc-400 font-medium mt-0.5">Choose your state</p>
                            </div>
                            <button id="close-state-modal" type="button" class="text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>

                        <!-- Search Input -->
                        <div class="mb-4 flex-shrink-0">
                            <input type="text" id="state-search-input" placeholder="Search state or region..." class="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3D00] font-medium transition-all">
                        </div>

                        <!-- Scrollable State List -->
                        <div id="state-modal-list" class="overflow-y-auto space-y-2 flex-1 pr-1 custom-scroll max-h-[50vh]">
                            <!-- Dynamically populated -->
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }

            const closeBtn = modal.querySelector('#close-state-modal');
            const searchInput = modal.querySelector('#state-search-input');
            const listContainer = modal.querySelector('#state-modal-list');
            const subtitle = modal.querySelector('#state-modal-country-subtitle');

            function openModal() {
                if (stateEl.disabled) return;
                const currentCountry = countryEl ? countryEl.value : '';
                if (!currentCountry) {
                    if (typeof showPremiumToast === 'function') showPremiumToast('Please select a country first!', 'error');
                    return;
                }

                subtitle.innerText = `Select state for ${currentCountry}`;
                populateStateList('');
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                if (searchInput) {
                    searchInput.value = '';
                    setTimeout(() => searchInput.focus(), 100);
                }
            }

            function closeModal() {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }

            function populateStateList(query) {
                listContainer.innerHTML = '';
                const options = Array.from(stateEl.options).filter(opt => opt.value !== '');
                const filtered = options.filter(opt => opt.text.toLowerCase().includes(query.toLowerCase()));

                if (filtered.length === 0) {
                    listContainer.innerHTML = '<div class="text-center py-6 text-zinc-500 text-xs uppercase font-bold">No states found</div>';
                    return;
                }

                filtered.forEach(opt => {
                    const item = document.createElement('div');
                    const isSelected = stateEl.value === opt.value;
                    item.className = `p-3.5 rounded-xl border transition-all cursor-pointer font-bold text-xs uppercase flex items-center justify-between ${
                        isSelected ? 'bg-[#FF3D00] text-white border-[#FF3D00]' : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border-white/5 hover:border-white/20'
                    }`;
                    item.innerHTML = `
                        <span>${opt.text}</span>
                        ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                    `;
                    item.onclick = () => {
                        stateEl.value = opt.value;
                        stateEl.dispatchEvent(new Event('change', { bubbles: true }));
                        closeModal();
                    };
                    listContainer.appendChild(item);
                });
            }

            if (closeBtn) closeBtn.onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

            if (searchInput) {
                searchInput.oninput = (e) => populateStateList(e.target.value);
            }

            stateEl.addEventListener('mousedown', (e) => {
                if (!stateEl.disabled) {
                    e.preventDefault();
                    openModal();
                }
            });

            stateEl.addEventListener('click', (e) => {
                if (!stateEl.disabled) {
                    e.preventDefault();
                    openModal();
                }
            });
        }

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
                console.warn("GTSA (Global): IP Detection completed.");
                // Keep Select Country placeholder intact without auto-selecting Australia
            }
        }

        // Keep Select Country default on initial load
        if (countryEl && countryEl.value === "Australia" && !window.location.hash.includes("auto")) {
            countryEl.value = "";
            countryEl.selectedIndex = 0;
            setDependentFieldsEnabled(false);
        }

        setupCustomStateModal();
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
