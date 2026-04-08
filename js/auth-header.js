import { auth } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Anti-Flicker Style: Hide buttons immediately if not already hidden by HTML
// We keep this as a backup, but it's best handled in the HTML <head>
const style = document.createElement('style');
style.innerHTML = `
    .auth-login, .auth-signup, #login-btn, #signup-btn { 
        opacity: 0; 
        visibility: hidden; 
        transition: opacity 0.3s ease; 
    }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        // Handle both ID-based (Desktop) and Class-based (Mobile/Multiple) buttons
        const loginButtons = document.querySelectorAll('.auth-login, #login-btn');
        const signupButtons = document.querySelectorAll('.auth-signup, #signup-btn, #auth-btn');
        const profileSections = document.querySelectorAll('.user-profile');

        if (user) {
            // User is logged in
            loginButtons.forEach(btn => {
                btn.style.display = 'none';
                btn.style.opacity = '0';
            });

            signupButtons.forEach(btn => {
                btn.style.display = 'none'; 
                btn.style.opacity = '0';
            });

            profileSections.forEach(s => {
                s.classList.remove('hidden');
                s.style.display = 'flex';
                // Update Name if element exists
                const nameTag = s.querySelector('.user-name');
                if (nameTag && user.displayName) nameTag.innerText = user.displayName;
            });
            
            // Handle Log Out buttons inside profile or elsewhere
            const logoutButtons = document.querySelectorAll('.auth-logout');
            logoutButtons.forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    signOut(auth).then(() => {
                        window.location.reload(); 
                    });
                };
            });
        } else {
            // User is NOT logged in: Show original buttons
            loginButtons.forEach(btn => {
                btn.style.display = 'inline-block';
            });

            signupButtons.forEach(btn => {
                btn.innerText = "Register or Sign-In";
                btn.href = "registration_with_video.html";
                btn.onclick = null;
                btn.style.display = 'inline-block';
                // Reset style if needed
                if (btn.id === 'signup-btn') {
                    btn.style.backgroundColor = ""; 
                }
            });

            profileSections.forEach(s => {
                s.classList.add('hidden');
                s.style.display = 'none';
            });
        }

        // Auth state is determined, fade in the buttons that are not display: none
        [...loginButtons, ...signupButtons, ...profileSections].forEach(btn => {
            if (btn.style.display !== 'none' && !btn.classList.contains('hidden')) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            }
        });

        // Remove anti-flicker styles once state is determined
        const antiFlicker = document.getElementById('anti-flicker');
        if (antiFlicker) antiFlicker.remove();
        
        const injectedStyle = document.querySelector('style#auth-header-style');
        if (injectedStyle) injectedStyle.remove();
    });
});

