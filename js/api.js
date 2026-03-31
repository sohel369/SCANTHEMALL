/**
 * api.js - Simple Registration Handler
 */
function registerUser(data) {
    console.log("Registering User:", data);
    localStorage.setItem("user_session", JSON.stringify(data));
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
