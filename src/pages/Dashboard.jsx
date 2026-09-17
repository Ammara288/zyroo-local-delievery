import React from 'react';
import { orders } from '../data/mockData';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const total = orders.length;
  const pending = orders.filter(o => o.status === 'Pending').length;
  const inDelivery = orders.filter(o => o.status === 'In Transit').length;
  const completed = orders.filter(o => o.status === 'Delivered').length;
  const recentOrders = orders.slice(0, 3);

  // Role-based heading
  const roleHeading = {
    business: { icon: '🏢', title: 'Business Dashboard', subtitle: 'Overview of your delivery operations' },
    rider: { icon: '🏍️', title: 'Rider Dashboard', subtitle: 'Your assigned deliveries' },
    customer: { icon: '👤', title: 'My Orders', subtitle: 'Track your deliveries' },
    admin: { icon: '👑', title: 'Admin Dashboard', subtitle: 'System overview' },
  };
  const heading = roleHeading[user?.role] || roleHeading.business;

  return (
    <div className="dashpage">
      {/* Header */}
      <div className="dashhead">
        <h1>{heading.icon} {heading.title}</h1>
        <p>{heading.subtitle}</p>
        {user?.name && (
          <p className="dashuser">Welcome back, <b>{user.name}</b>!</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="dashstats">
        <StatCard icon="📦" label="Total Orders" value={total} />
        <StatCard icon="⏳" label="Pending" value={pending} />
        <StatCard icon="🚚" label="In Delivery" value={inDelivery} />
        <StatCard icon="✅" label="Completed" value={completed} />
      </div>

      {/* Recent Orders */}
      <div className="dashrecent">
        <div className="dashrecent-head">
          <h2>Recent Orders</h2>
          <Link to="/orders" className="dashlink">View All →</Link>
        </div>

        {recentOrders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="dashorder">
            <div className="dashorder-left">
              <span className="dashorder-id">{order.id}</span>
              <div>
                <p className="dashorder-name">{order.customer}</p>
                <p className="dashorder-route">{order.pickup} → {order.delivery}</p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

const StatCard = ({ icon, label, value }) => (
  <div className="statcard">
    <div className="statcard-icon">{icon}</div>
    <h2 className="statcard-value">{value}</h2>
    <p className="statcard-label">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const cls = {
    'Pending': 'status-pending',
    'In Transit': 'status-transit',
    'Delivered': 'status-delivered',
  }[status] || 'status-pending';
  return <span className={`statusbadge ${cls}`}>{status}</span>;
};

export default Dashboard;