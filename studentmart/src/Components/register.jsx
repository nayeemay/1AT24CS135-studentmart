import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterCard3D({ children, style = {}, maxTilt = 6 }) {
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
    <div style={{ perspective: '1300px', width: '100%', maxWidth: '460px' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          background: 'linear-gradient(155deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '22px',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
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
            ? '0 28px 48px -14px rgba(0, 0, 0, 0.78), 0 0 26px rgba(59, 130, 246, 0.22)'
            : '0 18px 36px -12px rgba(0, 0, 0, 0.68)',
          ...style
        }}
      >
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            borderRadius: '22px',
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

const recessedInputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '11px',
  background: '#0b1120',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.08)',
  color: '#ffffff',
  fontSize: '13.5px',
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  color: '#cbd5e1',
  marginBottom: '6px'
};

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('3rd year');
  const [collegeName, setCollegeName] = useState('Atria');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          usn,
          email,
          password,
          role: 'user',
          class: year,
          collegeName
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      navigate('/login');
    } catch (err) {
      if (email.trim() !== '') {
        localStorage.setItem(
          'user',
          JSON.stringify({ fullName, usn, email, class: year, collegeName, role: 'user' })
        );
        navigate('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 68px)',
        width: '100%',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at 20% 15%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px'
      }}
    >
      <RegisterCard3D style={{ padding: '34px 36px', color: '#ffffff' }}>
        <div style={{ transform: 'translateZ(18px)' }}>
          {/* Floating 3D Emblem & Title */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                margin: '0 auto 12px auto',
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#ffffff',
                borderRadius: '13px',
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderBottom: '3px solid #1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '20px',
                boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.65)'
              }}
            >
              S
            </div>
            <h1
              style={{
                fontSize: '23px',
                fontWeight: '800',
                margin: '0 0 4px 0',
                letterSpacing: '0.4px',
                textShadow: '0 3px 12px rgba(0,0,0,0.45)'
              }}
            >
              STUDENT MART
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Your Campus. Your 3D Marketplace.
            </p>
          </div>

          <h2
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#f8fafc',
              margin: '0 0 16px 0',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.18)'
            }}
          >
            Create Student Account
          </h2>

          {error && (
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(127, 29, 29, 0.92), rgba(69, 10, 10, 0.96))',
                borderTop: '1px solid rgba(252, 165, 165, 0.35)',
                borderBottom: '3px solid #450a0a',
                color: '#fca5a5',
                padding: '11px 14px',
                borderRadius: '11px',
                fontSize: '12.5px',
                textAlign: 'center',
                marginBottom: '14px',
                boxShadow: '0 10px 18px -8px rgba(127, 29, 29, 0.6)'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={recessedInputStyle}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>University Seat Number (USN)</label>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                style={recessedInputStyle}
                placeholder="Enter your USN"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={recessedInputStyle}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={recessedInputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>College</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  style={recessedInputStyle}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...recessedInputStyle, paddingRight: '56px' }}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(30, 41, 59, 0.85)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    color: '#93c5fd',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: '700',
                padding: '13px',
                borderRadius: '11px',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.35)',
                borderBottom: '4px solid #1d4ed8',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                marginTop: '6px',
                opacity: loading ? 0.75 : 1,
                boxShadow: '0 12px 22px -6px rgba(37, 99, 235, 0.65)'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#60a5fa', fontWeight: '700', textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>

          <div
            style={{
              marginTop: '14px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#94a3b8',
              borderTop: '1px solid rgba(148, 163, 184, 0.18)',
              paddingTop: '14px'
            }}
          >
            Are you an Administrator?{' '}
            <Link to="/admin-login" style={{ color: '#60a5fa', fontWeight: '700', textDecoration: 'none' }}>
              🔐 Admin Login →
            </Link>
          </div>
        </div>
      </RegisterCard3D>
    </div>
  );
}