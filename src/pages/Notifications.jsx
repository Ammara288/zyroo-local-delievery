import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, X, Filter, RefreshCw, Loader } from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";

function Notifications() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [filter, setFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(false);

  // Filter notifications
  const filteredNotifications =
    filter === "All"
      ? notifications
      : filter === "Unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.read);

  // Handle mark as read
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    setActionLoading(true);
    await markAllAsRead();
    setActionLoading(false);
  };

  // Handle delete
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    const map = {
      info: "📦",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    };
    return map[type] || "🔔";
  };

  // Get color based on notification type
  const getColor = (type) => {
    const map = {
      info: "blue",
      success: "green",
      warning: "orange",
      error: "red",
    };
    return map[type] || "blue";
  };

  // Format time
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-page">
        <div className="notifications-inner">
          <div className="loading-state">
            <Loader className="spin" size={48} />
            <h2>Loading notifications...</h2>
            <p>Fetching from server</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-inner">
        {/* Header */}
        <div className="notifications-head">
          <div>
            <h1>🔔 Notifications</h1>
            <p>Stay updated with all delivery activities and order changes.</p>
          </div>
          <div className="notif-head-actions">
            <button className="refresh-btn" onClick={refreshNotifications} disabled={loading}>
              <RefreshCw size={18} className={loading ? "spin" : ""} />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button className="notif-btn-outline" onClick={handleMarkAllAsRead} disabled={actionLoading}>
                <CheckCircle2 size={16} /> Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={refreshNotifications}>Retry</button>
          </div>
        )}

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
          {["All", "Unread", "Read"].map((f) => (
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
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${!n.read ? "unread" : ""}`}
                onClick={() => handleMarkAsRead(n.id)}
              >
                <div className={`notif-icon notif-icon-${getColor(n.type)}`}>
                  <span>{getIcon(n.type)}</span>
                </div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <b>{n.title}</b>
                    {!n.read && <span className="notif-unread-dot" />}
                  </div>
                  <p>{n.message}</p>
                  <small>{formatTime(n.createdAt)}</small>
                </div>
                <button
                  className="notif-delete-btn"
                  onClick={(e) => handleDelete(e, n.id)}
                  title="Delete"
                >
                  <X size={16} />
                </button>
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