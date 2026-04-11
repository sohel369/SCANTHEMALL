/**
 * api.js - Simple Registration Handler
 */
function registerUser(data) {
    console.log("Registering User:", data);
    // Standardize across scripts
    localStorage.setItem("user_session", JSON.stringify(data));
    localStorage.setItem("GTSA_SESSION_TOKEN", "dummy_session_token_" + Date.now());
    localStorage.setItem("GTSA_SESSION_USER", JSON.stringify(data));
    if (typeof showPremiumToast === 'function') {
        showPremiumToast("Registration Successful!");
    } else {
        console.log("Registration Successful!");
    }
    
    // Universal Redirect for registration and prize entry success
    const currentPath = window.location.href.toLowerCase();
    if (currentPath.includes('registration') || currentPath.includes('welcome') || currentPath.includes('prize')) {
        window.location.href = "success.html";
    }
}
