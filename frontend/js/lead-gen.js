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
            console.log('Pushing Data to Copper CRM:', this.formData);
            
            // Simulation of the API call we mapped earlier
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success State
            document.getElementById('form-container').innerHTML = `
                <div class="text-center py-12 animate-in fade-in zoom-in duration-500">
                    <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span class="text-4xl">🎉</span>
                    </div>
                    <h3 class="text-3xl font-black text-white mb-4 uppercase italic">You're in the Draw!</h3>
                    <p class="text-zinc-400 mb-8 font-bold uppercase tracking-widest text-xs leading-relaxed">
                        Good luck! We've synced your entry. <br> Winners notified at <span class="text-[#e11d48]">${this.formData.email}</span>
                    </p>
                    <a href="index.html" class="inline-block bg-white text-black px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-[#e11d48] hover:text-white transition-all">Back to Game</a>
                </div>
            `;
        } catch (e) {
            this.showError('Sync failed. Please try again.');
            btn.disabled = false;
            btn.innerText = 'Enter to Win $1,000';
        }
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
