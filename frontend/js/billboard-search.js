/**
 * billboard-search.js - Handles the "SCAN MORE & DOUBLE YOUR LUCK" search functionality.
 */
(function() {
    function initSearch() {
        const searchBtn = document.getElementById('scan-more-search-btn');
        const resultBox = document.getElementById('scan-more-result');
        const countryInp = document.getElementById('scan-more-country');
        const postcodeInp = document.getElementById('scan-more-postcode');
        const stateInp = document.getElementById('scan-more-state');
        const stateDropdown = document.getElementById('scan-more-state-dropdown');
        const sectorInp = document.getElementById('scan-more-sector');

        if (!searchBtn || !resultBox) {
            console.warn("Billboard Search: UI elements not found. Retrying in 500ms...");
            setTimeout(initSearch, 500);
            return;
        }

        console.log("Billboard Search: Handler attached");

        // Auto-detect State/Region from Postcode
        if (postcodeInp) {
            postcodeInp.addEventListener('input', async (e) => {
                const pc = e.target.value.trim();
                const country = countryInp?.value || 'US';

                if (pc.length >= 4) {
                    try {
                        const resp = await fetch(`https://api.zippopotam.us/${country.toLowerCase()}/${pc}`);
                        if (resp.ok) {
                            const data = await resp.json();
                            if (data.places && data.places.length > 0) {
                                const p = data.places[0];
                                const city = p['place name'];
                                const stateName = p['state'] || city;

                                if (stateDropdown && !stateDropdown.classList.contains('hidden')) {
                                    const option = Array.from(stateDropdown.options).find(opt => opt.text.includes(stateName) || stateName.includes(opt.text));
                                    if (option) stateDropdown.value = option.value;
                                    else if (stateInp) stateInp.value = stateName;
                                } else if (stateInp) {
                                    stateInp.value = stateName;
                                }

                                resultBox.textContent = `📍 Location: ${city}, ${country}`;
                                resultBox.style.color = '#4ade80';
                            }
                        }
                    } catch (err) {
                        console.warn("Location lookup failed", err);
                    }
                }
            });
        }

        searchBtn.addEventListener('click', async () => {
            const pc = postcodeInp.value.trim();
            const countryVal = countryInp.value;
            const sectorVal = sectorInp?.value;

            console.log("Billboard Search: Clicked", { pc, countryVal, sectorVal });

            if (!pc) {
                resultBox.textContent = 'Enter Post Code first';
                resultBox.style.color = '#ef4444';
                return;
            }

            const originalText = searchBtn.innerText;
            searchBtn.innerText = 'Locating...';
            searchBtn.disabled = true;
            resultBox.textContent = 'Verifying with database...';
            resultBox.style.color = '#a1a1aa';

            try {
                const params = {
                    postal_codes: pc,
                    active_only: 'true'
                };
                if (sectorVal && sectorVal !== 'All Sectors') params.sector = sectorVal;
                if (countryVal) params.country = countryVal;
                
                const stateVal = (stateDropdown && !stateDropdown.classList.contains('hidden')) 
                    ? stateDropdown.value 
                    : stateInp?.value;
                if (stateVal) params.state = stateVal;

                console.log("Billboard Search: Calling NodeAPI.searchBillboards", params);
                
                if (!window.NodeAPI) {
                    throw new Error("NodeAPI not initialized");
                }

                const results = await window.NodeAPI.searchBillboards(params);
                console.log("Billboard Search: Results", results);

                if (results && results.total > 0) {
                    const count = results.total;
                    resultBox.textContent = `Found ${count} Active Billboard${count > 1 ? 's' : ''}!`;
                    resultBox.style.color = '#4ade80';

                    if (window.showPremiumToast) {
                        window.showPremiumToast(`Found ${count} active matches in ${pc}!`, "success");
                    }
                } else {
                    resultBox.textContent = 'No active billboards found here yet.';
                    resultBox.style.color = '#bc13fe';
                }
            } catch (e) {
                console.error("Search Error:", e);
                resultBox.textContent = 'Search service unavailable';
                resultBox.style.color = '#ef4444';
            } finally {
                searchBtn.innerText = originalText;
                searchBtn.disabled = false;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
