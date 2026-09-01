import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      padding: '18px 40px',
      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
    }}>
      <h2 style={{ color: '#fff', fontSize: '22px', letterSpacing: '1px', fontWeight: 'bold' }}>
        ZYROO <span style={{ color: '#fde047', fontWeight: '300' }}>Logistics</span>
      </h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/orders" style={linkStyle}>Orders</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#fff',
  fontSize: '15px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '25px',
  background: 'rgba(255, 255, 255, 0.15)',
};

export default Navbar;