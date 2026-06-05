import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="navbar">
      <button className="nav-logo" onClick={() => navigate("/dashboard")}>
        <span className="brand-icon">◈</span>
        <span className="brand-name">Spendly</span>
      </button>
      <div className="nav-right">
        <div className="user-pill" onClick={() => setMenuOpen((v) => !v)}>
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <span className="user-name">{user?.name}</span>
          <span className="caret">{menuOpen ? "▲" : "▼"}</span>
        </div>
        {menuOpen && (
          <div className="user-menu">
            <div className="menu-email">{user?.email}</div>
            <button className="menu-item logout" onClick={handleLogout}>Sign out</button>
          </div>
        )}
      </div>
    </nav>
  );
}
