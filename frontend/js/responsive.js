// Load Seamless SPA Router if not already included
if (typeof window !== 'undefined' && !window._spaRouterLoaded) {
    window._spaRouterLoaded = true;
    const spaScript = document.createElement('script');
    spaScript.src = 'js/spa-router.js';
    spaScript.defer = true;
    document.head.appendChild(spaScript);
}

// 1. Inject Universal Responsive & Neon Wave CSS Immediately
(function injectGlobalStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('gtsa-responsive-styles')) return;
    const style = document.createElement('style');
    style.id = 'gtsa-responsive-styles';
    style.innerHTML = `
        /* Universal Frosted Glass Header Blur on All Pages */
        header, .glass-nav, .glass-header, .sticky-header, nav.glass-nav {
            background-color: rgba(9, 9, 11, 0.72) !important;
            background: rgba(9, 9, 11, 0.72) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        header.scrolled, .glass-nav.scrolled, .glass-header.scrolled, .sticky-header.scrolled {
            background-color: rgba(5, 5, 5, 0.85) !important;
            background: rgba(5, 5, 5, 0.85) !important;
            -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
            backdrop-filter: blur(24px) saturate(200%) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7) !important;
        }

        header .bg-black, .glass-nav .bg-black, .glass-header .bg-black {
            background-color: rgba(0, 0, 0, 0.4) !important;
            background: rgba(0, 0, 0, 0.4) !important;
        }

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

        footer .social-icons-row,
        .social-icons-row {
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

        /* Active Sunburst Flare Link - Global (Header & Footer on Desktop, Tablet & Mobile) */
        .nav-active-link,
        .footer-active-link {
            position: relative !important;
            display: inline-flex !important;
            align-items: center !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            letter-spacing: 0.04em !important;
            padding: 0.35rem 0.85rem 0.45rem 0.85rem !important;
            border-radius: 0.6rem !important;
            background: linear-gradient(0deg, rgba(255, 61, 0, 0.32) 0%, rgba(255, 145, 0, 0.16) 45%, rgba(255, 61, 0, 0.03) 80%, transparent 100%) !important;
            border: 1px solid rgba(255, 61, 0, 0.55) !important;
            border-bottom: 2px solid #FF3D00 !important;
            box-shadow: 0 4px 18px rgba(255, 61, 0, 0.35), 0 -8px 22px rgba(255, 145, 0, 0.2), inset 0 -8px 16px rgba(255, 80, 0, 0.3) !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95), 0 0 12px rgba(255, 61, 0, 0.6) !important;
            transform: translateY(-1px) !important;
            transition: all 0.3s ease;
            z-index: 1 !important;
        }

        /* Rising Sun Flare Ray effect emanating upwards from bottom */
        .nav-active-link::before,
        .footer-active-link::before {
            content: '' !important;
            position: absolute !important;
            bottom: -2px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 130% !important;
            height: 120% !important;
            background: radial-gradient(ellipse at 50% 100%, rgba(255, 180, 0, 0.55) 0%, rgba(255, 61, 0, 0.35) 30%, rgba(255, 61, 0, 0.1) 65%, transparent 100%) !important;
            filter: blur(5px) !important;
            pointer-events: none !important;
            z-index: -1 !important;
            animation: sunGlowRise 3s ease-in-out infinite alternate !important;
        }

        /* Sun Core Underline with intense golden-orange laser wave */
        .nav-active-link::after,
        .footer-active-link::after {
            content: '' !important;
            position: absolute !important;
            bottom: -2px !important;
            left: 0 !important;
            width: 100% !important;
            height: 3px !important;
            border-radius: 9999px !important;
            background: linear-gradient(90deg, #FF3D00 0%, #FFF8E1 45%, #FF9100 55%, #FF3D00 100%) !important;
            background-size: 200% 100% !important;
            box-shadow: 0 0 10px #FF3D00, 0 -3px 14px #FF9100, 0 -8px 24px rgba(255, 145, 0, 0.7) !important;
            animation: sunRayWave 2.2s linear infinite !important;
            z-index: 2 !important;
        }

        @keyframes sunGlowRise {
            0% {
                height: 85%;
                opacity: 0.7;
                filter: blur(4px);
                transform: translateX(-50%) scaleX(0.9);
            }
            50% {
                height: 135%;
                opacity: 1;
                filter: blur(6px);
                transform: translateX(-50%) scaleX(1.15);
            }
            100% {
                height: 85%;
                opacity: 0.7;
                filter: blur(4px);
                transform: translateX(-50%) scaleX(0.9);
            }
        }

        @keyframes sunRayWave {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
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

            footer .social-icons-row,
            .social-icons-row {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100% !important;
                gap: 1rem !important;
            }

            footer .footer-bottom-container .payment-cards-row {
                justify-content: center !important;
                flex-wrap: wrap !important;
                width: 100% !important;
                gap: 0.5rem 0.75rem !important;
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
            .max-w-7xl, .max-w-6xl, .max-w-5xl, .max-w-4xl:not(form) {
                width: 100% !important;
                padding-left: 1.25rem !important;
                padding-right: 1.25rem !important;
            }

            .grid-cols-2:not(#category-grid):not(.mobile-grid-2):not(#social-multiplier-grid),
            .grid-cols-3:not(#category-grid):not(.mobile-grid-2):not(#social-multiplier-grid),
            .grid-cols-4:not(#category-grid):not(.mobile-grid-2):not(#social-multiplier-grid),
            .lg\\:grid-cols-2:not(#category-grid):not(.mobile-grid-2),
            .md\\:grid-cols-2:not(#category-grid):not(.mobile-grid-2) {
                grid-template-columns: 1fr !important;
                gap: 2rem !important;
            }

            /* Category Grid & 2-column mobile cards */
            #category-grid,
            .category-grid,
            .mobile-grid-2,
            #social-multiplier-grid {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 0.75rem !important;
            }

            /* Flex stacking */
            .flex-row:not(.social-icons-row):not(.payment-cards-row), 
            .md\\:flex-row:not(.social-icons-row):not(.payment-cards-row), 
            .lg\\:flex-row:not(.social-icons-row):not(.payment-cards-row) {
                flex-direction: column !important;
            }

            .social-icons-row,
            footer .social-icons-row,
            footer .col-span-1 .social-icons-row,
            footer .footer-bottom-container .social-icons-row {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                justify-content: center !important;
                align-items: center !important;
            }

            .items-center {
                /* align-items: stretch !important; */
            }

            /* Typography Adjustments - only apply to unclassed headings */
            h1:not([class*="text-"]) { font-size: 2.25rem !important; line-height: 1.1 !important; margin-bottom: 1.5rem !important; }
            h2:not([class*="text-"]) { font-size: 1.75rem !important; }

            /* Spacing */
            .py-20, .py-32, .pt-20, .pb-32 {
                padding-top: 3rem !important;
                padding-bottom: 3rem !important;
            }

            /* Footer Fixes: Left aligned on mobile, 2-column for About Us & Policy, full width for Brand & Support */
            footer,
            footer .footer-nav-grid,
            footer .footer-nav-grid div,
            footer .footer-nav-grid h4,
            footer .footer-nav-grid ul,
            footer .footer-nav-grid li,
            footer .footer-nav-grid p,
            footer .footer-nav-grid a {
                text-align: left !important;
            }

            footer .footer-nav-grid {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 2rem 1.5rem !important;
                text-align: left !important;
            }
            
            footer .footer-nav-grid > .col-span-2 {
                grid-column: span 2 / span 2 !important;
                text-align: left !important;
            }

            @media (min-width: 768px) {
                footer .footer-nav-grid {
                    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    gap: 3rem !important;
                }
                footer .footer-nav-grid > .col-span-2 {
                    grid-column: span 1 / span 1 !important;
                    text-align: left !important;
                }
            }
            
            footer .footer-flex {
                flex-direction: column !important;
                gap: 2rem !important;
            }

            /* Hide skyscrapers or ad elements on mobile */
            .skyscraper, [class*="skyscraper"], .ad-sidebar, .ad-skyscraper {
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
})();

    // 2. Define global highlightActiveNavAndFooterLinks (Header & Footer)
    window.highlightActiveNavAndFooterLinks = function() {
        try {
            const fullPath = window.location.pathname;
            const currentFile = decodeURIComponent(fullPath.substring(fullPath.lastIndexOf('/') + 1).toLowerCase()) || 'index.html';
            const currentHash = window.location.hash.toLowerCase();

            // A. Highlight Header & Mobile Menu links
            const headerLinks = document.querySelectorAll('header nav a, header a.nav-link, #mobile-menu a, .desktop-nav a, nav.hidden a');
            headerLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;

                link.classList.remove('nav-active-link');

                const cleanHref = href.trim();
                let targetFile = cleanHref.split('#')[0].split('?')[0];
                targetFile = decodeURIComponent(targetFile.substring(targetFile.lastIndexOf('/') + 1).toLowerCase());
                if (!targetFile) targetFile = 'index.html';
                
                let targetHash = cleanHref.includes('#') ? '#' + cleanHref.split('#')[1].toLowerCase() : '';

                let isActive = false;
                
                // If there's an active hash in the URL (like #faq)
                if (currentHash && currentHash !== '#' && currentHash !== '#home') {
                    if (targetHash === currentHash && (targetFile === currentFile || !targetFile)) {
                        isActive = true;
                    }
                    // When on a specific hash section like #faq, do NOT highlight Home unless Home specifically links to #faq
                } else {
                    // No hash or at the top of the page
                    if (!targetHash || targetHash === '#' || targetHash === '#home') {
                        if (targetFile === currentFile) {
                            isActive = true;
                        } else if ((currentFile === '' || currentFile === 'index.html') && (targetFile === 'index.html' || targetFile === '')) {
                            isActive = true;
                        } else if (currentFile.includes('about') && targetFile.includes('about')) {
                            isActive = true;
                        } else if (currentFile.includes('contact') && targetFile.includes('contact')) {
                            isActive = true;
                        }
                    }
                }

                if (isActive) {
                    link.classList.add('nav-active-link');
                }
            });

            // B. Highlight Footer links
            const footerLinks = document.querySelectorAll('footer a, .footer-nav-grid a, footer .footer-link');
            footerLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;

                link.classList.remove('footer-active-link');

                let cleanHref = href.trim();
                let targetFile = '';
                let targetHash = '';

                if (cleanHref.includes('#')) {
                    const parts = cleanHref.split('#');
                    targetFile = parts[0];
                    targetHash = '#' + parts[1].toLowerCase();
                } else {
                    targetFile = cleanHref;
                }

                targetFile = decodeURIComponent(targetFile.substring(targetFile.lastIndexOf('/') + 1).toLowerCase());
                if (!targetFile && targetHash) {
                    targetFile = currentFile;
                }

                let isActive = false;

                if (targetHash && currentHash) {
                    if (currentHash === targetHash && (targetFile === currentFile || !targetFile)) {
                        isActive = true;
                    }
                } else if (!targetHash && !currentHash) {
                    if (targetFile && targetFile === currentFile) {
                        isActive = true;
                    } else if ((currentFile === '' || currentFile === 'index.html') && (targetFile === 'index.html' || targetFile === '')) {
                        isActive = true;
                    }
                } else if (!currentHash && targetFile && targetFile === currentFile && !targetHash) {
                    isActive = true;
                }

                if (isActive) {
                    link.classList.add('footer-active-link');
                }
            });
        } catch (e) {
            console.error("Nav/Footer highlight error:", e);
        }
    };
    window.highlightActiveFooterLinks = window.highlightActiveNavAndFooterLinks;

    // 3. Build Mobile Menu Dynamically & Bind Events
    window.toggleGtsaMobileMenu = function(show) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;
        const isCurrentlyActive = mobileMenu.classList.contains('active') || mobileMenu.classList.contains('show-menu') || (!mobileMenu.classList.contains('hidden') && mobileMenu.style.display !== 'none' && mobileMenu.style.opacity !== '0');
        const shouldActivate = show !== undefined ? show : !isCurrentlyActive;
        
        if (shouldActivate) {
            mobileMenu.classList.add('active', 'show-menu');
            mobileMenu.classList.remove('hidden');
            mobileMenu.style.setProperty('display', 'flex', 'important');
            mobileMenu.style.setProperty('opacity', '1', 'important');
            mobileMenu.style.setProperty('pointer-events', 'auto', 'important');
            document.body.classList.add('menu-open');
            document.body.style.setProperty('overflow', 'hidden', 'important');
        } else {
            mobileMenu.classList.remove('active', 'show-menu');
            mobileMenu.classList.add('hidden');
            mobileMenu.style.setProperty('display', 'none', 'important');
            mobileMenu.style.setProperty('opacity', '0', 'important');
            mobileMenu.style.setProperty('pointer-events', 'none', 'important');
            document.body.classList.remove('menu-open');
            document.body.style.removeProperty('overflow');
        }
    };

    function setupMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        const toggleBtns = document.querySelectorAll('#mobile-menu-toggle, #mobile-menu-btn, .mobile-menu-toggle, button[aria-label="Toggle Navigation"]');
        toggleBtns.forEach(btn => {
            btn.style.cursor = 'pointer';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.toggleGtsaMobileMenu();
            };
        });

        const closeBtns = document.querySelectorAll('#mobile-menu-close, .mobile-menu-close');
        closeBtns.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.toggleGtsaMobileMenu(false);
            };
        });

        // Ensure lucide icons are rendered
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // 4. Smart Scroll-up Header
    function setupScrollHeader() {
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

            if (currentScrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

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
                header.style.setProperty('transform', 'translateY(-100%)', 'important');
            } else if (diff < -5) {
                header.style.setProperty('transform', 'translateY(0)', 'important');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // 5. Dynamic Header Offset Compensation (Single container only, no double padding)
    function adjustHeaderOffset() {
        const header = document.querySelector('header');
        if (!header) return;
        const h = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', h + 'px');
        
        const primaryWrapper = document.getElementById('blog-top-ad-wrapper')
            || document.getElementById('instagram-top-ad-wrapper')
            || document.getElementById('contact-top-ad-wrapper')
            || document.getElementById('position-content-wrapper')
            || document.getElementById('prize-main-wrapper')
            || document.querySelector('body > main')
            || document.querySelector('main');
            
        if (primaryWrapper) {
            if (primaryWrapper.id === 'position-content-wrapper' || primaryWrapper.id === 'prize-main-wrapper') {
                const nestedMain = primaryWrapper.querySelector('main');
                if (nestedMain) nestedMain.style.setProperty('padding-top', '0px', 'important');
            }
            primaryWrapper.style.setProperty('padding-top', (h + 8) + 'px', 'important');
        }
    }

    function setupAdvertiserLinks() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            if (window.location.port === '5500' || window.location.port === '3000') {
                document.querySelectorAll('a[href="/advertiser"], a[href="advertiser"], a[href="advertiser/"]').forEach(a => {
                    a.setAttribute('href', 'http://localhost:5173/');
                    a.setAttribute('target', '_blank');
                });
            }
        }
    }

    function initAll() {
        setupMobileMenu();
        setupScrollHeader();
        setupAdvertiserLinks();
        adjustHeaderOffset();
        window.highlightActiveFooterLinks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    window.addEventListener('load', () => {
        adjustHeaderOffset();
        window.highlightActiveFooterLinks();
    });
    window.addEventListener('resize', adjustHeaderOffset);
    window.addEventListener('gtsa:page-changed', () => {
        initAll();
    });
    window.addEventListener('popstate', () => {
        window.highlightActiveFooterLinks();
    });
    window.addEventListener('hashchange', () => {
        window.highlightActiveFooterLinks();
    });

    // Run highlight checks repeatedly during initial load
    setTimeout(window.highlightActiveFooterLinks, 100);
    setTimeout(window.highlightActiveFooterLinks, 500);

    // 6. Viewport & Scaling Safeguards
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.head.appendChild(meta);
    }
