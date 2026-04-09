import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MobileMenu from './MobileMenu'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="center-decoration-div">
          <svg viewBox="0 0 718 41" fill="none">
            <path d="M0 0L717.208 7.28L697.542 31.52L15.6188 40.68" fill="#D4A017" />
          </svg>
        </div>
        <svg className="header-background" viewBox="0 0 1400 126" fill="none">
          <path d="M1400 126L0 106.093V0L701 33.0086L1400 18.2334V126Z" fill="#1C2526" />
        </svg>
        <svg className="header-mobile-background" viewBox="0 0 360 51" fill="none">
          <path d="M360 50.0676H168.5H0V0L180.257 6.30827L360 0V50.0676Z" fill="#1C2526" />
        </svg>
        <button 
          type="button" 
          className={`menu-button ${isMenuOpen ? 'menu-button-open' : ''}`}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      <Link to="/">
        <img
          src="/assets/logo.png"
          alt="Scan and Win logo"
          className="header-logo"
        />
      </Link>

      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/welcome">
              About us
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/mission">
              Prizes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">
              Contact us
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/analysis">
              My position
            </Link>
          </li>
        </ul>
      </nav>
      <div className="advertise-button">
        <svg viewBox="0 0 293 65" fill="none">
          <path d="M0 0V56.66L146.445 50.92L292.891 64.34V7.69L149.543 13.56L0 0Z" fill="#D91A2A" />
        </svg>
        <Link className="advertise-text" to="/register">
          Advertise with us
        </Link>
      </div>
    </header>
    <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  )
}

export default Header
