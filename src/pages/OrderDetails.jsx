import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders as mockOrders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Truck, Package, Home, AlertCircle, Phone, MapPin, User, Calendar, CreditCard, Clock } from 'lucide-react';

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  const savedOrders = localStorage.getItem('zyroo_orders');
  const orders = savedOrders ? JSON.parse(savedOrders) : mockOrders;

  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div className="detail-page">
      <div className="detail-empty">
        <h2>Order not found</h2>
        <Link to="/orders" className="detail-back">← Back to Orders</Link>
      </div>
    </div>
  );

  const isRider = user?.role === 'rider';
  const isAssignedRider = isRider && order.rider && order.rider.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]);

  // Timeline steps
  const timelineSteps = [
    { label: 'Created', done: true, icon: '📝' },
    { label: 'Assigned', done: order.timeline?.some(t => t.status === 'Assigned') || order.rider !== 'Not Assigned', icon: '👤' },
    { label: 'Accepted', done: order.timeline?.some(t => t.status === 'Accepted') || ['Accepted','Picked Up','In Transit','Delivered'].includes(order.status), icon: '✓' },
    { label: 'Picked Up', done: order.timeline?.some(t => t.status === 'Picked Up') || ['Picked Up','In Transit','Delivered'].includes(order.status), icon: '📦' },
    { label: 'In Transit', done: order.timeline?.some(t => t.status === 'In Transit') || ['In Transit','Delivered'].includes(order.status), icon: '🚚' },
    { label: 'Delivered', done: order.status === 'Delivered', icon: '🏠' },
  ];

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

  const getRiderAction = () => {
    if (!isAssignedRider && !isRider) return null;
    switch (order.status) {
      case 'Assigned':
        return { label: 'Accept Delivery', next: 'Accepted', icon: <CheckCircle size={18} /> };
      case 'Accepted':
        return { label: 'Mark as Picked Up', next: 'Picked Up', icon: <Package size={18} /> };
      case 'Picked Up':
        return { label: 'Mark as In Transit', next: 'In Transit', icon: <Truck size={18} /> };
      case 'In Transit':
        return { label: 'Mark as Delivered', next: 'Delivered', icon: <Home size={18} /> };
      default:
        return null;
    }
  };

  const riderAction = isRider ? getRiderAction() : null;

  return (
    <div className="detail-page">
      {/* Back Link */}
      <Link to="/orders" className="detail-back">← Back to Orders</Link>

      {/* Header */}
      <div className="detail-header">
        <div>
          <p className="detail-header-label">ORDER ID</p>
          <h1 className="detail-header-id">#{order.id}</h1>
        </div>
        <div className="detail-header-status">
          {order.status}
        </div>
      </div>

      {/* Rider Action Panel */}
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
          >
            {riderAction.icon}
            {riderAction.label}
          </button>
        </div>
      )}

      {/* Rider Warnings */}
      {isRider && !isAssignedRider && order.rider !== 'Not Assigned' && (
        <div className="rider-warning">
          <AlertCircle size={18} />
          <span>This order is assigned to <b>{order.rider}</b>, not you.</span>
        </div>
      )}
      {isRider && order.rider === 'Not Assigned' && (
        <div className="rider-warning">
          <AlertCircle size={18} />
          <span>This order has no rider assigned yet.</span>
        </div>
      )}

      {/* Info Cards */}
      <div className="detail-info-grid">
        <InfoCard icon="👤" label="Customer" value={order.customer} />
        <InfoCard icon="🏍️" label="Rider" value={order.rider || 'Not Assigned'} />
        <InfoCard icon="📍" label="Pickup" value={order.pickup} />
        <InfoCard icon="🎯" label="Delivery" value={order.delivery} />
      </div>

      {/* Package & Order Info */}
      <div className="detail-timeline">
        <h2>📦 Package & Order Info</h2>
        <div className="detail-extrainfo">
          <InfoRow label="Customer Phone" value={order.customerPhone || '—'} />
          <InfoRow label="Package Details" value={order.packageDetails || '—'} />
          <InfoRow label="Priority" value={order.priority || 'Normal'} badge={order.priority} />
          <InfoRow label="Payment Method" value={order.paymentMethod || 'Cash on Delivery'} />
          <InfoRow label="Order Date" value={order.date || '—'} />
          <InfoRow label="Pickup Address" value={order.pickupAddress || order.pickup} />
          <InfoRow label="Delivery Address" value={order.deliveryAddress || order.delivery} />
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="detail-timeline">
        <h2>🕐 Delivery Timeline</h2>
        <div className="timeline-steps">
          {timelineSteps.map((step, index) => (
            <div key={index} className="timeline-step">
              <div className={`timeline-dot ${step.done ? 'done' : ''}`}>
                {step.done ? step.icon : '•'}
              </div>
              <p className={`timeline-label ${step.done ? 'done' : ''}`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline History */}
      {order.timeline && order.timeline.length > 1 && (
        <div className="detail-timeline">
          <h2>📋 Status History</h2>
          <div className="timeline-history">
            {order.timeline.map((entry, idx) => (
              <div key={idx} className="history-row">
                <div className="history-dot"></div>
                <div className="history-info">
                  <b>{entry.status}</b>
                  <small>
                    {new Date(entry.time).toLocaleString('en-PK', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </small>
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

const InfoRow = ({ label, value, badge }) => (
  <div className="extrainfo-row">
    <span className="extrainfo-label">{label}</span>
    {badge ? (
      <span className={`extrainfo-value priority-${(badge || 'normal').toLowerCase()}`}>
        {value}
      </span>
    ) : (
      <span className="extrainfo-value">{value}</span>
    )}
  </div>
);

export default OrderDetails;