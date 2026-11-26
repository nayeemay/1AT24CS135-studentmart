import React from 'react';

export default function About() {
  const features = [
    {
      icon: '🎓',
      title: 'Student-Only Marketplace',
      desc: 'Built for students to buy and sell books, lab tools, calculators, and project components on campus.',
    },
    {
      icon: '🛒',
      title: 'Seamless Cart & Orders',
      desc: 'Add products to your cart, update quantities, and track your campus orders from one dashboard.',
    },
    {
      icon: '🛡️',
      title: 'Admin Portal & Stock Control',
      desc: 'Admins can log in via Admin Portal to manage products, inventory stock, and incoming support queries.',
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerBlock}>
          <span style={styles.kicker}>ABOUT STUDENT MART</span>
          <h1 style={styles.title}>Built for Smarter Campus Commerce</h1>
          <p style={styles.subtitle}>
            StudentMart brings everyday student essentials together in a fast, dark 3D interface with dedicated portals for students and administrators.
          </p>
        </div>

        <div style={styles.grid}>
          {features.map((item) => (
            <div key={item.title} style={styles.card}>
              <div style={styles.iconBox}>{item.icon}</div>
              <h2 style={styles.cardTitle}>{item.title}</h2>
              <p style={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 68px)',
    background: 'radial-gradient(circle at 50% 0%, #132242 0%, #0a0f1c 60%, #060912 100%)',
    color: '#f8fafc',
    padding: '48px 24px',
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  headerBlock: {
    textAlign: 'center',
    maxWidth: '680px',
    margin: '0 auto 44px auto',
  },
  kicker: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    color: '#60a5fa',
  },
  title: {
    fontSize: 'clamp(30px, 4vw, 44px)',
    fontWeight: '800',
    margin: '10px 0 14px 0',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '15px',
    lineHeight: 1.65,
    color: '#94a3b8',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '22px',
  },
  card: {
    background: 'linear-gradient(180deg, rgba(24, 35, 58, 0.92) 0%, rgba(13, 20, 36, 0.96) 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '3px solid #060912',
    borderRadius: '18px',
    padding: '24px',
    boxShadow: '0 18px 36px rgba(0, 0, 0, 0.55)',
  },
  iconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'rgba(37, 99, 235, 0.18)',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: '13.5px',
    lineHeight: 1.6,
    color: '#94a3b8',
    margin: 0,
  },
};