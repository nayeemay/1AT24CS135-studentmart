import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5002/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user || res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '400px', color: '#111827' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ fontSize: '14px', color: '#4b5563', textAlign: 'center', marginBottom: '24px' }}>Sign in to your StudentMart account</p>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              placeholder="name@student.com" 
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', backgroundColor: '#111827', color: '#ffffff', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer' }}
          >
            Sign In
          </button>
        </form>
        <p style={{ fontSize: '14px', textAlign: 'center', color: '#4b5563', marginTop: '24px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}