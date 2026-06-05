import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const features = [
  { icon: "⚡", title: "Instant Tracking", desc: "Log expenses in seconds. Built for speed." },
  { icon: "📊", title: "Visual Insights", desc: "Charts and summaries that reveal your spending." },
  { icon: "🎯", title: "Budget Goals", desc: "Set category budgets and get alerts when you're close." },
  { icon: "📁", title: "CSV Export", desc: "Download your data anytime, no lock-in." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">Spendly</span>
        </div>
        <div className="nav-actions">
          {user ? (
            <button className="btn-primary" onClick={() => navigate("/dashboard")}>
              Dashboard →
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Get started →
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="grid-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Personal Finance, Simplified
          </div>
          <h1 className="hero-title">
            Take control of<br />
            <span className="gradient-text">your spending</span>
          </h1>
          <p className="hero-subtitle">
            Track expenses, visualize patterns, and hit your savings goals — all in one clean dashboard.
          </p>
          <div className="hero-cta">
            <button className="cta-primary" onClick={() => navigate(user ? "/dashboard" : "/register")}>
              {user ? "Go to dashboard" : "Start for free"}
              <span className="cta-arrow">→</span>
            </button>
            <button className="cta-ghost" onClick={() => navigate("/login")}>
              See a demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">₹0</span>
              <span className="stat-label">Cost to start</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">5s</span>
              <span className="stat-label">To log an expense</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">7</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
        {/* Dashboard Preview Card */}
        <div className="hero-visual">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dots">
                <span /><span /><span />
              </div>
              <span className="preview-title">This Month</span>
            </div>
            <div className="preview-amount">₹24,580</div>
            <div className="preview-bars">
              {[
                { label: "Food", w: "75%", color: "#6366f1" },
                { label: "Transport", w: "45%", color: "#8b5cf6" },
                { label: "Bills", w: "90%", color: "#ec4899" },
                { label: "Entertainment", w: "30%", color: "#f59e0b" },
              ].map((b) => (
                <div className="bar-row" key={b.label}>
                  <span className="bar-label">{b.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: b.w, background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="preview-transactions">
              {[
                { cat: "🍕", name: "Swiggy", amt: "-₹420", color: "#6366f1" },
                { cat: "🚇", name: "Metro Card", amt: "-₹200", color: "#8b5cf6" },
                { cat: "💡", name: "Electricity", amt: "-₹1,840", color: "#ec4899" },
              ].map((t) => (
                <div className="txn-row" key={t.name}>
                  <span className="txn-icon">{t.cat}</span>
                  <span className="txn-name">{t.name}</span>
                  <span className="txn-amt" style={{ color: t.color }}>{t.amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-sub">No fluff. Just the tools to understand where your money goes.</p>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="blob blob-cta-1" />
          <div className="blob blob-cta-2" />
        </div>
        <h2>Ready to take control?</h2>
        <p>Join thousands tracking smarter. It's free.</p>
        <button className="cta-primary" onClick={() => navigate("/register")}>
          Create your account →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="brand-name">◈ Spendly</span>
        <span>Built with React & Node.js</span>
      </footer>
    </div>
  );
}
