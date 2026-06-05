import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { formatCurrency, CATEGORY_COLORS } from "../utils/formatters";
import "./BudgetPanel.css";

const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Shopping", "Health", "Other"];

export default function BudgetPanel({ summary }) {
  const [budgets, setBudgets] = useState({});
  const [editing, setEditing] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/budgets").then((res) => {
      const map = {};
      res.data.forEach((b) => (map[b.category] = b.limit));
      setBudgets(map);
    }).catch(() => {});
  }, []);

  const handleSave = async (category) => {
    if (!inputVal || isNaN(Number(inputVal)) || Number(inputVal) < 0) return;
    setSaving(true);
    try {
      await api.put(`/budgets/${category}`, { limit: Number(inputVal) });
      setBudgets((prev) => ({ ...prev, [category]: Number(inputVal) }));
      setEditing(null);
    } finally { setSaving(false); }
  };

  const spent = summary?.byCategory || {};

  return (
    <div className="budget-panel">
      <div className="budget-header">
        <h2>Monthly Budgets</h2>
        <p>Set limits per category to track your spending goals</p>
      </div>
      <div className="budget-grid">
        {CATEGORIES.map((cat) => {
          const limit = budgets[cat] || 0;
          const spentAmt = spent[cat] || 0;
          const pct = limit > 0 ? Math.min((spentAmt / limit) * 100, 100) : 0;
          const over = limit > 0 && spentAmt > limit;
          const color = CATEGORY_COLORS[cat];

          return (
            <div className="budget-card" key={cat}>
              <div className="budget-cat-row">
                <span className="budget-cat-name" style={{ color }}>{cat}</span>
                {limit > 0 && (
                  <span className={`budget-status ${over ? "over" : pct > 80 ? "warn" : "ok"}`}>
                    {over ? "Over budget!" : pct > 80 ? "Near limit" : "On track"}
                  </span>
                )}
              </div>

              <div className="budget-amounts">
                <span className="budget-spent">{formatCurrency(spentAmt)}</span>
                {limit > 0 && <span className="budget-limit"> / {formatCurrency(limit)}</span>}
              </div>

              {limit > 0 && (
                <div className="budget-bar-track">
                  <div
                    className="budget-bar-fill"
                    style={{ width: `${pct}%`, background: over ? "#ef4444" : color }}
                  />
                </div>
              )}

              {editing === cat ? (
                <div className="budget-edit-row">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="Monthly limit"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave(cat)}
                  />
                  <button className="budget-save-btn" onClick={() => handleSave(cat)} disabled={saving}>
                    {saving ? "…" : "Save"}
                  </button>
                  <button className="budget-cancel-btn" onClick={() => setEditing(null)}>✕</button>
                </div>
              ) : (
                <button
                  className="budget-set-btn"
                  onClick={() => { setEditing(cat); setInputVal(limit > 0 ? String(limit) : ""); }}
                >
                  {limit > 0 ? "Edit budget" : "Set budget"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
