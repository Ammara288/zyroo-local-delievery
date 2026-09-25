import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Truck, ShieldCheck, MapPin, Clock, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="homepage">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">LOCAL DELIVERY PLATFORM</span>
          <h1>
            Manage your deliveries <br />
            <span className="hero-highlight">easily from one place.</span>
          </h1>
          <p>
            Zyroo helps businesses, riders, and customers connect for fast,
            reliable local deliveries across Pakistan.
          </p>

          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Role badges */}
          <div className="hero-roles">
            <span>🏢 Business</span>
            <span>🏍️ Rider</span>
            <span>👤 Customer</span>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="features-header">
          <span className="section-eyebrow">WHY ZYROO</span>
          <h2>Built for everyone in delivery</h2>
          <p>Simple tools for businesses, riders, and customers</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Package size={28} />
            </div>
            <h3>Easy Order Management</h3>
            <p>
              Create, track, and manage delivery orders from a simple
              dashboard.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Truck size={28} />
            </div>
            <h3>Real-Time Tracking</h3>
            <p>
              Customers can check their order status anytime, anywhere with
              live map tracking.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={28} />
            </div>
            <h3>Reliable & Secure</h3>
            <p>
              Role-based access ensures your data stays safe and organized.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="howworks">
        <div className="howworks-inner">
          <div className="howworks-head">
            <span className="section-eyebrow">HOW IT WORKS</span>
            <h2>Simple delivery flow</h2>
          </div>

          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Business Creates</h4>
              <p>Business adds a delivery order with pickup and drop details</p>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Rider Assigned</h4>
              <p>Business assigns the order to an available rider</p>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <h4>Rider Delivers</h4>
              <p>Rider picks up, updates status, and delivers the package</p>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <h4>Customer Tracks</h4>
              <p>Customer sees real-time status of their delivery on map</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-inner">
            <h2>Ready to start delivering?</h2>
            <p>Join Zyroo today and simplify your delivery workflow.</p>
            <Link to="/register" className="btn-primary btn-large">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stats-inner">
          <div className="stat-item">
            <b>500+</b>
            <span>Orders Delivered</span>
          </div>
          <div className="stat-item">
            <b>50+</b>
            <span>Active Riders</span>
          </div>
          <div className="stat-item">
            <b>100+</b>
            <span>Businesses</span>
          </div>
          <div className="stat-item">
            <b>98%</b>
            <span>Satisfaction</span>
          </div>
        </div>
      </section>
    </main>
  );
}