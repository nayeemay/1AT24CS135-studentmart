import React, { useState } from 'react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5002/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          window.location.href = '/edit-profile';
        }, 1500);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Error connecting to server');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', padding: '24px 16px', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: '#000000', color: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: 0 }}>StudentMart</h2>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Your student space</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={() => window.location.href = '/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
              📊 Dashboard
            </button>
            <button onClick={() => window.location.href = '/edit-profile'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
              ✏️ Edit Profile
            </button>
            <button onClick={() => window.location.href = '/products'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
              🛍️ Products
            </button>
            <button onClick={() => window.location.href = '/add-product'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
              ➕ List a Product
            </button>
            <button onClick={() => window.location.href = '/cart'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
              🛒 Shopping Cart
            </button>
            <button onClick={() => window.location.href = '/orders'} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', background: 'transparent', color: '#4b5563', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'left' }}>
              📦 My Orders
            </button>
          </nav>
        </div>

        <div>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 12px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', justifyContent: 'center' }}>
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Change Password</h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Secure your account with a new password.</p>
          </div>
          <button onClick={() => window.location.href = '/edit-profile'} style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            Back to Edit Profile
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', marginBottom: '20px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {statusMessage && (
          <div style={{ padding: '12px 16px', marginBottom: '20px', background: '#ecfdf5', color: '#065f46', borderRadius: '8px', fontSize: '14px', border: '1px solid #a7f3d0' }}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ background: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>CURRENT PASSWORD</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" required style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>NEW PASSWORD</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" required style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} />
          </div>

          <button type="submit" style={{ padding: '12px', background: '#111827', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', fontSize: '15px' }}>
            Update Password →
          </button>
        </form>
      </div>
    </div>
  );
}