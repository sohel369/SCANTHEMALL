/**
 * GTSA B2C Lead Generation Logic
 * Handles the Two-Step Form Flow for the $1,000 Cash Draw
 */

const LeadGen = {
    step: 1,
    formData: {
        email: '',
        phone: '',
        category: '',
        ageGroup: '',
        shoppingFreq: '',
        gender: '',
        source: 'cash_draw_v1'
    },

    init() {
        this.bindEvents();
        this.updateUI();
    },

    bindEvents() {
        const form = document.getElementById('cash-draw-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNext();
        });

        // Listen for back button
        const backBtn = document.getElementById('step-back');
        if (backBtn) {
            backBtn.onclick = () => this.goBack();
        }
    },

    handleNext() {
        if (this.step === 1) {
            this.validateStep1();
        } else if (this.step === 2) {
            this.validateStep2();
        }
    },

    validateStep1() {
        const email = document.getElementById('entry-email').value;
        const phone = document.getElementById('entry-phone').value;

        if (!email || !phone) {
            this.showError('Email and Phone are required to enter.');
            return;
        }

        this.formData.email = email;
        this.formData.phone = phone;

        // Transition to Step 2
        this.step = 2;
        this.updateUI();
        
        // Pulse Effect for Step 2
        const s2 = document.getElementById('form-step-2');
        s2.classList.add('animate-pulse');
        setTimeout(() => s2.classList.remove('animate-pulse'), 500);
    },

    async validateStep2() {
        this.formData.category = document.getElementById('entry-category').value;
        this.formData.ageGroup = document.getElementById('entry-age').value;
        this.formData.shoppingFreq = document.getElementById('entry-freq').value;
        this.formData.gender = document.getElementById('entry-gender').value;

        if (!this.formData.category || !this.formData.ageGroup || !this.formData.shoppingFreq) {
            this.showError('Please help us tailor your rewards by completing the final fields.');
            return;
        }

        if (this.formData.ageGroup === 'under_18') {
            this.showError('You must be 18+ to participate in the Cash Draw.');
            return;
        }

        this.submitToCRM();
    },

    async submitToCRM() {
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.innerText = 'Synchronizing Entry...';

        try {
            console.log('Pushing Data to Backend API:', this.formData);
            
            // Determine base URL dynamically or fallback to current origin
            const baseUrl = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:4000/api' : '/api');
            const response = await fetch(`${baseUrl}/lead/submit-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit entry');
            }

            const data = await response.json();
            console.log('Backend response:', data);

            // Get dynamic affiliate offers
            const offers = this.getAffiliateOffers(this.formData.category);

            // Success State
            document.getElementById('form-container').innerHTML = `
                <div class="text-center py-8 animate-in fade-in zoom-in duration-500">
                    <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🎉</span>
                    </div>
                    <h3 class="text-2xl font-black text-white mb-2 uppercase italic">You're in the Draw!</h3>
                    <p class="text-zinc-500 mb-6 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                        Good luck! We've synced your entry. <br> Winners notified at <span class="text-[#e11d48]">${this.formData.email}</span>
                    </p>

                    <!-- Affiliate Section -->
                    <div class="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 text-left">
                        <h4 class="text-[10px] font-black text-[#e11d48] uppercase tracking-[0.2em] mb-4">Exclusive Partner Offers for You</h4>
                        <div class="space-y-4">
                            ${offers.map(offer => `
                                <a href="${offer.link}" target="_blank" class="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-[#e11d48]/50 transition-all group">
                                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                        ${offer.icon}
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-xs font-black text-white uppercase tracking-wider">${offer.brand}</div>
                                        <div class="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">${offer.text}</div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-700 group-hover:text-[#e11d48] transition-colors"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </a>
                            `).join('')}
                        </div>
                        <p class="text-[8px] text-zinc-600 mt-4 uppercase tracking-widest font-black text-center italic">Associations with these household brands improve our community trust</p>
                    </div>

                    <a href="index.html" class="inline-block bg-white text-black px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-[#e11d48] hover:text-white transition-all">Back to Game</a>
                </div>
            `;
        } catch (e) {
            console.error(e);
            this.showError('Sync failed. Please try again.');
            btn.disabled = false;
            btn.innerText = 'Enter to Win $1,000';
        }
    },

    getAffiliateOffers(category) {
        const affiliateMap = {
            'Apparel & Accessories': [
                { brand: 'Nike', icon: '👟', link: 'https://impact.com', text: 'Gear up with the latest from Nike.' },
                { brand: 'Adidas', icon: '👕', link: 'https://impact.com', text: 'Explore iconic styles at Adidas.' }
            ],
            'Beauty': [
                { brand: 'Sephora', icon: '💄', link: 'https://impact.com', text: 'Discover beauty must-haves at Sephora.' },
                { brand: 'Ulta', icon: '✨', link: 'https://impact.com', text: 'Shop top beauty brands at Ulta.' }
            ],
            'Home & Garden': [
                { brand: 'Walmart', icon: '🏠', link: 'https://impact.com', text: 'Everything for your home at Walmart.' },
                { brand: 'Home Depot', icon: '🛠️', link: 'https://impact.com', text: 'Start your next project at Home Depot.' }
            ],
            'Electronics': [
                { brand: 'Best Buy', icon: '💻', link: 'https://impact.com', text: 'Get the latest tech at Best Buy.' },
                { brand: 'Microsoft', icon: '🏢', link: 'https://impact.com', text: 'Empower your work with Microsoft.' }
            ],
            'Automotive': [
                { brand: 'Discount Tire', icon: '🚗', link: 'https://impact.com', text: 'Quality tires and wheels at Discount Tire.' },
                { brand: 'AutoZone', icon: '🔧', link: 'https://impact.com', text: 'Parts and advice at AutoZone.' }
            ],
            'Travel': [
                { brand: 'Uber', icon: '🚕', link: 'https://impact.com', text: 'Get where you need to go with Uber.' },
                { brand: 'Expedia', icon: '✈️', link: 'https://impact.com', text: 'Book your next adventure on Expedia.' }
            ],
            'Food & Beverage': [
                { brand: 'Walmart', icon: '🛒', link: 'https://impact.com', text: 'Grocery essentials at Walmart.' },
                { brand: 'DoorDash', icon: '🍕', link: 'https://impact.com', text: 'Your favorite meals delivered by DoorDash.' }
            ]
        };

        // Fallback for missing or unknown categories
        return affiliateMap[category] || [
            { brand: 'Walmart', icon: '🛒', link: 'https://impact.com', text: 'Shop household brands at Walmart.' },
            { brand: 'Amazon', icon: '📦', link: 'https://impact.com', text: 'Explore deals on Amazon.' }
        ];
    },

    updateUI() {
        const s1 = document.getElementById('form-step-1');
        const s2 = document.getElementById('form-step-2');
        const back = document.getElementById('step-back');
        const btn = document.getElementById('submit-btn');

        if (this.step === 1) {
            s1.classList.remove('hidden');
            s2.classList.add('hidden');
            if (back) back.classList.add('invisible');
            btn.innerText = 'Continue to Entry';
        } else {
            s1.classList.add('hidden');
            s2.classList.remove('hidden');
            if (back) back.classList.remove('invisible');
            btn.innerText = 'Finish & Enter $1,000 Draw';
        }
    },

    goBack() {
        this.step = 1;
        this.updateUI();
    },

    showError(msg) {
        if (window.showPremiumToast) {
            window.showPremiumToast(msg, 'error');
        } else {
            alert(msg);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => LeadGen.init());
