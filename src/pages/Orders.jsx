import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { orders as initialOrders, ridersList } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Plus, X, UserCheck, Package, Truck, CheckCircle, Clock, Search, SlidersHorizontal } from "lucide-react";

function Orders() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("All");
  const [riderFilter, setRiderFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("zyroo_orders");
    return saved ? JSON.parse(saved) : [...initialOrders];
  });
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const isBusiness = user?.role === "business";
  const isRider = user?.role === "rider";
  const isCustomer = user?.role === "customer";

  let roleOrders = orders;
  if (isRider) {
    const mine = orders.filter(o => o.rider && o.rider.toLowerCase().includes(user.name.toLowerCase().split(" ")[0]));
    roleOrders = mine.length ? mine : orders;
  } else if (isCustomer) {
    const mine = orders.filter(o => o.customer?.toLowerCase().includes(user.name.toLowerCase().split(" ")[0]));
    roleOrders = mine.length ? mine : orders;
  }

  const filteredOrders = useMemo(() => roleOrders.filter((o) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [o.id, o.customer, o.rider].some(v => String(v || "").toLowerCase().includes(q));
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesRider = riderFilter === "All" || o.rider === riderFilter;
    const matchesDate = !dateFilter || o.date === dateFilter;
    return matchesSearch && matchesStatus && matchesRider && matchesDate;
  }), [roleOrders, search, statusFilter, riderFilter, dateFilter]);

  const stats = {
    total: roleOrders.length,
    pending: roleOrders.filter(o => o.status === "Pending").length,
    inDelivery: roleOrders.filter(o => ["Assigned","Accepted","Picked Up","In Transit"].includes(o.status)).length,
    completed: roleOrders.filter(o => o.status === "Delivered").length,
  };

  const handleAssignRider = (orderId, rider) => {
    const updated = orders.map(o => o.id === orderId ? {
      ...o,
      rider: rider.name,
      riderPhone: rider.phone,
      riderVehicle: rider.vehicle,
      riderStatus: "Assigned",
      riderAvatar: rider.name.charAt(0),
      riderLocation: o.pickup,
      status: "Assigned",
      timeline: [...(o.timeline || []), { status: "Assigned", time: new Date().toISOString() }]
    } : o);
    setOrders(updated);
    localStorage.setItem("zyroo_orders", JSON.stringify(updated));
    setAssigningOrder(null);
  };

  const handleCancelOrder = (orderId) => {
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem("zyroo_orders", JSON.stringify(updated));
    setCancelConfirm(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setRiderFilter("All");
    setDateFilter("");
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-head-row">
        <div className="orders-head">
          <span className="week-badge">WEEK 4 • SEARCH & FILTERS</span>
          <h1>{isRider ? "🏍️ My Deliveries" : isCustomer ? "👤 My Orders" : "📦 Orders Management"}</h1>
          <p>
            {isRider ? "View and manage your assigned deliveries"
              : isCustomer ? "Track your orders in real-time"
              : "Search, filter and manage delivery orders"}
          </p>
        </div>
        {isBusiness && (
          <Link to="/orders/new" className="create-order-btn">
            <Plus size={20} /> Create Order
          </Link>
        )}
      </div>

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
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer or Rider..."
          />
        </div>
        <div className="filter-selects">
          <label>
            Status
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {["All","Pending","Assigned","Accepted","Picked Up","In Transit","Delivered"].map(x => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Rider
            <select value={riderFilter} onChange={e => setRiderFilter(e.target.value)}>
              <option>All</option>
              {ridersList.map(r => <option key={r.id}>{r.name}</option>)}
            </select>
          </label>
          <label>
            Date
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}/>
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
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {filteredOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-top">
              <div>
                <span className="order-id">#{order.id}</span>
                <span className="order-date">{order.date}</span>
              </div>
              <span className={`order-status status-${order.status.toLowerCase().replaceAll(" ","-")}`}>
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
              <Link to={`/orders/${order.id}`} className="view-order-btn">View Details</Link>
              <Link to={`/tracking/${order.id}`} className="track-order-btn">
                <Truck size={15}/> Track
              </Link>
              {isBusiness && order.rider === "Not Assigned" && (
                <button className="assign-btn" onClick={() => setAssigningOrder(order)}>
                  <UserCheck size={15}/> Assign
                </button>
              )}
              {isBusiness && (
                <button className="cancel-order-btn" onClick={() => setCancelConfirm(order)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!filteredOrders.length && (
        <div className="orders-empty">
          <Search size={36}/>
          <h3>No orders found</h3>
          <p>Try changing the search text or filters.</p>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {/* Assign Rider Modal */}
      {assigningOrder && (
        <div className="modal-overlay" onClick={() => setAssigningOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>🏍️ Assign Rider</h3>
              <button onClick={() => setAssigningOrder(null)}><X/></button>
            </div>
            <p className="modal-sub">
              Select a rider for <b>#{assigningOrder.id}</b>
            </p>
            <div className="rider-list">
              {ridersList.map(r => (
                <button key={r.id} className="rider-option" onClick={() => handleAssignRider(assigningOrder.id, r)}>
                  <span className="rider-avatar">{r.name.charAt(0)}</span>
                  <div className="rider-info">
                    <b>{r.name}</b>
                    <small>{r.vehicle}</small>
                  </div>
                  <span className="rider-phone">{r.phone}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {cancelConfirm && (
        <div className="modal-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="modal-box modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>⚠️ Cancel Order?</h3>
              <button onClick={() => setCancelConfirm(null)}><X/></button>
            </div>
            <p className="modal-sub">
              Are you sure you want to cancel <b>#{cancelConfirm.id}</b>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn-outline" onClick={() => setCancelConfirm(null)}>
                Keep Order
              </button>
              <button className="modal-btn-danger" onClick={() => handleCancelOrder(cancelConfirm.id)}>
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;