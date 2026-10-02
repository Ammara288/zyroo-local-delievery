// ============================================
// API CONFIGURATION
// Central place for API URLs and endpoints
// ============================================

// Base URL for the API
// In production, this comes from environment variable
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// API Endpoints
export const ENDPOINTS = {
  USERS: "/users",
  RIDERS: "/riders",
  ORDERS: "/orders",
  NOTIFICATIONS: "/notifications",
};

// Request timeout (milliseconds)
export const REQUEST_TIMEOUT = 10000;

// HTTP Methods
export const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Helper: Build full URL
export const buildUrl = (endpoint) => `${API_URL}${endpoint}`;

// Helper: Get auth token from localStorage
export const getAuthToken = () => {
  try {
    const user = localStorage.getItem("zyroo_user");
    return user ? JSON.parse(user).id : null;
  } catch {
    return null;
  }
};