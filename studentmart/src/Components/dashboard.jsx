import React, { useState, useEffect } from 'react';

function DashboardCard3D({ children, style = {}, maxTilt = 7 }) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: Number(((0.5 - relY) * maxTilt).toFixed(2)),
      rotateY: Number(((relX - 0.5) * maxTilt).toFixed(2)),
      glowX: Math.round(relX * 100),
      glowY: Math.round(relY * 100),
      hovered: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, hovered: false });
  };

  return (
    <div style={{ perspective: '1200px' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          background: 'linear-gradient(155deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.16)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          borderRight: '1px solid rgba(15, 23, 42, 0.9)',
          borderBottom: '4px solid #070b14',
          transformStyle: 'preserve-3d',
          transform: tilt.hovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: tilt.hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
          boxShadow: tilt.hovered
            ? '0 26px 42px -14px rgba(0, 0, 0, 0.72), 0 0 22px rgba(59, 130, 246, 0.2)'
            : '0 16px 30px -12px rgba(0, 0, 0, 0.6)',
          ...style
        }}
      >
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            borderRadius: '18px',
            background: tilt.hovered
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.11), transparent 60%)`
              : 'none',
            zIndex: 1
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState({ name: 'Student', email: 'student@campus.com', college: 'Atria' });

  useEffect(() => {
    // Load profile info if saved in localStorage
    const savedUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedUser.name) {
      setUser(savedUser);
    }
  }, []);

  const navLinks = [
    { label: '📊 Dashboard', path: '/dashboard', active: true },
    { label: '✏️ Edit Profile', path: '/edit-profile', active: false },
    { label: '🛍️ Products', path: '/products', active: false },
    { label: '➕ List a Product', path: '/add-product', active: false },
    { label: '🛒 Shopping Cart', path: '/cart', active: false },
    { label: '📦 My Orders', path: '/orders', active: false }
  ];

  const quickTiles = [
    { title: 'Browse Marketplace', desc: 'Explore 3D campus essentials & supplies', icon: '🛍️', path: '/products', accent: '#3b82f6' },
    { title: 'Shopping Cart', desc: 'Review items & trace live delivery GPS', icon: '🛒', path: '/cart', accent: '#10b981' },
    { title: 'My Orders', desc: 'Track placed, packed & delivered orders', icon: '📦', path: '/orders', accent: '#8b5cf6' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'radial-gradient(circle at 18% 12%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* 3D ELEVATED SIDEBAR */}
      <aside
        style={{
          width: '270px',
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.97) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '12px 0 32px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          padding: '26px 18px',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* 3D Brand Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px',
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.75)',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              borderBottom: '3px solid #060913'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#ffffff',
                borderRadius: '11px',
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderBottom: '3px solid #1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '18px',
                boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.6)'
              }}
            >
              S
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>StudentMart</h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>3D Student Space</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => (window.location.href = item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '11px 14px',
                  background: item.active
                    ? 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)'
                    : 'linear-gradient(180deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.9) 100%)',
                  color: item.active ? '#ffffff' : '#cbd5e1',
                  border: 'none',
                  borderTop: item.active
                    ? '1px solid rgba(255,255,255,0.35)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderBottom: item.active ? '3px solid #1d4ed8' : '3px solid #070b14',
                  borderRadius: '11px',
                  fontSize: '14px',
                  fontWeight: item.active ? '700' : '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: item.active
                    ? '0 10px 18px -6px rgba(37, 99, 235, 0.55)'
                    : '0 6px 12px -6px rgba(0, 0, 0, 0.45)',
                  transition: 'transform 0.15s ease'
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '11px 14px',
              background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: '3px solid #991b1b',
              borderRadius: '11px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              justifyContent: 'center',
              boxShadow: '0 10px 18px -6px rgba(220, 38, 38, 0.55)'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN 3D CONTENT AREA */}
      <main style={{ flex: 1, padding: '40px 32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* 3D Floating Welcome Header */}
          <div
            style={{
              marginBottom: '28px',
              padding: '22px 26px',
              borderRadius: '18px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.94))',
              borderTop: '1px solid rgba(255, 255, 255, 0.16)',
              borderBottom: '4px solid #070b14',
              boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.65)'
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#f8fafc',
                margin: '0 0 6px 0',
                textShadow: '0 3px 12px rgba(0,0,0,0.45)'
              }}
            >
              Welcome back, {user.name}! 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Here is your 3D StudentMart profile overview & quick campus shortcuts.
            </p>
          </div>

          {/* 3D PROFILE SUMMARY CARD */}
          <DashboardCard3D style={{ padding: '28px', maxWidth: '640px', marginBottom: '28px' }}>
            <div style={{ transform: 'translateZ(16px)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                  paddingBottom: '12px',
                  marginBottom: '18px'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  🪪 Profile Summary
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#6ee7b7',
                    background: 'rgba(16, 185, 129, 0.14)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '999px'
                  }}
                >
                  Active Student
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '14px' }}>
                <div
                  style={{
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: '#0b1120',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.6)',
                    color: '#e2e8f0'
                  }}
                >
                  <strong style={{ color: '#94a3b8' }}>Name:</strong> {user.name}
                </div>
                <div
                  style={{
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: '#0b1120',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.6)',
                    color: '#e2e8f0'
                  }}
                >
                  <strong style={{ color: '#94a3b8' }}>Email:</strong> {user.email}
                </div>
                <div
                  style={{
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: '#0b1120',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.6)',
                    color: '#e2e8f0'
                  }}
                >
                  <strong style={{ color: '#94a3b8' }}>College / Section:</strong> {user.college || 'Atria'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => (window.location.href = '/edit-profile')}
                style={{
                  background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderTop: '1px solid rgba(255,255,255,0.35)',
                  borderBottom: '4px solid #1d4ed8',
                  padding: '11px 20px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px -6px rgba(37, 99, 235, 0.6)'
                }}
              >
                Edit Profile Details →
              </button>
            </div>
          </DashboardCard3D>

          {/* 3D QUICK-ACTION TILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
            {quickTiles.map((tile) => (
              <div
                key={tile.path}
                onClick={() => (window.location.href = tile.path)}
                style={{ cursor: 'pointer' }}
              >
                <DashboardCard3D style={{ padding: '20px', height: '100%' }} maxTilt={10}>
                  <div style={{ transform: 'translateZ(18px)' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '11px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: `1px solid ${tile.accent}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        marginBottom: '12px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.45)'
                      }}
                    >
                      {tile.icon}
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                      {tile.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
                      {tile.desc}
                    </p>
                  </div>
                </DashboardCard3D>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}