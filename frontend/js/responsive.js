/**
 * responsive.js - Universal Responsive Fixes for GTSA
 * Fixes mobile menu toggles and prevents layout conflicts.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("GTSA: Responsive Module Initializing");

    // 1. Inject Clean Responsive Utility Styles
    const style = document.createElement('style');
    style.innerHTML = `
        /* Mobile Menu Container Styles */
        #mobile-menu {
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        #mobile-menu.hidden {
            display: none !important;
        }

        /* Prevent scrolling when mobile menu is active */
        body.menu-open {
            overflow: hidden !important;
        }

        /* Ensure images and media do not overflow containers */
        img, video, iframe {
            max-width: 100%;
        }
    `;
    document.head.appendChild(style);

    // 2. Setup Mobile Menu Controller
    function setupMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-btn');
        const closeBtn = document.getElementById('mobile-menu-close');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!mobileMenu) return;

        // Ensure mobile menu starts hidden on page load
        mobileMenu.classList.add('hidden');

        function openMenu() {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('menu-open');
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileMenu.classList.contains('hidden')) {
                    openMenu();
                } else {
                    closeMenu();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeMenu();
            });
        }

        // Close menu on any navigation link click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                closeMenu();
            }
        });
    }

    setupMobileMenu();

    // 3. Viewport Safeguard
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.head.appendChild(meta);
    }
});
