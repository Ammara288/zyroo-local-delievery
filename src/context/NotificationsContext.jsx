import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getNotificationsByUser,
  markAsRead as markAsReadAPI,
  markAllAsRead as markAllAsReadAPI,
  deleteNotification as deleteNotificationAPI,
} from "../services/notificationService";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

const POLL_INTERVAL = 30000; // 30 seconds

export function NotificationsProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // FETCH NOTIFICATIONS
  // ============================================
  const fetchNotifications = useCallback(async (silent = false) => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    if (!silent) setLoading(true);
    setError(null);

    try {
      const result = await getNotificationsByUser(user.id);
      if (result.success) {
        setNotifications(result.notifications);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Initial fetch + when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time polling
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // ============================================
  // MARK AS READ (single)
  // ============================================
  const markAsRead = async (notificationId) => {
    const previous = [...notifications];

    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );

    try {
      const current = notifications.find((n) => n.id === notificationId);
      const result = await markAsReadAPI(notificationId, current);

      if (!result.success) {
        setNotifications(previous);
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      setNotifications(previous);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // MARK ALL AS READ
  // ============================================
  const markAllAsRead = async () => {
    const previous = [...notifications];

    // Optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      const result = await markAllAsReadAPI(user.id, notifications);
      if (!result.success) {
        setNotifications(previous);
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      setNotifications(previous);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // DELETE NOTIFICATION
  // ============================================
  const deleteNotification = async (notificationId) => {
    const previous = [...notifications];

    // Optimistic
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    try {
      const result = await deleteNotificationAPI(notificationId);
      if (!result.success) {
        setNotifications(previous);
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      setNotifications(previous);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // UTILITIES
  // ============================================
  const unreadCount = notifications.filter((n) => !n.read).length;

  const refreshNotifications = () => fetchNotifications(false);

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
}