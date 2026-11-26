import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true' || Boolean(localStorage.getItem('adminToken'));
  const userToken = localStorage.getItem('userToken') || localStorage.getItem('token');

  if (adminOnly) {
    return isAdmin ? children : <Navigate to="/admin-login" replace />;
  }

  return userToken || isAdmin ? children : <Navigate to="/login" replace />;
}