'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: 'Collections', href: '/collections' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'Inspiration', href: '/inspiration' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ];

  const supportLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping & Delivery', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Track Order', href: '/track-order' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Main Content Grid */}
        <div className={styles.footerGrid}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.brandLogo}>
              <span className={styles.brandChar}>F</span>
              <span className={styles.brandCharAccent}>U</span>
              <span className={styles.brandChar}>R</span>
              <span className={styles.brandChar}>N</span>
              <span className={styles.brandCharAccent}>I</span>
              <span className={styles.brandCharAccent}>S</span>
              <span className={styles.brandCharAccent}>H</span>
              <span className={styles.brandChar}>.</span>
              <span className={styles.brandCharAccent}>E</span>
              <span className={styles.brandCharAccent}>S</span>
            </div>
            <p className={styles.brandTagline}>
              Designed for urban living.<br />
              Crafted with care, delivered with precision.
            </p>
            
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <a href="mailto:hello@furnish.es" className={styles.contactLink}>
                hello@furnish.es
              </a>
              <span className={styles.contactDetail}>+65 6123 4567</span>
              <span className={styles.contactDetail}>
                123 Design Street, #05-01<br />
                Singapore 018956
              </span>
            </div>
          </div>

          {/* Shop Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <ul className={styles.linkList}>
              {shopLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Company</h4>
            <ul className={styles.linkList}>
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className={styles.linkColumn}>
            <h4 className={styles.columnTitle}>Support</h4>
            <ul className={styles.linkList}>
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className={styles.newsletterSection}>
            <h4 className={styles.columnTitle}>Stay Connected</h4>
            <p className={styles.newsletterText}>
              Get design tips, exclusive offers, and early access to new collections.
            </p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
                aria-label="Email for newsletter"
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>

            {/* Social Icons */}
            <div className={styles.socialLinks}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Pinterest"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12c0-2.5 1.5-5 4-5s4 2.5 4 5c0 3-1.5 5-4 5" />
                  <path d="M9 18l1.5-6" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Furnishes. All rights reserved.
          </p>

          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.legalSeparator}>·</span>
            <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
            <span className={styles.legalSeparator}>·</span>
            <Link href="/cookies" className={styles.legalLink}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
