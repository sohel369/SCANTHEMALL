import { Link } from 'react-router-dom';
import './Footer.css'

const footerLinks = {
    company: [
        {
            name: 'Our mission',
            link: '/mission'
        },
        {
            name: 'Why scan them all',
            link: '/welcome'
        },
        {
            name: 'Customer feedback',
            link: '/'
        },
        {
            name: 'Franchise Opportunities',
            link: 'https://rule7media.com/franchise'
        }
    ],
    policy: [
        {
            name: 'Terms of use',
            link: '/terms'
        },
        {
            name: 'Privacy Policy',
            link: '/privacy'
        },
        {
            name: 'FAQs',
            link: '/faq'
        }
    ],
    support: [
        {
            name: 'Blog',
            link: '/blog'
        },
        {
            name: 'Contact us',
            link: '/contact'
        },
        {
            name: 'Advertise With Us',
            link: '/ancillary'
        },
        {
            name: 'Affiliate Program',
            link: '/affiliate'
        }
    ]
}

const year = new Date().getFullYear();

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://rule7media.com/',
        location: "/assets/facebook.png"
    },
    {
        name: 'TikTok',
        href: '#',
        location: "/assets/tiktok.png"
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/rule.7media?igsh=aXNrbDVwZTlyYWhr',
        location: "/assets/instagram.png"
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/@Rule7Media',
        location: "/assets/youtube.png"
    }
]

const Footer = () => {
    return (
        <footer>
            <svg className="svg1" viewBox="0 0 1400 84" fill="none">
                <path d="M1400 28.6396L973.35 0L0 83.8599L1400 28.6396Z" fill="#D91A2A" />
            </svg>
            <svg className="svg2" viewBox="0 0 577 51" fill="none">
                <path d="M576.92 50.8501V0L0 50.8501H576.92Z" fill="#D4A017" />
            </svg>
            <svg className="svg3" viewBox="0 0 1400 87" fill="none">
                <path d="M1400 86.0903H0V0L700 64.3403L1400 0V86.0903Z" fill="white" />
            </svg>
            <svg className="svg4" viewBox="0 0 1400 106" fill="none">
                <path d="M1400 105.09H0V0L700 83.3403L1400 0V105.09Z" fill="#D91A2A" />
            </svg>
            <div className="newsletter">
                <span>Newsletter</span>
                <form className="newsletter-form">
                    <div className="email-input">
                        <svg viewBox="0 0 511 49" fill="none">
                            <path d="M510.92 48.6802H18.66L0 0H492.25L510.92 48.6802Z" fill="white" />
                        </svg>
                        <input type="email" placeholder="Enter your email address" aria-label="Email address" />
                    </div>
                    <div className="subscribe-button">
                        <svg viewBox="0 0 196 49" fill="none">
                            <path d="M195.19 48.6802H18.66L0 0H176.52L195.19 48.6802Z" fill="#D91A2A" />
                        </svg>
                        <span>Subscribe</span>
                    </div>
                </form>
            </div>

            <div className="footer-links">
                <div className="social-column">
                    <div className="social-links">
                        {socialLinks.map((item) => (
                            <a className="social-link" href={item.href} key={item.name} aria-label={item.name}>
                                <img src={item.location} alt={item.name + " image"} />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="footer-columns">
                    <div className="footer-column">
                        <h4>About Us</h4>
                        <ul>
                            {footerLinks.company.map((item) => (
                                <li key={item.name}>
                                    <svg viewBox="0 0 8 16" fill="none">
                                        <path d="M0 0V15.9902L7.99005 8L0 0Z" fill="white" />
                                    </svg>
                                    <Link to={item.link}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Policy</h4>
                        <ul>
                            {footerLinks.policy.map((item) => (
                                <li key={item.name}>
                                    <svg viewBox="0 0 8 16" fill="none">
                                        <path d="M0 0V15.9902L7.99005 8L0 0Z" fill="white" />
                                    </svg>
                                    <Link to={item.link}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Support</h4>
                        <ul>
                            {footerLinks.support.map((item) => (
                                <li key={item.name}>
                                    <svg viewBox="0 0 8 16" fill="none">
                                        <path d="M0 0V15.9902L7.99005 8L0 0Z" fill="white" />
                                    </svg>
                                    <Link to={item.link}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-meta1">
                <svg viewBox="0 0 21 21" fill="none">
                    <path d="M10.341 19.6606C15.4883 19.6606 19.661 15.4881 19.661 10.3408C19.661 5.19353 15.4883 1.021 10.341 1.021C5.19371 1.021 1.021 5.19353 1.021 10.3408C1.021 15.4881 5.19371 19.6606 10.341 19.6606Z" stroke="white" />
                    <path d="M15.281 12.4307C15.011 13.0707 14.621 13.6506 14.131 14.1406C13.641 14.6306 13.071 15.021 12.421 15.291C11.781 15.561 11.071 15.7109 10.331 15.7109C9.591 15.7109 8.881 15.561 8.241 15.291C7.601 15.021 7.021 14.6306 6.531 14.1406C6.041 13.6506 5.651 13.0807 5.381 12.4307C5.111 11.7907 4.961 11.0808 4.961 10.3408C4.961 9.60082 5.111 8.89098 5.381 8.25098C5.651 7.61098 6.041 7.03102 6.531 6.54102C7.021 6.05102 7.591 5.66063 8.241 5.39062C8.881 5.12062 9.591 4.9707 10.331 4.9707C11.071 4.9707 11.781 5.12062 12.421 5.39062C13.061 5.66063 13.641 6.05102 14.131 6.54102C14.621 7.03102 15.011 7.60098 15.281 8.25098" stroke="white" />
                </svg>
                <span>{year} Rule 7 Media. All rights reserved</span>
            </div>
            <div className="footer-meta2">
                <div className="chat-panel">
                    <svg viewBox="0 0 165 32" fill="none">
                        <path d="M164.62 31.0903H17.7299L0 0H146.89L164.62 31.0903Z" fill="white" />
                    </svg>
                    <span>Chat with us</span>
                </div>
                <div className="payment-image">
                    <svg viewBox="0 0 219 40" fill="none">
                        <path d="M199.14 0H0L21.36 39.0703H218.57L199.14 0Z" fill="white" />
                    </svg>
                    <img className="paypal-image" src="/assets/paypal.png" alt="Paypal Image" />
                    <img className="visa-image" src="/assets/visa.png" alt="Visa Image" />
                </div>
            </div>
        </footer>
    )
}

export default Footer
