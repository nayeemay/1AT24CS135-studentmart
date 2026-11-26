import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const publicPaths = ['/', '/about', '/contact', '/login', '/register', '/admin-login'];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <footer
      style={{
        ...styles.footer,
        marginLeft: isPublicPage ? '0px' : '248px',
        width: isPublicPage ? '100%' : 'calc(100% - 248px)'
      }}
    >
      <div style={styles.inner}>
        <div style={styles.brandCol}>
          <div style={styles.brandRow}>
            <div style={styles.badge}>S</div>
            <div>
              <div style={styles.title}>StudentMart</div>
              <div style={styles.sub}>3D Campus Marketplace</div>
            </div>
          </div>
          <p style={styles.desc}>
            Peer-to-peer student marketplace for books, lab essentials, calculators, and campus gear.
          </p>
        </div>

        <div style={styles.linksCol}>
          <div style={styles.heading}>Navigation</div>
          <div style={styles.linkList}>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/about" style={styles.link}>About</Link>
            <Link to="/contact" style={styles.link}>Contact Us</Link>
            <Link to="/login" style={styles.link}>Sign In</Link>
            <Link to="/register" style={styles.link}>Sign Up</Link>
          </div>
        </div>

        <div style={styles.metaCol}>
          <div style={styles.heading}>Campus Desk</div>
          <div style={styles.metaText}>Student Activity Center</div>
          <div style={{ ...styles.metaText, color: '#60a5fa' }}>support@studentmart.edu</div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <span>© {new Date().getFullYear()} StudentMart. All rights reserved.</span>
        <span>Built for Campus Students</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(6, 9, 18, 1) 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#cbd5e1',
    fontFamily: 'system-ui, sans-serif',
    marginTop: 'auto'
  },
  inner: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '28px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    alignItems: 'start'
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  badge: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: '1px solid rgba(255,255,255,0.35)',
    borderBottom: '2px solid #1d4ed8'
  },
  title: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#ffffff'
  },
  sub: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  desc: {
    margin: 0,
    fontSize: '12.5px',
    lineHeight: 1.55,
    color: '#94a3b8',
    maxWidth: '300px'
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  heading: {
    fontSize: '11.5px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#f8fafc',
    marginBottom: '2px'
  },
  linkList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px'
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600'
  },
  metaCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  metaText: {
    fontSize: '13px',
    color: '#94a3b8'
  },
  bottomBar: {
    borderTop: '1px solid rgba(148, 163, 184, 0.14)',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    fontSize: '12px',
    color: '#64748b',
    boxSizing: 'border-box'
  }
};