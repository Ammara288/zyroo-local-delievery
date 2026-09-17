import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orders as mockOrders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Truck, Package, Home, AlertCircle } from 'lucide-react';

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  // Load orders from localStorage (if updated), otherwise from mockData
  const savedOrders = localStorage.getItem('zyroo_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : mockOrders;

  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div className="detail-empty">
      <h2>Order not found</h2>
      <Link to="/orders" className="detail-back">← Back to Orders</Link>
    </div>
  );

  const isRider = user?.role === 'rider';
  const isBusiness = user?.role === 'business';
  const isAssignedRider = isRider && order.rider && order.rider.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]);

  // Timeline
  const timelineSteps = [
    { label: 'Created', done: true },
    { label: 'Assigned', done: order.timeline?.some(t => t.status === 'Assigned') || order.rider !== 'Not Assigned' },
    { label: 'Accepted', done: order.timeline?.some(t => t.status === 'Accepted') || ['Accepted','Picked Up','In Transit','Delivered'].includes(order.status) },
    { label: 'Picked Up', done: order.timeline?.some(t => t.status === 'Picked Up') || ['Picked Up','In Transit','Delivered'].includes(order.status) },
    { label: 'In Transit', done: order.timeline?.some(t => t.status === 'In Transit') || ['In Transit','Delivered'].includes(order.status) },
    { label: 'Delivered', done: order.status === 'Delivered' },
  ];

  // Update status function
  const updateStatus = (newStatus) => {
    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: newStatus,
          timeline: [...(o.timeline || []), { status: newStatus, time: new Date().toISOString() }],
          ...(newStatus === 'Delivered' ? { deliveredAt: new Date().toISOString() } : {}),
        };
      }
      return o;
    });
    localStorage.setItem('zyroo_orders', JSON.stringify(updated));
    setRefresh(refresh + 1);
  };

  // Determine next action for rider
  const getRiderAction = () => {
    if (!isAssignedRider && !isRider) return null;

    switch (order.status) {
      case 'Assigned':
        return { label: 'Accept Delivery', next: 'Accepted', icon: <CheckCircle size={20} />, color: '#4338ca' };
      case 'Accepted':
        return { label: 'Mark as Picked Up', next: 'Picked Up', icon: <Package size={20} />, color: '#c2410c' };
      case 'Picked Up':
        return { label: 'Mark as In Transit', next: 'In Transit', icon: <Truck size={20} />, color: '#2563eb' };
      case 'In Transit':
        return { label: 'Mark as Delivered', next: 'Delivered', icon: <Home size={20} />, color: '#16a34a' };
      default:
        return null;
    }
  };

  const riderAction = isRider ? getRiderAction() : null;

  return (
    <div className="detail-page">
      {/* Back Link */}
      <Link to="/orders" className="detail-back">← Back to Orders</Link>

      {/* Header Card */}
      <div className="detail-header">
        <div>
          <p className="detail-header-label">ORDER ID</p>
          <h1 className="detail-header-id">#{order.id}</h1>
        </div>
        <div className="detail-header-status" style={{ background: 'rgba(255,255,255,0.22)' }}>
          {order.status}
        </div>
      </div>

      {/* Rider Action Panel (only for assigned rider) */}
      {riderAction && (
        <div className="rider-action-panel">
          <div className="rider-action-info">
            <span className="rider-action-icon">🏍️</span>
            <div>
              <b>Your Next Action</b>
              <p>Update the delivery status</p>
            </div>
          </div>
          <button
            className="rider-action-btn"
            onClick={() => updateStatus(riderAction.next)}
            style={{ background: `linear-gradient(135deg, ${riderAction.color}, #dc2626)` }}
          >
            {riderAction.icon}
            {riderAction.label}
          </button>
        </div>
      )}

      {/* If rider, but not assigned to this order */}
      {isRider && !isAssignedRider && order.rider !== 'Not Assigned' && (
        <div className="rider-warning">
          <AlertCircle size={18} />
          <span>This order is assigned to <b>{order.rider}</b>, not you.</span>
        </div>
      )}

      {/* If order has no rider */}
      {isRider && order.rider === 'Not Assigned' && (
        <div className="rider-warning">
          <AlertCircle size={18} />
          <span>This order has no rider assigned yet.</span>
        </div>
      )}

      {/* Info Grid */}
      <div className="detail-info-grid">
        <InfoCard icon="👤" label="Customer" value={order.customer} />
        <InfoCard icon="🏍️" label="Rider" value={order.rider || 'Not Assigned'} />
        <InfoCard icon="📍" label="Pickup" value={order.pickup} />
        <InfoCard icon="🎯" label="Delivery" value={order.delivery} />
      </div>

      {/* Extra Info */}
      <div className="detail-timeline">
        <h2>📦 Package & Order Info</h2>
        <div className="detail-extrainfo">
          <div className="extrainfo-row">
            <span className="extrainfo-label">Customer Phone</span>
            <span className="extrainfo-value">{order.customerPhone || '—'}</span>
          </div>
          <div className="extrainfo-row">
            <span className="extrainfo-label">Package Details</span>
            <span className="extrainfo-value">{order.packageDetails || '—'}</span>
          </div>
          <div className="extrainfo-row">
            <span className="extrainfo-label">Priority</span>
            <span className="extrainfo-value">{order.priority || 'Normal'}</span>
          </div>
          <div className="extrainfo-row">
            <span className="extrainfo-label">Payment Method</span>
            <span className="extrainfo-value">{order.paymentMethod || 'Cash on Delivery'}</span>
          </div>
          <div className="extrainfo-row">
            <span className="extrainfo-label">Order Date</span>
            <span className="extrainfo-value">{order.date || '—'}</span>
          </div>
          <div className="extrainfo-row">
            <span className="extrainfo-label">Pickup Address</span>
            <span className="extrainfo-value">{order.pickupAddress || order.pickup}</span>
          </div>
          <div className="extrainfo-row">
            <span className="extrainfo-label">Delivery Address</span>
            <span className="extrainfo-value">{order.deliveryAddress || order.delivery}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="detail-timeline">
        <h2>🕐 Delivery Timeline</h2>
        <div className="timeline-steps">
          {timelineSteps.map((step, index) => (
            <div key={index} className="timeline-step">
              <div className={`timeline-dot ${step.done ? 'done' : ''}`}>
                {step.done ? '✓' : '•'}
              </div>
              <p className={`timeline-label ${step.done ? 'done' : ''}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline History (Detailed) */}
      {order.timeline && order.timeline.length > 1 && (
        <div className="detail-timeline">
          <h2>📋 Status History</h2>
          <div className="timeline-history">
            {order.timeline.map((entry, idx) => (
              <div key={idx} className="history-row">
                <div className="history-dot"></div>
                <div className="history-info">
                  <b>{entry.status}</b>
                  <small>{new Date(entry.time).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track Button */}
      <Link to={`/tracking/${order.id}`} className="detail-track-btn">
        📍 Track this Delivery
      </Link>
    </div>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <div className="infocard">
    <div className="infocard-icon">{icon}</div>
    <p className="infocard-label">{label.toUpperCase()}</p>
    <p className="infocard-value">{value}</p>
  </div>
);

export default OrderDetails;