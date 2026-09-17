import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orders as initialOrders, ridersList } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, X, UserCheck, Package, Truck, CheckCircle, Clock } from 'lucide-react';

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState([...initialOrders]);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);

  const isBusiness = user?.role === 'business';
  const isRider = user?.role === 'rider';
  const isCustomer = user?.role === 'customer';

  // Role-based filtering
  let roleOrders = orders;
  if (isRider) {
    roleOrders = orders.filter(o => o.rider && o.rider.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]));
    if (roleOrders.length === 0) roleOrders = orders;
  } else if (isCustomer) {
    roleOrders = orders.filter(o => o.customer.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]));
    if (roleOrders.length === 0) roleOrders = orders;
  }

  const filteredOrders = filter === 'All'
    ? roleOrders
    : roleOrders.filter(o => o.status === filter);

  const statusFilters = ['All', 'Pending', 'Assigned', 'In Transit', 'Delivered'];

  // Assign rider to order
  const handleAssignRider = (orderId, rider) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          rider: rider.name,
          riderPhone: rider.phone,
          status: 'Assigned',
          timeline: [...o.timeline, { status: 'Assigned', time: new Date().toISOString() }],
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('zyroo_orders', JSON.stringify(updated));
    setAssigningOrder(null);
  };

  // Cancel order
  const handleCancelOrder = (orderId) => {
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('zyroo_orders', JSON.stringify(updated));
    setCancelConfirm(null);
  };

  // Count stats
  const stats = {
    total: roleOrders.length,
    pending: roleOrders.filter(o => o.status === 'Pending').length,
    inDelivery: roleOrders.filter(o => o.status === 'In Transit' || o.status === 'Picked Up' || o.status === 'Assigned' || o.status === 'Accepted').length,
    completed: roleOrders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-head-row">
        <div className="orders-head">
          <h1>
            {isRider ? '🏍️ My Deliveries' :
             isCustomer ? '👤 My Orders' :
             '📦 Orders Management'}
          </h1>
          <p>
            {isRider ? 'View and manage your assigned deliveries' :
             isCustomer ? 'Track your orders in real-time' :
             'View and manage all your delivery orders in one place'}
          </p>
        </div>

        {/* Create Order Button - Only for Business */}
        {isBusiness && (
          <Link to="/orders/new" className="create-order-btn">
            <Plus size={20} /> Create Order
          </Link>
        )}
      </div>

      {/* Stats Bar */}
      <div className="orders-stats">
        <div className="ostat">
          <span className="ostat-icon"><Package size={18} /></span>
          <div>
            <b>{stats.total}</b>
            <small>Total</small>
          </div>
        </div>
        <div className="ostat">
          <span className="ostat-icon" style={{background:'#fef3c7',color:'#d97706'}}><Clock size={18} /></span>
          <div>
            <b>{stats.pending}</b>
            <small>Pending</small>
          </div>
        </div>
        <div className="ostat">
          <span className="ostat-icon" style={{background:'#dbeafe',color:'#2563eb'}}><Truck size={18} /></span>
          <div>
            <b>{stats.inDelivery}</b>
            <small>In Delivery</small>
          </div>
        </div>
        <div className="ostat">
          <span className="ostat-icon" style={{background:'#dcfce7',color:'#16a34a'}}><CheckCircle size={18} /></span>
          <div>
            <b>{stats.completed}</b>
            <small>Completed</small>
          </div>
        </div>
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
          <OrderCard
            key={order.id}
            order={order}
            userRole={user?.role}
            isBusiness={isBusiness}
            onAssignClick={() => setAssigningOrder(order.id)}
            onCancelClick={() => setCancelConfirm(order.id)}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="orders-empty">
          <h2>No orders found</h2>
          <p>Try a different filter</p>
        </div>
      )}

      {/* Assign Rider Modal */}
      {assigningOrder && (
        <div className="modal-overlay" onClick={() => setAssigningOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3><UserCheck size={20}/> Assign Rider</h3>
              <button onClick={() => setAssigningOrder(null)}><X size={20} /></button>
            </div>
            <p className="modal-sub">Order: <b>{assigningOrder}</b></p>
            <div className="rider-list">
              {ridersList.map(rider => (
                <button
                  key={rider.id}
                  className="rider-option"
                  onClick={() => handleAssignRider(assigningOrder, rider)}
                >
                  <div className="rider-avatar">{rider.name.charAt(0)}</div>
                  <div className="rider-info">
                    <b>{rider.name}</b>
                    <small>{rider.vehicle} • ⭐ {rider.rating}</small>
                  </div>
                  <span className="rider-phone">{rider.phone}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="modal-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="modal-box modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>⚠️ Cancel Order?</h3>
              <button onClick={() => setCancelConfirm(null)}><X size={20} /></button>
            </div>
            <p className="modal-sub">
              Are you sure you want to cancel order <b>{cancelConfirm}</b>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-btn-outline" onClick={() => setCancelConfirm(null)}>
                Keep Order
              </button>
              <button className="modal-btn-danger" onClick={() => handleCancelOrder(cancelConfirm)}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const OrderCard = ({ order, userRole, isBusiness, onAssignClick, onCancelClick }) => {
  const statusColors = {
    'Pending': { bg: '#fef3c7', color: '#d97706', border: '#fbbf24' },
    'Assigned': { bg: '#e0e7ff', color: '#4338ca', border: '#818cf8' },
    'Accepted': { bg: '#fce7f3', color: '#be185d', border: '#f472b6' },
    'Picked Up': { bg: '#ffedd5', color: '#c2410c', border: '#fb923c' },
    'In Transit': { bg: '#dbeafe', color: '#2563eb', border: '#60a5fa' },
    'Delivered': { bg: '#dcfce7', color: '#16a34a', border: '#4ade80' },
  };
  const status = statusColors[order.status] || statusColors['Pending'];
  const isRider = userRole === 'rider';
  const canEdit = isBusiness && order.status !== 'Delivered';

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
        {order.customerPhone && <p className="ordercard-phone">📞 {order.customerPhone}</p>}
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

      {/* Priority + Date */}
      <div className="ordercard-meta">
        {order.priority && <span className={`priority-tag priority-${order.priority.toLowerCase()}`}>{order.priority}</span>}
        {order.date && <span className="date-tag">📅 {order.date}</span>}
      </div>

      {/* Actions */}
      <div className="ordercard-actions">
        <Link to={`/orders/${order.id}`} className="ordercard-btn">
          View Details →
        </Link>

        {/* Business actions */}
        {isBusiness && (
          <div className="ordercard-inline-actions">
            {canEdit && (
              <Link to={`/orders/${order.id}/edit`} className="inline-btn inline-edit">
                <Edit size={14} /> Edit
              </Link>
            )}
            {order.status === 'Pending' && (
              <>
                <button className="inline-btn inline-assign" onClick={onAssignClick}>
                  <UserCheck size={14} /> Assign
                </button>
                <button className="inline-btn inline-cancel" onClick={onCancelClick}>
                  <X size={14} /> Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;