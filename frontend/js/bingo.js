/**
 * billboard.js - Professional Billboard Game Logic with Line Detection & Visual Highlighting
 */

const CATEGORY_ICONS = [
    'shopping-bag', 'wallet', 'repeat', 'check-circle', 'search',
    'heart', 'smartphone', 'mail', 'share-2', 'shirt',
    'sparkles', 'home', 'star', 'utensils', 'cpu',
    'car', 'dog', 'stethoscope', 'plane', 'landmark',
    'graduation-cap', 'building', 'tool', 'party-popper', 'frown'
];

const BILLBOARD_QUESTIONS = [
    // 1. Lifestyle & Spending Power
    { title: "Primary Category", question: "Which category do you spend the most on monthly?", options: ["Apparel & Accessories", "Home & Garden", "Food & Beverage", "Electronics", "Health & Wellness", "Automotive", "Travel", "I prefer not to say"] },
    { title: "Monthly Spend", question: "How much do you typically spend on non-essential items per month?", options: ["<$100", "$100–$300", "$300–$600", "$600+", "I don't track"] },
    { title: "Purchase Frequency", question: "How often do you make a purchase over $50?", options: ["Daily", "Weekly", "Monthly", "Rarely", "Only during sales"] },
    
    // 2. Decision Drivers
    { title: "Top Factor", question: "What matters most when you try a new brand?", options: ["Price/Value", "Quality/Durability", "Brand Reputation", "Customer Reviews", "Sustainability/Ethics", "Convenience"] },
    { title: "Discovery Channel", question: "Where do you usually discover new products?", options: ["Social Media (Instagram/TikTok)", "Search Engines (Google)", "Friend/Family Referral", "Email Newsletters", "In-Store Displays", "Influencer Content"] },
    { title: "Loyalty Behavior", question: "Do you have a favorite loyalty program or rewards card?", options: ["Yes, I use them often", "Yes, but rarely", "No, I prefer cash discounts", "No, I don't care"] },

    // 3. Digital Engagement
    { title: "Device Preference", question: "Which device do you use most to shop?", options: ["Mobile Phone", "Desktop/Laptop", "Tablet", "Voice Assistant"] },
    { title: "Email Open Rate", question: "How often do you open promotional emails?", options: ["Always", "Often", "Sometimes", "Rarely", "Never"] },
    { title: "Social Habits", question: "Which platforms do you use for product research?", options: ["Instagram", "TikTok", "Facebook", "YouTube", "Pinterest", "LinkedIn", "Reddit"] },

    // 4. Industry-Specific Micro-Segments (Bingo Challenge)
    { title: "Apparel Challenge", question: "Select all categories you have purchased from in the last 3 months:", options: ["Apparel", "Beauty", "Home & Garden", "Food & Beverage", "Electronics", "Auto", "Pets", "Health", "Travel", "Legal/Financial", "Education"] },
    { title: "Beauty Habits", question: "Do you buy skincare products online or in-store?", options: ["Mostly Online", "Mostly In-Store", "Mix of both", "I rarely buy skincare"] },
    { title: "Home & Garden", question: "Are you planning a home renovation soon?", options: ["Within 6 months", "Within a year", "No plans", "Just finished one"] },

    { title: "FREE SPACE", question: "Claim your bonus entry for the $75,000 Grand Prize!", options: ["Claim Free Space"] },

    { title: "Food & Beverage", question: "How often do you order food delivery?", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
    { title: "Electronics", question: "Which electronic device do you plan to buy next?", options: ["Smartphone", "Laptop/Tablet", "Smart Home Device", "Gaming Console", "None"] },
    { title: "Automotive", question: "What is your primary mode of transport?", options: ["Own Vehicle", "Public Transport", "Rideshare", "Bicycle/Walk"] },
    
    { title: "Pets Challenge", question: "Do you own any pets?", options: ["Dog", "Cat", "Other", "No Pets"] },
    { title: "Health Challenge", question: "How often do you visit a health professional?", options: ["Regularly", "When needed", "Rarely", "Never"] },
    { title: "Travel Challenge", question: "What is your dream vacation type?", options: ["Beach/Relax", "Adventure/Active", "City/Culture", "Cruise"] },

    { title: "Legal/Financial", question: "Have you used legal/financial services recently?", options: ["Yes, Legal", "Yes, Financial", "Both", "Neither"] },
    { title: "Education", question: "Are you currently pursuing any education?", options: ["Degree", "Certification", "Short Course", "No"] },
    
    // Corners / Diagonal content
    { title: "Real Estate", question: "Are you looking to buy or rent property soon?", options: ["Buy", "Rent", "Sell", "Not now"] },
    { title: "IT Support", question: "Do you use IT support for your work/home?", options: ["Yes, Managed Service", "Yes, On-call", "No, I do it myself", "No"] },
    { title: "Wedding/Events", question: "Planning an event soon?", options: ["Wedding", "Birthday/Party", "Corporate", "No"] },
    { title: "Frustrations", question: "What is your biggest frustration with online shopping?", options: ["Shipping Costs", "Return Policies", "Product Quality", "Slow Delivery", "Lack of Trust", "Hidden Fees"] }
];

function initBillboard() {
    console.log("Billboard Game: Initializing...");
    
    // Ensure styles are injected
    if (!document.getElementById('billboard-styles')) {
        const style = document.createElement('style');
        style.id = 'billboard-styles';
        style.innerHTML = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
            .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        `;
        document.head.appendChild(style);
    }

    if (!localStorage.getItem("billboard_grid")) {
        let grid = Array(25).fill(0);
        localStorage.setItem("billboard_grid", JSON.stringify(grid));
    }
    if (!localStorage.getItem("completed_lines")) {
        localStorage.setItem("completed_lines", JSON.stringify([]));
    }
    if (!localStorage.getItem("shopping_habits")) {
        localStorage.setItem("shopping_habits", JSON.stringify({}));
    }
    
    // Check for pending full card reward (for after redirects)
    if (localStorage.getItem("showFullCardReward") === "true") {
        localStorage.removeItem("showFullCardReward");
        setTimeout(() => {
            triggerFullCardReward("FULL CARD COMPLETED 🎉 +50 BONUS ENTRIES!");
        }, 800);
    }

    // Check for pending line reward
    const pendingLine = localStorage.getItem("pendingLineReward");
    if (pendingLine) {
        localStorage.removeItem("pendingLineReward");
        setTimeout(() => {
            triggerLineReward(pendingLine);
        }, 500);
    }

    renderBillboardGrid();

    // Fetch from backend if logged in
    if (window.NodeAPI && window.NodeAPI.isAuthenticated()) {
        window.NodeAPI.getBillboard().then(data => {
            if (data) {
                if (data.grid_state && data.grid_state.length === 25) {
                    console.log("Billboard Game: Synced from backend.");
                    localStorage.setItem("billboard_grid", JSON.stringify(data.grid_state));
                }
                if (data.completed_lines) {
                    localStorage.setItem("completed_lines", JSON.stringify(data.completed_lines));
                }
                if (data.shopping_habits) {
                    localStorage.setItem("shopping_habits", JSON.stringify(data.shopping_habits));
                }
                renderBillboardGrid();
            }
        }).catch(err => console.error("Billboard Game: Backend fetch failed", err));
    }
}

/**
 * Step 1: Open Question Modal
 */
window.openBillboardQuestion = function(index) {
    const grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
    if (grid[index] === 1) return; // Already filled

    const questionData = BILLBOARD_QUESTIONS[index];
    if (!questionData) return;

    const modal = document.createElement('div');
    modal.id = "billboard-modal";
    modal.className = "fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#0f172a]/95 backdrop-blur-xl";
    modal.classList.add('animate-fadeIn');

    modal.innerHTML = `
        <div class="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-scaleIn">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-[#e11d48] rounded-xl flex items-center justify-center">
                    <i data-lucide="${CATEGORY_ICONS[index] || 'help-circle'}" class="w-6 h-6 text-white"></i>
                </div>
                <h3 class="text-xl font-black uppercase tracking-tight">${questionData.title}</h3>
            </div>
            <p class="text-zinc-400 mb-8 font-medium">${questionData.question}</p>
            <div class="space-y-3">
                ${questionData.options.map(opt => `
                    <button onclick="submitBillboardAnswer(${index}, '${opt}')" class="w-full text-left bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-[#e11d48] hover:text-white transition-all font-bold text-sm">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <button onclick="document.getElementById('billboard-modal').remove()" class="w-full mt-6 text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">
                Maybe Later
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
}

/**
 * Step 2: Submit Answer
 */
window.submitBillboardAnswer = function(index, answer) {
    console.log(`Billboard Game: Answer for square ${index}: ${answer}`);
    
    let grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
    grid[index] = 1;
    localStorage.setItem("billboard_grid", JSON.stringify(grid));
    localStorage.setItem("billboard_last_update", index.toString());

    // Data Collection Hook: Sync with LeadGen strategy
    if (window.LeadGen) {
        const questionData = BILLBOARD_QUESTIONS[index];
        window.LeadGen.formData.category = questionData.title;
        console.log("Billboard Game: Synced category interest:", questionData.title);
    }

    const modal = document.getElementById('billboard-modal');
    if (modal) modal.remove();

    checkAndRewardLines(grid);
    renderBillboardGrid();
    checkFullCard(grid);

    // Sync to backend if logged in
    if (window.NodeAPI && window.NodeAPI.isAuthenticated()) {
        const completedLines = JSON.parse(localStorage.getItem("completed_lines") || "[]");
        const shoppingHabits = JSON.parse(localStorage.getItem("shopping_habits") || "{}");
        
        // Update shopping habits with this answer
        const questionData = BILLBOARD_QUESTIONS[index];
        shoppingHabits[questionData.title] = answer;
        localStorage.setItem("shopping_habits", JSON.stringify(shoppingHabits));

        window.NodeAPI.updateBillboard(grid, completedLines, shoppingHabits).catch(err => {
            console.error("GTSA Billboard: Failed to sync with backend", err);
        });
    }
};

/**
 * Detect lines
 */
function checkAndRewardLines(grid) {
    const lines = [];
    for (let r = 0; r < 5; r++) lines.push({ name: `Row ${r+1}`, indices: [r*5, r*5+1, r*5+2, r*5+3, r*5+4] });
    for (let c = 0; c < 5; c++) lines.push({ name: `Column ${c+1}`, indices: [c, c+5, c+10, c+15, c+20] });
    lines.push({ name: "Diagonal 1", indices: [0, 6, 12, 18, 24] });
    lines.push({ name: "Diagonal 2", indices: [4, 8, 12, 16, 20] });

    let alreadyRewarded = JSON.parse(localStorage.getItem("completed_lines") || "[]");
    
    lines.forEach(line => {
        const isComplete = line.indices.every(idx => grid[idx] === 1);
        if (isComplete && !alreadyRewarded.includes(line.name)) {
            const message = `${line.name} COMPLETE +10 ENTRIES!`;
            triggerLineReward(message);
            localStorage.setItem("pendingLineReward", message); // Store for next page too
            alreadyRewarded.push(line.name);
        }
    });

    localStorage.setItem("completed_lines", JSON.stringify(alreadyRewarded));
}

function checkFullCard(grid) {
    const isFull = grid.every(val => val === 1);
    if (isFull) {
        localStorage.setItem("showFullCardReward", "true");
        archiveAndResetGrid(grid);
    }
}

function triggerFullCardReward(message) {
    const notification = document.createElement('div');
    notification.className = "fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fadeIn";
    notification.innerHTML = `
        <div class="bg-zinc-900 text-white p-10 rounded-[3rem] border-2 border-[#e11d48] shadow-[0_0_100px_rgba(225,29,72,0.3)] flex flex-col items-center text-center max-w-sm animate-scaleIn">
            <div class="w-20 h-20 bg-[#e11d48] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(225,29,72,0.5)]">
                <i data-lucide="party-popper" class="w-10 h-10 text-white"></i>
            </div>
            <h2 class="text-3xl font-black uppercase tracking-tighter mb-2 italic">GAME BOARD COMPLETE!</h2>
            <p class="text-zinc-400 font-bold uppercase tracking-widest mb-8 text-[10px]">YOU EARNED A BONUS ENTRY INTO THE $75,000 GRAND PRIZE! 🏆</p>
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-[#e11d48] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl">
                KEEP PLAYING
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    if (window.lucide) lucide.createIcons();
}

function archiveAndResetGrid(grid) {
    localStorage.setItem("lastCompletedCard", JSON.stringify(grid));
    let count = parseInt(localStorage.getItem("cardsCompleted") || "0");
    localStorage.setItem("cardsCompleted", (count + 1).toString());
    localStorage.setItem("billboard_grid", JSON.stringify(Array(25).fill(0)));
    localStorage.setItem("completed_lines", JSON.stringify([]));
    renderBillboardGrid();
}

function triggerLineReward(message) {
    const notification = document.createElement('div');
    notification.className = "fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-lg animate-fadeIn";
    notification.innerHTML = `
        <div class="bg-[#e11d48] backdrop-blur-md text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl border border-white/20 flex flex-col items-center text-center">
            <div class="text-lg">LINE SUCCESS!</div>
            <div class="text-[10px] mt-1 opacity-80">${message}</div>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

window.renderBillboardGrid = function() {
    console.log("Billboard Game: Rendering Grid...");
    const container = document.getElementById('bingo-container');
    if (!container) {
        console.error("Billboard Game: Container not found!");
        return;
    }
    
    let grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
    if (grid.length !== 25) {
        console.warn("Billboard Game: Invalid grid found, resetting...");
        grid = Array(25).fill(0);
        localStorage.setItem("billboard_grid", JSON.stringify(grid));
    }

    let alreadyRewarded = JSON.parse(localStorage.getItem("completed_lines") || "[]");
    
    const highlightedIndices = new Set();
    const lines = [];
    for (let r = 0; r < 5; r++) lines.push({ name: `Row ${r+1}`, indices: [r*5, r*5+1, r*5+2, r*5+3, r*5+4] });
    for (let c = 0; c < 5; c++) lines.push({ name: `Column ${c+1}`, indices: [c, c+5, c+10, c+15, c+20] });
    lines.push({ name: "Diagonal 1", indices: [0, 6, 12, 18, 24] });
    lines.push({ name: "Diagonal 2", indices: [4, 8, 12, 16, 20] });

    lines.forEach(line => {
        if (alreadyRewarded.includes(line.name)) {
            line.indices.forEach(idx => highlightedIndices.add(idx));
        }
    });

    const cardsCompleted = localStorage.getItem("cardsCompleted") || "0";
    const roundIndicator = cardsCompleted !== "0" ? `<div class="absolute top-0 right-4 bg-[#e11d48] text-white px-3 py-1 rounded-b-lg font-black text-[10px] uppercase tracking-widest shadow-lg z-20">Round ${parseInt(cardsCompleted)+1}</div>` : '';

    container.className = "grid grid-cols-5 gap-3 sm:gap-4 max-w-[450px] mx-auto p-6 sm:p-8 bg-zinc-900/40 border border-white/10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl min-h-[350px] transition-all duration-700";
    
    container.innerHTML = roundIndicator + grid.map((val, i) => {
        const isHighlighted = highlightedIndices.has(i);
        const icon = CATEGORY_ICONS[i] || 'help-circle';
        
        return `
        <div onclick="openBillboardQuestion(${i})" class="aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center relative cursor-pointer group overflow-hidden
            ${val ? 'bg-[#e11d48] text-white shadow-[0_4px_15_rgba(225,29,72,0.4)]' : 'bg-white/5 text-zinc-500 border border-white/5'} 
            ${isHighlighted ? 'ring-2 ring-white/30' : ''}
            transition-all duration-300 hover:scale-105 active:scale-95">
            <i data-lucide="${icon}" class="w-5 h-5 sm:w-6 sm:h-6 ${val ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'} transition-opacity"></i>
            ${val ? '<div class="absolute top-1 right-1"><div class="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div></div>' : ''}
            ${!val ? '<div class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>' : ''}
        </div>
    `}).join('');
    
    if (window.lucide) lucide.createIcons();
    console.log("Billboard Game: Rendered.");
}

window.updateBillboard = function(specificIndex = null) {
    if (specificIndex !== null && specificIndex !== undefined && !isNaN(specificIndex)) {
        console.log("Billboard Game: Auto-filling square", specificIndex);
        submitBillboardAnswer(specificIndex, "Scanned");
    } else {
        // Fallback: Pick the first empty square and fill it
        let grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
        if (grid.length === 0) grid = Array(25).fill(0);
        let empty = grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
        if (empty.length > 0) {
            let firstEmpty = empty[0];
            console.log("Billboard Game: Auto-filling first empty square", firstEmpty);
            submitBillboardAnswer(firstEmpty, "Scanned");
        }
    }
}
// Auto-init if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bingo-container')) {
        initBillboard();
    }
});
