import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../data/mockData';

function Orders() {
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div style={{ padding: '50px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '35px' }}>
        <h1 style={{ fontSize: '38px', color: '#1e293b', marginBottom: '10px' }}>
          📦 Orders Management
        </h1>
        <p style={{ color: '#64748b', fontSize: '17px' }}>
          View and manage all your delivery orders in one place
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Transit', 'Delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '10px 22px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: '0.3s',
              background: filter === status
                ? 'linear-gradient(90deg, #6366f1, #a855f7)'
                : '#f1f5f9',
              color: filter === status ? 'white' : '#475569',
              boxShadow: filter === status ? '0 6px 20px rgba(99, 102, 241, 0.35)' : 'none'
            }}>
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <h2>No orders found</h2>
        </div>
      )}
    </div>
  );
}

const OrderCard = ({ order }) => {
  const statusColors = {
    'Pending': { bg: '#fef3c7', color: '#d97706', border: '#fbbf24' },
    'In Transit': { bg: '#dbeafe', color: '#2563eb', border: '#60a5fa' },
    'Delivered': { bg: '#dcfce7', color: '#16a34a', border: '#4ade80' }
  };
  const status = statusColors[order.status] || statusColors['Pending'];

  return (
    <div style={{
      background: 'white',
      borderRadius: '18px',
      padding: '25px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
      borderTop: `4px solid ${status.border}`,
      transition: '0.3s'
    }}>
      {/* Order ID + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{
          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {order.id}
        </div>
        <div style={{
          background: status.bg,
          color: status.color,
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {order.status}
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ marginBottom: '18px' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>CUSTOMER</p>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>{order.customer}</p>
      </div>

      {/* Route */}
      <div style={{
        background: '#f8fafc',
        padding: '15px',
        borderRadius: '12px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#475569'
      }}>
        <span>📍</span>
        <span style={{ fontWeight: '500' }}>{order.pickup}</span>
        <span style={{ color: '#a855f7', fontWeight: 'bold' }}>→</span>
        <span style={{ fontWeight: '500' }}>{order.delivery}</span>
      </div>

      {/* Rider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>
        <span>🏍️</span>
        <span>Rider: <strong style={{ color: '#1e293b' }}>{order.rider}</strong></span>
      </div>

      {/* Button */}
      <Link
        to={`/orders/${order.id}`}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px',
          background: 'linear-gradient(90deg, #6366f1, #a855f7)',
          color: 'white',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '15px',
          textDecoration: 'none',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}>
        View Details →
      </Link>
    </div>
  );
};

export default Orders;