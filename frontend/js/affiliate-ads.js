/**
 * GTSA Affiliate Ad Injection System
 * Injects household brand affiliate links into pages to build trust and monetize.
 */

const AffiliateAds = {
    brands: [
        { brand: 'Walmart', icon: '🛒', link: 'https://impact.com', text: 'Household essentials and more at Walmart.' },
        { brand: 'Nike', icon: '👟', link: 'https://impact.com', text: 'Just do it. Shop the latest at Nike.' },
        { brand: 'Best Buy', icon: '💻', link: 'https://impact.com', text: 'Upgrade your tech at Best Buy.' },
        { brand: 'Adidas', icon: '👕', link: 'https://impact.com', text: 'Iconic sportswear at Adidas.' },
        { brand: 'Microsoft', icon: '🏢', link: 'https://impact.com', text: 'Software and hardware from Microsoft.' }
    ],

    init() {
        const containers = document.querySelectorAll('.affiliate-offers-container');
        containers.forEach(container => this.render(container));
    },

    render(container) {
        // Randomly pick 3 brands
        const shuffled = [...this.brands].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        container.innerHTML = `
            <div class="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-left mt-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h4 class="text-[10px] font-black text-[#e11d48] uppercase tracking-[0.2em] mb-1">Exclusive Partner Offers</h4>
                        <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest">Recommended for our community</p>
                    </div>
                    <div class="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-black text-green-500 uppercase tracking-widest">Verified Partners</div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${selected.map(offer => `
                        <a href="${offer.link}" target="_blank" class="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#e11d48]/50 transition-all group">
                            <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                ${offer.icon}
                            </div>
                            <div class="flex-1">
                                <div class="text-xs font-black text-white uppercase tracking-wider">${offer.brand}</div>
                                <div class="text-[9px] text-zinc-600 font-bold uppercase tracking-tight leading-tight mt-1">${offer.text}</div>
                            </div>
                        </a>
                    `).join('')}
                </div>
                
                <div class="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p class="text-[8px] text-zinc-600 uppercase tracking-widest font-black italic">Associations with these household brands improve our community trust</p>
                    <div class="flex gap-4 items-center opacity-30">
                        <img src="https://logo.clearbit.com/impact.com" alt="Impact" class="h-3 grayscale invert">
                        <img src="https://logo.clearbit.com/walmart.com" alt="Walmart" class="h-3 grayscale invert">
                        <img src="https://logo.clearbit.com/nike.com" alt="Nike" class="h-3 grayscale invert">
                    </div>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => AffiliateAds.init());
