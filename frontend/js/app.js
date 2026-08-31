/**
 * app.js - Main Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("App Loaded - GTSA Initializing Modules");

    // --- Page-Specific Initializations (Task: Prevent Conflicts) ---
    const path = window.location.pathname;

    // A. Instagram / Upload Page (Upload logic + Bingo results + Ads)
    if (path.includes("instagram_upload_page") || path.includes("upload")) {
        console.log("GTSA: Upload logic active");
        if (typeof initUpload === 'function') initUpload();
    }

    // Initialize Billboard Game if container exists
    if (document.getElementById('bingo-container')) {
        console.log("GTSA: Billboard Game detected, initializing...");
        if (typeof initBillboard === 'function') initBillboard();
    }

    if (path.includes("instagram_upload_page") || path.includes("upload") || document.getElementById('ad-container')) {
        if (typeof initAds === 'function') initAds();
    }

    // B. Global Ad Rotation (Task: Standardize across all pages)
    if (document.querySelectorAll(".ad-placeholder").length > 0) {
        console.log("GTSA: Ad Module Active");
        if (typeof initAds === 'function') initAds();
    }

    // C. Register Page (User Creation)
    if (path.includes("registration") || path.includes("welcome")) {
        console.log("GTSA: Registration Handler Active");
    }

    // Finalize all alerts replacement
    function showPremiumToast(message, type = "success") {
        const toast = document.createElement('div');
        toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-sm";
        const icon = type === "success" ? "check-circle" : "alert-circle";
        const gradient = type === "success" ? "from-green-600/90 to-emerald-600/90" : "from-red-600/90 to-orange-600/90";
        
        toast.innerHTML = `
            <div class="bg-gradient-to-r ${gradient} backdrop-blur-xl text-white px-6 py-4 rounded-2xl font-bold border border-white/20 shadow-2xl flex items-center space-x-4 animate-bounce">
                <i data-lucide="${icon}" class="w-6 h-6"></i>
                <span class="text-sm tracking-wide uppercase">${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // 2. Registration and Entry Form Logic (DEPRECATED: Use page-specific modules for auth)
    // --- Removed redundant handler to prevent session key conflicts ---

    // Export to global scope for other scripts
    window.showPremiumToast = showPremiumToast;

    // 3. Fix Internal Links for Local Browsing (Remap absolute to relative .html)
    const links = document.querySelectorAll('a[href*="scanthemall.com"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Match scanthemall.com/endpoint to local endpoint.html
        const mapping = {
            'index': 'index.html',
            'welcome': 'GTSA_FInal_Welcome_Page_(About_US).html',
            'prizes': 'prize.html',
            'analysis': 'position.html',
            'register': 'registration_with_video.html',
            'blog': 'blog.html',
            'contact': 'Final_contact_page.html',
            'privacy': 'privacy.html',
            'terms': 'GTSA Final Terms No Advertising.html'
        };

        for (const [key, val] of Object.entries(mapping)) {
            if (href.endsWith(key)) {
                link.setAttribute('href', val);
                break;
            }
        }
    });

    // 4. Global Location System (Country, State, Area Code, Country Code)
    const countryEl = document.getElementById('country') || document.getElementById('countrySelect');
    const stateEl = document.getElementById('state') || document.getElementById('stateSelect');
    const areaEl = document.getElementById('area-code') || document.getElementById('areaCode');
    const countryCodeEl = document.getElementById('country-code') || document.getElementById('countryCode');
    const postalEl = document.getElementById('postal') || document.getElementById('postalCode');

    if (countryEl && stateEl) {
        const locationData = {
            "USA": {
                code: "+1",
                areas: ["212 (New York)", "310 (Los Angeles)", "415 (San Francisco)", "312 (Chicago)", "713 (Houston)", "305 (Miami)", "206 (Seattle)", "404 (Atlanta)", "617 (Boston)", "214 (Dallas)", "303 (Denver)", "215 (Philadelphia)", "615 (Nashville)", "704 (Charlotte)", "602 (Phoenix)", "702 (Las Vegas)", "503 (Portland)", "801 (Salt Lake City)", "703 (Virginia)", "614 (Columbus)"],
                states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
            },
            "UK": {
                code: "+44",
                areas: ["020 (London)", "0121 (Birmingham)", "0113 (Leeds)", "0161 (Manchester)", "0131 (Edinburgh)", "0141 (Glasgow)", "0151 (Liverpool)", "0117 (Bristol)", "029 (Cardiff)", "028 (Belfast)", "0114 (Sheffield)", "0191 (Newcastle)", "0115 (Nottingham)", "01865 (Oxford)", "01223 (Cambridge)"],
                states: ["England", "Scotland", "Wales", "Northern Ireland", "Greater London", "West Midlands", "Greater Manchester", "West Yorkshire", "Hampshire", "Kent"]
            },
            "Canada": {
                code: "+1",
                areas: ["416 (Toronto)", "647 (Toronto)", "604 (Vancouver)", "778 (Vancouver)", "514 (Montreal)", "438 (Montreal)", "403 (Calgary)", "780 (Edmonton)", "613 (Ottawa)", "204 (Winnipeg)", "902 (Halifax)", "418 (Quebec City)", "306 (Saskatchewan)", "709 (Newfoundland)", "867 (Territories)"],
                states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"]
            },
            "Australia": {
                code: "+61",
                areas: ["02 (New South Wales / ACT)", "03 (Victoria / Tasmania)", "07 (Queensland)", "08 (Western Australia / South Australia / NT)", "04 (Mobile)"],
                states: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"]
            },
            "Germany": {
                code: "+49",
                areas: ["030 (Berlin)", "040 (Hamburg)", "089 (Munich)", "069 (Frankfurt)", "0221 (Cologne)", "0711 (Stuttgart)", "0211 (Düsseldorf)", "0341 (Leipzig)", "0231 (Dortmund)", "0421 (Bremen)", "0511 (Hannover)", "0911 (Nuremberg)", "0201 (Essen)", "0351 (Dresden)", "0621 (Mannheim)", "0721 (Karlsruhe)", "0228 (Bonn)", "0251 (Münster)", "0821 (Augsburg)", "0611 (Wiesbaden)"],
                states: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"]
            },
            "France": {
                code: "+33",
                areas: ["01 (Île-de-France / Paris)", "02 (Northwest France)", "03 (Northeast France)", "04 (Southeast France / Marseille)", "05 (Southwest France / Bordeaux)", "06 (Mobile)", "07 (Mobile)", "09 (National VoIP)"],
                states: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"]
            },
            "Spain": {
                code: "+34",
                areas: ["91 (Madrid)", "93 (Barcelona)", "96 (Valencia)", "95 (Seville / Andalusia)", "94 (Bilbao / Basque)", "981 (A Coruña)", "976 (Zaragoza)", "958 (Granada)", "968 (Murcia)", "971 (Balearic Islands)", "928 (Las Palmas)", "922 (Tenerife)", "942 (Santander)", "945 (Vitoria-Gasteiz)"],
                states: ["Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and León", "Castilla-La Mancha", "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencia"]
            },
            "Italy": {
                code: "+39",
                areas: ["06 (Rome)", "02 (Milan)", "081 (Naples)", "011 (Turin)", "055 (Florence)", "051 (Bologna)", "091 (Palermo)", "010 (Genoa)", "041 (Venice)", "070 (Cagliari)", "080 (Bari)", "095 (Catania)", "049 (Padua)", "085 (Pescara)", "071 (Ancona)", "0965 (Reggio Calabria)"],
                states: ["Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Sardinia", "Sicily", "Trentino-South Tyrol", "Tuscany", "Umbria", "Veneto"]
            },
            "Ireland": {
                code: "+353",
                areas: ["01 (Dublin)", "021 (Cork)", "061 (Limerick)", "091 (Galway)", "051 (Waterford)", "071 (Sligo)", "045 (Kildare)", "059 (Carlow)", "065 (Clare)", "074 (Donegal)", "046 (Meath)", "083 (Mobile)", "085 (Mobile)", "087 (Mobile)"],
                states: ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"]
            },
            "Portugal": {
                code: "+351",
                areas: ["21 (Lisbon)", "22 (Porto)", "289 (Faro / Algarve)", "239 (Coimbra)", "253 (Braga)", "234 (Aveiro)", "291 (Funchal / Madeira)", "296 (Ponta Delgada / Azores)", "265 (Setúbal)", "266 (Évora)", "272 (Castelo Branco)", "271 (Guarda)", "259 (Vila Real)", "273 (Bragança)"],
                states: ["Aveiro", "Azores", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro (Algarve)", "Guarda", "Leiria", "Lisbon", "Madeira", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"]
            },
            "New Zealand": {
                code: "+64",
                areas: ["09 (Auckland / Northland)", "03 (Christchurch / South Island)", "04 (Wellington)", "07 (Waikato / Bay of Plenty)", "06 (Taranaki / Hawke's Bay / Manawatu)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                states: ["Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay", "Manawatū-Whanganui", "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Tasman", "Waikato", "Wellington", "West Coast"]
            },
            "Netherlands": {
                code: "+31",
                areas: ["020 (Amsterdam)", "010 (Rotterdam)", "070 (The Hague)", "030 (Utrecht)", "040 (Eindhoven)", "050 (Groningen)", "013 (Tilburg)", "076 (Breda)", "024 (Nijmegen)", "026 (Arnhem)", "072 (Alkmaar)", "038 (Zwolle)", "043 (Maastricht)", "06 (Mobile)"],
                states: ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"]
            },
            "Sweden": {
                code: "+46",
                areas: ["08 (Stockholm)", "031 (Gothenburg)", "040 (Malmö)", "018 (Uppsala)", "019 (Örebro)", "013 (Linköping)", "046 (Lund)", "090 (Umeå)", "060 (Sundsvall)", "036 (Jönköping)", "033 (Borås)", "016 (Eskilstuna)", "021 (Västerås)", "042 (Helsingborg)", "070 (Mobile)"],
                states: ["Blekinge", "Dalarna", "Gotland", "Gävleborg", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Skåne", "Stockholm", "Södermanland", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland", "Örebro", "Östergötland"]
            },
            "Austria": {
                code: "+43",
                areas: ["01 (Vienna)", "0316 (Graz)", "0732 (Linz)", "0662 (Salzburg)", "0512 (Innsbruck)", "0463 (Klagenfurt)", "02742 (St. Pölten)", "02682 (Eisenstadt)", "05574 (Bregenz)", "07242 (Wels)", "04242 (Villach)", "0664 (Mobile)"],
                states: ["Burgenland", "Carinthia", "Lower Austria", "Salzburg", "Styria", "Tyrol", "Upper Austria", "Vienna", "Vorarlberg"]
            },
            "Poland": {
                code: "+48",
                areas: ["22 (Warsaw)", "12 (Krakow)", "71 (Wroclaw)", "61 (Poznan)", "58 (Gdansk)", "42 (Lodz)", "32 (Katowice)", "81 (Lublin)", "91 (Szczecin)", "85 (Bialystok)", "52 (Bydgoszcz)", "17 (Rzeszow)", "34 (Czestochowa)", "89 (Olsztyn)"],
                states: ["Greater Poland", "Kuyavian-Pomeranian", "Lesser Poland", "Lodz", "Lower Silesian", "Lublin", "Lubusz", "Masovian", "Opole", "Podlaskie", "Pomeranian", "Silesian", "Subcarpathian", "Holy Cross", "Warmian-Masurian", "West Pomeranian"]
            },
            "Brazil": {
                code: "+55",
                areas: ["11 (São Paulo)", "21 (Rio de Janeiro)", "31 (Belo Horizonte)", "41 (Curitiba)", "51 (Porto Alegre)", "61 (Brasília)", "71 (Salvador)", "81 (Recife)", "85 (Fortaleza)", "62 (Goiânia)", "19 (Campinas)", "27 (Vitória)", "48 (Florianópolis)", "91 (Belém)", "92 (Manaus)"],
                states: ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"]
            },
            "Mexico": {
                code: "+52",
                areas: ["55 (Mexico City)", "33 (Guadalajara)", "81 (Monterrey)", "664 (Tijuana)", "998 (Cancun)", "222 (Puebla)", "442 (Querétaro)", "477 (León)", "656 (Ciudad Juárez)", "999 (Mérida)", "614 (Chihuahua)", "844 (Saltillo)", "744 (Acapulco)"],
                states: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico City", "Mexico State", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"]
            },
            "Turkey": {
                code: "+90",
                areas: ["212 (Istanbul Europe)", "216 (Istanbul Asia)", "312 (Ankara)", "232 (Izmir)", "224 (Bursa)", "242 (Antalya)", "322 (Adana)", "342 (Gaziantep)", "352 (Kayseri)", "422 (Malatya)", "362 (Samsun)", "462 (Trabzon)", "258 (Denizli)", "262 (Kocaeli)"],
                states: ["Adana", "Ankara", "Antalya", "Aydın", "Balıkesir", "Bursa", "Denizli", "Diyarbakır", "Eskişehir", "Gaziantep", "Hatay", "Istanbul", "Izmir", "Kayseri", "Kocaeli", "Konya", "Malatya", "Manisa", "Mersin", "Muğla", "Sakarya", "Samsun", "Tekirdağ", "Trabzon", "Şanlıurfa"]
            },
            "South Korea": {
                code: "+82",
                areas: ["02 (Seoul)", "051 (Busan)", "053 (Daegu)", "032 (Incheon)", "062 (Gwangju)", "042 (Daejeon)", "052 (Ulsan)", "044 (Sejong)", "031 (Gyeonggi)", "033 (Gangwon)", "043 (Chungbuk)", "041 (Chungnam)", "063 (Jeonbuk)", "061 (Jeonnam)", "054 (Gyeongbuk)", "055 (Gyeongnam)", "064 (Jeju)", "010 (Mobile)"],
                states: ["Busan", "Chungcheongbuk-do", "Chungcheongnam-do", "Daegu", "Daejeon", "Gangwon-do", "Gwangju", "Gyeonggi-do", "Gyeongsangbuk-do", "Gyeongsangnam-do", "Incheon", "Jeju-do", "Jeollabuk-do", "Jeollanam-do", "Sejong", "Seoul", "Ulsan"]
            }
        };

        // Populate Countries if empty
        if (countryEl.options.length <= 1) {
            Object.keys(locationData).sort().forEach(country => {
                const opt = document.createElement('option');
                opt.value = country;
                opt.innerText = country;
                countryEl.appendChild(opt);
            });
        }

        const phoneEl = document.querySelector('input[name="Phone"]');

        function setDependentFieldsEnabled(enabled) {
            if (stateEl) {
                stateEl.disabled = !enabled;
                stateEl.style.opacity = enabled ? '1' : '0.4';
                stateEl.style.cursor = enabled ? 'pointer' : 'not-allowed';
                if (!enabled) {
                    stateEl.innerHTML = '<option value="" selected>Select Country First</option>';
                    stateEl.value = "";
                }
            }

            if (phoneEl) {
                phoneEl.disabled = !enabled;
                phoneEl.style.opacity = enabled ? '1' : '0.4';
                phoneEl.style.cursor = enabled ? 'pointer' : 'not-allowed';
                phoneEl.placeholder = enabled ? "Phone Number" : "Select Country First";
                if (!enabled) phoneEl.value = "";
            }

            if (areaEl) {
                areaEl.disabled = !enabled;
                areaEl.style.opacity = enabled ? '1' : '0.4';
                areaEl.style.cursor = enabled ? 'pointer' : 'not-allowed';
                if (!enabled) {
                    areaEl.innerHTML = '<option value="" selected>Select Country First</option>';
                    areaEl.value = "";
                }
            }

            if (countryCodeEl) {
                if (!enabled) countryCodeEl.value = "";
            }
        }

        // Force reset and disable fields on initial page load
        if (countryEl) {
            countryEl.value = "";
            countryEl.selectedIndex = 0;
        }
        setDependentFieldsEnabled(false);

        // Country Phone Format Rules & Validation
        const PHONE_RULES = {
            "Australia": { code: "+61", digits: 9, minDigits: 9, maxDigits: 10, placeholder: "e.g. 412 345 678 (9 digits)" },
            "USA": { code: "+1", digits: 10, minDigits: 10, maxDigits: 10, placeholder: "e.g. 555 019 2834 (10 digits)" },
            "Canada": { code: "+1", digits: 10, minDigits: 10, maxDigits: 10, placeholder: "e.g. 416 555 0192 (10 digits)" },
            "UK": { code: "+44", minDigits: 10, maxDigits: 11, placeholder: "e.g. 7123 456789 (10-11 digits)" },
            "Germany": { code: "+49", minDigits: 10, maxDigits: 11, placeholder: "e.g. 15123456789" },
            "France": { code: "+33", digits: 9, minDigits: 9, maxDigits: 9, placeholder: "e.g. 612345678 (9 digits)" },
            "Spain": { code: "+34", digits: 9, minDigits: 9, maxDigits: 9, placeholder: "e.g. 612345678 (9 digits)" },
            "Italy": { code: "+39", minDigits: 9, maxDigits: 10, placeholder: "e.g. 3123456789" },
            "New Zealand": { code: "+64", minDigits: 8, maxDigits: 10, placeholder: "e.g. 212345678" }
        };

        function getPhoneRule(countryName) {
            const normalized = countryName === 'AUS' ? 'Australia' : 
                               countryName === 'CAN' ? 'Canada' : 
                               countryName === 'UK' ? 'UK' : countryName;
            return PHONE_RULES[normalized] || { minDigits: 8, maxDigits: 12, placeholder: "Enter valid phone number" };
        }

        // Remove any old phone error element if present
        const existingPhoneErr = document.getElementById('phone-error-msg');
        if (existingPhoneErr) existingPhoneErr.remove();

        function showPhoneError(msg) {
            if (phoneEl) {
                phoneEl.style.borderColor = '#ef4444';
            }
            if (typeof showPremiumToast === 'function') {
                showPremiumToast(msg, 'error');
            }
        }

        function clearPhoneError() {
            const errEl = document.getElementById('phone-error-msg');
            if (errEl) errEl.remove();
            if (phoneEl) {
                phoneEl.style.borderColor = '';
            }
        }

        // Real-time validation as user types
        if (phoneEl) {
            phoneEl.addEventListener('input', () => {
                const selectedCountry = countryEl ? countryEl.value : '';
                if (!selectedCountry) return;

                const rawDigits = phoneEl.value.replace(/\D/g, '');
                const rule = getPhoneRule(selectedCountry);

                if (!rawDigits) {
                    clearPhoneError();
                    return;
                }

                if (rawDigits.length > rule.maxDigits) {
                    phoneEl.style.borderColor = '#ef4444';
                } else {
                    phoneEl.style.borderColor = '';
                }
            });

            phoneEl.addEventListener('blur', () => {
                const selectedCountry = countryEl ? countryEl.value : '';
                if (!selectedCountry || !phoneEl.value.trim()) { clearPhoneError(); return; }
                const rawDigits = phoneEl.value.replace(/\D/g, '');
                const rule = getPhoneRule(selectedCountry);
                const exactMatch = rule.digits && rawDigits.length !== rule.digits;
                const rangeMatch = !rule.digits && rule.minDigits && (rawDigits.length < rule.minDigits || rawDigits.length > rule.maxDigits);
                if (exactMatch || rangeMatch) {
                    phoneEl.style.borderColor = '#ef4444';
                } else {
                    phoneEl.style.borderColor = '';
                }
            });
        }

        function validatePhoneNumber(phoneInput, selectedCountry) {
            if (!phoneInput || !selectedCountry) return true;
            const rawDigits = phoneInput.value.replace(/\D/g, '');
            const rule = getPhoneRule(selectedCountry);

            if (!rawDigits) {
                showPhoneError(`Phone number is required for ${selectedCountry}.`);
                if (phoneInput) phoneInput.focus();
                return false;
            }

            const exactMatch = rule.digits && rawDigits.length !== rule.digits;
            const rangeMatch = !rule.digits && rule.minDigits && (rawDigits.length < rule.minDigits || rawDigits.length > rule.maxDigits);

            if (exactMatch) {
                showPhoneError(`Invalid ${selectedCountry} number — exactly ${rule.digits} digits needed.`);
                if (phoneInput) phoneInput.focus();
                return false;
            }

            if (rangeMatch) {
                showPhoneError(`Invalid ${selectedCountry} number — must be ${rule.minDigits}–${rule.maxDigits} digits.`);
                if (phoneInput) phoneInput.focus();
                return false;
            }

            clearPhoneError();
            return true;
        }

        window.validatePhoneNumber = validatePhoneNumber;

        // State-to-Areas Precise Mapping (Strictly state/region based)
        const stateAreasMap = {
            "Germany": {
                "Bavaria": ["089 (Munich)", "0911 (Nuremberg)", "0821 (Augsburg)", "0931 (Würzburg)", "0941 (Regensburg)", "0841 (Ingolstadt)", "0951 (Bamberg)", "0871 (Landshut)"],
                "Berlin": ["030 (Berlin)"],
                "Hamburg": ["040 (Hamburg)"],
                "Hesse": ["069 (Frankfurt)", "0611 (Wiesbaden)", "0561 (Kassel)", "06151 (Darmstadt)", "0641 (Gießen)", "0661 (Fulda)", "06181 (Hanau)"],
                "North Rhine-Westphalia": ["0221 (Cologne)", "0211 (Düsseldorf)", "0231 (Dortmund)", "0201 (Essen)", "0228 (Bonn)", "0251 (Münster)", "0202 (Wuppertal)", "0209 (Gelsenkirchen)", "0241 (Aachen)", "02161 (Mönchengladbach)", "0203 (Duisburg)", "0234 (Bochum)", "0521 (Bielefeld)"],
                "Baden-Württemberg": ["0711 (Stuttgart)", "0621 (Mannheim)", "0721 (Karlsruhe)", "0761 (Freiburg)", "06221 (Heidelberg)", "07131 (Heilbronn)", "0731 (Ulm)", "07231 (Pforzheim)", "07071 (Tübingen)", "07531 (Konstanz)"],
                "Saxony": ["0341 (Leipzig)", "0351 (Dresden)", "0371 (Chemnitz)", "0375 (Zwickau)", "03581 (Görlitz)", "03741 (Plauen)"],
                "Lower Saxony": ["0511 (Hannover)", "0531 (Braunschweig)", "0541 (Osnabrück)", "0441 (Oldenburg)", "0551 (Göttingen)", "05361 (Wolfsburg)", "05121 (Hildesheim)", "04421 (Wilhelmshaven)"],
                "Bremen": ["0421 (Bremen)", "0471 (Bremerhaven)"],
                "Schleswig-Holstein": ["0431 (Kiel)", "0451 (Lübeck)", "0461 (Flensburg)", "04321 (Neumünster)", "04101 (Pinneberg)"],
                "Rhineland-Palatinate": ["06131 (Mainz)", "0621 (Ludwigshafen)", "0651 (Trier)", "0261 (Koblenz)", "0631 (Kaiserslautern)", "06241 (Worms)", "06232 (Speyer)"],
                "Thuringia": ["0361 (Erfurt)", "03641 (Jena)", "0365 (Gera)", "03681 (Suhl)", "03691 (Eisenach)", "03631 (Nordhausen)"],
                "Saxony-Anhalt": ["0391 (Magdeburg)", "0345 (Halle)", "0340 (Dessau)", "03943 (Wernigerode)", "03491 (Wittenberg)"],
                "Brandenburg": ["0331 (Potsdam)", "0355 (Cottbus)", "03381 (Brandenburg)", "0335 (Frankfurt Oder)", "03334 (Eberswalde)"],
                "Mecklenburg-Vorpommern": ["0381 (Rostock)", "0385 (Schwerin)", "03831 (Stralsund)", "0395 (Neubrandenburg)", "03834 (Greifswald)", "03841 (Wismar)"],
                "Saarland": ["0681 (Saarbrücken)", "06821 (Neunkirchen)", "06831 (Saarlouis)", "06894 (St. Ingbert)", "06851 (St. Wendel)"]
            },
            "Spain": {
                "Madrid": ["91 (Madrid)", "910 (Madrid Metropolitan)", "911 (Madrid Norte)", "912 (Madrid Sur)"],
                "Catalonia": ["93 (Barcelona)", "972 (Girona)", "973 (Lleida)", "977 (Tarragona)", "938 (Manresa)"],
                "Andalusia": ["95 (Seville)", "958 (Granada)", "952 (Málaga / Marbella)", "957 (Córdoba)", "950 (Almería)", "956 (Cádiz / Jerez)", "959 (Huelva)", "953 (Jaén)"],
                "Valencia": ["96 (Valencia)", "965 (Alicante / Elche)", "964 (Castellón)"],
                "Basque Country": ["94 (Bilbao / Biscay)", "945 (Vitoria-Gasteiz / Álava)", "943 (San Sebastián / Gipuzkoa)"],
                "Galicia": ["981 (A Coruña)", "986 (Vigo / Pontevedra)", "982 (Lugo)", "988 (Ourense)"],
                "Aragon": ["976 (Zaragoza)", "974 (Huesca)", "978 (Teruel)"],
                "Asturias": ["985 (Oviedo / Gijón)", "984 (Avilés)"],
                "Balearic Islands": ["971 (Palma de Mallorca / Ibiza / Menorca)"],
                "Canary Islands": ["928 (Las Palmas / Gran Canaria)", "922 (Santa Cruz de Tenerife)"],
                "Cantabria": ["942 (Santander / Torrelavega)"],
                "Castile and León": ["983 (Valladolid)", "987 (León)", "923 (Salamanca)", "947 (Burgos)", "920 (Ávila)", "921 (Segovia)", "975 (Soria)", "979 (Palencia)", "980 (Zamora)"],
                "Castilla-La Mancha": ["925 (Toledo)", "967 (Albacete)", "926 (Ciudad Real)", "969 (Cuenca)", "949 (Guadalajara)"],
                "Extremadura": ["924 (Badajoz / Mérida)", "927 (Cáceres)"],
                "La Rioja": ["941 (Logroño)"],
                "Murcia": ["968 (Murcia / Cartagena)"],
                "Navarre": ["948 (Pamplona / Tudela)"]
            },
            "France": {
                "Île-de-France": ["01 (Paris & Île-de-France)"],
                "Auvergne-Rhône-Alpes": ["04 (Lyon / Grenoble / Saint-Étienne / Clermont-Ferrand)"],
                "Provence-Alpes-Côte d'Azur": ["04 (Marseille / Nice / Toulon / Cannes / Aix-en-Provence)"],
                "Occitanie": ["05 (Toulouse / Montpellier / Nîmes / Perpignan)"],
                "Nouvelle-Aquitaine": ["05 (Bordeaux / Limoges / Poitiers / Pau / La Rochelle)"],
                "Hauts-de-France": ["03 (Lille / Amiens / Roubaix / Tourcoing / Dunkirk)"],
                "Grand Est": ["03 (Strasbourg / Reims / Metz / Nancy / Mulhouse)"],
                "Brittany": ["02 (Rennes / Brest / Quimper / Lorient / Saint-Brieuc)"],
                "Pays de la Loire": ["02 (Nantes / Angers / Le Mans / Saint-Nazaire)"],
                "Normandy": ["02 (Rouen / Le Havre / Caen / Cherbourg)"],
                "Bourgogne-Franche-Comté": ["03 (Dijon / Besançon / Belfort / Chalon-sur-Saône)"],
                "Centre-Val de Loire": ["02 (Tours / Orléans / Bourges / Blois)"],
                "Corsica": ["04 (Ajaccio / Bastia)"]
            },
            "Italy": {
                "Lazio": ["06 (Rome)", "0773 (Latina)", "0774 (Tivoli)", "0775 (Frosinone)", "0761 (Viterbo)", "0746 (Rieti)"],
                "Lombardy": ["02 (Milan)", "030 (Brescia)", "035 (Bergamo)", "031 (Como)", "039 (Monza)", "0332 (Varese)", "0376 (Mantua)", "0382 (Pavia)", "0341 (Lecco)", "0372 (Cremona)", "0342 (Sondrio)", "0371 (Lodi)"],
                "Campania": ["081 (Naples)", "089 (Salerno)", "0823 (Caserta)", "0825 (Avellino)", "0824 (Benevento)"],
                "Piedmont": ["011 (Turin)", "0321 (Novara)", "015 (Biella)", "0161 (Vercelli)", "0171 (Cuneo)", "0141 (Asti)", "0131 (Alessandria)", "0323 (Verbania)"],
                "Veneto": ["041 (Venice)", "045 (Verona)", "049 (Padua)", "0444 (Vicenza)", "0422 (Treviso)", "0425 (Rovigo)", "0437 (Belluno)"],
                "Emilia-Romagna": ["051 (Bologna)", "059 (Modena)", "0521 (Parma)", "0522 (Reggio Emilia)", "0544 (Ravenna)", "0541 (Rimini)", "0543 (Forlì-Cesena)", "0532 (Ferrara)", "0523 (Piacenza)"],
                "Tuscany": ["055 (Florence)", "050 (Pisa)", "0586 (Livorno)", "0583 (Lucca)", "0575 (Arezzo)", "0577 (Siena)", "0574 (Prato)", "0573 (Pistoia)", "0564 (Grosseto)", "0585 (Massa-Carrara)"],
                "Sicily": ["091 (Palermo)", "095 (Catania)", "090 (Messina)", "0931 (Syracuse)", "0922 (Agrigento)", "0932 (Ragusa)", "0923 (Trapani)", "0934 (Caltanissetta)", "0935 (Enna)"],
                "Apulia": ["080 (Bari)", "0832 (Lecce)", "099 (Taranto)", "0881 (Foggia)", "0831 (Brindisi)", "0883 (Barletta-Andria-Trani)"],
                "Liguria": ["010 (Genoa)", "0187 (La Spezia)", "019 (Savona)", "0183 (Imperia / Sanremo)"],
                "Calabria": ["0965 (Reggio Calabria)", "0961 (Catanzaro)", "0984 (Cosenza)", "0963 (Vibo Valentia)", "0962 (Crotone)"],
                "Sardinia": ["070 (Cagliari)", "079 (Sassari / Olbia)", "0784 (Nuoro)", "0783 (Oristano)"],
                "Friuli Venezia Giulia": ["040 (Trieste)", "0432 (Udine)", "0434 (Pordenone)", "0481 (Gorizia)"],
                "Marche": ["071 (Ancona)", "0721 (Pesaro)", "0736 (Ascoli Piceno)", "0733 (Macerata)", "0734 (Fermo)"],
                "Abruzzo": ["085 (Pescara)", "0862 (L'Aquila)", "0871 (Chieti)", "0861 (Teramo)"],
                "Trentino-South Tyrol": ["0461 (Trento)", "0471 (Bolzano / Bozen)"],
                "Umbria": ["075 (Perugia)", "0744 (Terni)"],
                "Basilicata": ["0971 (Potenza)", "0835 (Matera)"],
                "Molise": ["0874 (Campobasso)", "0865 (Isernia)"],
                "Aosta Valley": ["0165 (Aosta)"]
            },
            "USA": {
                "California": ["310 (Los Angeles)", "213 (Downtown LA)", "415 (San Francisco)", "619 (San Diego)", "408 (San Jose)", "916 (Sacramento)", "559 (Fresno)", "510 (Oakland)", "714 (Orange County)", "818 (San Fernando Valley)"],
                "New York": ["212 (Manhattan)", "718 (Brooklyn / Queens)", "917 (NYC General)", "646 (Manhattan)", "516 (Long Island)", "914 (Westchester)", "716 (Buffalo)", "585 (Rochester)", "518 (Albany)", "315 (Syracuse)"],
                "Texas": ["713 (Houston)", "214 (Dallas)", "512 (Austin)", "210 (San Antonio)", "817 (Fort Worth)", "915 (El Paso)", "972 (Dallas Suburbs)", "832 (Houston Metro)", "806 (Lubbock)", "956 (McAllen)"],
                "Florida": ["305 (Miami)", "407 (Orlando)", "813 (Tampa)", "904 (Jacksonville)", "954 (Fort Lauderdale)", "561 (West Palm Beach)", "850 (Tallahassee)", "239 (Cape Coral)"],
                "Illinois": ["312 (Chicago Loop)", "773 (Chicago Metro)", "630 (Oak Brook)", "847 (North Suburbs)", "708 (South Suburbs)", "309 (Peoria)", "217 (Springfield)", "815 (Rockford)"],
                "Georgia": ["404 (Atlanta)", "770 (North Metro)", "678 (Atlanta Metro)", "912 (Savannah)", "706 (Augusta / Athens)", "478 (Macon)"],
                "Washington": ["206 (Seattle)", "425 (Bellevue)", "253 (Tacoma)", "509 (Spokane)", "360 (Olympia / Vancouver)"],
                "Massachusetts": ["617 (Boston)", "508 (Worcester)", "781 (Suburban Boston)", "978 (Lowell)", "413 (Springfield)"],
                "Pennsylvania": ["215 (Philadelphia)", "412 (Pittsburgh)", "267 (Philadelphia)", "610 (Allentown)", "717 (Harrisburg)", "814 (Erie)"],
                "Arizona": ["602 (Phoenix)", "480 (Scottsdale / Mesa)", "520 (Tucson)", "623 (Glendale)", "928 (Flagstaff)"],
                "Nevada": ["702 (Las Vegas)", "725 (Las Vegas Metro)", "775 (Reno / Carson City)"],
                "Colorado": ["303 (Denver)", "720 (Denver Metro)", "719 (Colorado Springs)", "970 (Fort Collins / Aspen)"],
                "North Carolina": ["704 (Charlotte)", "919 (Raleigh)", "980 (Charlotte Metro)", "336 (Greensboro)", "828 (Asheville)", "252 (Greenville)"],
                "Tennessee": ["615 (Nashville)", "901 (Memphis)", "865 (Knoxville)", "423 (Chattanooga)", "931 (Clarksville)"],
                "Ohio": ["614 (Columbus)", "216 (Cleveland)", "513 (Cincinnati)", "937 (Dayton)", "330 (Akron)", "419 (Toledo)"],
                "Michigan": ["313 (Detroit)", "616 (Grand Rapids)", "248 (Troy / Oakland)", "586 (Warren)", "734 (Ann Arbor)", "517 (Lansing)"],
                "Virginia": ["703 (Arlington / Alexandria)", "571 (Northern VA)", "804 (Richmond)", "757 (Virginia Beach / Norfolk)", "540 (Roanoke)"],
                "Oregon": ["503 (Portland)", "971 (Portland Metro)", "541 (Eugene / Salem)"]
            },
            "Australia": {
                "New South Wales": ["02 (Sydney / NSW Regional)", "04 (Mobile)"],
                "Victoria": ["03 (Melbourne / Geelong / VIC Regional)", "04 (Mobile)"],
                "Queensland": ["07 (Brisbane / Gold Coast / Sunshine Coast / QLD Regional)", "04 (Mobile)"],
                "Western Australia": ["08 (Perth / Fremantle / WA Regional)", "04 (Mobile)"],
                "South Australia": ["08 (Adelaide / SA Regional)", "04 (Mobile)"],
                "Tasmania": ["03 (Hobart / Launceston / TAS)", "04 (Mobile)"],
                "Australian Capital Territory": ["02 (Canberra / ACT)", "04 (Mobile)"],
                "Northern Territory": ["08 (Darwin / Alice Springs / NT)", "04 (Mobile)"]
            },
            "UK": {
                "Greater London": ["020 (London Inner & Outer)"],
                "West Midlands": ["0121 (Birmingham)", "024 (Coventry)", "01902 (Wolverhampton)", "01922 (Walsall)", "01384 (Dudley)"],
                "Greater Manchester": ["0161 (Manchester / Salford / Bolton / Stockport / Oldham)"],
                "West Yorkshire": ["0113 (Leeds)", "01274 (Bradford)", "01484 (Huddersfield)", "01924 (Wakefield)", "01422 (Halifax)"],
                "Scotland": ["0131 (Edinburgh)", "0141 (Glasgow)", "01224 (Aberdeen)", "01382 (Dundee)", "01463 (Inverness)", "01786 (Stirling)"],
                "Wales": ["029 (Cardiff)", "01792 (Swansea)", "01633 (Newport)", "01978 (Wrexham)", "01248 (Bangor)"],
                "Northern Ireland": ["028 (Belfast / Derry / Lisburn / Newry / All NI)"],
                "Hampshire": ["023 (Southampton / Portsmouth)", "01962 (Winchester)", "01256 (Basingstoke)"],
                "Kent": ["01622 (Maidstone)", "01227 (Canterbury)", "01892 (Tunbridge Wells)", "01634 (Medway)"],
                "England": ["0117 (Bristol)", "0151 (Liverpool)", "0114 (Sheffield)", "0191 (Newcastle)", "0115 (Nottingham)", "01865 (Oxford)", "01223 (Cambridge)"]
            },
            "Canada": {
                "Ontario": ["416 (Toronto Core)", "647 (Toronto)", "437 (Toronto)", "905 (GTA / Hamilton)", "613 (Ottawa)", "519 (London / Kitchener)", "705 (Barrie / Sudbury)", "807 (Thunder Bay)"],
                "Quebec": ["514 (Montreal Core)", "438 (Montreal)", "450 (Montreal Suburbs)", "418 (Quebec City)", "819 (Gatineau / Sherbrooke)"],
                "British Columbia": ["604 (Vancouver)", "778 (Greater Vancouver)", "250 (Victoria / Kelowna)", "236 (BC Wide)"],
                "Alberta": ["403 (Calgary / Red Deer)", "780 (Edmonton / Grande Prairie)", "587 (Alberta Wide)", "825 (Alberta Wide)"],
                "Manitoba": ["204 (Winnipeg / Brandon)", "431 (Manitoba Wide)"],
                "Saskatchewan": ["306 (Saskatoon / Regina)", "639 (Saskatchewan Wide)"],
                "Nova Scotia": ["902 (Halifax / Sydney)", "782 (Nova Scotia Wide)"],
                "New Brunswick": ["506 (Moncton / Saint John / Fredericton)"],
                "Newfoundland and Labrador": ["709 (St. John's / Corner Brook)"],
                "Prince Edward Island": ["902 (Charlottetown / Summerside)"],
                "Northwest Territories": ["867 (Yellowknife)"],
                "Nunavut": ["867 (Iqaluit)"],
                "Yukon": ["867 (Whitehorse)"]
            },
            "New Zealand": {
                "Auckland": ["09 (Auckland Central / North Shore / Manukau / Waitakere)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Wellington": ["04 (Wellington / Lower Hutt / Upper Hutt / Porirua / Kapiti)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Canterbury": ["03 (Christchurch / Timaru / Ashburton / Rangiora)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Waikato": ["07 (Hamilton / Cambridge / Te Awamutu / Taupo)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Bay of Plenty": ["07 (Tauranga / Rotorua / Whakatane)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Hawke's Bay": ["06 (Napier / Hastings)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Manawatū-Whanganui": ["06 (Palmerston North / Whanganui)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Northland": ["09 (Whangarei / Kerikeri / Kaitaia)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Otago": ["03 (Dunedin / Queenstown / Wanaka / Oamaru)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Southland": ["03 (Invercargill / Gore)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Taranaki": ["06 (New Plymouth / Hawera)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Nelson": ["03 (Nelson / Richmond)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Marlborough": ["03 (Blenheim / Picton)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Tasman": ["03 (Motueka / Takaka)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "Gisborne": ["06 (Gisborne)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"],
                "West Coast": ["03 (Greymouth / Westport / Hokitika)", "021 (Mobile)", "022 (Mobile)", "027 (Mobile)"]
            }
        };

        // Function to populate Area Codes exclusively for the selected State/Region
        function updateAreaCodesForSelectedState(countryKey, selectedState) {
            if (!areaEl) return;

            let areas = [];
            if (countryKey && selectedState && stateAreasMap[countryKey] && stateAreasMap[countryKey][selectedState]) {
                areas = stateAreasMap[countryKey][selectedState];
            } else if (countryKey && selectedState && locationData[countryKey] && locationData[countryKey].areas) {
                // Fallback filter: only include if area text mentions the state name
                const lowerState = selectedState.toLowerCase();
                areas = locationData[countryKey].areas.filter(a => a.toLowerCase().includes(lowerState));
                if (areas.length === 0) areas = locationData[countryKey].areas;
            }

            areaEl.innerHTML = '';

            if (!selectedState) {
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.innerText = 'Select State First';
                defaultOpt.selected = true;
                areaEl.appendChild(defaultOpt);
                areaEl.disabled = true;
                areaEl.classList.add('opacity-40', 'cursor-not-allowed');
                return;
            }

            areaEl.disabled = false;
            areaEl.classList.remove('opacity-40', 'cursor-not-allowed');

            if (areas.length === 0) {
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.innerText = 'Select Area Code';
                defaultOpt.selected = true;
                areaEl.appendChild(defaultOpt);
                return;
            }

            areas.forEach((area, index) => {
                const opt = document.createElement('option');
                const match = area.match(/^([0-9A-Za-z]+)\s*\((.*)\)$/);
                if (match) {
                    opt.value = match[1];
                    opt.innerText = `(${match[1]}) ${match[2]}`;
                } else {
                    opt.value = area;
                    opt.innerText = `(${area})`;
                }
                if (index === 0) opt.selected = true;
                areaEl.appendChild(opt);
            });
        }

        // Country Change Listener
        countryEl.addEventListener('change', (e) => {
            const country = e.target.value;
            if (!country) {
                setDependentFieldsEnabled(false);
                return;
            }

            // Enable fields once country is selected
            setDependentFieldsEnabled(true);

            const countryKey = country === 'AUS' ? 'Australia' : 
                               country === 'CAN' ? 'Canada' : 
                               country === 'UK' ? 'UK' : country;
            
            const data = locationData[countryKey];
            const phoneRule = getPhoneRule(country);

            if (phoneEl) {
                phoneEl.placeholder = phoneRule.placeholder;
                phoneEl.classList.remove('border-red-500');
            }
            
            // Update States
            if (stateEl) {
                stateEl.innerHTML = '<option value="" selected>Select State</option>';
                if (data && data.states) {
                    data.states.sort().forEach(state => {
                        const opt = document.createElement('option');
                        opt.value = state;
                        opt.innerText = state;
                        stateEl.appendChild(opt);
                    });
                }
            }

            // Update Country Code
            if (countryCodeEl && data) {
                countryCodeEl.value = data.code || phoneRule.code || "";
            }

            // Reset Area Code to require State Selection first
            updateAreaCodesForSelectedState(countryKey, '');
        });

        // State Change Listener - Strictly loads only the selected State's Area Codes
        if (stateEl) {
            stateEl.addEventListener('change', () => {
                const country = countryEl ? countryEl.value : '';
                const countryKey = country === 'AUS' ? 'Australia' : 
                                   country === 'CAN' ? 'Canada' : 
                                   country === 'UK' ? 'UK' : country;
                const selectedState = stateEl.value;
                updateAreaCodesForSelectedState(countryKey, selectedState);
            });
        }

        // 5. Custom State Selection Modal Window Component (In-Window Modal Selector)
        function setupCustomStateModal() {
            if (!stateEl) return;

            let modal = document.getElementById('state-modal-window');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'state-modal-window';
                modal.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden';
                modal.innerHTML = `
                    <div class="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl relative animate-fadeIn">
                        <div class="flex justify-between items-center pb-4 border-b border-white/10 mb-4 flex-shrink-0">
                            <div>
                                <h3 class="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    Select State / Region
                                </h3>
                                <p id="state-modal-country-subtitle" class="text-xs text-zinc-400 font-medium mt-0.5">Choose your state</p>
                            </div>
                            <button id="close-state-modal" type="button" class="text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>

                        <!-- Search Input -->
                        <div class="mb-4 flex-shrink-0">
                            <input type="text" id="state-search-input" placeholder="Search state or region..." class="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3D00] font-medium transition-all">
                        </div>

                        <!-- Scrollable State List -->
                        <div id="state-modal-list" class="overflow-y-auto space-y-2 flex-1 pr-1 custom-scroll max-h-[50vh]">
                            <!-- Dynamically populated -->
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }

            const closeBtn = modal.querySelector('#close-state-modal');
            const searchInput = modal.querySelector('#state-search-input');
            const listContainer = modal.querySelector('#state-modal-list');
            const subtitle = modal.querySelector('#state-modal-country-subtitle');

            function openModal() {
                if (stateEl.disabled) return;
                const currentCountry = countryEl ? countryEl.value : '';
                if (!currentCountry) {
                    if (typeof showPremiumToast === 'function') showPremiumToast('Please select a country first!', 'error');
                    return;
                }

                subtitle.innerText = `Select state for ${currentCountry}`;
                populateStateList('');
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                if (searchInput) {
                    searchInput.value = '';
                    setTimeout(() => searchInput.focus(), 100);
                }
            }

            function closeModal() {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }

            function populateStateList(query) {
                listContainer.innerHTML = '';
                const options = Array.from(stateEl.options).filter(opt => opt.value !== '');
                const filtered = options.filter(opt => opt.text.toLowerCase().includes(query.toLowerCase()));

                if (filtered.length === 0) {
                    listContainer.innerHTML = '<div class="text-center py-6 text-zinc-500 text-xs uppercase font-bold">No states found</div>';
                    return;
                }

                filtered.forEach(opt => {
                    const item = document.createElement('div');
                    const isSelected = stateEl.value === opt.value;
                    item.className = `p-3.5 rounded-xl border transition-all cursor-pointer font-bold text-xs uppercase flex items-center justify-between ${
                        isSelected ? 'bg-[#FF3D00] text-white border-[#FF3D00]' : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border-white/5 hover:border-white/20'
                    }`;
                    item.innerHTML = `
                        <span>${opt.text}</span>
                        ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                    `;
                    item.onclick = () => {
                        stateEl.value = opt.value;
                        stateEl.dispatchEvent(new Event('change', { bubbles: true }));
                        closeModal();
                    };
                    listContainer.appendChild(item);
                });
            }

            if (closeBtn) closeBtn.onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

            if (searchInput) {
                searchInput.oninput = (e) => populateStateList(e.target.value);
            }

            ['pointerdown', 'mousedown', 'click', 'touchstart'].forEach(evt => {
                stateEl.addEventListener(evt, (e) => {
                    if (!stateEl.disabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal();
                    }
                }, { capture: true });
            });

            stateEl.addEventListener('keydown', (e) => {
                if (!stateEl.disabled && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
                    e.preventDefault();
                    e.stopPropagation();
                    openModal();
                }
            });
        }

        // 5b. Custom Area Code Selection Modal Window Component (Responsive In-Window Modal Selector)
        function setupCustomAreaModal() {
            if (!areaEl) return;

            let modal = document.getElementById('area-modal-window');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'area-modal-window';
                modal.className = 'fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden';
                modal.innerHTML = `
                    <div class="bg-zinc-950 border border-white/10 rounded-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl relative animate-fadeIn mx-auto overflow-hidden">
                        <div class="flex justify-between items-center pb-4 border-b border-white/10 mb-4 flex-shrink-0">
                            <div>
                                <h3 class="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF3D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                    Select Area Code
                                </h3>
                                <p id="area-modal-country-subtitle" class="text-xs text-zinc-400 font-medium mt-0.5">Select area code</p>
                            </div>
                            <button id="close-area-modal" type="button" class="text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-colors cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>

                        <!-- Search Input -->
                        <div class="mb-4 flex-shrink-0">
                            <input type="text" id="area-search-input" placeholder="Search area code or city..." class="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3D00] font-medium transition-all">
                        </div>

                        <!-- Scrollable Area List -->
                        <div id="area-modal-list" class="overflow-y-auto space-y-2 flex-1 pr-1 custom-scroll max-h-[50vh]">
                            <!-- Dynamically populated -->
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            }

            const closeBtn = modal.querySelector('#close-area-modal');
            const searchInput = modal.querySelector('#area-search-input');
            const listContainer = modal.querySelector('#area-modal-list');
            const subtitle = modal.querySelector('#area-modal-country-subtitle');

            function openModal() {
                if (areaEl.disabled) {
                    if (!countryEl || !countryEl.value) {
                        if (typeof showPremiumToast === 'function') showPremiumToast('Please select a country first!', 'error');
                    } else if (!stateEl || !stateEl.value) {
                        if (typeof showPremiumToast === 'function') showPremiumToast('Please select a state / region first!', 'info');
                        const stateModal = document.getElementById('state-modal-window');
                        if (stateModal) {
                            stateModal.classList.remove('hidden');
                            stateModal.style.display = 'flex';
                        }
                    }
                    return;
                }
                const currentCountry = countryEl ? countryEl.value : '';
                const selectedState = stateEl ? stateEl.value : '';
                if (!currentCountry) {
                    if (typeof showPremiumToast === 'function') showPremiumToast('Please select a country first!', 'error');
                    return;
                }
                if (!selectedState) {
                    if (typeof showPremiumToast === 'function') showPremiumToast('Please select a state / region first!', 'info');
                    return;
                }

                subtitle.innerText = `Select area code for ${selectedState}`;
                populateAreaList('');
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                if (searchInput) {
                    searchInput.value = '';
                    setTimeout(() => searchInput.focus(), 100);
                }
            }

            function closeModal() {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }

            function populateAreaList(query) {
                listContainer.innerHTML = '';
                const options = Array.from(areaEl.options).filter(opt => opt.value !== '');
                const filtered = options.filter(opt => opt.text.toLowerCase().includes(query.toLowerCase()) || opt.value.toLowerCase().includes(query.toLowerCase()));

                if (filtered.length === 0) {
                    listContainer.innerHTML = '<div class="text-center py-6 text-zinc-500 text-xs uppercase font-bold">No area codes found</div>';
                    return;
                }

                filtered.forEach(opt => {
                    const item = document.createElement('div');
                    const isSelected = areaEl.value === opt.value;
                    item.className = `p-3.5 rounded-xl border transition-all cursor-pointer font-bold text-xs uppercase flex items-center justify-between ${
                        isSelected ? 'bg-[#FF3D00] text-white border-[#FF3D00]' : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border-white/5 hover:border-white/20'
                    }`;
                    item.innerHTML = `
                        <span>${opt.text}</span>
                        ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                    `;
                    item.onclick = () => {
                        areaEl.value = opt.value;
                        areaEl.dispatchEvent(new Event('change', { bubbles: true }));
                        closeModal();
                    };
                    listContainer.appendChild(item);
                });
            }

            if (closeBtn) closeBtn.onclick = closeModal;
            modal.onclick = (e) => {
                if (e.target === modal) closeModal();
            };

            if (searchInput) {
                searchInput.oninput = (e) => populateAreaList(e.target.value);
            }

            ['pointerdown', 'mousedown', 'click', 'touchstart'].forEach(evt => {
                areaEl.addEventListener(evt, (e) => {
                    if (!areaEl.disabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal();
                    }
                }, { capture: true });
            });

            areaEl.addEventListener('keydown', (e) => {
                if (!areaEl.disabled && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
                    e.preventDefault();
                    e.stopPropagation();
                    openModal();
                }
            });
        }

        // --- IP-Based Country Detection Optimized for Speed ---
        async function detectLocation() {
            try {
                // Abort request after 2 seconds to prevent site hang
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error('Location detection failed');
                
                const data = await response.json();
                const detectedCountry = data.country_name;

                const countryMap = {
                    "United States": "USA",
                    "United Kingdom": "UK",
                    "Canada": "Canada",
                    "Australia": "Australia",
                    "Germany": "Germany",
                    "France": "France",
                    "Spain": "Spain",
                    "Italy": "Italy",
                    "Ireland": "Ireland",
                    "New Zealand": "New Zealand",
                    "Brazil": "Brazil",
                    "Mexico": "Mexico"
                };

                const mappedValue = countryMap[detectedCountry];
                
                if (mappedValue && (locationData[mappedValue] || mappedValue === 'USA' || mappedValue === 'UK')) {
                    let valueToSelect = mappedValue;
                    if (![...countryEl.options].some(opt => opt.value === mappedValue)) {
                        if (mappedValue === 'Australia') valueToSelect = 'AUS';
                        if (mappedValue === 'Canada') valueToSelect = 'CAN';
                    }

                    countryEl.value = valueToSelect;
                    countryEl.dispatchEvent(new Event('change'));
                    console.log(`GTSA (Global): Detected country: ${detectedCountry} -> ${valueToSelect}`);
                }
            } catch (error) {
                console.warn("GTSA (Global): IP Detection completed.");
                // Keep Select Country placeholder intact without auto-selecting Australia
            }
        }

        // Keep Select Country default on initial load
        if (countryEl && countryEl.value === "Australia" && !window.location.hash.includes("auto")) {
            countryEl.value = "";
            countryEl.selectedIndex = 0;
            setDependentFieldsEnabled(false);
        }

        setupCustomStateModal();
        setupCustomAreaModal();
    }

    // Note: Image Fallback System is now handled by js/image-handler.js in the head of HTML files for better coverage.

    // 6. Social Share Logic
    window.shareToPlatform = function(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("Check out Scanthemall - The ultimate luxury hunt! 🏎️💨");
        let shareUrl = '';

        if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (platform === 'x' || platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        } else if (platform === 'whatsapp') {
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        } else if (platform === 'instagram') {
            // Instagram doesn't support direct sharing via URL like others.
            // Usually, we redirect to the upload page or the profile.
            window.location.href = 'instagram_upload_page.html';
            return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,location=0,menubar=0,scrollbars=1,status=1,resizable=1');
        } else {
            console.error("GTSA: Share platform not supported:", platform);
        }
    };

    // Auto-attach to button elements with share classes (prevents conflict with footer profile links)
    document.querySelectorAll('button.share-facebook').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('facebook'); });
    });
    document.querySelectorAll('button.share-x, button.share-twitter').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('x'); });
    });
    document.querySelectorAll('button.share-instagram').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('instagram'); });
    });
    document.querySelectorAll('button.share-whatsapp').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); window.shareToPlatform('whatsapp'); });
    });

    // Frosted Glass Header Scroll Blur Handler
    const updateHeaderBlur = () => {
        const headers = document.querySelectorAll('header, .glass-nav, .glass-header, .sticky-header');
        const isScrolled = window.scrollY > 20;
        headers.forEach(header => {
            if (isScrolled) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };
    window.addEventListener('scroll', updateHeaderBlur, { passive: true });
    updateHeaderBlur();

    // Note: Responsive scaling is now handled via CSS in responsive.js
});
