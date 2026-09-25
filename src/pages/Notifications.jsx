import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, X, Filter } from "lucide-react";

const initialNotifications = [
  { id: 1, type: "order", title: "New order created", text: "Order #DL001 is ready for processing.", time: "2 min ago", read: false, icon: "📦", color: "blue" },
  { id: 2, type: "rider", title: "Rider assigned", text: "Hamza has been assigned to order #DL001.", time: "15 min ago", read: false, icon: "🏍️", color: "purple" },
  { id: 3, type: "accepted", title: "Order accepted", text: "Rider Hamza accepted order #DL001.", time: "1 hour ago", read: false, icon: "✅", color: "green" },
  { id: 4, type: "picked", title: "Order picked up", text: "Package picked up from Mardan warehouse.", time: "2 hours ago", read: true, icon: "📍", color: "orange" },
  { id: 5, type: "transit", title: "Delivery started", text: "Order #DL001 is now in transit to Timergara.", time: "3 hours ago", read: true, icon: "🚚", color: "blue" },
  { id: 6, type: "delivered", title: "Delivery completed", text: "Order #DL002 delivered successfully.", time: "Yesterday", read: true, icon: "🎉", color: "green" },
  { id: 7, type: "order", title: "New order created", text: "Order #DL003 is pending assignment.", time: "Yesterday", read: true, icon: "📦", color: "blue" },
];

function Notifications() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("zyroo_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [filter, setFilter] = useState("All");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("zyroo_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === "All"
    ? notifications
    : filter === "Unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.read);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    if (window.confirm("Clear all notifications?")) {
      setNotifications([]);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-inner">
        {/* Header */}
        <div className="notifications-head">
          <div>
            <span className="notif-eyebrow">WEEK 4 • NOTIFICATIONS</span>
            <h1>🔔 Notifications</h1>
            <p>Stay updated with all delivery activities and order changes.</p>
          </div>
          <div className="notif-head-actions">
            {unreadCount > 0 && (
              <button className="notif-btn-outline" onClick={markAllAsRead}>
                <CheckCircle2 size={16} /> Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="notif-btn-outline danger" onClick={clearAll}>
                <X size={16} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="notif-stats">
          <div className="notif-stat">
            <Bell size={18} />
            <div>
              <b>{notifications.length}</b>
              <small>Total</small>
            </div>
          </div>
          <div className="notif-stat highlight">
            <span className="notif-dot-blue" />
            <div>
              <b>{unreadCount}</b>
              <small>Unread</small>
            </div>
          </div>
          <div className="notif-stat">
            <CheckCircle2 size={18} />
            <div>
              <b>{notifications.length - unreadCount}</b>
              <small>Read</small>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="notif-filters">
          <Filter size={15} />
          {["All", "Unread", "Read"].map(f => (
            <button
              key={f}
              className={`notif-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="notif-empty">
              <Bell size={48} />
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map(n => (
              <div
                key={n.id}
                className={`notification-item ${!n.read ? "unread" : ""}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className={`notif-icon notif-icon-${n.color}`}>
                  <span>{n.icon}</span>
                </div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <b>{n.title}</b>
                    {!n.read && <span className="notif-unread-dot" />}
                  </div>
                  <p>{n.text}</p>
                  <small>{n.time}</small>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back link */}
        <div className="notif-back">
          <Link to="/orders">← Back to Orders</Link>
        </div>
      </div>
    </div>
  );
}

export default Notifications;