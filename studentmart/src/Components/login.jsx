import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginCard3D({ children, style = {}, maxTilt = 7 }) {
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
    <div style={{ perspective: '1300px', width: '100%', maxWidth: '420px' }}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          background: 'linear-gradient(155deg, rgba(30, 41, 59, 0.94) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '20px',
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
            borderRadius: '20px',
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
  padding: '12px 14px',
  borderRadius: '11px',
  background: '#0b1120',
  border: '1px solid rgba(148, 163, 184, 0.25)',
  boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.08)',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        if (data.token) {
          localStorage.setItem('userToken', data.token);
        }
        if (data.isAdmin || email.includes('admin')) {
          localStorage.setItem('isAdmin', 'true');
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 68px)',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at 20% 15%, #1e293b 0%, #0b1120 55%, #060913 100%)',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <LoginCard3D style={{ padding: '40px 36px' }}>
        <div style={{ transform: 'translateZ(18px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 14px auto',
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#ffffff',
                borderRadius: '14px',
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderBottom: '3px solid #1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '22px',
                boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.65)'
              }}
            >
              S
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 6px 0',
                letterSpacing: '0.4px',
                textShadow: '0 3px 12px rgba(0,0,0,0.45)'
              }}
            >
              STUDENT MART
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              3D Campus Marketplace Login
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '12px 14px',
                marginBottom: '18px',
                background: 'linear-gradient(145deg, rgba(127, 29, 29, 0.92), rgba(69, 10, 10, 0.96))',
                color: '#fca5a5',
                borderRadius: '11px',
                fontSize: '13px',
                borderTop: '1px solid rgba(252, 165, 165, 0.35)',
                borderBottom: '3px solid #450a0a',
                boxShadow: '0 10px 18px -8px rgba(127, 29, 29, 0.6)'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#cbd5e1',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@student.com"
                required
                style={recessedInputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#cbd5e1',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={recessedInputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px',
                background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                borderTop: '1px solid rgba(255,255,255,0.35)',
                borderBottom: '4px solid #1d4ed8',
                borderRadius: '11px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                marginTop: '8px',
                boxShadow: '0 12px 22px -6px rgba(37, 99, 235, 0.65)',
                transition: 'transform 0.12s ease, opacity 0.2s ease',
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Don&apos;t have an account? </span>
              <Link
                to="/register"
                style={{ fontSize: '13px', color: '#60a5fa', textDecoration: 'none', fontWeight: '700' }}
              >
                Create Account
              </Link>
            </div>
            <div>
              <Link
                to="/admin-login"
                style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none', fontWeight: '700' }}
              >
                🔐 Admin Portal Login
              </Link>
            </div>
          </div>
        </div>
      </LoginCard3D>
    </div>
  );
}