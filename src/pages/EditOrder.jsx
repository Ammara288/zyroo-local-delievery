import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Phone, MapPin, Package, AlertCircle, Save, ArrowLeft, CreditCard, Weight, Clock, FileText } from "lucide-react";
import { orders as mockOrders, PRIORITY_OPTIONS, PAYMENT_OPTIONS } from "../data/mockData";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const savedOrders = localStorage.getItem("zyroo_orders");
  const allOrders = savedOrders ? JSON.parse(savedOrders) : mockOrders;
  const existing = allOrders.find(o => o.id === id);

  const [form, setForm] = useState({
    customer: existing?.customer || "",
    customerPhone: existing?.customerPhone || "",
    pickupAddress: existing?.pickupAddress || existing?.pickup || "",
    deliveryAddress: existing?.deliveryAddress || existing?.delivery || "",
    packageDetails: existing?.packageDetails || "",
    packageWeight: existing?.packageWeight || "",
    deliveryTime: existing?.deliveryTime || "Anytime",
    specialInstructions: existing?.specialInstructions || "",
    priority: existing?.priority || "Normal",
    paymentMethod: existing?.paymentMethod || "Cash on Delivery",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!existing) return (
    <div className="detail-empty">
      <h2>Order not found</h2>
      <Link to="/orders" className="detail-back">← Back to Orders</Link>
    </div>
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customer || !form.customerPhone || !form.pickupAddress || !form.deliveryAddress || !form.packageDetails) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);

    const updated = allOrders.map(o => {
      if (o.id === id) {
        return {
          ...o,
          customer: form.customer,
          customerPhone: form.customerPhone,
          pickup: form.pickupAddress.split(",")[0] || form.pickupAddress,
          pickupAddress: form.pickupAddress,
          delivery: form.deliveryAddress.split(",")[0] || form.deliveryAddress,
          deliveryAddress: form.deliveryAddress,
          packageDetails: form.packageDetails,
          packageWeight: form.packageWeight,
          deliveryTime: form.deliveryTime,
          specialInstructions: form.specialInstructions,
          priority: form.priority,
          paymentMethod: form.paymentMethod,
        };
      }
      return o;
    });

    localStorage.setItem("zyroo_orders", JSON.stringify(updated));
    setTimeout(() => navigate(`/orders/${id}`), 400);
  };

  return (
    <div className="createorder-page">
      <div className="createorder-head">
        <button className="back-btn" onClick={() => navigate(`/orders/${id}`)}>
          <ArrowLeft size={18} /> Back to Order
        </button>
        <h1>✏️ Edit Order</h1>
        <p>Update order details for <b>{id}</b></p>
      </div>

      {error && (
        <div className="autherror">
          <AlertCircle size={18} /><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="createorder-form" noValidate>
        {/* Customer */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">👤</span>
            <div><h2 className="form-section-title">Customer Information</h2></div>
          </div>
          <div className="formrow-2">
            <label>Customer Name *
              <div className="inputwrap">
                <User size={18} />
                <input type="text" name="customer" value={form.customer} onChange={handleChange} />
              </div>
            </label>
            <label>Customer Phone *
              <div className="inputwrap">
                <Phone size={18} />
                <input type="tel" name="customerPhone" value={form.customerPhone} onChange={handleChange} />
              </div>
            </label>
          </div>
        </div>

        {/* Locations */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">📍</span>
            <div><h2 className="form-section-title">Pickup & Delivery</h2></div>
          </div>
          <label>Pickup Address *
            <div className="inputwrap">
              <MapPin size={18} />
              <input type="text" name="pickupAddress" value={form.pickupAddress} onChange={handleChange} />
            </div>
          </label>
          <label>Delivery Address *
            <div className="inputwrap">
              <MapPin size={18} />
              <input type="text" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} />
            </div>
          </label>
        </div>

        {/* Package */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">📦</span>
            <div><h2 className="form-section-title">Package Details</h2></div>
          </div>
          <label>Package Description *
            <div className="inputwrap textarea-wrap">
              <Package size={18} />
              <textarea name="packageDetails" value={form.packageDetails} onChange={handleChange} rows={3} />
            </div>
          </label>
          <div className="formrow-2">
            <label>Weight (kg)
              <div className="inputwrap">
                <Weight size={18} />
                <input type="text" name="packageWeight" value={form.packageWeight} onChange={handleChange} />
              </div>
            </label>
            <label>Delivery Time
              <div className="inputwrap">
                <Clock size={18} />
                <select name="deliveryTime" value={form.deliveryTime} onChange={handleChange}>
                  <option>Anytime</option>
                  <option>Morning (9am - 12pm)</option>
                  <option>Afternoon (12pm - 4pm)</option>
                  <option>Evening (4pm - 8pm)</option>
                </select>
              </div>
            </label>
          </div>
          <label>Special Instructions
            <div className="inputwrap textarea-wrap">
              <FileText size={18} />
              <textarea name="specialInstructions" value={form.specialInstructions} onChange={handleChange} rows={2} />
            </div>
          </label>
        </div>

        {/* Options */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">⚙️</span>
            <div><h2 className="form-section-title">Delivery Options</h2></div>
          </div>
          <div className="formrow-2">
            <label>Priority
              <div className="inputwrap">
                <AlertCircle size={18} />
                <select name="priority" value={form.priority} onChange={handleChange}>
                  {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </label>
            <label>Payment Method
              <div className="inputwrap">
                <CreditCard size={18} />
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  {PAYMENT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="authbtn" disabled={loading}>
          <Save size={18} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}