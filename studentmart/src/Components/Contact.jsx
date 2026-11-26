import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('studentmart_messages') || '[]');
    const entry = {
      id: Date.now(),
      ...form,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem('studentmart_messages', JSON.stringify([entry, ...existing]));
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Left Info Card */}
        <div style={styles.infoPanel}>
          <span style={styles.kicker}>SUPPORT & FEEDBACK</span>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>
            Have a question about an order, product listing, or your StudentMart account? Reach out directly.
          </p>

          <div style={styles.infoBox}>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>CAMPUS HELPDESK</div>
              <div style={styles.infoValue}>Student Activity Center, Main Campus</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>SUPPORT EMAIL</div>
              <div style={{ ...styles.infoValue, color: '#60a5fa' }}>support@studentmart.edu</div>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.infoLabel}>HOURS</div>
              <div style={styles.infoValue}>Mon – Sat • 9:00 AM – 6:00 PM</div>
            </div>
          </div>
        </div>

        {/* Right 3D Form Card */}
        <div style={styles.formCard}>
          {submitted && (
            <div style={styles.successBanner}>
              ✓ Your message has been sent!
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div>
              <label style={styles.label}>FULL NAME</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>STUDENT EMAIL</label>
              <input
                type="email"
                required
                placeholder="name@student.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>SUBJECT</label>
              <input
                type="text"
                required
                placeholder="Product listing / Order / Account help"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>MESSAGE</label>
              <textarea
                rows="4"
                required
                placeholder="Write your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => setPressed(false)}
              style={{
                ...styles.submitBtn,
                transform: pressed ? 'translateY(2px)' : 'translateY(0px)',
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 68px)',
    background: 'radial-gradient(circle at 80% 10%, #132242 0%, #0a0f1c 60%, #060912 100%)',
    color: '#f8fafc',
    padding: '48px 24px',
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '1040px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px',
    alignItems: 'start',
  },
  infoPanel: {
    paddingTop: '8px',
  },
  kicker: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '1.2px',
    color: '#60a5fa',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '8px 0 12px 0',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '14.5px',
    lineHeight: 1.6,
    color: '#94a3b8',
    margin: '0 0 24px 0',
  },
  infoBox: {
    background: 'rgba(19, 27, 46, 0.9)',
    borderTop: '1px solid rgba(255, 255, 255, 0.14)',
    borderBottom: '3px solid #060912',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoRow: {},
  infoLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    color: '#64748b',
    marginBottom: '3px',
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  formCard: {
    background: 'linear-gradient(180deg, rgba(24, 35, 58, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.16)',
    borderBottom: '4px solid #050811',
    borderRadius: '20px',
    padding: '28px',
    boxShadow: '0 24px 50px rgba(0, 0, 0, 0.65)',
  },
  successBanner: {
    marginBottom: '16px',
    padding: '12px 14px',
    borderRadius: '11px',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(52, 211, 153, 0.35)',
    color: '#6ee7b7',
    fontSize: '13px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    color: '#94a3b8',
    marginBottom: '7px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '11px',
    background: '#0a0f1c',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'system-ui, sans-serif',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    marginTop: '4px',
    borderRadius: '12px',
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.35)',
    borderBottom: '3px solid #1d4ed8',
    background: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)',
    color: '#ffffff',
    fontSize: '14.5px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 12px 22px -6px rgba(37, 99, 235, 0.6)',
    transition: 'transform 0.1s ease',
  },
};