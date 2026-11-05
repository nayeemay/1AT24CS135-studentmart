import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function EditProfile() {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    class: '',
    collegeName: '',
    usn: ''
  });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [passwords, setPasswords] = useState({ current: '', newPassword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/register');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(user));
    alert('Profile updated successfully!');
    navigate('/dashboard');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
    setPasswords({ current: '', newPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/register'); // Redirects to Register page on logout as requested
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      {/* Sidebar Navigation matching screenshot */}
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <span style={{ backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', padding: '10px 14px', borderRadius: '12px', fontSize: '18px' }}>S</span>
            <div>
              <h2 style={{ fontWeight: 'bold', color: '#111827', fontSize: '16px', margin: 0 }}>StudentMart</h2>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Your student space</p>
            </div>
          </div>
          
          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Workspace</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px', color: '#4b5563', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/edit" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px', backgroundColor: '#ede9fe', color: '#4f46e5', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
              <span>✏️</span>
              <span>Edit Profile</span>
            </Link>
          </nav>
        </div>

        <div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', fontWeight: '600', fontSize: '14px', width: '100%', padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Account Settings</p>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>Edit Profile</h1>
          </div>
          <Link to="/dashboard" style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
            View Dashboard
          </Link>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '32px', maxWidth: '700px', margin: '0 auto', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          
          {/* Tabs matching screenshot */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', gap: '32px' }}>
            <button 
              onClick={() => setActiveTab('profile')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '12px', fontWeight: activeTab === 'profile' ? 'bold' : 'normal', color: activeTab === 'profile' ? '#4f46e5' : '#6b7280', borderBottom: activeTab === 'profile' ? '2px solid #4f46e5' : 'none', fontSize: '14px' }}>
              👤 Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('password')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '12px', fontWeight: activeTab === 'password' ? 'bold' : 'normal', color: activeTab === 'password' ? '#4f46e5' : '#6b7280', borderBottom: activeTab === 'password' ? '2px solid #4f46e5' : 'none', fontSize: '14px' }}>
              🔒 Change Password
            </button>
          </div>

          {activeTab === 'profile' ? (
            <>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '24px' }}>Keep your student information accurate and up to date.</p>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Full Name</label>
                  <input type="text" name="fullName" value={user.fullName || ''} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" name="email" value={user.email || ''} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Year</label>
                    <input type="text" name="class" value={user.class || ''} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>College Name</label>
                    <input type="text" name="collegeName" value={user.collegeName || ''} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                  <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    Save Changes →
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '24px' }}>Update your password to keep your account secure.</p>
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Current Password</label>
                  <input type="password" required value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>New Password</label>
                  <input type="password" required value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="••••••••" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                  <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    Update Password →
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </main>
    </div>
  );
}