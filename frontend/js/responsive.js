/**
 * responsive.js - Universal Responsive Fixes for GTSA
 * This script injects responsive CSS and builds a premium mobile menu.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("GTSA: Responsive Module Initializing");

    // 1. Inject Universal Responsive CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Mobile Menu Styles - 100vh Height Fullscreen Opaque Popup */
        #mobile-menu {
            display: none;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            min-width: 100vw !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: 100vh !important;
            background-color: #09090b !important;
            background: #09090b !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            z-index: 999999 !important;
            flex-direction: column;
            padding: 1rem 1.25rem 3rem 1.25rem !important;
            gap: 0.25rem;
            border: none !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            pointer-events: none;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }

        #mobile-menu::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
        }

        #mobile-menu.active, #mobile-menu.show-menu {
            display: flex !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            height: 100vh !important;
            min-height: 100vh !important;
        }

        body.menu-open {
            overflow: hidden !important;
            height: 100vh !important;
            max-height: 100vh !important;
            background: #09090b !important;
            touch-action: none !important;
        }

        /* Hide all home page content when mobile menu is active */
        body.menu-open main,
        body.menu-open footer,
        body.menu-open > section,
        body.menu-open div:not(header div):not(#mobile-menu):not(#mobile-menu div) {
            display: none !important;
        }

        body.menu-open header {
            background: #09090b !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }

        #mobile-menu .nav-link {
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #ffffff;
            padding: 0.85rem 0.5rem;
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

        /* Footer Bottom Container: Default / Desktop (1 single horizontal line) */
        footer .footer-bottom-container {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            gap: 1.5rem !important;
        }

        footer .footer-bottom-container p {
            width: auto !important;
            text-align: left !important;
            margin: 0 !important;
            font-size: 0.75rem !important;
            letter-spacing: 0.1em !important;
            white-space: nowrap !important;
            display: block !important;
        }

        footer .footer-bottom-container .social-icons-row {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 1.25rem !important;
            width: auto !important;
        }

        footer .footer-bottom-container .payment-cards-row {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: flex-end !important;
            align-items: center !important;
            gap: 1.25rem !important;
            width: auto !important;
        }

        /* Generic Mobile Overrides */
        @media (max-width: 1024px) {
            /* Footer Bottom on Mobile: 3 clean stacked lines */
            footer .footer-bottom-container {
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                text-align: center !important;
                gap: 1.25rem !important;
            }

            footer .footer-bottom-container p {
                width: 100% !important;
                text-align: center !important;
                white-space: normal !important;
                font-size: 0.7rem !important;
                line-height: 1.5 !important;
            }

            footer .footer-bottom-container .social-icons-row {
                justify-content: center !important;
                width: 100% !important;
                gap: 1.25rem !important;
            }

            footer .footer-bottom-container .payment-cards-row {
                justify-content: center !important;
                width: 100% !important;
                gap: 1.25rem !important;
            }
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
            
            footer .footer-flex {
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

        /* Prevent full site horizontal overflow / extra width */
        html, body {
            max-width: 100vw !important;
            overflow-x: hidden !important;
        }

        header {
            transition: transform 0.35s ease-in-out, background 0.3s ease !important;
        }

        header.header-hidden {
            transform: translateY(-100%) !important;
        }

        header.header-visible {
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Build Mobile Menu Dynamically & Bind Events
    function setupMobileMenu() {
        const header = document.querySelector('header');
        const mobileMenu = document.getElementById('mobile-menu');
        const toggleBtns = document.querySelectorAll('#mobile-menu-toggle, #mobile-menu-btn, .mobile-menu-toggle');

        if (!mobileMenu) return;

        // Toggle Button Click Handler
        function toggleMenu(show) {
            const isCurrentlyActive = mobileMenu.classList.contains('active') || mobileMenu.classList.contains('show-menu') || (!mobileMenu.classList.contains('hidden') && mobileMenu.style.display !== 'none');
            const shouldActivate = show !== undefined ? show : !isCurrentlyActive;
            
            if (shouldActivate) {
                mobileMenu.classList.add('active', 'show-menu');
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.setProperty('display', 'flex', 'important');
                document.body.classList.add('menu-open');
                document.body.style.setProperty('overflow', 'hidden', 'important');
            } else {
                mobileMenu.classList.remove('active', 'show-menu');
                mobileMenu.classList.add('hidden');
                mobileMenu.style.setProperty('display', 'none', 'important');
                document.body.classList.remove('menu-open');
                document.body.style.removeProperty('overflow');
            }
        }

        toggleBtns.forEach(btn => {
            btn.style.cursor = 'pointer';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            };
        });

        const closeBtns = document.querySelectorAll('#mobile-menu-close, .mobile-menu-close');
        closeBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(false);
            };
        });

        // Close menu on nav link click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                toggleMenu(false);
            }
        });
    }

    setupMobileMenu();

    // 3. Smart Scroll-up Header (Show header instantly when scrolling UP from bottom)
    (function setupScrollHeader() {
        let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        if (!header) return;

        header.style.setProperty('position', 'fixed', 'important');
        header.style.setProperty('top', '0px', 'important');
        header.style.setProperty('left', '0px', 'important');
        header.style.setProperty('right', '0px', 'important');
        header.style.setProperty('width', '100%', 'important');
        header.style.setProperty('z-index', '100', 'important');
        header.style.setProperty('transition', 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 'important');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (document.body.classList.contains('menu-open')) {
                header.style.setProperty('transform', 'translateY(0)', 'important');
                return;
            }

            if (currentScrollY <= 20) {
                header.style.setProperty('transform', 'translateY(0)', 'important');
                lastScrollY = currentScrollY;
                return;
            }

            const diff = currentScrollY - lastScrollY;

            if (diff > 5) {
                // Scrolling DOWN (towards bottom) -> Hide Header
                header.style.setProperty('transform', 'translateY(-100%)', 'important');
            } else if (diff < -5) {
                // Scrolling UP (from bottom towards top) -> Show Header
                header.style.setProperty('transform', 'translateY(0)', 'important');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    })();

    // 4. Dynamic Header Offset Compensation (Prevents header from overlapping content on all devices)
    function adjustHeaderOffset() {
        const header = document.querySelector('header');
        if (!header) return;
        const h = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', h + 'px');
        
        const contentWrappers = document.querySelectorAll('main, #prize-main-wrapper, #position-content-wrapper');
        contentWrappers.forEach(el => {
            const currentPaddingTop = parseInt(window.getComputedStyle(el).paddingTop, 10) || 0;
            if (currentPaddingTop < h) {
                el.style.setProperty('padding-top', (h + 16) + 'px', 'important');
            }
        });
    }

    adjustHeaderOffset();
    window.addEventListener('resize', adjustHeaderOffset);
    window.addEventListener('load', adjustHeaderOffset);

    // 5. Viewport & Scaling Safeguards
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.head.appendChild(meta);
    }
});
