import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    usn: '',
    collegeName: '',
    course: '',
    class: '',
    section: '',
    profilePicture: '',
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
      await axios.post('http://localhost:5002/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error during registration');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Create Student Account</h2>
        <p className="text-gray-500 text-center mb-6">Join the StudentMart campus marketplace</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="Nayeema Banu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="name@student.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">USN / Roll Number</label>
              <input type="text" name="usn" required value={formData.usn} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="2GI23CS..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">College Name</label>
              <input type="text" name="collegeName" required value={formData.collegeName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="KLE Tech / BVB" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input type="text" name="course" required value={formData.course} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="CSE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year / Class</label>
              <input type="text" name="class" required value={formData.class} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="3rd Year" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input type="text" name="section" required value={formData.section} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="Section A" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture URL (Optional)</label>
            <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="https://example.com/photo.jpg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 font-semibold">Sign Up</button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}