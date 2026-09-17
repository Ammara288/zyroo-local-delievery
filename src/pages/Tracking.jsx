import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders } from '../data/mockData';

function Tracking() {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  // Agar id nahi di gayi (jaise /tracking page direct khula hai)
  if (!id) {
    return (
      <div className="tracking-page">
        <div className="tracking-inner">
          <h1 className="tracking-title">📍 Track Delivery</h1>
          <p className="tracking-sub">Enter an order ID or click "View Details" from Orders page</p>
          <div className="tracking-empty-card">
            <p>No order selected</p>
            <Link to="/orders" className="tracking-btn">Go to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="tracking-page">
      <div className="tracking-inner">
        <h1 className="tracking-title">📍 Live Tracking</h1>
        <p className="tracking-sub">Real-time updates for your delivery</p>

        <div className="tracking-card">
          {/* Order ID Header */}
          <div className="tracking-order-header">
            Order: {order.id}
          </div>

          {/* Route Visual */}
          <div className="tracking-route">
            <div className="route-point">
              <div className="route-icon">📦</div>
              <p className="route-label">PICKUP</p>
              <p className="route-city-name">{order.pickup}</p>
            </div>
            <div className="route-arrow-anim">→</div>
            <div className="route-point">
              <div className="route-icon">🏠</div>
              <p className="route-label">DELIVERY</p>
              <p className="route-city-name">{order.delivery}</p>
            </div>
          </div>

          {/* Rider Info */}
          <div className="tracking-rider">
            <span className="rider-emoji">🏍️</span>
            <span className="rider-label">Rider:</span>
            <strong className="rider-name">{order.rider || 'Not Assigned'}</strong>
          </div>

          {/* Status */}
          <div className="tracking-status-wrap">
            <p className="tracking-status-label">Current Status</p>
            <div className="tracking-status-badge">{order.status}</div>
          </div>
        </div>

        <Link to={`/orders/${order.id}`} className="tracking-back-link">
          ← Back to Order Details
        </Link>
      </div>
    </div>
  );
}

export default Tracking;