/**
 * GTSA Seamless SPA Client-Side Router
 * Enables instant, smooth page navigation without full browser reloads (PushState + DOM Swap)
 */

(function () {
    if (typeof window === 'undefined' || !window.fetch || !window.DOMParser || !window.history.pushState) {
        return;
    }

    // Top progress loading bar
    const getProgressBar = () => {
        let bar = document.getElementById('spa-progress-bar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'spa-progress-bar';
            bar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                width: 0%;
                background: linear-gradient(90deg, #FF3D00 0%, #FF9100 100%);
                z-index: 9999999;
                transition: width 0.25s ease, opacity 0.3s ease;
                box-shadow: 0 0 12px rgba(255, 61, 0, 0.8);
                pointer-events: none;
            `;
            document.body.appendChild(bar);
        }
        return bar;
    };

    const startProgress = () => {
        const bar = getProgressBar();
        bar.style.opacity = '1';
        bar.style.width = '35%';
        setTimeout(() => {
            if (bar.style.opacity === '1') bar.style.width = '75%';
        }, 120);
    };

    const finishProgress = () => {
        const bar = getProgressBar();
        bar.style.width = '100%';
        setTimeout(() => {
            bar.style.opacity = '0';
            setTimeout(() => {
                bar.style.width = '0%';
            }, 300);
        }, 180);
    };

    // Cache to store preloaded HTML
    const pageCache = new Map();

    const isInternalNavigation = (url) => {
        try {
            const target = new URL(url, window.location.href);
            const current = new URL(window.location.href);

            // Must match origin
            if (target.origin !== current.origin) return false;

            const path = target.pathname.toLowerCase();
            // Exclude backend routes or downloadable files
            if (path.startsWith('/api') || path.startsWith('/admin') || path.startsWith('/advertiser')) return false;
            if (path.endsWith('.pdf') || path.endsWith('.zip') || path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.mp4')) return false;

            return true;
        } catch (e) {
            return false;
        }
    };

    const navigateTo = async (url, pushHistory = true) => {
        try {
            startProgress();

            let html = pageCache.get(url);
            if (!html) {
                const response = await fetch(url);
                if (!response.ok) {
                    window.location.href = url;
                    return;
                }
                html = await response.text();
                pageCache.set(url, html);
            }

            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');

            // 1. Update Title
            document.title = newDoc.title;

            // 2. Update Browser History URL
            if (pushHistory) {
                window.history.pushState({ url }, newDoc.title, url);
            }

            // 3. Close mobile menu if open & reset body overflow
            document.body.classList.remove('menu-open');
            document.body.style.removeProperty('overflow');
            if (typeof window.toggleGtsaMobileMenu === 'function') {
                window.toggleGtsaMobileMenu(false);
            }
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active', 'show-menu');
                mobileMenu.classList.add('hidden');
                mobileMenu.style.setProperty('display', 'none', 'important');
                mobileMenu.style.setProperty('opacity', '0', 'important');
                mobileMenu.style.setProperty('pointer-events', 'none', 'important');
            }

            // 4. Smoothly replace body content
            document.body.innerHTML = newDoc.body.innerHTML;

            // 5. Scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });

            // 6. Execute newly injected scripts
            const scripts = Array.from(document.body.querySelectorAll('script'));
            for (const oldScript of scripts) {
                // Avoid duplicating global libraries that already live on window
                if (oldScript.src && (oldScript.src.includes('tailwindcss') || oldScript.src.includes('lucide'))) {
                    continue;
                }
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode.replaceChild(newScript, oldScript);
            }

            // 7. Re-initialize icons and Lucide
            if (window.lucide) {
                window.lucide.createIcons();
            }

            // 8. Re-initialize ads if present
            if (typeof window.initAds === 'function') {
                window.initAds();
            }

            // 9. Dispatch custom navigation event for auth-header & active tabs
            if (typeof window.highlightActiveFooterLinks === 'function') {
                window.highlightActiveFooterLinks();
            }
            window.dispatchEvent(new CustomEvent('gtsa:page-changed', { detail: { url } }));

            finishProgress();
        } catch (err) {
            console.error('[SPA Router Error]:', err);
            finishProgress();
            window.location.href = url;
        }
    };

    // Click handler for links
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        // Skip modified clicks (Ctrl, Cmd, Shift, middle click)
        if (e.defaultPrevented || e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
        if (anchor.target && anchor.target !== '_self') return;
        if (anchor.hasAttribute('download')) return;

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        if (isInternalNavigation(href)) {
            e.preventDefault();
            const targetUrl = new URL(href, window.location.href).href;

            // If same page with hash
            if (targetUrl.split('#')[0] === window.location.href.split('#')[0] && targetUrl.includes('#')) {
                const hash = targetUrl.split('#')[1];
                const elem = document.getElementById(hash);
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // If exact same page
            if (targetUrl === window.location.href) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            navigateTo(targetUrl, true);
        }
    });

    // Browser back/forward navigation support
    window.addEventListener('popstate', () => {
        navigateTo(window.location.href, false);
    });

    // Hover prefetch for ultra-fast instant clicks
    document.addEventListener('mouseover', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

        if (isInternalNavigation(href)) {
            const targetUrl = new URL(href, window.location.href).href;
            if (!pageCache.has(targetUrl)) {
                fetch(targetUrl)
                    .then(res => {
                        if (res.ok) return res.text();
                    })
                    .then(html => {
                        if (html) pageCache.set(targetUrl, html);
                    })
                    .catch(() => {});
            }
        }
    });

    console.log('⚡ GTSA Seamless SPA Router Initialized');
})();
