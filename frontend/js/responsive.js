/**
 * responsive.js - Universal Responsive Fixes for GTSA
 * This script injects responsive CSS and builds a premium mobile menu.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("GTSA: Responsive Module Initializing");

    // 1. Inject Universal Responsive CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Mobile Menu Styles */
        #mobile-menu {
            display: none;
            position: fixed;
            top: 5rem;
            left: 0;
            width: 100%;
            height: calc(100vh - 5rem);
            background: rgba(10, 10, 12, 0.98);
            backdrop-filter: blur(25px);
            z-index: 200;
            flex-direction: column;
            padding: 2rem 1.5rem;
            gap: 1rem;
            border-top: 1px solid rgba(255, 61, 0, 0.1);
            overflow-y: auto;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
        }

        #mobile-menu.active {
            display: flex;
            opacity: 1;
            pointer-events: auto;
        }

        #mobile-menu .nav-link {
            font-size: 1.125rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #ffffff;
            padding: 1.25rem 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s ease;
        }

        #mobile-menu .nav-link:hover {
            color: #FF3D00;
            padding-left: 1rem;
            background: rgba(255, 255, 255, 0.02);
        }

        /* Generic Mobile Overrides */
        @media (max-width: 1024px) {
            header .hidden.md\\:flex, 
            header .hidden.lg\\:flex,
            header nav.hidden,
            .hidden.md\\:flex,
            .hidden.lg\\:flex {
                display: none !important;
            }

            .md\\:hidden, .lg\\:hidden {
                display: block !important;
            }

            /* Container & Grid Fixes */
            .max-w-7xl, .max-w-6xl, .max-w-5xl, .max-w-4xl {
                width: 100% !important;
                padding-left: 1.25rem !important;
                padding-right: 1.25rem !important;
            }

            .grid-cols-2, .grid-cols-3, .grid-cols-4, .lg\\:grid-cols-2, .md\\:grid-cols-2 {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
            }

            /* Special case: 2 columns for smaller cards if requested */
            .mobile-grid-2 {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 1rem !important;
            }

            /* Flex stacking */
            .flex-row, .md\\:flex-row, .lg\\:flex-row {
                flex-direction: column !important;
            }

            .items-center {
                /* align-items: stretch !important; */
            }

            .text-left, .lg\\:text-left, .md\\:text-left {
                text-align: center !important;
            }

            .justify-start, .lg\\:justify-start, .md\\:justify-start {
                justify-content: center !important;
            }

            /* Typography Adjustments */
            h1 { font-size: 2.5rem !important; line-height: 1.1 !important; margin-bottom: 1.5rem !important; }
            h2 { font-size: 2rem !important; }
            p { font-size: 1rem !important; }

            /* Spacing */
            .py-20, .py-32, .pt-20, .pb-32 {
                padding-top: 3rem !important;
                padding-bottom: 3rem !important;
            }

            /* Footer Fixes */
            footer .grid {
                grid-template-columns: 1fr !important;
                text-align: center !important;
                gap: 3rem !important;
            }
            
            footer .flex {
                flex-direction: column !important;
                gap: 2rem !important;
            }

            /* Hide skyscrapers or sidebar elements on mobile */
            aside, .skyscraper, [class*="skyscraper"], .ad-sidebar {
                display: none !important;
            }

            /* Ensure images fit */
            img {
                max-width: 100% !important;
                height: auto !important;
            }

            /* Specific component fixes */
            .car-track, .car-track-reverse {
                animation-duration: 20s !important;
            }
        }

        /* Prevent scrolling when menu is active */
        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // 2. Build Mobile Menu Dynamically
    function setupMobileMenu() {
        const header = document.querySelector('header');
        if (!header) return;

        // Create toggle button if it doesn't have an ID
        let toggleBtn = document.getElementById('mobile-menu-btn') || header.querySelector('button');
        if (toggleBtn && !toggleBtn.id) toggleBtn.id = 'mobile-menu-btn';

        if (!toggleBtn) {
            console.warn("GTSA: No toggle button found in header");
            return;
        }

        // Find existing desktop nav links
        const desktopNav = header.querySelector('nav');
        const desktopLinks = desktopNav ? desktopNav.querySelectorAll('a') : [];
        const authButtons = header.querySelectorAll('a[href*="regist"], a[class*="btn-primary"], a[class*="premium"], .hidden.md\\:flex a');

        // Create mobile menu if not present
        let mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobile-menu';

            // Add Links
            desktopLinks.forEach(link => {
                const mLink = link.cloneNode(true);
                mLink.className = "nav-link";
                mLink.classList.remove('hidden', 'md:flex', 'lg:flex', 'text-sm', 'text-xs');
                mLink.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><path d="m9 18 6-6-6-6"/></svg>';
                mobileMenu.appendChild(mLink);
            });

            // Add Auth buttons at bottom with special styling
            if (authButtons.length > 0) {
                const divider = document.createElement('div');
                divider.className = "h-px bg-white/10 my-4 w-full";
                mobileMenu.appendChild(divider);

                authButtons.forEach(btn => {
                    if (btn.innerText.trim().length > 3) {
                        const mBtn = btn.cloneNode(true);
                        mBtn.className = btn.className + " !flex !w-full !justify-center !text-center !py-4 !rounded-2xl !mt-2";
                        mBtn.classList.remove('hidden', 'md:flex', 'lg:flex', 'text-sm', 'text-xs');
                        mobileMenu.appendChild(mBtn);
                    }
                });
            }

            document.body.appendChild(mobileMenu);
        }

        // Toggle Button Click Handler
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open', isActive);

            // Update Icon
            const iconContainer = toggleBtn.querySelector('i') || toggleBtn.querySelector('svg');
            if (iconContainer) {
                if (isActive) {
                    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
                } else {
                    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
                }
            }
        });

        // Close menu on link click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    setupMobileMenu();

    // 3. Viewport & Scaling Safeguards
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.head.appendChild(meta);
    }
});
