// ============================================
// AUTHENTICATION SERVICE
// Login, Register, Logout via API
// ============================================

import { apiGet, apiPost } from "./api";
import { ENDPOINTS } from "../api/config";

/**
 * Login user with email and password
 * @returns { success, user, error }
 */
export const loginUser = async (email, password) => {
  try {
    // Get all users from API
    const users = await apiGet(ENDPOINTS.USERS);

    // Find user with matching email + password
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      return { success: false, error: "Invalid email or password" };
    }

    // Remove password before returning
    const { password: _, ...userData } = foundUser;

    return { success: true, user: userData };
  } catch (error) {
    return { success: false, error: error.message || "Login failed" };
  }
};

/**
 * Register new user
 * @returns { success, user, error }
 */
export const registerUser = async (userData) => {
  try {
    // Check if email already exists
    const users = await apiGet(ENDPOINTS.USERS);
    const exists = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (exists) {
      return { success: false, error: "Email already registered" };
    }

    // Generate new ID
    const newId = "U" + String(users.length + 1).padStart(3, "0");

    const newUser = {
      id: newId,
      ...userData,
      createdAt: new Date().toISOString(),
    };

    // POST to API
    await apiPost(ENDPOINTS.USERS, newUser);

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = newUser;

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    return { success: false, error: error.message || "Registration failed" };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { apiPut } = await import("./api");
    const updated = await apiPut(`${ENDPOINTS.USERS}/${userId}`, updates);
    return { success: true, user: updated };
  } catch (error) {
    return { success: false, error: error.message || "Update failed" };
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const { apiGet } = await import("./api");
    const user = await apiGet(`${ENDPOINTS.USERS}/${userId}`);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message || "User not found" };
  }
};