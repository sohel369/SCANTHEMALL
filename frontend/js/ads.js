/**
 * ads.js - High-Quality Ad Rotation with Loading Support
 */

function initAds() {
    const adInventory = {
        leaderboard: [
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200"
        ],
        skyscraper: [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600"
        ],
        square: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1526170315830-ef18a280bb3c?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"
        ]
    };

    const placeholders = document.querySelectorAll(".ad-placeholder");

    const adObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                startAdRotation(el);
                observer.unobserve(el); // Only init once
            }
        });
    }, { rootMargin: '200px' });

    placeholders.forEach(el => adObserver.observe(el));

    function startAdRotation(el) {
        const rect = el.getBoundingClientRect();
        let type = "square";
        
        if (rect.height > rect.width * 1.5) {
            type = "skyscraper";
        } else if (rect.width > rect.height * 2) {
            type = "leaderboard";
        }

        const categoryAds = adInventory[type];
        let index = 0;

        const rotate = () => {
            const nextImgUrl = categoryAds[index];
            index = (index + 1) % categoryAds.length;

            const img = new Image();
            img.src = nextImgUrl;
            
            // Show shimmer only on first load if empty
            if (!el.querySelector('img')) {
                el.innerHTML = `
                    <div class="relative w-full h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center">
                        <div class="w-8 h-8 rounded-full border-2 border-[#FF3D00]/20 border-t-[#FF3D00] animate-spin"></div>
                    </div>
                `;
            }

            img.onload = () => {
                const currentImg = el.querySelector('img');
                if (currentImg) {
                    currentImg.style.opacity = '0';
                    setTimeout(() => updateContent(), 700);
                } else {
                    updateContent();
                }

                function updateContent() {
                    el.innerHTML = `
                        <div class="relative w-full h-full group overflow-hidden bg-black border border-white/5 rounded-xl shadow-2xl transition-all duration-700">
                            <img src="${nextImgUrl}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt="Partner Sponsor" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div class="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded text-[6px] text-zinc-500 uppercase tracking-widest font-black">Sponsored Partner</div>
                        </div>
                    `;
                }
            };

            img.onerror = () => {
                if (!el.querySelector('img')) {
                    el.innerHTML = `<div class="text-[8px] text-zinc-700 uppercase tracking-widest text-center">GTSA Partner Network</div>`;
                }
            };
        };

        rotate();
        setInterval(rotate, 15000);
    }
}
