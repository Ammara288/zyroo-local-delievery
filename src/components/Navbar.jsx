import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, LayoutDashboard, Package, Truck, Home as HomeIcon, ChevronDown, Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleLabels, roleColors } from "../data/users";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifications = [
    { id: 1, title: "New order created", text: "Order #DL001 is ready for processing.", icon: "📦", time: "2 min ago", unread: true },
    { id: 2, title: "Rider assigned", text: "Hamza has been assigned to #DL001.", icon: "🏍️", time: "15 min ago", unread: true },
    { id: 3, title: "Order picked up", text: "The rider picked up the package.", icon: "📍", time: "1 hour ago", unread: false },
    { id: 4, title: "Delivery started", text: "Order #DL001 is now in transit.", icon: "🚚", time: "2 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification-wrap")) setNotificationsOpen(false);
      if (!e.target.closest(".usermenu-wrap")) setUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const getNavLinks = () => {
    const commonLinks = [{ to: "/", label: "Home", icon: <HomeIcon size={16} /> }];
    if (!isAuthenticated) return commonLinks;
    if (user?.role === "business") {
      return [
        ...commonLinks,
        { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "/orders", label: "Orders", icon: <Package size={16} /> },
      ];
    }
    if (user?.role === "rider") {
      return [...commonLinks, { to: "/dashboard", label: "My Deliveries", icon: <Truck size={16} /> }];
    }
    if (user?.role === "customer") {
      return [
        ...commonLinks,
        { to: "/dashboard", label: "My Orders", icon: <Package size={16} /> },
        { to: "/tracking", label: "Track", icon: <Truck size={16} /> },
      ];
    }
    return commonLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <span className="brandmark">Z</span>
          <span className="brandname">
            Zyroo <span>Delivery</span>
          </span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="navbar-link">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated && (
            <div className="notification-wrap">
              <button
                className="notification-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell size={19} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-head">
                    <div>
                      <b>Notifications</b>
                      <small>Recent delivery updates</small>
                    </div>
                    <span>{unreadCount} new</span>
                  </div>
                  {notifications.map((n) => (
                    <div className={`notification-item ${n.unread ? "unread" : ""}`} key={n.id}>
                      <span className="notification-icon">{n.icon}</span>
                      <div>
                        <b>{n.title}</b>
                        <p>{n.text}</p>
                        <small>{n.time}</small>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/notifications"
                    className="notification-footer"
                    onClick={() => setNotificationsOpen(false)}
                    style={{ textDecoration: "none" }}
                  >
                    <Bell size={15} /> View All Notifications →
                  </Link>
                </div>
              )}
            </div>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
              <Link to="/register" className="nav-btn nav-btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="usermenu-wrap">
              <button
                className="usermenu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
              >
                <span className="useravatar" style={{ background: roleColors[user.role] || "#dc2626" }}>
                  {user.avatar || user.name?.charAt(0).toUpperCase()}
                </span>
                <div className="userdetails">
                  <b>{user.name?.split(" ")[0]}</b>
                  <small style={{ color: roleColors[user.role] }}>{roleLabels[user.role]}</small>
                </div>
                <ChevronDown size={16} />
              </button>

              {userMenuOpen && (
                <div className="usermenu">
                  <div className="usermenu-header">
                    <b>{user.name}</b>
                    <small>{user.email}</small>
                  </div>
                  <hr />
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="mobile-link" onClick={closeMobile}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <hr />
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="mobile-link" onClick={closeMobile}>Login</Link>
              <Link to="/register" className="mobile-link mobile-primary" onClick={closeMobile}>Sign Up</Link>
            </>
          ) : (
            <>
              <div className="mobile-user">
                <span className="useravatar" style={{ background: roleColors[user.role] || "#dc2626" }}>
                  {user.avatar || user.name?.charAt(0).toUpperCase()}
                </span>
                <div>
                  <b>{user.name}</b>
                  <small style={{ color: roleColors[user.role] }}>{roleLabels[user.role]}</small>
                </div>
              </div>
              <button onClick={handleLogout} className="mobile-link logout-mobile">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}