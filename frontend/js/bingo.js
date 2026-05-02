/**
 * billboard.js - Professional Billboard Game Logic with Line Detection & Visual Highlighting
 */

const CATEGORY_ICONS = [
    'receipt', 'car', 'toy-brick', 'sparkles', 'users',
    'shopping-bag', 'graduation-cap', 'calendar-heart', 'landmark', 'dumbbell',
    'home', 'stethoscope', 'cpu', 'gavel', 'shirt',
    'smartphone', 'plane', 'dog', 'award', 'radio',
    'building', 'utensils', 'truck', 'hammer', 'flower'
];

const BILLBOARD_QUESTIONS = [
    { title: "Accounting & Tax", question: "Have you used Accounting or Tax services this year?", options: ["Yes", "No", "Planning to"] },
    { title: "Automotive Services", question: "Have you serviced your car recently?", options: ["Yes, recently", "No", "Planning soon"] },
    { title: "Baby & Toys", question: "Have you purchased Baby or Toy products recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Beauty & Cosmetic", question: "Have you purchased Beauty or Cosmetic products in the last 3 months?", options: ["Yes", "No", "Planning to"] },
    { title: "Childcare & Aged Care", question: "Have you used Childcare or Aged Care services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Dept Stores & Electrical", question: "Have you shopped at a Department or Electrical store recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Education & Tutoring", question: "Have you used Education or Tutoring services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Events & Wedding", question: "Have you used Wedding or Event services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Financial & Insurance", question: "Have you reviewed your Financial or Insurance services recently?", options: ["Yes", "No", "Planning soon"] },
    { title: "Fitness & Training", question: "Have you used Fitness or Personal Training services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Home & Garden", question: "Have you purchased Home or Garden items recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Health & Medical", question: "Have you used Health or Medical services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "IT & Tech", question: "Have you purchased IT or Tech services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Legal Services", question: "Have you used Legal services recently?", options: ["Yes", "No", "Planning soon"] },
    { title: "Lifestyle & Apparel", question: "Have you purchased Lifestyle or Apparel items in the last 3 months?", options: ["Yes", "No", "Planning to"] },
    { title: "Mobile & Internet", question: "Have you reviewed your Mobile or Internet plan recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Travel", question: "Have you purchased Travel services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Pets & Animals", question: "Have you purchased Pet or Animal products recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Professional Training", question: "Have you used Professional Training services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Radio & TV", question: "Do you consume Radio or TV advertising regularly?", options: ["Yes", "Sometimes", "Rarely"] },
    { title: "Real Estate", question: "Have you used Real Estate services recently?", options: ["Yes", "No", "Planning soon"] },
    { title: "Restaurants & Food", question: "Have you purchased Food or Beverage items recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Logistics & Storage", question: "Have you used Logistics or Storage services recently?", options: ["Yes", "No", "Planning soon"] },
    { title: "Trades & Home Services", question: "Have you used Trades or Home Services recently?", options: ["Yes", "No", "Planning to"] },
    { title: "Funeral & Support", question: "Have you used Funeral or Support services recently?", options: ["Yes", "No", "Planning to"] }
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

    container.className = "grid grid-cols-5 gap-2 sm:gap-3 max-w-[400px] mx-auto p-4 sm:p-6 bg-zinc-900/50 border border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden backdrop-blur-sm min-h-[300px]";
    
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
        const path = window.location.pathname;
        const willRedirect = path.includes("upload") || path.includes("instagram");
        
        if (!willRedirect) {
            let grid = JSON.parse(localStorage.getItem("billboard_grid") || "[]");
            if (grid.length === 0) grid = Array(25).fill(0);
            let empty = grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
            if (empty.length > 0) {
                let rand = empty[Math.floor(Math.random() * empty.length)];
                console.log("Billboard Game: Opening random question for square", rand);
                openBillboardQuestion(rand);
            }
        } else {
            console.log("Billboard Game: Skipping random question due to potential redirect.");
        }
    }
}
