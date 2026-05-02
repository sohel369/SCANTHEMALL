/**
 * upload.js - Premium Image Preview & Upload System
 */

let selectedCategoryIndex = null;

function initUpload() {
    const btn = document.querySelector(".upload-zone button, [data-action='upload']");
    const fileInput = document.getElementById('image-upload');
    const categoryGrid = document.getElementById('category-grid');

    if (!btn || !fileInput) return;

    // Handle Category Selection
    if (categoryGrid) {
        const cards = categoryGrid.querySelectorAll('.category-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active from others
                cards.forEach(c => c.classList.remove('ring-2', 'ring-[#e11d48]', 'scale-105', 'bg-[#e11d48]/10'));
                // Add to this
                card.classList.add('ring-2', 'ring-[#e11d48]', 'scale-105', 'bg-[#e11d48]/10');
                selectedCategoryIndex = parseInt(card.getAttribute('data-index'));
                console.log("Selected Category Index:", selectedCategoryIndex);

                // Scroll to upload zone for better UX
                const uploadZone = document.querySelector('.upload-zone');
                if (uploadZone) uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // Trigger file picker
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            showPreview(file);
        }
    });

    createPreviewModal();
}

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewModal = document.getElementById('upload-preview-modal');
        const previewImg = document.getElementById('preview-img');
        if (previewImg && previewModal) {
            previewImg.src = e.target.result;
            previewModal.classList.remove('hidden');
            setTimeout(() => previewModal.classList.add('opacity-100'), 10);
        }
    };
    reader.readAsDataURL(file);
}

async function finalizeUpload() {
    const modal = document.getElementById('upload-preview-modal');
    const confirmBtn = document.getElementById('confirm-finalize-btn');
    const fileInput = document.getElementById('image-upload');

    if (!confirmBtn || !fileInput || !fileInput.files[0]) {
        alert("Please select a file first.");
        return;
    }

    console.log("GTSA: Finalizing upload. Checking session...");
    
    // Check global NodeAPI availability
    const api = window.NodeAPI || (typeof NodeAPI !== 'undefined' ? NodeAPI : null);
    
    if (!api || !api.isAuthenticated()) {
        console.warn("GTSA: Auth check failed. NodeAPI available:", !!api);
        alert("Session expired. Please log in to complete your upload.");
        window.location.href = "log_in_page_advertising_placeholder.html";
        return;
    }

    confirmBtn.innerText = "Processing...";
    confirmBtn.disabled = true;

    try {
        const file = fileInput.files[0];
        const params = new URLSearchParams(window.location.search);
        let platform = params.get('platform') || 'scanthemall';
        if (platform.toLowerCase() === 'stamy') platform = 'scanthemall';

        const formData = new FormData();
        formData.append('image', file);
        formData.append('platform', platform);
        // Add other required fields for the backend
        formData.append('tag_count', '0'); 

        console.log(`Starting upload for platform: ${platform}`);
        const result = await api.uploadImage(formData);
        console.log("Upload Success:", result);

        // Update Billboard Game if a category was selected
        if (typeof window.updateBillboard === 'function') {
            console.log(`GTSA Billboard Game: Updating square for category index: ${selectedCategoryIndex}`);
            window.updateBillboard(selectedCategoryIndex);
        } else {
            console.warn("GTSA Billboard Game: updateBillboard function not found!");
        }

        // Update local session counter
        let count = parseInt(localStorage.getItem("total_uploads") || "0");
        localStorage.setItem("total_uploads", count + 1);

        confirmBtn.innerText = "Verified!";
        setTimeout(() => {
            modal.classList.add('hidden');
            // Redirect with a flag to show success message on the next page
            window.location.href = "successful_upload.html?platform=" + platform + "&billboardUpdate=true";
        }, 1500);

    } catch (error) {
        console.error("Upload Error:", error);
        alert("Upload Failed: " + error.message);
        confirmBtn.innerText = "Verify & Sync";
        confirmBtn.disabled = false;
    }
}

function createPreviewModal() {
    if (document.getElementById('upload-preview-modal')) return;

    const modalHtml = `
        <div id="upload-preview-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl hidden opacity-0 transition-all duration-300 overflow-y-auto">
            <div class="bg-zinc-900 w-full max-w-sm rounded-[2.5rem] border border-zinc-800 p-8 text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] my-auto">
                <h3 class="text-xl font-bold mb-6 uppercase tracking-wider text-white">Preview Screenshot</h3>
                <div class="w-full bg-black rounded-3xl overflow-hidden mb-8 border border-zinc-800 relative shadow-2xl max-h-[60vh]">
                    <img id="preview-img" src="" class="w-full h-auto object-contain" />
                    <div class="absolute inset-x-0 h-1 bg-[#FF3D00] shadow-[0_0_20px_#FF3D00] animate-[scan_3s_infinite_linear]"></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="document.getElementById('upload-preview-modal').classList.add('hidden')" class="px-6 py-4 rounded-xl border border-zinc-800 text-zinc-400 font-bold hover:bg-zinc-800 transition-colors uppercase text-[10px] tracking-widest">Cancel</button>
                    <button id="confirm-finalize-btn" onclick="finalizeUpload()" class="px-6 py-4 rounded-xl bg-[#FF3D00] text-white font-bold shadow-xl hover:shadow-[#FF3D00]/20 transition-all uppercase text-[10px] tracking-widest">Verify & Sync</button>
                </div>
            </div>
            <style>
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            </style>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}
