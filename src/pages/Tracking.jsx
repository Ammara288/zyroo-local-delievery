import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders } from '../data/mockData';

function Tracking() {
  const { id } = useParams();
  const order = orders.find(o => o.id === id);

  if (!order) return (
    <div style={{ padding: '80px', textAlign: 'center' }}>
      <h2>Order not found</h2>
      <Link to="/orders" style={{ color: '#6366f1' }}>← Back to Orders</Link>
    </div>
  );

  return (
    <div style={{
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)',
      padding: '60px 20px'
    }}>
      <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '38px', color: '#1e293b', marginBottom: '10px' }}>
          📍 Live Tracking
        </h1>
        <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '17px' }}>
          Real-time updates for your delivery
        </p>

        {/* Tracking Card */}
        <div style={{
          background: 'white',
          borderRadius: '25px',
          padding: '40px 30px',
          boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '30px',
            fontSize: '22px',
            fontWeight: 'bold'
          }}>
            Order: {order.id}
          </div>

          {/* Route Visual */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
            padding: '25px',
            borderRadius: '15px',
            marginBottom: '30px',
            gap: '10px'
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>📦</div>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>PICKUP</p>
              <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{order.pickup}</p>
            </div>
            <div style={{
              fontSize: '28px',
              color: '#a855f7',
              animation: 'pulse 2s infinite'
            }}>
              →
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '30px', marginBottom: '8px' }}>🏠</div>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>DELIVERY</p>
              <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{order.delivery}</p>
            </div>
          </div>

          {/* Rider Info */}
          <div style={{
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '24px' }}>🏍️</span>
            <span style={{ color: '#64748b' }}>Rider:</span>
            <strong style={{ color: '#1e293b', fontSize: '17px' }}>{order.rider}</strong>
          </div>

          {/* Status */}
          <div>
            <p style={{ color: '#64748b', marginBottom: '10px', fontSize: '15px' }}>Current Status</p>
            <div style={{
              display: 'inline-block',
              padding: '14px 35px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              color: 'white',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
            }}>
              {order.status}
            </div>
          </div>
        </div>

        <Link to={`/orders/${order.id}`} style={{
          display: 'inline-block',
          marginTop: '30px',
          color: '#6366f1',
          fontWeight: '600',
          textDecoration: 'none'
        }}>
          ← Back to Order Details
        </Link>
      </div>
    </div>
  );
}

export default Tracking;