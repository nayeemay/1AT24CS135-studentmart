import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    usn: '',
    collegeName: '',
    class: '',
    section: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5002/api/auth/register', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user || formData));
      navigate('/dashboard');
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Error during registration');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', width: '100%', maxWidth: '500px', color: '#111827' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ fontSize: '14px', color: '#4b5563', textAlign: 'center', marginBottom: '24px' }}>Join the StudentMart campus marketplace</p>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Full Name</label>
            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="Nayeema Banu" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="name@student.com" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>USN</label>
              <input type="text" name="usn" required value={formData.usn} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="USN" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>College Name</label>
              <input type="text" name="collegeName" required value={formData.collegeName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="College Name" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Year</label>
              <input type="text" name="class" required value={formData.class} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="3rd Year" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Section</label>
              <input type="text" name="section" required value={formData.section} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="Sec A" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#374151', marginBottom: '6px' }}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} placeholder="••••••••" />
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#111827', color: '#ffffff', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
            Sign Up
          </button>
        </form>
        <p style={{ fontSize: '14px', textAlign: 'center', color: '#4b5563', marginTop: '24px' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}