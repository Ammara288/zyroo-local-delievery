// ============================================
// ORDER SERVICE
// All order-related API operations
// ============================================

import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { ENDPOINTS } from "../api/config";

/**
 * Get all orders
 */
export const getAllOrders = async () => {
  try {
    const orders = await apiGet(ENDPOINTS.ORDERS);
    return { success: true, orders };
  } catch (error) {
    return { success: false, error: error.message, orders: [] };
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const order = await apiGet(`${ENDPOINTS.ORDERS}/${orderId}`);
    return { success: true, order };
  } catch (error) {
    return { success: false, error: error.message, order: null };
  }
};

/**
 * Get orders filtered by user role
 */
export const getOrdersByRole = async (user) => {
  try {
    const allOrders = await apiGet(ENDPOINTS.ORDERS);

    if (!user || !user.role) {
      return { success: true, orders: allOrders };
    }

    const firstName = user.name?.split(" ")[0]?.toLowerCase() || "";

    let filtered = allOrders;

    if (user.role === "business") {
      // Business sees orders belonging to them
      filtered = allOrders.filter(
        (o) => o.businessId === user.id || o.businessName === user.company
      );
      // If no orders match (demo), show all
      if (filtered.length === 0) filtered = allOrders;
    } else if (user.role === "rider") {
      // Rider sees orders assigned to them
      filtered = allOrders.filter(
        (o) => o.rider && o.rider.toLowerCase().includes(firstName)
      );
      if (filtered.length === 0) filtered = allOrders;
    } else if (user.role === "customer") {
      // Customer sees only their orders
      filtered = allOrders.filter(
        (o) =>
          o.customer?.toLowerCase().includes(firstName) ||
          o.customerPhone === user.phone
      );
      // If no personal orders, show all (for demo purposes)
      if (filtered.length === 0) filtered = allOrders;
    }

    return { success: true, orders: filtered };
  } catch (error) {
    return { success: false, error: error.message, orders: [] };
  }
};

/**
 * Create new order
 */
export const createOrder = async (orderData) => {
  try {
    const newOrder = {
      ...orderData,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      timeline: [
        { status: "Pending", time: new Date().toISOString() }
      ],
    };
    const order = await apiPost(ENDPOINTS.ORDERS, newOrder);
    return { success: true, order };
  } catch (error) {
    return { success: false, error: error.message, order: null };
  }
};

/**
 * Update order
 */
export const updateOrder = async (orderId, updates) => {
  try {
    const order = await apiPut(`${ENDPOINTS.ORDERS}/${orderId}`, updates);
    return { success: true, order };
  } catch (error) {
    return { success: false, error: error.message, order: null };
  }
};

/**
 * Delete order
 */
export const deleteOrder = async (orderId) => {
  try {
    await apiDelete(`${ENDPOINTS.ORDERS}/${orderId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Assign rider to order
 */
export const assignRider = async (orderId, rider, currentOrder) => {
  try {
    const updatedTimeline = [
      ...(currentOrder.timeline || []),
      { status: "Assigned", time: new Date().toISOString() },
    ];

    const updates = {
      ...currentOrder,
      rider: rider.name,
      riderPhone: rider.phone,
      status: "Assigned",
      timeline: updatedTimeline,
    };

    const order = await apiPut(`${ENDPOINTS.ORDERS}/${orderId}`, updates);
    return { success: true, order };
  } catch (error) {
    return { success: false, error: error.message, order: null };
  }
};

/**
 * Update order status (for rider actions)
 */
export const updateOrderStatus = async (orderId, newStatus, currentOrder) => {
  try {
    const updatedTimeline = [
      ...(currentOrder.timeline || []),
      { status: newStatus, time: new Date().toISOString() },
    ];

    const updates = {
      ...currentOrder,
      status: newStatus,
      timeline: updatedTimeline,
      ...(newStatus === "Delivered"
        ? { deliveredAt: new Date().toISOString() }
        : {}),
    };

    const order = await apiPut(`${ENDPOINTS.ORDERS}/${orderId}`, updates);
    return { success: true, order };
  } catch (error) {
    return { success: false, error: error.message, order: null };
  }
};

/**
 * Search and filter orders
 */
export const searchOrders = (orders, { query, status, rider, date }) => {
  return orders.filter((o) => {
    // Search by ID or customer
    if (query) {
      const q = query.toLowerCase();
      const matchId = o.id?.toLowerCase().includes(q);
      const matchCustomer = o.customer?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer) return false;
    }

    // Filter by status
    if (status && o.status !== status) return false;

    // Filter by rider
    if (rider && o.rider !== rider) return false;

    // Filter by date
    if (date && o.date !== date) return false;

    return true;
  });
};

/**
 * Paginate orders
 */
export const paginateOrders = (orders, page = 1, pageSize = 5) => {
  const total = orders.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = orders.slice(start, end);

  return {
    items,
    total,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};