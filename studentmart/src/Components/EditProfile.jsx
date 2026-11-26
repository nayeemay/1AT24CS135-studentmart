import React, { useState, useEffect } from 'react';

function EditProfileCard3D({ children, style = {}, maxTilt = 5 }) {
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
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-3px)`
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
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.1), transparent 60%)`
              : 'none',
            zIndex: 1
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
      </div>
    </div>
  );
}

const recessedInputStyle = {
  padding: '12px 14px',
  borderRadius: '11px',
  background: '#0b1120',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.08)',
  color: '#fff',
  fontSize: '14px',
  outline: 'none'
};

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('');
  const [college, setCollege] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedUser.name) setName(savedUser.name);
    if (savedUser.email) setEmail(savedUser.email);
    if (savedUser.section) setSection(savedUser.section);
    if (savedUser.college) setCollege(savedUser.college);
  }, []);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedProfile = { name, email, section, college };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setStatusMessage('✅ Profile updated successfully!');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  const navLinks = [
    { label: '📊 Dashboard', path: '/dashboard', active: false },
    { label: '✏️ Edit Profile', path: '/edit-profile', active: true },
    { label: '🛍️ Products', path: '/products', active: false },
    { label: '➕ List a Product', path: '/add-product', active: false },
    { label: '🛒 Shopping Cart', path: '/cart', active: false },
    { label: '📦 My Orders', path: '/orders', active: false }
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
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* 3D Floating Header Deck */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '26px',
              padding: '22px 26px',
              borderRadius: '18px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.94))',
              borderTop: '1px solid rgba(255, 255, 255, 0.16)',
              borderBottom: '4px solid #070b14',
              boxShadow: '0 20px 35px -15px rgba(0, 0, 0, 0.65)',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '26px',
                  fontWeight: '800',
                  color: '#f8fafc',
                  margin: '0 0 4px 0',
                  textShadow: '0 3px 12px rgba(0,0,0,0.45)'
                }}
              >
                Edit Profile
              </h1>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Keep your student information up to date.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => (window.location.href = '/change-password')}
                style={{
                  background: 'linear-gradient(180deg, #475569 0%, #334155 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderTop: '1px solid rgba(255,255,255,0.22)',
                  borderBottom: '3px solid #0f172a',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px -6px rgba(0,0,0,0.5)'
                }}
              >
                🔒 Change Password
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = '/dashboard')}
                style={{
                  background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderTop: '1px solid rgba(255,255,255,0.35)',
                  borderBottom: '3px solid #1d4ed8',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px -6px rgba(37, 99, 235, 0.6)'
                }}
              >
                View Dashboard
              </button>
            </div>
          </div>

          {statusMessage && (
            <div
              style={{
                padding: '13px 18px',
                marginBottom: '22px',
                background: 'linear-gradient(145deg, rgba(6, 95, 70, 0.9), rgba(6, 78, 59, 0.95))',
                color: '#d1fae5',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                borderTop: '1px solid rgba(52, 211, 153, 0.45)',
                borderBottom: '3px solid #022c22',
                boxShadow: '0 12px 24px -10px rgba(6, 95, 70, 0.6)'
              }}
            >
              {statusMessage}
            </div>
          )}

          {/* 3D EDIT PROFILE FORM CARD */}
          <EditProfileCard3D style={{ padding: '30px' }}>
            <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', color: '#94a3b8' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={recessedInputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', color: '#94a3b8' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={recessedInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', color: '#94a3b8' }}>
                    SECTION / YEAR
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g., 3rd Year CSE"
                    style={recessedInputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', color: '#94a3b8' }}>
                    COLLEGE NAME
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g., Atria"
                    style={recessedInputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: '13px 20px',
                  background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderTop: '1px solid rgba(255,255,255,0.35)',
                  borderBottom: '4px solid #1d4ed8',
                  borderRadius: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '8px',
                  fontSize: '15px',
                  boxShadow: '0 12px 22px -6px rgba(37, 99, 235, 0.65)'
                }}
              >
                Save Changes →
              </button>
            </form>
          </EditProfileCard3D>
        </div>
      </main>
    </div>
  );
}