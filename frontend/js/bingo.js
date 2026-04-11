/**
 * bingo.js - Professional Bingo Logic with Line Detection & Visual Highlighting
 */

const CATEGORY_ICONS = [
    'receipt', 'car', 'toy-brick', 'sparkles', 'users',
    'shopping-bag', 'graduation-cap', 'calendar-heart', 'landmark', 'dumbbell',
    'home', 'stethoscope', 'cpu', 'gavel', 'shirt',
    'smartphone', 'plane', 'dog', 'award', 'radio',
    'building', 'utensils', 'truck', 'hammer', 'flower'
];

function initBingo() {
    if (!localStorage.getItem("bingo_grid")) {
        let grid = Array(25).fill(0);
        localStorage.setItem("bingo_grid", JSON.stringify(grid));
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

    renderBingoGrid();
}

/**
 * Step 1: Upload -> Bingo fill (Supports specific index or random)
 */
function updateBingo(specificIndex = null) {
    let grid = JSON.parse(localStorage.getItem("bingo_grid"));
    let updatedIndex = -1;
    
    if (specificIndex !== null && specificIndex >= 0 && specificIndex < 25) {
        if (grid[specificIndex] === 1) {
            console.log("Category already filled, picking random next available...");
            specificIndex = null; 
        } else {
            grid[specificIndex] = 1;
            updatedIndex = specificIndex;
        }
    }

    if (specificIndex === null) {
        let empty = grid.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
        if (empty.length === 0) {
            checkFullCard(grid);
            return;
        }
        let rand = empty[Math.floor(Math.random() * empty.length)];
        grid[rand] = 1;
        updatedIndex = rand;
    }

    // Save the last updated index for a "pop" animation
    localStorage.setItem("bingo_last_update", updatedIndex.toString());
    localStorage.setItem("bingo_grid", JSON.stringify(grid));
    
    checkAndRewardLines(grid);
    renderBingoGrid();
    checkFullCard(grid);
}

/**
 * Step 2: Bingo -> Line detect
 */
function checkAndRewardLines(grid) {
    const lines = [];
    // Rows
    for (let r = 0; r < 5; r++) lines.push({ name: `Row ${r+1}`, indices: [r*5, r*5+1, r*5+2, r*5+3, r*5+4] });
    // Columns
    for (let c = 0; c < 5; c++) lines.push({ name: `Column ${c+1}`, indices: [c, c+5, c+10, c+15, c+20] });
    // Diagonals
    lines.push({ name: "Diagonal 1", indices: [0, 6, 12, 18, 24] });
    lines.push({ name: "Diagonal 2", indices: [4, 8, 12, 16, 20] });

    let alreadyRewarded = JSON.parse(localStorage.getItem("completed_lines") || "[]");
    
    lines.forEach(line => {
        const isComplete = line.indices.every(idx => grid[idx] === 1);
        if (isComplete && !alreadyRewarded.includes(line.name)) {
            triggerLineReward(`${line.name} COMPLETE +10 ENTRIES!`);
            alreadyRewarded.push(line.name);
        }
    });

    localStorage.setItem("completed_lines", JSON.stringify(alreadyRewarded));
}

/**
 * Step 3: Full Card Reset & Big Reward
 */
function checkFullCard(grid) {
    const isFull = grid.every(val => val === 1);
    if (isFull) {
        // Set flag to show reward after redirect
        localStorage.setItem("showFullCardReward", "true");
        archiveAndResetGrid(grid);
    }
}

function triggerFullCardReward(message) {
    const notification = document.createElement('div');
    notification.className = "fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md";
    notification.style.animation = "fadeIn 0.5s ease-out";
    
    // Inject styles for animation if not present
    if (!document.getElementById('bingo-animations')) {
        const style = document.createElement('style');
        style.id = 'bingo-animations';
        style.innerHTML = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes jackpotPop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }

    notification.innerHTML = `
        <div class="bg-gradient-to-b from-zinc-900 to-black text-white p-10 rounded-[3rem] border-2 border-yellow-400 shadow-[0_0_100px_rgba(255,180,0,0.3)] flex flex-col items-center text-center max-w-sm" style="animation: jackpotPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div class="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,180,0,0.5)]">
                <i data-lucide="party-popper" class="w-12 h-12 text-black"></i>
            </div>
            <h2 class="text-4xl font-black uppercase tracking-tighter mb-2 italic">FULL CARD!</h2>
            <p class="text-[#FF3D00] font-black uppercase tracking-[0.2em] mb-8 text-xs leading-relaxed">${message}</p>
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-white text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl">
                START NEW ROUND
            </button>
        </div>
    `;
    document.body.appendChild(notification);
    lucide.createIcons();
}

function archiveAndResetGrid(grid) {
    // Save last completed card for "Previous Card" feature
    localStorage.setItem("lastCompletedCard", JSON.stringify(grid));
    
    // Increment completed card count
    let count = parseInt(localStorage.getItem("cardsCompleted") || "0");
    localStorage.setItem("cardsCompleted", (count + 1).toString());

    // Reset current grid and rewards
    localStorage.setItem("bingo_grid", JSON.stringify(Array(25).fill(0)));
    localStorage.setItem("completed_lines", JSON.stringify([]));
    
    renderBingoGrid();
}

function triggerLineReward(message) {
    const notification = document.createElement('div');
    notification.className = "fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-lg";
    notification.innerHTML = `
        <div class="bg-gradient-to-r from-orange-600/90 to-red-600/90 backdrop-blur-md text-white px-8 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(255,61,0,0.4)] border-2 border-white/20 animate-bounce flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <i data-lucide="trophy" class="w-8 h-8 text-yellow-300"></i>
            </div>
            <div class="text-xl">BINGO SUCCESS</div>
            <div class="text-[10px] mt-2 opacity-80">${message}</div>
        </div>
    `;
    document.body.appendChild(notification);
    lucide.createIcons();
    setTimeout(() => {
        notification.classList.add('opacity-0', 'scale-95', 'translate-y-4');
        notification.style.transition = 'all 0.5s ease-in-out';
        setTimeout(() => notification.remove(), 500);
    }, 4500);
}

function renderBingoGrid() {
    const container = document.getElementById('bingo-container');
    if (!container) return;
    
    let grid = JSON.parse(localStorage.getItem("bingo_grid"));
    let alreadyRewarded = JSON.parse(localStorage.getItem("completed_lines") || "[]");
    let lastUpdate = parseInt(localStorage.getItem("bingo_last_update") || "-1");
    
    // Check which cells are part of a completed line for highlighting
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
    const roundIndicator = cardsCompleted !== "0" ? `<div class="absolute top-0 right-4 bg-yellow-400 text-black px-2 py-1 rounded-b-lg font-black text-[8px] uppercase tracking-tighter shadow-lg z-20">Round ${parseInt(cardsCompleted)+1}</div>` : '';

    container.className = "grid grid-cols-5 gap-2 max-w-[320px] mx-auto p-4 bg-zinc-950 border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden";
    
    container.innerHTML = roundIndicator + grid.map((val, i) => {
        const isHighlighted = highlightedIndices.has(i);
        const isNew = i === lastUpdate;
        const icon = CATEGORY_ICONS[i] || 'help-circle';
        
        return `
        <div class="aspect-square rounded-lg flex items-center justify-center text-[10px] font-black relative group
            ${val ? 'bg-gradient-to-br from-[#FF3D00] to-[#E63700] text-white shadow-[0_4px_12px_rgba(255,61,0,0.6)]' : 'bg-zinc-900/50 text-zinc-600 border border-white/10'} 
            ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-950 z-10' : ''}
            ${isNew ? 'animate-bounce ring-2 ring-white scale-110 z-20' : ''}
            transition-all duration-500 hover:scale-110 hover:border-[#FF3D00]/30 shadow-inner">
            ${val ? `<i data-lucide="${icon}" class="w-6 h-6 opacity-40 absolute"></i><span class="relative z-10 text-lg">★</span>` : `<i data-lucide="${icon}" class="w-5 h-5 opacity-30"></i>`}
            ${isHighlighted ? '<div class="absolute inset-0 bg-yellow-400/20 rounded-lg animate-pulse"></div>' : ''}
        </div>
    `}).join('');
    
    // Clear last update after rendering once to stop animation on next load
    localStorage.setItem("bingo_last_update", "-1");
    
    if (window.lucide) lucide.createIcons();
}


