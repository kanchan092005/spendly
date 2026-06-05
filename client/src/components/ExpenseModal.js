import React, { useState, useEffect } from "react";
import { todayStr } from "../utils/formatters";
import "./ExpenseModal.css";

const CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Shopping", "Health", "Other"];

export default function ExpenseModal({ expense, onSave, onClose }) {
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: todayStr(),
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note || "",
      });
    }
  }, [expense]);

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      e.amount = "Enter a positive amount";
    }
    if (!form.category) e.category = "Category is required";
    if (!form.date) e.date = "Date is required";
    if (form.date > todayStr()) e.date = "Date cannot be in the future";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({ ...form, amount: Number(form.amount) });
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || "Failed to save. Try again." });
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{expense ? "Edit Expense" : "Add Expense"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {errors.submit && <div className="modal-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className={`mfield ${errors.amount ? "error" : ""}`}>
            <label>Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={set("amount")}
              autoFocus
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>

          <div className={`mfield ${errors.category ? "error" : ""}`}>
            <label>Category</label>
            <select value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className={`mfield ${errors.date ? "error" : ""}`}>
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              max={todayStr()}
              onChange={set("date")}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>

          <div className="mfield">
            <label>Note <span className="optional">(optional)</span></label>
            <input
              type="text"
              placeholder="What was this for?"
              value={form.note}
              onChange={set("note")}
              maxLength={120}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? <span className="spinner" /> : (expense ? "Save Changes" : "Add Expense")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
