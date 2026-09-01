import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders } from '../data/mockData';

function OrderDetails() {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div style={{ padding: '80px', textAlign: 'center' }}>
      <h2 style={{ color: '#1e293b' }}>Order not found</h2>
      <Link to="/orders" style={{ color: '#6366f1', marginTop: '20px', display: 'inline-block' }}>
        ← Back to Orders
      </Link>
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
    <div style={{ padding: '50px 30px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Link */}
      <Link to="/orders" style={{
        color: '#6366f1',
        fontWeight: '600',
        fontSize: '15px',
        display: 'inline-block',
        marginBottom: '25px',
        textDecoration: 'none'
      }}>
        ← Back to Orders
      </Link>

      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        color: 'white',
        padding: '35px',
        borderRadius: '20px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        boxShadow: '0 15px 40px rgba(99, 102, 241, 0.3)'
      }}>
        <div>
          <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '5px' }}>ORDER ID</p>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>#{order.id}</h1>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '12px 22px',
          borderRadius: '30px',
          backdropFilter: 'blur(10px)',
          fontWeight: '600',
          fontSize: '15px'
        }}>
          {order.status}
        </div>
      </div>

      {/* Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <InfoCard icon="👤" label="Customer" value={order.customer} />
        <InfoCard icon="🏍️" label="Rider" value={order.rider} />
        <InfoCard icon="📍" label="Pickup" value={order.pickup} />
        <InfoCard icon="🎯" label="Delivery" value={order.delivery} />
      </div>

      {/* Timeline Card */}
      <div style={{
        background: 'white',
        padding: '35px',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '22px', color: '#1e293b', marginBottom: '25px' }}>
          🕐 Delivery Timeline
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '15px' }}>
          {timelineSteps.map((step, index) => (
            <div key={index} style={{ textAlign: 'center', flex: 1, minWidth: '90px', position: 'relative' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                background: step.done
                  ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                  : '#e2e8f0',
                boxShadow: step.done ? '0 6px 20px rgba(99, 102, 241, 0.4)' : 'none'
              }}>
                {step.done ? '✓' : '•'}
              </div>
              <p style={{
                fontSize: '13px',
                fontWeight: '600',
                color: step.done ? '#1e293b' : '#94a3b8'
              }}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Track Button */}
      <Link
        to={`/tracking/${order.id}`}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '18px',
          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
          color: 'white',
          borderRadius: '15px',
          fontWeight: 'bold',
          fontSize: '17px',
          textDecoration: 'none',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
        }}>
        📍 Track this Delivery
      </Link>
    </div>
  );
}

const InfoCard = ({ icon, label, value }) => (
  <div style={{
    background: 'white',
    padding: '25px',
    borderRadius: '18px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
    borderLeft: '4px solid #a855f7'
  }}>
    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{icon}</div>
    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '5px', fontWeight: '600', letterSpacing: '0.5px' }}>
      {label.toUpperCase()}
    </p>
    <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{value}</p>
  </div>
);

export default OrderDetails;