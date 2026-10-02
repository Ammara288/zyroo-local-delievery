import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, updateUserProfile } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("zyroo_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("zyroo_user");
      }
    }
    setLoading(false);
  }, []);

  // Login via API
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        setUser(result.user);
        localStorage.setItem("zyroo_user", JSON.stringify(result.user));
        setLoading(false);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Register via API
  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      const result = await registerUser(userData);

      if (result.success) {
        setUser(result.user);
        localStorage.setItem("zyroo_user", JSON.stringify(result.user));
        setLoading(false);
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        setLoading(false);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("zyroo_user");
  };

  // Update profile via API
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: "Not logged in" };

    try {
      const result = await updateUserProfile(user.id, { ...user, ...updates });

      if (result.success) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("zyroo_user", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}