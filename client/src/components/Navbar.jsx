import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Notes' },
  { to: '/translate', label: 'Translate' },
  { to: '/pdf', label: 'PDF Extract' },
  { to: '/docx', label: 'Word Extract' },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>SmartNotes</span>
      <div style={styles.links}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              ...styles.link,
              ...(location.pathname === link.to ? styles.activeLink : {}),
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '60px',
    background: 'var(--nav-bg)',
    color: 'var(--text-primary)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 300ms ease, border-color 300ms ease',
  },
  logo: { fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent)' },
  links: { display: 'flex', gap: '1.5rem' },
  link: { color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' },
  activeLink: { color: 'var(--accent)', fontWeight: 600 },
};
