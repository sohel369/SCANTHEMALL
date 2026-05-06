import { NodeAPI } from "./api-config.js";

// Clean up any existing anti-flicker style immediately
const antiFlicker = document.getElementById('anti-flicker');
if (antiFlicker) antiFlicker.remove();

document.addEventListener("DOMContentLoaded", () => {
    const checkAuthState = () => {
        try {
            const isAuthenticated = NodeAPI.isAuthenticated();
            const user = NodeAPI.getUser();
            console.log("Auth Check:", { isAuthenticated, user });

            const loginButtons = document.querySelectorAll('.auth-login, #login-btn');
            const signupButtons = document.querySelectorAll('.auth-signup, #signup-btn, #auth-btn');
            const profileSections = document.querySelectorAll('.user-profile');

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

                    const firstName = user.firstName || (user.profile && user.profile.first_name) || user.username || (user.email ? user.email.split('@')[0] : 'User');
                    const lastName = user.lastName || (user.profile && user.profile.last_name) || '';

                    if (nameTag) {
                        nameTag.innerText = `${firstName} ${lastName}`.trim().toUpperCase();
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
                            adminLink.href = '/admin';
                            adminLink.className = 'dashboard-link flex items-center px-4 py-3 text-sm text-[#FF3D00] font-bold hover:bg-zinc-800 transition-colors';
                            adminLink.innerHTML = '<i data-lucide="layout-dashboard" class="w-4 h-4 mr-3"></i> ADMIN PANEL';
                            dropdown.prepend(adminLink);
                        } else if (user.role === 'advertiser') {
                            const advLink = document.createElement('a');
                            advLink.href = '/advertiser';
                            advLink.className = 'dashboard-link flex items-center px-4 py-3 text-sm text-[#FF3D00] font-bold hover:bg-zinc-800 transition-colors';
                            advLink.innerHTML = '<i data-lucide="layout-dashboard" class="w-4 h-4 mr-3"></i> ADVERTISER PANEL';
                            dropdown.prepend(advLink);
                        }
                        if (window.lucide) window.lucide.createIcons();
                    }
                });

                // Handle Logout
                document.querySelectorAll('.auth-logout').forEach(btn => {
                    btn.onclick = (e) => {
                        e.preventDefault();
                        NodeAPI.removeToken();
                        window.location.reload();
                    };
                });

            } else {
                // User is NOT logged in: Show login/signup buttons
                loginButtons.forEach(btn => {
                    btn.style.display = 'inline-block';
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                });

                signupButtons.forEach(btn => {
                    btn.style.display = 'inline-block';
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                });

                profileSections.forEach(s => {
                    s.style.display = 'none';
                });
            }

        } catch (error) {
            console.error("Auth Header Error:", error);
            document.querySelectorAll('.auth-login, .auth-signup, #login-btn, #signup-btn, #auth-btn').forEach(btn => {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
                btn.style.display = 'inline-block';
            });
        } finally {
            const injectedStyle = document.getElementById('auth-header-style');
            if (injectedStyle) injectedStyle.remove();
            const af = document.getElementById('anti-flicker');
            if (af) af.remove();
        }
    };

    checkAuthState();
    
    // Listen for storage events (when token is set in another tab or script)
    window.addEventListener('storage', checkAuthState);
    // Listen for a custom event we can trigger manually
    window.addEventListener('auth-changed', checkAuthState);
});
