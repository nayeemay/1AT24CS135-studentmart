import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [rot, setRot] = useState({ x: -22, y: 34 });
  const [autoSpin, setAutoSpin] = useState(true);
  const [heroPressed, setHeroPressed] = useState(false);

  useEffect(() => {
    const styleId = 'studentmart-3d-cube-styles';
    if (!document.getElementById(styleId)) {
      const el = document.createElement('style');
      el.id = styleId;
      el.textContent = `
        @keyframes smOrbitRing {
          0% { transform: rotateX(68deg) rotateZ(0deg); }
          100% { transform: rotateX(68deg) rotateZ(360deg); }
        }
        @keyframes smPulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes smFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    if (!autoSpin) return;
    const timer = setInterval(() => {
      setRot((prev) => ({
        x: prev.x,
        y: (prev.y + 1.1) % 360
      }));
    }, 30);
    return () => clearInterval(timer);
  }, [autoSpin]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setAutoSpin(false);
    setRot({
      x: Number((-22 - ny * 55).toFixed(1)),
      y: Number((34 + nx * 95).toFixed(1))
    });
  };

  const handleMouseLeave = () => {
    setAutoSpin(true);
  };

  const cubeSize = 180;
  const half = cubeSize / 2;

  const faces = [
    { label: 'BOOKS & NOTES', emoji: '📘', price: 'From ₹85', transform: `translateZ(${half}px)` },
    { label: 'LAB KITS', emoji: '📐', price: 'From ₹350', transform: `rotateY(180deg) translateZ(${half}px)` },
    { label: 'CALCULATORS', emoji: '🧮', price: 'Verified', transform: `rotateY(90deg) translateZ(${half}px)` },
    { label: 'HARDWARE', emoji: '🔌', price: 'Campus Ready', transform: `rotateY(-90deg) translateZ(${half}px)` },
    { label: 'CAMPUS HUB', emoji: '🎓', price: 'StudentMart', transform: `rotateX(90deg) translateZ(${half}px)` },
    { label: 'INSTANT CART', emoji: '🛒', price: '0% Fee', transform: `rotateX(-90deg) translateZ(${half}px)` }
  ];

  return (
    <div style={styles.page}>
      <div style={{ ...styles.glowOrb, top: '-110px', left: '-110px', background: 'rgba(37, 99, 235, 0.28)' }} />
      <div style={{ ...styles.glowOrb, bottom: '-120px', right: '-100px', background: 'rgba(6, 182, 212, 0.22)' }} />

      <div style={styles.container}>
        {/* Left Column */}
        <div style={{ ...styles.leftCol, animation: 'smFadeUp 0.65s ease-out forwards' }}>
          <div style={styles.pillBadge}>
            <span style={styles.liveDot} />
            3D Campus Marketplace • Interactive Space
          </div>

          <h1 style={styles.heroTitle}>
            Everything Students Need,{' '}
            <span style={styles.gradientText}>Right on Campus</span>
          </h1>

          <p style={styles.heroSubtitle}>
            Explore student-listed textbooks, engineering kits, calculators, and project components inside a 3D campus marketplace built for fast peer-to-peer trade.
          </p>

          <div style={styles.ctaRow}>
            <Link
              to="/register"
              onMouseDown={() => setHeroPressed(true)}
              onMouseUp={() => setHeroPressed(false)}
              onMouseLeave={() => setHeroPressed(false)}
              style={{
                ...styles.primaryBtn,
                transform: heroPressed ? 'translateY(2px)' : 'translateY(0px)'
              }}
            >
              Get Started Free →
            </Link>
            <Link to="/login" style={styles.secondaryBtn}>
              Sign In
            </Link>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Campus Items</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: '#60a5fa' }}>100%</div>
              <div style={styles.statLabel}>Student Verified</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: '#67e8f9' }}>0%</div>
              <div style={styles.statLabel}>Platform Fee</div>
            </div>
          </div>
        </div>

        {/* Right Column: Unique 3D Rotating Cube Stage */}
        <div
          style={styles.stageWrapper}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setAutoSpin((s) => !s)}
        >
          <div style={styles.orbitRing} />
          <div style={styles.orbitRingOuter} />

          <div style={styles.perspectiveBox}>
            <div
              style={{
                width: `${cubeSize}px`,
                height: `${cubeSize}px`,
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                transition: autoSpin ? 'transform 0.04s linear' : 'transform 0.12s ease-out'
              }}
            >
              {faces.map((face) => (
                <div
                  key={face.label}
                  style={{
                    ...styles.cubeFace,
                    width: `${cubeSize}px`,
                    height: `${cubeSize}px`,
                    transform: face.transform
                  }}
                >
                  <div style={{ fontSize: '34px', marginBottom: '8px' }}>{face.emoji}</div>
                  <div style={styles.faceTitle}>{face.label}</div>
                  <div style={styles.faceTag}>{face.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.stageCaption}>
            Move cursor to steer 3D cube • Click to {autoSpin ? 'pause' : 'auto-spin'}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 68px)',
    background: 'radial-gradient(circle at 20% 10%, #132242 0%, #0a0f1c 55%, #060912 100%)',
    color: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'system-ui, sans-serif',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  glowOrb: {
    position: 'absolute',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    filter: 'blur(90px)',
    animation: 'smPulseGlow 7s ease-in-out infinite',
    pointerEvents: 'none'
  },
  container: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '48px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
    gap: '48px',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  pillBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    alignSelf: 'flex-start',
    padding: '7px 14px',
    borderRadius: '999px',
    background: 'rgba(37, 99, 235, 0.16)',
    border: '1px solid rgba(96, 165, 250, 0.35)',
    color: '#60a5fa',
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '20px'
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#60a5fa',
    boxShadow: '0 0 10px #60a5fa'
  },
  heroTitle: {
    fontSize: 'clamp(34px, 4.6vw, 54px)',
    fontWeight: '800',
    lineHeight: 1.12,
    letterSpacing: '-0.6px',
    margin: '0 0 18px 0',
    color: '#ffffff'
  },
  gradientText: {
    background: 'linear-gradient(90deg, #60a5fa 0%, #67e8f9 55%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '15.5px',
    lineHeight: 1.65,
    color: '#94a3b8',
    margin: '0 0 28px 0',
    maxWidth: '540px'
  },
  ctaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    marginBottom: '36px'
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    padding: '13px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '14.5px',
    borderTop: '1px solid rgba(255, 255, 255, 0.38)',
    borderBottom: '3px solid #1d4ed8',
    boxShadow: '0 12px 24px -6px rgba(37, 99, 235, 0.6)',
    transition: 'transform 0.12s ease'
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    padding: '13px 22px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: '14.5px',
    borderTop: '1px solid rgba(255, 255, 255, 0.14)',
    borderBottom: '3px solid #060912',
    boxShadow: '0 10px 20px -8px rgba(0, 0, 0, 0.65)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    maxWidth: '460px'
  },
  statCard: {
    padding: '14px 12px',
    borderRadius: '14px',
    background: 'rgba(19, 27, 46, 0.85)',
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    borderBottom: '3px solid #070b14',
    boxShadow: '0 10px 20px -8px rgba(0, 0, 0, 0.6)'
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff'
  },
  statLabel: {
    fontSize: '11.5px',
    color: '#94a3b8',
    marginTop: '2px'
  },
  stageWrapper: {
    position: 'relative',
    minHeight: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  },
  orbitRing: {
    position: 'absolute',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    border: '1px dashed rgba(96, 165, 250, 0.35)',
    animation: 'smOrbitRing 14s linear infinite',
    pointerEvents: 'none'
  },
  orbitRingOuter: {
    position: 'absolute',
    width: '340px',
    height: '340px',
    borderRadius: '50%',
    border: '1px solid rgba(103, 232, 249, 0.16)',
    animation: 'smOrbitRing 22s linear reverse infinite',
    pointerEvents: 'none'
  },
  perspectiveBox: {
    perspective: '900px',
    padding: '36px',
    zIndex: 2
  },
  cubeFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '20px',
    background: 'linear-gradient(155deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.96) 100%)',
    border: '1px solid rgba(96, 165, 250, 0.35)',
    boxShadow: 'inset 0 0 24px rgba(37, 99, 235, 0.2), 0 12px 30px rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '16px',
    boxSizing: 'border-box',
    backfaceVisibility: 'visible'
  },
  faceTitle: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1px',
    color: '#f8fafc',
    marginBottom: '6px'
  },
  faceTag: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#60a5fa',
    padding: '3px 10px',
    borderRadius: '999px',
    background: 'rgba(37, 99, 235, 0.18)',
    border: '1px solid rgba(96, 165, 250, 0.3)'
  },
  stageCaption: {
    marginTop: '24px',
    fontSize: '12px',
    color: '#94a3b8',
    zIndex: 2
  }
};