/**
 * ads.js - High-Quality Automated Ad Rotation & Ultra-Fast Loading System
 */

const AD_INVENTORY = {
    leaderboard: [
        {
            img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=728&q=60&fm=webp",
            brand: "Porsche Motorsport",
            tag: "Official Sponsor"
        },
        {
            img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=728&q=60&fm=webp",
            brand: "Luxury Timepieces",
            tag: "Verified Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=728&q=60&fm=webp",
            brand: "Nike Global Edition",
            tag: "Featured Sponsor"
        }
    ],
    skyscraper: [
        {
            img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=320&q=60&fm=webp",
            brand: "Air Jordan Retro",
            tag: "Premium Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=320&q=60&fm=webp",
            brand: "Exotic Escapes",
            tag: "Travel Sponsor"
        },
        {
            img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=320&q=60&fm=webp",
            brand: "Precision Chrono",
            tag: "Luxury Partner"
        }
    ],
    square: [
        {
            img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Studio Acoustics",
            tag: "Audio Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Fujifilm Optics",
            tag: "Camera Sponsor"
        },
        {
            img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Swiss Chronograph",
            tag: "Gold Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Milan Fashion",
            tag: "Couture Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Hypercar Track",
            tag: "Auto Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Bullion Reserve",
            tag: "Vault Partner"
        },
        {
            img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=360&q=60&fm=webp",
            brand: "Apple Smart Watch",
            tag: "Tech Sponsor"
        },
        {
            img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=60&fm=webp",
            brand: "Urban Athletics",
            tag: "Gear Partner"
        }
    ]
};

// Background Image Pre-cache pool
const preloadAdImages = () => {
    Object.values(AD_INVENTORY).flat().forEach(item => {
        const img = new Image();
        img.decoding = 'async';
        img.src = item.img;
    });
};

function initAds() {
    const placeholders = document.querySelectorAll(".ad-placeholder");
    if (!placeholders || placeholders.length === 0) return;

    preloadAdImages();

    placeholders.forEach((el, i) => {
        // Skip if already populated with an img tag
        const existingImg = el.querySelector('img');
        
        // Determine ad format
        const text = (el.textContent || "").toLowerCase();
        let type = "square";

        if (text.includes("skyscraper") || el.classList.contains("w-[160px]")) {
            type = "skyscraper";
        } else if (text.includes("leaderboard") || el.classList.contains("h-[90px]")) {
            type = "leaderboard";
        }

        const items = AD_INVENTORY[type] || AD_INVENTORY.square;
        let index = i % items.length;

        const renderAd = (idx) => {
            const ad = items[idx];
            el.innerHTML = `
                <div class="relative w-full h-full group overflow-hidden bg-zinc-950 border border-white/10 rounded-xl shadow-xl transition-all duration-500 cursor-pointer">
                    <img src="${ad.img}" 
                         alt="${ad.brand}" 
                         class="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                         decoding="async" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span class="text-[10px] font-black uppercase text-white tracking-wider drop-shadow-md">${ad.brand}</span>
                        <span class="px-1.5 py-0.5 bg-[#FF3D00] rounded text-[7px] text-white uppercase font-black tracking-widest">${ad.tag}</span>
                    </div>
                </div>
            `;
        };

        if (!existingImg) {
            renderAd(index);
        }

        // Rotate ad periodically
        setInterval(() => {
            index = (index + 1) % items.length;
            renderAd(index);
        }, 12000 + (i * 1500));
    });
}

// Auto initialize on script load and DOM events
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
} else {
    initAds();
}
window.addEventListener('load', initAds);
window.initAds = initAds;


