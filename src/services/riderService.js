// ============================================
// RIDER SERVICE
// All rider-related API operations
// ============================================

import { apiGet } from "./api";
import { ENDPOINTS } from "../api/config";

/**
 * Get all riders
 */
export const getAllRiders = async () => {
  try {
    const riders = await apiGet(ENDPOINTS.RIDERS);
    return { success: true, riders };
  } catch (error) {
    return { success: false, error: error.message, riders: [] };
  }
};

/**
 * Get only active riders
 */
export const getActiveRiders = async () => {
  try {
    const riders = await apiGet(ENDPOINTS.RIDERS);
    const active = riders.filter((r) => r.active !== false);
    return { success: true, riders: active };
  } catch (error) {
    return { success: false, error: error.message, riders: [] };
  }
};

/**
 * Get rider by ID
 */
export const getRiderById = async (riderId) => {
  try {
    const rider = await apiGet(`${ENDPOINTS.RIDERS}/${riderId}`);
    return { success: true, rider };
  } catch (error) {
    return { success: false, error: error.message, rider: null };
  }
};

/**
 * Get rider statistics from orders
 */
export const getRiderStats = (riderName, orders) => {
  const riderOrders = orders.filter(
    (o) => o.rider?.toLowerCase() === riderName?.toLowerCase()
  );

  const today = new Date().toISOString().split("T")[0];

  return {
    total: riderOrders.length,
    today: riderOrders.filter((o) => o.date === today).length,
    pending: riderOrders.filter((o) => o.status === "Assigned").length,
    active: riderOrders.filter((o) =>
      ["Accepted", "Picked Up", "In Transit"].includes(o.status)
    ).length,
    completed: riderOrders.filter((o) => o.status === "Delivered").length,
  };
};