// ============================================
// NOTIFICATION SERVICE
// All notification-related API operations
// ============================================

import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { ENDPOINTS } from "../api/config";

/**
 * Get all notifications for a specific user
 */
export const getNotificationsByUser = async (userId) => {
  try {
    const notifications = await apiGet(ENDPOINTS.NOTIFICATIONS);
    const userNotifications = notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, notifications: userNotifications };
  } catch (error) {
    return { success: false, error: error.message, notifications: [] };
  }
};

/**
 * Create a new notification
 */
export const createNotification = async (data) => {
  try {
    const newNotification = {
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const notification = await apiPost(ENDPOINTS.NOTIFICATIONS, newNotification);
    return { success: true, notification };
  } catch (error) {
    return { success: false, error: error.message, notification: null };
  }
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (notificationId, currentNotification) => {
  try {
    const updated = {
      ...currentNotification,
      read: true,
    };
    await apiPut(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}`, updated);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId, notifications) => {
  try {
    const unreadOnes = notifications.filter((n) => !n.read);
    await Promise.all(
      unreadOnes.map((n) =>
        apiPut(`${ENDPOINTS.NOTIFICATIONS}/${n.id}`, { ...n, read: true })
      )
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    await apiDelete(`${ENDPOINTS.NOTIFICATIONS}/${notificationId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get unread count
 */
export const getUnreadCount = (notifications) => {
  return notifications.filter((n) => !n.read).length;
};

// ============================================
// EVENT-BASED NOTIFICATIONS
// ============================================

/**
 * Notification templates for different events
 */
const NOTIFICATION_TEMPLATES = {
  RIDER_ASSIGNED: {
    title: "Rider Assigned",
    message: (order) => `${order.rider} has been assigned to order ${order.id}`,
    type: "info",
  },
  DELIVERY_ACCEPTED: {
    title: "Delivery Accepted",
    message: (order) => `${order.rider} accepted order ${order.id}`,
    type: "success",
  },
  ORDER_PICKED_UP: {
    title: "Order Picked Up",
    message: (order) => `Order ${order.id} has been picked up`,
    type: "info",
  },
  IN_TRANSIT: {
    title: "In Transit",
    message: (order) => `Order ${order.id} is on the way`,
    type: "info",
  },
  DELIVERY_COMPLETED: {
    title: "Delivery Completed",
    message: (order) => `Order ${order.id} has been delivered successfully`,
    type: "success",
  },
  ORDER_CANCELLED: {
    title: "Order Cancelled",
    message: (order) => `Order ${order.id} has been cancelled`,
    type: "error",
  },
};

/**
 * Auto-create notification for an order event
 */
export const notifyEvent = async (eventType, order, userId) => {
  const template = NOTIFICATION_TEMPLATES[eventType];
  if (!template) {
    return { success: false, error: "Unknown event type" };
  }

  const notificationData = {
    userId: userId || order.businessId || "U001",
    title: template.title,
    message: template.message(order),
    type: template.type,
    orderId: order.id,
  };

  return await createNotification(notificationData);
};