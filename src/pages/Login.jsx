import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = login(form.email, form.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setForm({ email, password });
    const result = login(email, password);
    if (result.success) navigate("/dashboard");
  };

  return (
    <div className="authpage">
      <div className="authcard">
        <div className="authhead">
          <h1>Welcome Back</h1>
          <p>Sign in to manage your deliveries</p>
        </div>

        {error && (
          <div className="autherror">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="authform">
          <label>
            Email Address
            <div className="inputwrap">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            Password
            <div className="inputwrap">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </label>

          <button
            type="submit"
            className="authbtn"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="authswitch">
          Don't have an account? <Link to="/register">Create one now</Link>
        </p>

        {/* Demo Accounts */}
        <div className="authdemo">
          <p className="demotitle">🎯 Try Demo Accounts</p>
          <div className="demobtns">
            <button
              type="button"
              onClick={() => quickLogin("business@zyroo.com", "business123")}
              className="demobtn business"
            >
              <span>🏢</span> Business
            </button>
            <button
              type="button"
              onClick={() => quickLogin("rider@zyroo.com", "rider123")}
              className="demobtn rider"
            >
              <span>🏍️</span> Rider
            </button>
            <button
              type="button"
              onClick={() => quickLogin("customer@zyroo.com", "customer123")}
              className="demobtn customer"
            >
              <span>👤</span> Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}