import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Navigation, Clock3, Truck, Phone, UserRound, CheckCircle2 } from "lucide-react";
import { orders as mockOrders, STATUS_FLOW } from "../data/mockData";
import DeliveryMap from "../components/DeliveryMap";

function Tracking() {
  const { id } = useParams();

  const orders = useMemo(() => {
    const saved = localStorage.getItem("zyroo_orders");
    return saved ? JSON.parse(saved) : mockOrders;
  }, []);

  const order = orders.find((o) => o.id === id);

  if (!id) {
    return (
      <div className="tracking-page">
        <div className="tracking-inner">
          <h1 className="tracking-title">📍 Track Delivery</h1>
          <p className="tracking-sub">Select an order from the Orders page to view its delivery progress.</p>
          <div className="tracking-empty-card">
            <p>No order selected</p>
            <Link to="/orders" className="tracking-btn">Go to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-page">
        <div className="tracking-inner">
          <h2 className="tracking-title">Order not found</h2>
          <Link to="/orders" className="detail-back">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  const rider = order.rider || "Not Assigned";
  const isDelivered = order.status === "Delivered";
  const riderInitial = order.riderAvatar || rider.charAt(0).toUpperCase();

  return (
    <div className="tracking-page">
      <div className="tracking-inner">
        <div className="tracking-page-head">
          <div>
            <span className="tracking-eyebrow">DELIVERY TRACKING</span>
            <h1 className="tracking-title">📍 Track Order #{order.id}</h1>
            <p className="tracking-sub">Follow the live delivery route and current rider progress.</p>
          </div>
          <span className={`tracking-main-status status-${order.status.toLowerCase().replaceAll(" ", "-")}`}>
            {order.status}
          </span>
        </div>

        <div className="tracking-grid">
          {/* Real Map */}
          <section className="tracking-map-card">
            <div className="card-heading">
              <div>
                <h2>Live Delivery Route</h2>
                <p>Real-time rider tracking map</p>
              </div>
              <Navigation size={22} />
            </div>

            <div className="tracking-map-real">
              <DeliveryMap
                pickup={order.pickup}
                delivery={order.delivery}
                riderLocation={order.riderLocation}
              />
            </div>

            <div className="route-summary">
              <div><MapPin size={17}/><span><b>Pickup</b>{order.pickup}</span></div>
              <div><Navigation size={17}/><span><b>Rider</b>{order.riderLocation || "En route"}</span></div>
              <div><MapPin size={17}/><span><b>Delivery</b>{order.delivery}</span></div>
            </div>
          </section>

          {/* Status + rider */}
          <aside className="tracking-side">
            <section className="tracking-info-card">
              <div className="card-heading">
                <div><h2>Current Status</h2><p>Delivery progress</p></div>
                <Truck size={21}/>
              </div>
              <div className="status-large">{order.status}</div>
              <div className="estimate-box">
                <Clock3 size={20}/>
                <div><small>Estimated Delivery</small><b>{isDelivered ? "Delivered" : `${order.estimatedDelivery || 25} minutes`}</b></div>
              </div>

              <div className="timeline">
                {STATUS_FLOW.map((step) => {
                  const done = order.timeline?.some(t => t.status === step) || step === "Pending";
                  return (
                    <div className={`timeline-row ${done ? "done" : ""}`} key={step}>
                      <span className="timeline-dot">{done ? <CheckCircle2 size={16}/> : ""}</span>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="tracking-info-card rider-card">
              <div className="card-heading">
                <div><h2>Rider Information</h2><p>Assigned delivery partner</p></div>
                <UserRound size={21}/>
              </div>
              <div className="rider-profile">
                <div className="rider-avatar-large">{riderInitial}</div>
                <div><h3>{rider}</h3><span>{order.riderStatus || "Assigned"}</span></div>
              </div>
              <div className="rider-details">
                <div><Phone size={16}/><span>{order.riderPhone || "Not available"}</span></div>
                <div>🏍️ <span>{order.riderVehicle || "Vehicle not assigned"}</span></div>
                <div>📍 <span>Current: {order.riderLocation || "Simulated location"}</span></div>
              </div>
            </section>
          </aside>
        </div>

        <Link to={`/orders/${order.id}`} className="tracking-back-link">← Back to Order Details</Link>
      </div>
    </div>
  );
}

export default Tracking;