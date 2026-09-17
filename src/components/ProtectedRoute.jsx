import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - Ensures only logged-in users can access certain pages
 * Also supports role-based access (Business, Rider, Customer)
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="authloading">
        <div className="authspinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified and user's role not allowed → redirect to dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // All good → render the protected component
  return children;
}