import React from 'react';
import { orders } from '../data/mockData';
import { Link } from 'react-router-dom';

function Dashboard() {
  const total = orders.length;
  const pending = orders.filter(o => o.status === 'Pending').length;
  const inDelivery = orders.filter(o => o.status === 'In Transit').length;
  const completed = orders.filter(o => o.status === 'Delivered').length;
  const recentOrders = orders.slice(0, 3);

  return (
    <div style={{ padding: '50px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '38px', color: '#1e293b', marginBottom: '10px' }}>
          📊 Business Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '17px' }}>
          Overview of your delivery operations
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '25px',
        marginBottom: '50px'
      }}>
        <StatCard
          icon="📦"
          label="Total Orders"
          value={total}
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
        />
        <StatCard
          icon="⏳"
          label="Pending Orders"
          value={pending}
          gradient="linear-gradient(135deg, #f59e0b, #f97316)"
        />
        <StatCard
          icon="🚚"
          label="In Delivery"
          value={inDelivery}
          gradient="linear-gradient(135deg, #0ea5e9, #3b82f6)"
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={completed}
          gradient="linear-gradient(135deg, #10b981, #22c55e)"
        />
      </div>

      {/* Recent Orders Section */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontSize: '24px', color: '#1e293b' }}>Recent Orders</h2>
          <Link to="/orders" style={{
            color: '#6366f1',
            fontWeight: '600',
            fontSize: '15px',
            textDecoration: 'none'
          }}>
            View All →
          </Link>
        </div>

        {recentOrders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 20px',
              borderRadius: '12px',
              marginBottom: '10px',
              background: '#f8fafc',
              textDecoration: 'none',
              flexWrap: 'wrap',
              gap: '10px',
              borderLeft: '4px solid #a855f7'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '13px'
              }}>
                {order.id}
              </div>
              <div>
                <p style={{ fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>{order.customer}</p>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>{order.pickup} → {order.delivery}</p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value, gradient }) => (
  <div style={{
    background: gradient,
    color: 'white',
    padding: '28px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ fontSize: '36px', marginBottom: '15px' }}>{icon}</div>
    <h2 style={{ fontSize: '42px', marginBottom: '5px', fontWeight: 'bold' }}>{value}</h2>
    <p style={{ fontSize: '15px', opacity: 0.9 }}>{label}</p>
    <div style={{
      position: 'absolute',
      top: '-30px',
      right: '-30px',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)'
    }}></div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    'Pending': { bg: '#fef3c7', color: '#d97706' },
    'In Transit': { bg: '#dbeafe', color: '#2563eb' },
    'Delivered': { bg: '#dcfce7', color: '#16a34a' }
  };
  const c = colors[status] || colors['Pending'];
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600'
    }}>
      {status}
    </span>
  );
};

export default Dashboard;