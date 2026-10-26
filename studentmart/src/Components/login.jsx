import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5002/api/auth/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      setMessage('Login successful!');

      // Save token & user info return by backend
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else {
        localStorage.setItem('token', 'authenticated'); // fallback token
      }

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        localStorage.setItem('user', JSON.stringify({ email }));
      }

      // Redirect directly to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Invalid email or password');
      }
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>

      {message && <div style={{ marginTop: '1rem', color: message.includes('successful') ? 'green' : 'red' }}>{message}</div>}

      <p style={{ marginTop: '1rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;