import React from "react";
import { formatCurrency, formatDate } from "../utils/formatters";
import "./SummaryPanel.css";

export default function SummaryPanel({ summary, loading }) {
  if (loading) {
    return (
      <div className="summary-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="summary-card skeleton-card" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const topCategory = Object.entries(summary.byCategory || {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="summary-grid">
      <div className="summary-card card-primary">
        <div className="card-label">Total This Month</div>
        <div className="card-amount">{formatCurrency(summary.totalThisMonth || 0)}</div>
        <div className="card-sub">Across all categories</div>
      </div>

      <div className="summary-card">
        <div className="card-label">Top Category</div>
        <div className="card-amount card-amount-sm">{topCategory ? topCategory[0] : "—"}</div>
        <div className="card-sub">
          {topCategory ? formatCurrency(topCategory[1]) : "No expenses yet"}
        </div>
      </div>

      <div className="summary-card">
        <div className="card-label">Highest Expense</div>
        <div className="card-amount card-amount-sm">
          {summary.highest ? formatCurrency(summary.highest.amount) : "—"}
        </div>
        <div className="card-sub">
          {summary.highest
            ? `${summary.highest.category} · ${formatDate(summary.highest.date)}`
            : "No expenses yet"}
        </div>
      </div>
    </div>
  );
}
