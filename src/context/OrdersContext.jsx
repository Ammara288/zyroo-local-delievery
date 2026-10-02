import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAllOrders,
  getOrdersByRole,
  createOrder as createOrderAPI,
  updateOrder as updateOrderAPI,
  deleteOrder as deleteOrderAPI,
  assignRider as assignRiderAPI,
  updateOrderStatus as updateOrderStatusAPI,
} from "../services/orderService";
import { notifyEvent } from "../services/notificationService";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext();

// Polling interval (30 seconds)
const POLL_INTERVAL = 30000;

export function OrdersProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ============================================
  // FETCH ORDERS
  // ============================================
  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      // If user is logged in, fetch by role; otherwise fetch all
      const result = isAuthenticated && user
        ? await getOrdersByRole(user)
        : await getAllOrders();

      if (result.success) {
        setOrders(result.orders);
        setLastUpdated(new Date());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Initial fetch + Re-fetch when user changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ============================================
  // REAL-TIME POLLING
  // ============================================
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchOrders(true); // Silent refresh
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchOrders]);

  // ============================================
  // CREATE ORDER
  // ============================================
  const createOrder = async (orderData) => {
    // Optimistic: Add temporary order
    const tempOrder = {
      id: "TEMP-" + Date.now(),
      ...orderData,
      status: "Pending",
      _optimistic: true,
    };
    setOrders((prev) => [tempOrder, ...prev]);

    try {
      const result = await createOrderAPI(orderData);

      if (result.success) {
        // Replace temp with real order
        setOrders((prev) =>
          prev.map((o) => (o.id === tempOrder.id ? result.order : o))
        );

        // Send notification
        await notifyEvent("ORDER_CREATED", result.order, user?.id);

        return { success: true, order: result.order };
      } else {
        // Rollback on failure
        setOrders((prev) => prev.filter((o) => o.id !== tempOrder.id));
        return { success: false, error: result.error };
      }
    } catch (err) {
      // Rollback on error
      setOrders((prev) => prev.filter((o) => o.id !== tempOrder.id));
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // UPDATE ORDER
  // ============================================
  const updateOrder = async (orderId, updates) => {
    const previousOrders = [...orders];

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );

    try {
      const current = orders.find((o) => o.id === orderId);
      const result = await updateOrderAPI(orderId, { ...current, ...updates });

      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? result.order : o))
        );
        return { success: true, order: result.order };
      } else {
        // Rollback
        setOrders(previousOrders);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setOrders(previousOrders);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // DELETE (CANCEL) ORDER
  // ============================================
  const cancelOrder = async (orderId) => {
    const previousOrders = [...orders];

    // Optimistic remove
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      const result = await deleteOrderAPI(orderId);

      if (result.success) {
        const cancelled = previousOrders.find((o) => o.id === orderId);
        if (cancelled) {
          await notifyEvent("ORDER_CANCELLED", cancelled, user?.id);
        }
        return { success: true };
      } else {
        // Rollback
        setOrders(previousOrders);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setOrders(previousOrders);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // ASSIGN RIDER
  // ============================================
  const assignRider = async (orderId, rider) => {
    const previousOrders = [...orders];
    const current = orders.find((o) => o.id === orderId);

    // Optimistic
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, rider: rider.name, riderPhone: rider.phone, status: "Assigned" }
          : o
      )
    );

    try {
      const result = await assignRiderAPI(orderId, rider, current);

      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? result.order : o))
        );

        await notifyEvent("RIDER_ASSIGNED", result.order, result.order.businessId);

        return { success: true, order: result.order };
      } else {
        setOrders(previousOrders);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setOrders(previousOrders);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // UPDATE STATUS (for riders)
  // ============================================
  const updateStatus = async (orderId, newStatus) => {
    const previousOrders = [...orders];
    const current = orders.find((o) => o.id === orderId);

    // Optimistic
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const result = await updateOrderStatusAPI(orderId, newStatus, current);

      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? result.order : o))
        );

        // Send notification based on status
        const eventMap = {
          "Accepted": "DELIVERY_ACCEPTED",
          "Picked Up": "ORDER_PICKED_UP",
          "In Transit": "IN_TRANSIT",
          "Delivered": "DELIVERY_COMPLETED",
        };
        const event = eventMap[newStatus];
        if (event) {
          await notifyEvent(event, result.order, result.order.businessId);
        }

        return { success: true, order: result.order };
      } else {
        setOrders(previousOrders);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setOrders(previousOrders);
      return { success: false, error: err.message };
    }
  };

  // ============================================
  // MANUAL REFRESH
  // ============================================
  const refreshOrders = () => fetchOrders(false);

  const value = {
    orders,
    loading,
    error,
    lastUpdated,
    fetchOrders,
    refreshOrders,
    createOrder,
    updateOrder,
    cancelOrder,
    assignRider,
    updateStatus,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return context;
}