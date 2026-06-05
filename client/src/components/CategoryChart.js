import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { formatCurrency, CATEGORY_COLORS } from "../utils/formatters";
import "./CategoryChart.css";

export default function CategoryChart({ summary, loading }) {
  const [view, setView] = React.useState("pie");

  if (loading) return <div className="chart-card skeleton-chart" />;
  if (!summary) return null;

  const data = Object.entries(summary.byCategory || {})
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (!data.length) {
    return (
      <div className="chart-card chart-empty">
        <div className="empty-icon">📊</div>
        <p>No expenses this month yet</p>
        <span>Add expenses to see your breakdown</span>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Spending by Category</h3>
        <div className="chart-toggle">
          <button className={view === "pie" ? "active" : ""} onClick={() => setView("pie")}>Pie</button>
          <button className={view === "bar" ? "active" : ""} onClick={() => setView("bar")}>Bar</button>
        </div>
      </div>

      {view === "pie" ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#64748b"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{ background: "#1c1c28", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0ff" }}
            />
            <Legend
              formatter={(value) => <span style={{ color: "#8888aa", fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(v) => formatCurrency(v)}
              contentStyle={{ background: "#1c1c28", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0ff" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#64748b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
