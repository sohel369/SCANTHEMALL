import { NodeAPI } from "./api-config.js";

// Anti-Flicker Style: Hide buttons immediately if not already hidden by HTML
const style = document.createElement('style');
style.id = 'auth-header-style';
style.innerHTML = `
    .auth-login, .auth-signup, #login-btn, #signup-btn, #auth-btn, .user-profile { 
        opacity: 0; 
        visibility: hidden; 
        transition: opacity 0.3s ease; 
    }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
    const checkAuthState = () => {
        const isAuthenticated = NodeAPI.isAuthenticated();
        const user = NodeAPI.getUser();
        console.log("Auth Check:", { isAuthenticated, user });

        const loginButtons = document.querySelectorAll('.auth-login, #login-btn');
        const signupButtons = document.querySelectorAll('.auth-signup, #signup-btn, #auth-btn');
        let profileSections = document.querySelectorAll('.user-profile');

        if (isAuthenticated && user) {
            // User is logged in: Hide auth buttons
            [...loginButtons, ...signupButtons].forEach(btn => {
                btn.style.display = 'none';
                btn.style.opacity = '0';
            });

            profileSections.forEach(s => {
                s.classList.remove('hidden');
                s.style.display = 'flex';

                const nameTag = s.querySelector('.user-name');
                const avatarTag = s.querySelector('.user-avatar');
                const roleTag = s.querySelector('.user-role');

                // Fetch data from database fields (handle various response formats)
                const firstName = user.firstName || (user.profile && user.profile.first_name) || user.username || (user.email ? user.email.split('@')[0] : 'User');
                const lastName = user.lastName || (user.profile && user.profile.last_name) || '';

                if (nameTag) {
                    nameTag.innerText = `${firstName} ${lastName}`.toUpperCase();
                    nameTag.style.fontWeight = '900';
                }

                if (roleTag) {
                    const role = user.role === 'admin' ? 'ADMIN' : (user.role === 'advertiser' ? 'ADVERTISER' : 'PRO MEMBER');
                    roleTag.innerText = role;
                }

                if (avatarTag) {
                    avatarTag.src = `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}&backgroundColor=ff3d00`;
                }

                // Add Dashboard links for Admin/Advertiser
                const dropdown = s.querySelector('.profile-dropdown, div.absolute');
                if (dropdown && !dropdown.querySelector('.dashboard-link')) {
                    if (user.role === 'admin') {
                        const adminLink = document.createElement('a');
                        adminLink.href = 'http://localhost:5173/';
                        adminLink.className = 'dashboard-link flex items-center px-4 py-3 text-sm text-[#FF3D00] font-bold hover:bg-zinc-800 transition-colors';
                        adminLink.innerHTML = '<i data-lucide="layout-dashboard" class="w-4 h-4 mr-3"></i> ADMIN PANEL';
                        dropdown.prepend(adminLink);
                    } else if (user.role === 'advertiser') {
                        const advLink = document.createElement('a');
                        advLink.href = 'http://localhost:5174/';
                        advLink.className = 'dashboard-link flex items-center px-4 py-3 text-sm text-[#FF3D00] font-bold hover:bg-zinc-800 transition-colors';
                        advLink.innerHTML = '<i data-lucide="layout-dashboard" class="w-4 h-4 mr-3"></i> ADVERTISER PANEL';
                        dropdown.prepend(advLink);
                    }
                    if (window.lucide) window.lucide.createIcons();
                }
            });

            // Update all "Advertise With Us" links to the Advertiser Panel
            document.querySelectorAll('a').forEach(a => {
                const text = a.innerText.toLowerCase();
                if (text.includes('advertise with us')) {
                    a.href = 'http://localhost:5174/';
                }
            });

            // Handle Logout
            const logoutButtons = document.querySelectorAll('.auth-logout');
            logoutButtons.forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    // Use NodeAPI to clear session correctly
                    NodeAPI.removeToken();
                    window.location.reload();
                };
            });
        } else {
            // User is NOT logged in: Show original buttons
            loginButtons.forEach(btn => {
                btn.style.display = 'inline-block';
            });

            signupButtons.forEach(btn => {
                btn.style.display = 'inline-block';
            });

            profileSections.forEach(s => {
                s.style.display = 'none';
            });
        }

        // Final visibility sync
        [...loginButtons, ...signupButtons, ...profileSections].forEach(btn => {
            if (btn.style.display !== 'none' && !btn.classList.contains('hidden')) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            }
        });

        // Cleanup
        const injectedStyle = document.getElementById('auth-header-style');
        if (injectedStyle) injectedStyle.remove();
        const antiFlicker = document.getElementById('anti-flicker');
        if (antiFlicker) antiFlicker.remove();
    };

    checkAuthState();
});

