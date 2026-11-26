import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

function NavLink3D({ to, label, active, variant = 'default', isSidebar = false, indent = false }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isPrimary = variant === 'primary';

  const getBackground = () => {
    if (active || isPrimary) {
      return 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)';
    }
    return hovered
      ? 'linear-gradient(180deg, rgba(51, 65, 85, 0.92) 0%, rgba(30, 41, 59, 0.96) 100%)'
      : 'linear-gradient(180deg, rgba(30, 41, 59, 0.72) 0%, rgba(15, 23, 42, 0.9) 100%)';
  };

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isSidebar ? 'flex-start' : 'center',
        textDecoration: 'none',
        color: active || isPrimary ? '#ffffff' : hovered ? '#f8fafc' : '#cbd5e1',
        fontSize: indent ? '13.5px' : isSidebar ? '14.5px' : '13.5px',
        fontWeight: active || isPrimary ? '700' : '600',
        padding: indent ? '9px 12px 9px 22px' : isSidebar ? '11px 14px' : '9px 15px',
        borderRadius: '11px',
        background: getBackground(),
        borderTop:
          active || isPrimary
            ? '1px solid rgba(255, 255, 255, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom:
          active || isPrimary
            ? '3px solid #1d4ed8'
            : '3px solid #070b14',
        transform: pressed
          ? 'translateY(2px)'
          : hovered || active
            ? isSidebar
              ? 'translateX(3px)'
              : 'translateY(-1px)'
            : 'translate(0px, 0px)',
        boxShadow:
          active || isPrimary
            ? '0 10px 18px -6px rgba(37, 99, 235, 0.58)'
            : hovered
              ? '0 10px 18px -8px rgba(0, 0, 0, 0.65)'
              : '0 6px 12px -6px rgba(0, 0, 0, 0.45)',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [logoutPressed, setLogoutPressed] = useState(false);

  if (location.pathname === '/admin') {
    return null;
  }

  const publicPaths = ['/', '/about', '/contact', '/login', '/register', '/admin-login'];
  const isPublicPage = publicPaths.includes(location.pathname);

  const activeAdminTab =
    location.pathname === '/admin' ? searchParams.get('tab') || 'products' : null;

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isPublicPage) {
    return (
      <header style={styles.topNavbar}>
        <div style={styles.topNavInner}>
          <Link to="/" style={styles.topLogoLink}>
            <div style={styles.logoBadge}>S</div>
            <div>
              <h2 style={styles.logoText}>StudentMart</h2>
              <span style={styles.logoSubtext}>3D Campus Space</span>
            </div>
          </Link>

          <nav style={styles.topNavLinks}>
            <NavLink3D to="/" label="Home" active={location.pathname === '/'} />
            <NavLink3D to="/about" label="About" active={location.pathname === '/about'} />
            <NavLink3D to="/contact" label="Contact Us" active={location.pathname === '/contact'} />

            <div style={styles.divider} />

            <NavLink3D to="/login" label="Sign In" active={location.pathname === '/login'} />
            <NavLink3D
              to="/register"
              label="Sign Up"
              active={location.pathname === '/register'}
              variant="primary"
            />
          </nav>
        </div>
      </header>
    );
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <div style={styles.logoBadge}>S</div>
        <div>
          <h2 style={styles.logoText}>StudentMart</h2>
          <span style={styles.logoSubtext}>3D Campus Space</span>
        </div>
      </div>

      <nav style={styles.navLinks}>
        <NavLink3D
          to="/"
          label="🏠 Public Home"
          active={location.pathname === '/'}
          isSidebar
        />
        <NavLink3D
          to="/products"
          label="🛍️ Products"
          active={location.pathname === '/products'}
          isSidebar
        />
        <NavLink3D
          to="/cart"
          label="🛒 Cart"
          active={location.pathname === '/cart'}
          isSidebar
        />
        <NavLink3D
          to="/dashboard"
          label="📊 Dashboard"
          active={location.pathname === '/dashboard'}
          isSidebar
        />
        {isAdmin && (
          <>
            <NavLink3D
              to="/admin?tab=products"
              label="🛡️ Admin Dashboard"
              active={location.pathname === '/admin'}
              isSidebar
            />
            <NavLink3D
              to="/admin?tab=products"
              label="📦 Manage Products"
              active={activeAdminTab === 'products'}
              isSidebar
              indent
            />
            <NavLink3D
              to="/admin?tab=orders"
              label="🧾 Manage Orders"
              active={activeAdminTab === 'orders'}
              isSidebar
              indent
            />
            <NavLink3D
              to="/admin?tab=users"
              label="👥 Manage Users"
              active={activeAdminTab === 'users'}
              isSidebar
              indent
            />
          </>
        )}
      </nav>

      <div style={styles.bottomSection}>
        <button
          type="button"
          onClick={handleLogout}
          onMouseDown={() => setLogoutPressed(true)}
          onMouseUp={() => setLogoutPressed(false)}
          onMouseLeave={() => setLogoutPressed(false)}
          style={{
            ...styles.logoutBtn,
            transform: logoutPressed ? 'translateY(2px)' : 'translateY(0px)'
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  topNavbar: {
    width: '100%',
    boxSizing: 'border-box',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.97) 100%)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.55)',
    fontFamily: 'system-ui, sans-serif'
  },
  topNavInner: {
    width: '100%',
    maxWidth: 'none',
    boxSizing: 'border-box',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '14px'
  },
  topLogoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  },
  topNavLinks: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'rgba(148, 163, 184, 0.25)',
    margin: '0 4px'
  },
  sidebar: {
    width: '248px',
    height: '100vh',
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 55%, rgba(6, 9, 19, 1) 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    padding: '22px 18px',
    boxSizing: 'border-box',
    zIndex: 1000,
    boxShadow: '14px 0 34px rgba(0, 0, 0, 0.65)',
    fontFamily: 'system-ui, sans-serif'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '22px',
    padding: '12px',
    borderRadius: '14px',
    background: 'rgba(11, 17, 32, 0.85)',
    borderTop: '1px solid rgba(255, 255, 255, 0.14)',
    borderBottom: '3px solid #050811',
    boxShadow: '0 10px 20px -8px rgba(0, 0, 0, 0.6)'
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '11px',
    background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
    color: '#ffffff',
    borderTop: '1px solid rgba(255, 255, 255, 0.4)',
    borderBottom: '3px solid #1d4ed8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '18px',
    boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.65)'
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#f8fafc',
    margin: 0,
    letterSpacing: '-0.2px'
  },
  logoSubtext: {
    fontSize: '11.5px',
    color: '#94a3b8'
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    overflowY: 'auto'
  },
  bottomSection: {
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(148, 163, 184, 0.18)'
  },
  logoutBtn: {
    width: '100%',
    padding: '11px 14px',
    background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
    color: '#ffffff',
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.3)',
    borderBottom: '3px solid #991b1b',
    borderRadius: '11px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 10px 18px -6px rgba(220, 38, 38, 0.55)',
    transition: 'transform 0.1s ease, box-shadow 0.2s ease'
  }
};