import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X, ShoppingCart, LayoutDashboard, Package, Truck, Home as HomeIcon, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { roleLabels, roleColors } from "../data/users";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  // Role-based navigation links
  const getNavLinks = () => {
    const commonLinks = [
      { to: "/", label: "Home", icon: <HomeIcon size={16} /> },
    ];

    if (!isAuthenticated) {
      return commonLinks;
    }

    if (user?.role === "business") {
      return [
        ...commonLinks,
        { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "/orders", label: "Orders", icon: <Package size={16} /> },
      ];
    }

    if (user?.role === "rider") {
      return [
        ...commonLinks,
        { to: "/dashboard", label: "My Deliveries", icon: <Truck size={16} /> },
      ];
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
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <span className="brandmark">Z</span>
          <span className="brandname">
            Zyroo <span>Delivery</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="navbar-link">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
              <Link to="/register" className="nav-btn nav-btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="usermenu-wrap">
              <button
                className="usermenu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span
                  className="useravatar"
                  style={{ background: roleColors[user.role] || "#dc2626" }}
                >
                  {user.avatar || user.name?.charAt(0).toUpperCase()}
                </span>
                <div className="userdetails">
                  <b>{user.name?.split(" ")[0]}</b>
                  <small style={{ color: roleColors[user.role] }}>
                    {roleLabels[user.role]}
                  </small>
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

          {/* Mobile menu toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-link"
              onClick={closeMobile}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <hr />
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="mobile-link" onClick={closeMobile}>
                Login
              </Link>
              <Link to="/register" className="mobile-link mobile-primary" onClick={closeMobile}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="mobile-user">
                <span
                  className="useravatar"
                  style={{ background: roleColors[user.role] || "#dc2626" }}
                >
                  {user.avatar || user.name?.charAt(0).toUpperCase()}
                </span>
                <div>
                  <b>{user.name}</b>
                  <small style={{ color: roleColors[user.role] }}>
                    {roleLabels[user.role]}
                  </small>
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