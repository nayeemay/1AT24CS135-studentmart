import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Change password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get('http://localhost:5002/api/auth/me', config);
        setUser(userRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load profile data');
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        'http://localhost:5002/api/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || 'Error updating password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '3rem', fontFamily: 'sans-serif' }}>Loading workspace...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '240px', background: '#fff', borderRight: '1px solid #e5e7eb', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111', marginBottom: '20px', paddingLeft: '8px' }}>
          STUDENTMART <span style={{ fontSize: '0.75rem', color: '#6b7280', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>APP</span>
        </div>
        
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ textAlign: 'left', padding: '10px 12px', background: activeTab === 'dashboard' ? '#f3f4f6' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'dashboard' ? '600' : '400', color: activeTab === 'dashboard' ? '#111' : '#4b5563', fontSize: '0.9rem' }}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('password')} 
          style={{ textAlign: 'left', padding: '10px 12px', background: activeTab === 'password' ? '#f3f4f6' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'password' ? '600' : '400', color: activeTab === 'password' ? '#111' : '#4b5563', fontSize: '0.9rem' }}
        >
          Password
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '24px' }}>Workspace / Dashboard</div>

        {activeTab === 'dashboard' ? (
          <div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #667eea' }} />
                ) : (
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>Student Profile</div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#111', margin: '0 0 4px 0' }}>{user?.name}</h1>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: 0 }}>
                  {user?.email} {user?.class ? `• ${user.class}` : ''} {user?.section ? `(${user.section})` : ''}
                </p>
              </div>
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>Class & Section</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111', marginBottom: '4px' }}>
                  {user?.class || 'Not specified'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>{user?.section ? `Section: ${user.section}` : 'No section assigned'}</div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>Account Status</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#059669', marginBottom: '4px' }}>Active Student</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>• Signed in securely</div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>Security</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111', marginBottom: '4px' }}>Password</div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer' }} onClick={() => setActiveTab('password')}>Manage password →</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111', margin: '0 0 6px 0' }}>Quick actions</h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 16px 0' }}>Manage your account using the actions below.</p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setActiveTab('password')}
                  style={{ padding: '8px 16px', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}
                >
                  Edit password
                </button>
                <button 
                  onClick={handleLogout}
                  style={{ padding: '8px 16px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Password Tab */
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111', margin: '0 0 6px 0' }}>Change Password</h2>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 24px 0' }}>Ensure your account is using a secure password.</p>

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              <button type="submit" style={{ padding: '10px 16px', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', marginTop: '8px' }}>
                Update password
              </button>
            </form>

            {passwordMessage && (
              <p style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: '600', color: passwordMessage.includes('successfully') ? '#059669' : '#dc2626' }}>
                {passwordMessage}
              </p>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '48px' }}>
          © 2026 STUDENTMART Account dashboard
        </div>
      </div>

    </div>
  );
}

export default Dashboard;