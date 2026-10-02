import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { getAllRiders } from "../services/riderService";
import {
  Plus, X, UserCheck, Package, Truck, CheckCircle, Clock,
  Search, SlidersHorizontal, RefreshCw, Loader,
  ChevronLeft, ChevronRight
} from "lucide-react";

function Orders() {
  const { user } = useAuth();
  const {
    orders,
    loading,
    error,
    refreshOrders,
    cancelOrder,
    assignRider,
  } = useOrders();

  const [statusFilter, setStatusFilter] = useState("All");
  const [riderFilter, setRiderFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [riders, setRiders] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5; // Orders per page

  const isBusiness = user?.role === "business";
  const isRider = user?.role === "rider";
  const isCustomer = user?.role === "customer";

  // Load riders list from API
  useEffect(() => {
    const loadRiders = async () => {
      const result = await getAllRiders();
      if (result.success) setRiders(result.riders);
    };
    loadRiders();
  }, []);

  // Role-based orders (Context already filters, but extra safety)
  const roleOrders = orders;

  // Apply filters
  const filteredOrders = useMemo(() => {
    return roleOrders.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [o.id, o.customer, o.rider].some((v) =>
          String(v || "").toLowerCase().includes(q)
        );
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      const matchesRider = riderFilter === "All" || o.rider === riderFilter;
      const matchesDate = !dateFilter || o.date === dateFilter;
      return matchesSearch && matchesStatus && matchesRider && matchesDate;
    });
  }, [roleOrders, search, statusFilter, riderFilter, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, riderFilter, dateFilter]);

  // Stats
  const stats = {
    total: roleOrders.length,
    pending: roleOrders.filter((o) => o.status === "Pending").length,
    inDelivery: roleOrders.filter((o) =>
      ["Assigned", "Accepted", "Picked Up", "In Transit"].includes(o.status)
    ).length,
    completed: roleOrders.filter((o) => o.status === "Delivered").length,
  };

  // Handle assign rider
  const handleAssignRider = async (orderId, rider) => {
    setActionLoading(true);
    const result = await assignRider(orderId, rider);
    setActionLoading(false);
    if (result.success) setAssigningOrder(null);
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    setActionLoading(true);
    const result = await cancelOrder(orderId);
    setActionLoading(false);
    if (result.success) setCancelConfirm(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setRiderFilter("All");
    setDateFilter("");
    setPage(1);
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="loading-state">
          <Loader className="spin" size={48} />
          <h2>Loading orders...</h2>
          <p>Fetching data from server</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-head-row">
        <div className="orders-head">
          <h1>
            {isRider ? "🏍️ My Deliveries" : isCustomer ? "👤 My Orders" : "📦 Orders Management"}
          </h1>
          <p>
            {isRider ? "View and manage your assigned deliveries"
              : isCustomer ? "Track your orders in real-time"
              : "Search, filter and manage delivery orders"}
          </p>
        </div>
        <div className="head-actions">
          <button className="refresh-btn" onClick={refreshOrders} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} />
            Refresh
          </button>
          {isBusiness && (
            <Link to="/orders/new" className="create-order-btn">
              <Plus size={20} /> Create Order
            </Link>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={refreshOrders}>Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="orders-stats">
        <div className="ostat">
          <span className="ostat-icon"><Package size={18}/></span>
          <div><b>{stats.total}</b><small>Total</small></div>
        </div>
        <div className="ostat">
          <span className="ostat-icon"><Clock size={18}/></span>
          <div><b>{stats.pending}</b><small>Pending</small></div>
        </div>
        <div className="ostat">
          <span className="ostat-icon"><Truck size={18}/></span>
          <div><b>{stats.inDelivery}</b><small>In Delivery</small></div>
        </div>
        <div className="ostat">
          <span className="ostat-icon"><CheckCircle size={18}/></span>
          <div><b>{stats.completed}</b><small>Completed</small></div>
        </div>
      </div>

      {/* Filters */}
      <div className="week4-filter-panel">
        <div className="week4-search">
          <Search size={18}/>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer or Rider..."
          />
        </div>
        <div className="filter-selects">
          <label>
            Status
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {["All", "Pending", "Assigned", "Accepted", "Picked Up", "In Transit", "Delivered"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Rider
            <select value={riderFilter} onChange={(e) => setRiderFilter(e.target.value)}>
              <option>All</option>
              {riders.map((r) => <option key={r.id}>{r.name}</option>)}
            </select>
          </label>
          <label>
            Date
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </label>
          <button className="clear-filter-btn" onClick={clearFilters}>
            <X size={16}/> Clear
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="orders-results-row">
        <span>
          <SlidersHorizontal size={15}/> Showing <b>{filteredOrders.length}</b> of {roleOrders.length} orders
        </span>
        <span className="page-indicator">
          Page <b>{page}</b> of {totalPages}
        </span>
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {paginatedOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-top">
              <div>
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{order.date}</span>
              </div>
              <span className={`order-status status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>
                {order.status}
              </span>
            </div>

            <div className="order-route">
              <span>📦 {order.pickup}</span>
              <b>→</b>
              <span>🏠 {order.delivery}</span>
            </div>

            <div className="order-customer">
              <b>{order.customer}</b>
              <small>Rider: {order.rider || "Not Assigned"}</small>
            </div>

            <div className="order-card-actions">
              <Link to={`/orders/${order.id}`} className="view-order-btn">
                View Details
              </Link>
              <Link to={`/tracking/${order.id}`} className="track-order-btn">
                <Truck size={15}/> Track
              </Link>
              {isBusiness && order.rider === "Not Assigned" && (
                <button className="assign-btn" onClick={() => setAssigningOrder(order)}>
                  <UserCheck size={15}/> Assign
                </button>
              )}
              {isBusiness && order.status !== "Delivered" && (
                <button className="cancel-order-btn" onClick={() => setCancelConfirm(order)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-num ${page === p ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {!filteredOrders.length && !loading && (
        <div className="orders-empty">
          <Search size={36}/>
          <h3>No orders found</h3>
          <p>Try changing the search text or filters.</p>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {/* Assign Rider Modal */}
      {assigningOrder && (
        <div className="modal-overlay" onClick={() => !actionLoading && setAssigningOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>🏍️ Assign Rider</h3>
              <button onClick={() => setAssigningOrder(null)} disabled={actionLoading}><X/></button>
            </div>
            <p className="modal-sub">
              Select a rider for <b>#{assigningOrder.id}</b>
            </p>
            <div className="rider-list">
              {riders.map((r) => (
                <button
                  key={r.id}
                  className="rider-option"
                  onClick={() => handleAssignRider(assigningOrder.id, r)}
                  disabled={actionLoading}
                >
                  <span className="rider-avatar">{r.name.charAt(0)}</span>
                  <div className="rider-info">
                    <b>{r.name}</b>
                    <small>{r.vehicle}</small>
                  </div>
                  <span className="rider-phone">{r.phone}</span>
                </button>
              ))}
            </div>
            {actionLoading && <p className="modal-loading">Assigning rider...</p>}
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {cancelConfirm && (
        <div className="modal-overlay" onClick={() => !actionLoading && setCancelConfirm(null)}>
          <div className="modal-box modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>⚠️ Cancel Order?</h3>
              <button onClick={() => setCancelConfirm(null)} disabled={actionLoading}><X/></button>
            </div>
            <p className="modal-sub">
              Are you sure you want to cancel <b>#{cancelConfirm.id}</b>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn-outline" onClick={() => setCancelConfirm(null)} disabled={actionLoading}>
                Keep Order
              </button>
              <button className="modal-btn-danger" onClick={() => handleCancelOrder(cancelConfirm.id)} disabled={actionLoading}>
                {actionLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;