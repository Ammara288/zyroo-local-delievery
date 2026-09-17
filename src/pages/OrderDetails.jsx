import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div className="detail-empty">
      <h2>Order not found</h2>
      <Link to="/orders" className="detail-back">← Back to Orders</Link>
    </div>
  );

  const timelineSteps = [
    { label: 'Created', done: true },
    { label: 'Assigned', done: true },
    { label: 'Picked Up', done: true },
    { label: 'In Transit', done: order.status === 'In Transit' || order.status === 'Delivered' },
    { label: 'Delivered', done: order.status === 'Delivered' },
  ];

  const statusColors = {
    'Pending': { bg: '#fef3c7', color: '#d97706' },
    'In Transit': { bg: '#dbeafe', color: '#2563eb' },
    'Delivered': { bg: '#dcfce7', color: '#16a34a' }
  };
  const sc = statusColors[order.status] || statusColors['Pending'];

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

      {/* Info Grid */}
      <div className="detail-info-grid">
        <InfoCard icon="👤" label="Customer" value={order.customer} />
        <InfoCard icon="🏍️" label="Rider" value={order.rider || 'Not Assigned'} />
        <InfoCard icon="📍" label="Pickup" value={order.pickup} />
        <InfoCard icon="🎯" label="Delivery" value={order.delivery} />
      </div>

      {/* Timeline Card */}
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