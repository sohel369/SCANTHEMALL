/**
 * billboard.js - Professional Billboard Game Logic with Line Detection & Visual Highlighting
 */

const CATEGORY_ICONS = [
    'receipt', 'car', 'toy-brick', 'sparkles', 'users',
    'shopping-bag', 'graduation-cap', 'calendar-heart', 'landmark', 'dumbbell',
    'utensils', 'gamepad-2', 'star', 'stethoscope', 'home',
    'gem', 'scale', 'tv', 'dog', 'building-2',
    'sun', 'shield-check', 'trophy', 'smartphone', 'plane'
];

const BILLBOARD_QUESTIONS = [
    { title: "Accounting & Tax", question: "Do you use professional accounting or tax services?", options: ["Yes, Annual Tax Return", "Yes, Year-round Business", "No, Self-filed", "Planning to hire one"] },
    { title: "Automotive Services", question: "How do you maintain your vehicle?", options: ["Dealership Service", "Local Mechanic", "DIY at Home", "No Vehicle"] },
    { title: "Baby & Toys", question: "Do you regularly shop for baby products or toys?", options: ["Frequently (Weekly/Monthly)", "Occasionally (Gifts/Holidays)", "Rarely", "Never"] },
    { title: "Beauty & Cosmetic", question: "Where do you buy your beauty & skincare products?", options: ["Mostly Online", "In-Store Specialty", "Department Stores", "Drugstore / Supermarket"] },
    { title: "Childcare & Aged Care", question: "Are you currently using or planning family care services?", options: ["Childcare/Daycare", "Aged/Senior Care", "Both", "None currently"] },

    { title: "Department Stores", question: "How often do you shop at major department stores?", options: ["Weekly", "Monthly", "Seasonal/Holidays", "Rarely"] },
    { title: "Education & Tutoring", question: "Are you or your family pursuing education/tutoring?", options: ["University/College", "K-12 Tutoring", "Professional Certifications", "No"] },
    { title: "Events & Wedding", question: "Are you planning a special event or wedding soon?", options: ["Wedding", "Birthday/Anniversary", "Corporate Event", "No upcoming events"] },
    { title: "Financial & Insurance", question: "What financial or insurance products are you reviewing?", options: ["Home/Auto Insurance", "Life/Health Insurance", "Investments/Mortgages", "None right now"] },
    { title: "Fitness & Training", question: "What is your primary fitness activity?", options: ["Gym Membership", "Personal Training", "Home Workouts", "Outdoor Sports"] },

    { title: "Food & Beverage", question: "How often do you dine out or order food delivery?", options: ["Daily", "Several times a week", "Weekly", "Rarely"] },
    { title: "Gaming & Esports", question: "Which gaming platform do you use most?", options: ["PC / Steam", "PlayStation / Xbox", "Nintendo Switch", "Mobile Gaming", "Non-gamer"] },
    { title: "FREE SPACE", question: "Claim your bonus entry for the $75,000 Grand Prize!", options: ["Claim Free Space"] },
    { title: "Health & Medical", question: "How often do you visit a healthcare professional?", options: ["Regular Checkups", "When Needed", "Rarely", "Never"] },
    { title: "Home & Garden", question: "Are you planning home improvement or gardening projects?", options: ["Within 3 months", "Within a year", "DIY projects", "No plans"] },

    { title: "Jewelry & Luxury", question: "When do you typically purchase luxury items or jewelry?", options: ["Special Milestones", "Holidays/Anniversaries", "Regular Investment", "Rarely"] },
    { title: "Legal & Professional", question: "Have you required legal or professional advisory services?", options: ["Business Advisory", "Personal/Family Legal", "Real Estate Conveyancing", "Not recently"] },
    { title: "Media & Entertainment", question: "Which entertainment service do you use daily?", options: ["Streaming (Netflix/HBO)", "Live Events/Concerts", "Cinema/Theatre", "Gaming / YouTube"] },
    { title: "Pet Care & Supplies", question: "What type of pets do you care for?", options: ["Dog(s)", "Cat(s)", "Birds/Fish/Reptiles", "No Pets"] },
    { title: "Real Estate & Property", question: "What is your current real estate interest?", options: ["Buying First Home", "Property Investment", "Renting", "Not looking"] },

    { title: "Renewable & Solar", question: "Are you interested in solar or energy efficiency upgrades?", options: ["Already Have Solar", "Planning to Install", "Exploring Options", "Not now"] },
    { title: "Security & Protection", question: "Do you use home or business security systems?", options: ["Smart Alarm / CCTV", "Monitored Security", "Basic Locks Only", "Planning Upgrade"] },
    { title: "Sports & Outdoor", question: "What outdoor or sporting gear do you purchase most?", options: ["Camping/Hiking", "Team Sports", "Water Sports / Cycling", "Rarely"] },
    { title: "Telecommunications", question: "How frequently do you upgrade your phone or internet plan?", options: ["Every Year", "Every 2-3 Years", "Only when broken", "Contract basis"] },
    { title: "Travel & Tourism", question: "What is your next dream travel destination?", options: ["International Luxury", "Domestic Roadtrip", "Beach Resort", "Adventure Cruise"] }
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
window.openBillboardQuestion = function(index, triggerUploadAfter = false) {
    const grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
    
    // If this square is already answered, skip question immediately
    if (grid[index] === 1) {
        console.log(`Billboard Game: Square ${index} already completed. Skipping question.`);
        if (triggerUploadAfter) {
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.click();
        }
        return;
    }

    const questionData = BILLBOARD_QUESTIONS[index];
    if (!questionData) {
        if (triggerUploadAfter) {
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.click();
        }
        return;
    }

    // Remove any existing modal
    const existingModal = document.getElementById('billboard-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = "billboard-modal";
    modal.className = "fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn";

    const escapedOptions = questionData.options.map(opt => {
        const safeOpt = opt.replace(/'/g, "\\'");
        return `
            <button onclick="submitBillboardAnswer(${index}, '${safeOpt}', ${triggerUploadAfter})" class="w-full text-left bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-[#FF3D00] hover:text-white hover:border-[#FF3D00] transition-all font-bold text-xs sm:text-sm text-zinc-200">
                ${opt}
            </button>
        `;
    }).join('');

    modal.innerHTML = `
        <div class="bg-zinc-900 border border-white/15 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] w-full max-w-md shadow-2xl animate-scaleIn text-left relative">
            <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <div class="w-10 h-10 bg-[#FF3D00] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF3D00]/30 flex-shrink-0">
                    <i data-lucide="${CATEGORY_ICONS[index] || 'help-circle'}" class="w-5 h-5 text-white"></i>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#FF3D00]">Industry Question</span>
                    <h3 class="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-tight">${questionData.title}</h3>
                </div>
            </div>
            
            <p class="text-zinc-300 mb-6 font-medium text-xs sm:text-sm leading-relaxed">${questionData.question}</p>
            
            <div class="space-y-2.5 sm:space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                ${escapedOptions}
            </div>
            
            <button onclick="document.getElementById('billboard-modal').remove()" class="w-full mt-4 sm:mt-5 text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-zinc-300 transition-colors py-2">
                Cancel / Choose Another Category
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) lucide.createIcons();
};

/**
 * Step 2: Submit Answer
 */
window.submitBillboardAnswer = function(index, answer, triggerUploadAfter = false) {
    console.log(`Billboard Game: Answer for square ${index}: ${answer}`);
    
    let grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
    if (grid.length !== 25) grid = Array(25).fill(0);
    grid[index] = 1;
    localStorage.setItem("billboard_grid", JSON.stringify(grid));
    localStorage.setItem("billboard_last_update", index.toString());

    // Save demographic shopping habit answer
    const shoppingHabits = JSON.parse(localStorage.getItem("shopping_habits") || "{}");
    const questionData = BILLBOARD_QUESTIONS[index];
    if (questionData) {
        shoppingHabits[questionData.title] = answer;
        localStorage.setItem("shopping_habits", JSON.stringify(shoppingHabits));
    }

    // Data Collection Hook: Sync with LeadGen strategy
    if (window.LeadGen && questionData) {
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
        window.NodeAPI.updateBillboard(grid, completedLines, shoppingHabits).catch(err => {
            console.error("GTSA Billboard: Failed to sync with backend", err);
        });
    }

    // If this answer was submitted during upload flow, automatically trigger file picker
    if (triggerUploadAfter) {
        setTimeout(() => {
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.click();
        }, 150);
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
    
    // Sync completed state to larger 25 category cards on page
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const idx = parseInt(card.getAttribute('data-index'));
        if (!isNaN(idx) && grid[idx] === 1) {
            card.classList.add('ring-1', 'ring-emerald-500/60', 'border-emerald-500/40');
            if (!card.querySelector('.completed-badge')) {
                const badge = document.createElement('div');
                badge.className = 'completed-badge absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-md';
                badge.innerHTML = '<i data-lucide="check" class="w-2.5 h-2.5 stroke-[3]"></i>';
                card.appendChild(badge);
            }
        }
    });
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
