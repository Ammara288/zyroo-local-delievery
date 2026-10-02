import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin, Navigation, Clock3, Truck, Phone, UserRound,
  CheckCircle2, RefreshCw, Loader
} from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import { STATUS_FLOW } from "../data/mockData";
import DeliveryMap from "../components/DeliveryMap";

function Tracking() {
  const { id } = useParams();
  const { orders, loading, error, refreshOrders } = useOrders();

  const order = orders.find((o) => o.id === id);

  // Loading state
  if (loading && !order) {
    return (
      <div className="tracking-page">
        <div className="tracking-inner">
          <div className="loading-state">
            <Loader className="spin" size={48} />
            <h2>Loading tracking data...</h2>
            <p>Fetching from server</p>
          </div>
        </div>
      </div>
    );
  }

  // No ID provided
  if (!id) {
    return (
      <div className="tracking-page">
        <div className="tracking-inner">
          <h1 className="tracking-title">📍 Track Delivery</h1>
          <p className="tracking-sub">
            Select an order from the Orders page to view its delivery progress.
          </p>
          <div className="tracking-empty-card">
            <p>No order selected</p>
            <Link to="/orders" className="tracking-btn">Go to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="tracking-page">
        <div className="tracking-inner">
          <h2 className="tracking-title">Order not found</h2>
          <Link to="/orders" className="detail-back">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  const rider = order.rider || "Not Assigned";
  const isDelivered = order.status === "Delivered";
  const riderInitial = order.riderAvatar || rider.charAt(0).toUpperCase();

  // Get status index for progress
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const totalSteps = STATUS_FLOW.length;
  const progressPercent =
    currentStatusIndex >= 0
      ? Math.round(((currentStatusIndex + 1) / totalSteps) * 100)
      : 0;

  // Last update time
  const lastUpdate =
    order.timeline && order.timeline.length > 0
      ? order.timeline[order.timeline.length - 1].time
      : order.createdAt;

  const formatLastUpdate = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return date.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="tracking-page">
      <div className="tracking-inner">
        {/* Header */}
        <div className="tracking-page-head">
          <div>
            <span className="tracking-eyebrow">DELIVERY TRACKING</span>
            <h1 className="tracking-title">📍 Track Order #{order.id}</h1>
            <p className="tracking-sub">
              Follow the live delivery route and current rider progress.
            </p>
          </div>
          <div className="tracking-head-actions">
            <button
              className="refresh-btn"
              onClick={refreshOrders}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "spin" : ""} />
            </button>
            <span
              className={`tracking-main-status status-${order.status
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={refreshOrders}>Retry</button>
          </div>
        )}

        {/* Last Update */}
        <div className="tracking-last-update">
          <Clock3 size={14} />
          <span>Last updated: <b>{formatLastUpdate(lastUpdate)}</b></span>
        </div>

        {/* Progress Bar */}
        <div className="tracking-progress-wrap">
          <div className="tracking-progress-info">
            <span>Delivery Progress</span>
            <b>{progressPercent}%</b>
          </div>
          <div className="tracking-progress-bar">
            <div
              className="tracking-progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="tracking-grid">
          {/* Map */}
          <section className="tracking-map-card">
            <div className="card-heading">
              <div>
                <h2>Live Delivery Route</h2>
                <p>Real-time rider tracking map</p>
              </div>
              <Navigation size={22} />
            </div>

            <div className="tracking-map-real">
              <DeliveryMap
                pickup={order.pickup}
                delivery={order.delivery}
                riderLocation={order.riderLocation}
              />
            </div>

            <div className="route-summary">
              <div>
                <MapPin size={17} />
                <span><b>Pickup</b>{order.pickup}</span>
              </div>
              <div>
                <Navigation size={17} />
                <span><b>Rider</b>{order.riderLocation || "En route"}</span>
              </div>
              <div>
                <MapPin size={17} />
                <span><b>Delivery</b>{order.delivery}</span>
              </div>
            </div>
          </section>

          {/* Side Info */}
          <aside className="tracking-side">
            <section className="tracking-info-card">
              <div className="card-heading">
                <div>
                  <h2>Current Status</h2>
                  <p>Delivery progress</p>
                </div>
                <Truck size={21} />
              </div>

              <div className="status-large">{order.status}</div>

              <div className="estimate-box">
                <Clock3 size={20} />
                <div>
                  <small>Estimated Delivery</small>
                  <b>
                    {isDelivered
                      ? "Delivered"
                      : `${order.estimatedDelivery || 25} minutes`}
                  </b>
                </div>
              </div>

              <div className="timeline">
                {STATUS_FLOW.map((step) => {
                  const done =
                    order.timeline?.some((t) => t.status === step) ||
                    step === "Pending";
                  return (
                    <div
                      className={`timeline-row ${done ? "done" : ""}`}
                      key={step}
                    >
                      <span className="timeline-dot">
                        {done ? <CheckCircle2 size={16} /> : ""}
                      </span>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="tracking-info-card rider-card">
              <div className="card-heading">
                <div>
                  <h2>Rider Information</h2>
                  <p>Assigned delivery partner</p>
                </div>
                <UserRound size={21} />
              </div>

              <div className="rider-profile">
                <div className="rider-avatar-large">{riderInitial}</div>
                <div>
                  <h3>{rider}</h3>
                  <span>{order.riderStatus || "Assigned"}</span>
                </div>
              </div>

              <div className="rider-details">
                <div>
                  <Phone size={16} />
                  <span>{order.riderPhone || "Not available"}</span>
                </div>
                <div>
                  🏍️ <span>{order.riderVehicle || "Vehicle not assigned"}</span>
                </div>
                <div>
                  📍 <span>Current: {order.riderLocation || "Simulated location"}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <Link to={`/orders/${order.id}`} className="tracking-back-link">
          ← Back to Order Details
        </Link>
      </div>
    </div>
  );
}

export default Tracking;