import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function Orders() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');

  // Role-based filtering
  let roleOrders = orders;
  if (user?.role === 'rider') {
    // Rider sirf apni assigned orders dekhe
    roleOrders = orders.filter(o => o.rider && o.rider.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]));
    // Agar kuch nahi mila toh sab dikha do (demo ke liye)
    if (roleOrders.length === 0) roleOrders = orders;
  } else if (user?.role === 'customer') {
    // Customer sirf apni orders dekhe
    roleOrders = orders.filter(o => o.customer.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]));
    if (roleOrders.length === 0) roleOrders = orders;
  }

  const filteredOrders = filter === 'All'
    ? roleOrders
    : roleOrders.filter(o => o.status === filter);

  const statusFilters = ['All', 'Pending', 'In Transit', 'Delivered'];

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-head">
        <h1>
          {user?.role === 'rider' ? '🏍️ My Deliveries' :
           user?.role === 'customer' ? '👤 My Orders' :
           '📦 Orders Management'}
        </h1>
        <p>
          {user?.role === 'rider' ? 'View and manage your assigned deliveries' :
           user?.role === 'customer' ? 'Track your orders in real-time' :
           'View and manage all your delivery orders in one place'}
        </p>
        {user?.name && <p className="orders-user">Welcome back, <b>{user.name}</b>!</p>}
      </div>

      {/* Filter Buttons */}
      <div className="orders-filters">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} userRole={user?.role} />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="orders-empty">
          <h2>No orders found</h2>
          <p>Try a different filter</p>
        </div>
      )}
    </div>
  );
}

const OrderCard = ({ order, userRole }) => {
  const statusColors = {
    'Pending': { bg: '#fef3c7', color: '#d97706', border: '#fbbf24' },
    'In Transit': { bg: '#dbeafe', color: '#2563eb', border: '#60a5fa' },
    'Delivered': { bg: '#dcfce7', color: '#16a34a', border: '#4ade80' }
  };
  const status = statusColors[order.status] || statusColors['Pending'];

  return (
    <div className="ordercard" style={{ borderTopColor: status.border }}>
      {/* Order ID + Status */}
      <div className="ordercard-top">
        <div className="ordercard-id">{order.id}</div>
        <div className="ordercard-status" style={{ background: status.bg, color: status.color }}>
          {order.status}
        </div>
      </div>

      {/* Customer Info */}
      <div className="ordercard-customer">
        <p className="ordercard-label">CUSTOMER</p>
        <p className="ordercard-name">{order.customer}</p>
      </div>

      {/* Route */}
      <div className="ordercard-route">
        <span>📍</span>
        <span className="route-city">{order.pickup}</span>
        <span className="route-arrow">→</span>
        <span className="route-city">{order.delivery}</span>
      </div>

      {/* Rider */}
      <div className="ordercard-rider">
        <span>🏍️</span>
        <span>Rider: <strong>{order.rider || 'Not Assigned'}</strong></span>
      </div>

      {/* Button */}
      <Link to={`/orders/${order.id}`} className="ordercard-btn">
        View Details →
      </Link>
    </div>
  );
};

export default Orders;