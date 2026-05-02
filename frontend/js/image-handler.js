(function() {
    // Standard fallback image path
    const FALLBACK_IMAGE = 'fallback-image.png';

    /**
     * Handles image loading errors by replacing the source with a fallback image.
     * @param {Event} event - The error event
     */
    function handleImageError(event) {
        const img = event.target;
        if (img.tagName === 'IMG') {
            // Prevent infinite loops if fallback also fails
            if (img.src.includes(FALLBACK_IMAGE)) {
                img.style.display = 'none'; // Hide if even fallback fails
                return;
            }
            
            console.warn(`Image failed to load: ${img.src}. Using fallback.`);
            img.src = FALLBACK_IMAGE;
            img.classList.add('image-fallback-applied');
        }
    }

    // Use capture phase to catch errors before they bubble
    window.addEventListener('error', handleImageError, true);

    /**
     * Initial check for images that might have failed before script load
     * or have empty/invalid sources.
     */
    function initImageCheck() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Fix empty src or broken placeholders
            if (!img.getAttribute('src') || img.getAttribute('src') === "") {
                img.src = FALLBACK_IMAGE;
            }
            
            // Check if already broken
            if (img.complete && img.naturalWidth === 0) {
                img.src = FALLBACK_IMAGE;
            }
        });
    }

    // Run on DOM load and also observe for dynamic images
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageCheck);
    } else {
        initImageCheck();
    }

    // MutationObserver to handle dynamically added images (e.g. by Alpine.js or other scripts)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    if (!node.getAttribute('src') || node.getAttribute('src') === "") {
                        node.src = FALLBACK_IMAGE;
                    }
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img').forEach(img => {
                        if (!img.getAttribute('src') || img.getAttribute('src') === "") {
                            img.src = FALLBACK_IMAGE;
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
