import React from 'react';

function Footer() {
  return (
    <footer style={{
      padding: '30px 20px',
      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
      color: '#fff',
      textAlign: 'center'
    }}>
      <p style={{ marginBottom: '5px' }}>&copy; 2026 Zyroo Logistics. All rights reserved.</p>
      <p style={{ fontSize: '14px', color: '#f1f5f9' }}>Website: https://zyroo.org</p>
    </footer>
  );
}
export default Footer;