import { Link, useLocation } from 'react-router-dom';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Home' },
        { path: '/welcome', label: 'About us' },
        { path: '/mission', label: 'Prizes' },
        { path: '/contact', label: 'Contact us' },
        { path: '/analysis', label: 'My position' },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="mobile-menu-backdrop" onClick={onClose}></div>

            {/* Menu Overlay */}
            <div className="mobile-menu-overlay">
                {/* Close Button */}
                <button
                    className="mobile-menu-close"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                {/* Promotional Graphic */}
                <div className="mobile-menu-promo">
                    <Link to="/" onClick={onClose}>
                        <img
                            src="/assets/logo.png"
                            alt="Scan and Win Mobile logo"
                            className="mobile-header-logo"
                        />
                    </Link>
                </div>

                {/* Menu Items */}
                <nav className="mobile-menu-nav">
                    <ul className="mobile-menu-list">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path} className={`mobile-menu-item ${isActive ? 'active' : ''}`}>
                                    <Link
                                        to={item.path}
                                        className="mobile-menu-link"
                                        onClick={onClose}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;

