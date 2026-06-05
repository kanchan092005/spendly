import React from "react";
import { getMonthRange, todayStr } from "../utils/formatters";
import "./FilterBar.css";

const CATEGORIES = ["All", "Food", "Transport", "Bills", "Entertainment", "Shopping", "Health", "Other"];

export default function FilterBar({ filters, onChange }) {
  const setPreset = (preset) => {
    if (preset === "this-month") {
      onChange({ ...filters, ...getMonthRange(0) });
    } else if (preset === "last-month") {
      onChange({ ...filters, ...getMonthRange(-1) });
    } else if (preset === "all") {
      onChange({ ...filters, startDate: "2000-01-01", endDate: todayStr() });
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>From</label>
        <input
          type="date"
          value={filters.startDate}
          max={filters.endDate}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>To</label>
        <input
          type="date"
          value={filters.endDate}
          min={filters.startDate}
          max={todayStr()}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
        />
      </div>

      <div className="filter-presets">
        <button onClick={() => setPreset("this-month")}>This Month</button>
        <button onClick={() => setPreset("last-month")}>Last Month</button>
        <button onClick={() => setPreset("all")}>All Time</button>
      </div>
    </div>
  );
}
