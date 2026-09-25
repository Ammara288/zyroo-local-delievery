import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, Building, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    company: "",
    vehicle: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      role,
      avatar: form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    };

    if (role === "business") {
      userData.company = form.company;
    } else if (role === "rider") {
      userData.vehicle = form.vehicle;
      userData.rating = 5.0;
      userData.totalDeliveries = 0;
    }

    const result = register(userData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const roleInfo = {
    business: { icon: "🏢", label: "Business", desc: "Manage & send orders" },
    rider: { icon: "🏍️", label: "Rider", desc: "Deliver packages" },
    customer: { icon: "👤", label: "Customer", desc: "Track your orders" },
  };

  return (
    <div className="authpage">
      <div className="authcard authcard-wide">
        <div className="authhead">
          <h1>Create Account</h1>
          <p>Join Zyroo and start your journey</p>
        </div>

        {error && (
          <div className="autherror">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="roleselect">
          <p className="roleselect-label">I want to join as:</p>
          <div className="roleoptions">
            {Object.entries(roleInfo).map(([key, info]) => (
              <button
                key={key}
                type="button"
                className={`roleopt ${role === key ? "active" : ""}`}
                onClick={() => setRole(key)}
              >
                <span className="roleicon">{info.icon}</span>
                <b>{info.label}</b>
                <small>{info.desc}</small>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="authform">
          {/* Name */}
          <label>
            Full Name *
            <div className="inputwrap">
              <User size={18} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ali Khan"
              />
            </div>
          </label>

          {/* Email */}
          <label>
            Email Address *
            <div className="inputwrap">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </label>

          {/* Phone */}
          <label>
            Phone Number
            <div className="inputwrap">
              <Phone size={18} />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
              />
            </div>
          </label>

          {/* Business-specific: Company */}
          {role === "business" && (
            <label>
              Company Name
              <div className="inputwrap">
                <Building size={18} />
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                />
              </div>
            </label>
          )}

          {/* Rider-specific: Vehicle */}
          {role === "rider" && (
            <label>
              Vehicle Type
              <div className="inputwrap">
                <MapPin size={18} />
                <input
                  type="text"
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  placeholder="Motorcycle / Van / Truck"
                />
              </div>
            </label>
          )}

          {/* Address */}
          <label>
            Address
            <div className="inputwrap">
              <MapPin size={18} />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Your city, area"
              />
            </div>
          </label>

          {/* Password */}
          <div className="formrow">
            <label>
              Password *
              <div className="inputwrap">
                <Lock size={18} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                />
              </div>
            </label>

            <label>
              Confirm Password *
              <div className="inputwrap">
                <Lock size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                />
              </div>
            </label>
          </div>

          <button type="submit" className="authbtn" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="authswitch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}