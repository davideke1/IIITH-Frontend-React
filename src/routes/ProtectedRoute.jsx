// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../hooks/user.actions';

// General Protected Route
function ProtectedRoute({ children }) {
  const user = getUser();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

// Admin Protected Route
function AdminProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}

// User Protected Route
function UserProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'user') return <Navigate to="/" />;
  return <>{children}</>;
}

export { ProtectedRoute, AdminProtectedRoute, UserProtectedRoute };