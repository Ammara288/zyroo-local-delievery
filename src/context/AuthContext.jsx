import React, { createContext, useContext, useState, useEffect } from "react";
import { users as mockUsers } from "../data/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Login
  const login = (email, password) => {
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" };
    }

    const userData = { ...foundUser };
    delete userData.password;

    setUser(userData);
    localStorage.setItem("zyroo_user", JSON.stringify(userData));
    return { success: true, user: userData };
  };

  // Register
  const register = (userData) => {
    const exists = mockUsers.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (exists) {
      return { success: false, error: "Email already registered" };
    }

    const newUser = {
      id: "U" + Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    setUser(userWithoutPassword);
    localStorage.setItem("zyroo_user", JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("zyroo_user");
  };

  // Update profile
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("zyroo_user", JSON.stringify(updatedUser));

    const index = mockUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updates };
    }

    return { success: true };
  };

  const value = {
    user,
    loading,
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