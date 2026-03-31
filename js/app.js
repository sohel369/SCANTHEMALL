/**
 * app.js - Main Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded - GTSA Initializing Modules");

    // --- Page-Specific Initializations (Task: Prevent Conflicts) ---
    const path = window.location.pathname;

    // A. Instagram / Upload Page (Upload logic + Bingo results + Ads)
    if (path.includes("instagram_upload_page") || path.includes("upload")) {
        console.log("GTSA: Upload, bingo & Ads Active");
        if (typeof initUpload === 'function') initUpload();
        if (typeof initBingo === 'function') initBingo();
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

    // 2. Registration and Entry Form Logic (Task: Handle all submission forms)
    const regForm = document.querySelector('form[action*="regist"], #registrationForm, #register-form, #cashdraw-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(regForm).entries());
            
            // Basic Form Validation check
            if (!data.state || data.state === "") {
                showPremiumToast("Please select your State or Region.", "error");
                return;
            }

            registerUser(data);
        });
    }

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

    // 4. Region Selector Logic (For Registration and Prize forms)
    const countryEl = document.getElementById('country') || document.getElementById('countrySelect');
    const stateEl = document.getElementById('state') || document.getElementById('stateSelect');
    const postalEl = document.getElementById('postal') || document.getElementById('postalCode');

    if (countryEl && stateEl) {
        const regions = {
            "AUS": ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"],
            "USA": ["NY", "CA", "TX", "FL", "IL", "PA", "OH", "GA"],
            "UK": ["England", "Scotland", "Wales", "N. Ireland"],
            "CAN": ["ON", "QC", "BC", "AB", "MB", "SK"]
        };

        countryEl.addEventListener('change', (e) => {
            const country = e.target.value;
            stateEl.innerHTML = '<option value="">Select State</option>';
            
            if (regions[country]) {
                regions[country].forEach(state => {
                    const opt = document.createElement('option');
                    opt.value = state;
                    opt.innerText = state;
                    stateEl.appendChild(opt);
                });
            }
        });
    }

    // Simple Dummy Postal Code filler
    if (stateEl && postalEl) {
        stateEl.addEventListener('change', () => {
            postalEl.innerHTML = '<option value="">Select Postal Code</option>';
            const dummyPostals = ["1000", "2000", "3000", "4000", "5000"];
            dummyPostals.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p;
                opt.innerText = p;
                postalEl.appendChild(opt);
            });
        });
    }

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
