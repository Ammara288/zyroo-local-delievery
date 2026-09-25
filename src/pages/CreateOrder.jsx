import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Package, AlertCircle, Save, ArrowLeft, CreditCard, Weight, Clock, FileText, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { orders as initialOrders, PRIORITY_OPTIONS, PAYMENT_OPTIONS } from "../data/mockData";

export default function CreateOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    customer: "",
    customerPhone: "",
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: "",
    packageWeight: "",
    deliveryTime: "Anytime",
    specialInstructions: "",
    priority: "Normal",
    paymentMethod: "Cash on Delivery",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // Form completion percentage
  const requiredFields = ["customer", "customerPhone", "pickupAddress", "deliveryAddress", "packageDetails"];
  const filledFields = requiredFields.filter(f => form[f]?.trim()).length;
  const progress = Math.round((filledFields / requiredFields.length) * 100);

  const validate = () => {
    const newErrors = {};
    if (!form.customer.trim()) newErrors.customer = "Customer name is required";
    if (!form.customerPhone.trim()) newErrors.customerPhone = "Phone number is required";
    else if (form.customerPhone.length < 10) newErrors.customerPhone = "Enter a valid phone number";
    if (!form.pickupAddress.trim()) newErrors.pickupAddress = "Pickup address is required";
    if (!form.deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery address is required";
    if (!form.packageDetails.trim()) newErrors.packageDetails = "Package description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const newOrder = {
      id: `DL${String(initialOrders.length + 1).padStart(3, "0")}`,
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
      rider: "Not Assigned",
      riderPhone: "",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      businessId: user?.id || "U001",
      businessName: user?.company || user?.name || "Business",
      timeline: [{ status: "Pending", time: new Date().toISOString() }],
    };

    // Load existing orders from localStorage and add new one
    const saved = localStorage.getItem("zyroo_orders");
    const existing = saved ? JSON.parse(saved) : [...initialOrders];
    existing.unshift(newOrder);
    localStorage.setItem("zyroo_orders", JSON.stringify(existing));

    setTimeout(() => navigate("/orders"), 400);
  };

  return (
    <div className="createorder-page">
      {/* Header */}
      <div className="createorder-head">
        <button className="back-btn" onClick={() => navigate("/orders")}>
          <ArrowLeft size={18} /> Back to Orders
        </button>
        <h1>📦 Create New Order</h1>
        <p>Fill in the delivery details below. Fields marked with * are required.</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-wrap">
        <div className="progress-info">
          <span>Form Progress</span>
          <b>{progress}%</b>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="createorder-form" noValidate>
        {/* Customer Section */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">👤</span>
            <div>
              <h2 className="form-section-title">Customer Information</h2>
              <p className="form-section-sub">Who is receiving the delivery?</p>
            </div>
          </div>

          <div className="formrow-2">
            <label>
              Customer Name *
              <div className={`inputwrap ${errors.customer ? "input-error" : ""}`}>
                <User size={18} />
                <input
                  type="text"
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  placeholder="Ali Khan"
                />
                {form.customer && <CheckCircle size={16} className="input-check" />}
              </div>
              {errors.customer && <span className="error-text">{errors.customer}</span>}
            </label>

            <label>
              Customer Phone *
              <div className={`inputwrap ${errors.customerPhone ? "input-error" : ""}`}>
                <Phone size={18} />
                <input
                  type="tel"
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                />
                {form.customerPhone && <CheckCircle size={16} className="input-check" />}
              </div>
              {errors.customerPhone && <span className="error-text">{errors.customerPhone}</span>}
            </label>
          </div>
        </div>

        {/* Pickup & Delivery */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">📍</span>
            <div>
              <h2 className="form-section-title">Pickup & Delivery</h2>
              <p className="form-section-sub">From where to where?</p>
            </div>
          </div>

          <label>
            Pickup Address *
            <div className={`inputwrap ${errors.pickupAddress ? "input-error" : ""}`}>
              <MapPin size={18} />
              <input
                type="text"
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                placeholder="Shop 12, Nisatta Road, Mardan"
              />
              {form.pickupAddress && <CheckCircle size={16} className="input-check" />}
            </div>
            {errors.pickupAddress && <span className="error-text">{errors.pickupAddress}</span>}
          </label>

          <label>
            Delivery Address *
            <div className={`inputwrap ${errors.deliveryAddress ? "input-error" : ""}`}>
              <MapPin size={18} />
              <input
                type="text"
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                placeholder="House 45, Main Bazaar, Timergara"
              />
              {form.deliveryAddress && <CheckCircle size={16} className="input-check" />}
            </div>
            {errors.deliveryAddress && <span className="error-text">{errors.deliveryAddress}</span>}
          </label>
        </div>

        {/* Package Details */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">📦</span>
            <div>
              <h2 className="form-section-title">Package Details</h2>
              <p className="form-section-sub">What are you sending?</p>
            </div>
          </div>

          <label>
            Package Description *
            <div className={`inputwrap textarea-wrap ${errors.packageDetails ? "input-error" : ""}`}>
              <Package size={18} />
              <textarea
                name="packageDetails"
                value={form.packageDetails}
                onChange={handleChange}
                placeholder="Small box - Tractor spare parts (Hydraulic Pump)"
                rows={3}
              />
            </div>
            {errors.packageDetails && <span className="error-text">{errors.packageDetails}</span>}
          </label>

          <div className="formrow-2">
            <label>
              Package Weight (kg)
              <div className="inputwrap">
                <Weight size={18} />
                <input
                  type="text"
                  name="packageWeight"
                  value={form.packageWeight}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
              </div>
            </label>

            <label>
              Delivery Time Preference
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

          <label>
            Special Instructions
            <div className="inputwrap textarea-wrap">
              <FileText size={18} />
              <textarea
                name="specialInstructions"
                value={form.specialInstructions}
                onChange={handleChange}
                placeholder="Any special handling or delivery notes..."
                rows={2}
              />
            </div>
          </label>
        </div>

        {/* Delivery Options */}
        <div className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon">⚙️</span>
            <div>
              <h2 className="form-section-title">Delivery Options</h2>
              <p className="form-section-sub">Priority & payment method</p>
            </div>
          </div>

          <div className="formrow-2">
            <label>
              Delivery Priority
              <div className="inputwrap">
                <AlertCircle size={18} />
                <select name="priority" value={form.priority} onChange={handleChange}>
                  {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </label>

            <label>
              Payment Method
              <div className="inputwrap">
                <CreditCard size={18} />
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                  {PAYMENT_OPTIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="authbtn" disabled={loading}>
          <Save size={18} />
          {loading ? "Creating Order..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}