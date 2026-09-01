import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        color: 'white',
        padding: '90px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)'
        }}></div>

        <h1 style={{ fontSize: '52px', marginBottom: '20px', fontWeight: 'bold', position: 'relative', zIndex: 1, lineHeight: '1.2' }}>
          Local Delivery Made <span style={{ color: '#fde047' }}>Simple</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#f1f5f9', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', position: 'relative', zIndex: 1, lineHeight: '1.6' }}>
          Manage all your deliveries, riders, and orders from one powerful dashboard.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '16px 40px', fontSize: '17px',
            background: '#fff', color: '#6366f1',
            border: 'none', borderRadius: '50px', cursor: 'pointer',
            fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            position: 'relative', zIndex: 1
          }}>
          Get Started →
        </button>
      </div>

      {/* FEATURES SECTION */}
      <div style={{ padding: '70px 20px', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: '34px', marginBottom: '15px', color: '#1e293b' }}>Why Choose Us?</h2>
        <p style={{ color: '#64748b', marginBottom: '50px', fontSize: '16px' }}>Everything you need to run your delivery business</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap' }}>
          <FeatureCard icon="⚡" title="Fast Delivery" desc="Lightning-fast deliveries with optimized routes." color="#6366f1" />
          <FeatureCard icon="📍" title="Live Tracking" desc="Track every order from pickup to delivery." color="#a855f7" />
          <FeatureCard icon="📊" title="Smart Dashboard" desc="Manage riders, orders, and analytics easily." color="#ec4899" />
        </div>
      </div>

      {/* STATS SECTION */}
      <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)', padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap', textAlign: 'center' }}>
          <Stat number="500+" label="Deliveries" color="#6366f1" />
          <Stat number="50+" label="Riders" color="#a855f7" />
          <Stat number="98%" label="Satisfaction" color="#ec4899" />
        </div>
      </div>

      {/* CTA SECTION */}
      <div style={{ padding: '70px 20px', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '18px', color: '#1e293b' }}>
          Ready to Start Delivering?
        </h2>
        <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '16px' }}>
          Join hundreds of businesses using Zyroo Logistics.
        </p>
        <button
          onClick={() => navigate('/orders')}
          style={{
            padding: '15px 40px', fontSize: '16px',
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            color: 'white', border: 'none', borderRadius: '50px',
            cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)'
          }}>
          View Orders
        </button>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc, color }) => (
  <div style={{
    padding: '35px 25px', borderRadius: '20px',
    width: '280px', maxWidth: '100%',
    background: 'white',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    textAlign: 'center',
    borderTop: `4px solid ${color}`
  }}>
    <div style={{
      fontSize: '45px', width: '80px', height: '80px',
      lineHeight: '80px', margin: '0 auto 18px',
      borderRadius: '50%', background: `${color}15`
    }}>{icon}</div>
    <h3 style={{ marginBottom: '12px', fontSize: '20px', color: '#1e293b' }}>{title}</h3>
    <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '15px' }}>{desc}</p>
  </div>
);

const Stat = ({ number, label, color }) => (
  <div>
    <h2 style={{ fontSize: '40px', color: color, marginBottom: '5px', fontWeight: 'bold' }}>{number}</h2>
    <p style={{ color: '#64748b', fontSize: '15px' }}>{label}</p>
  </div>
);

export default Home;