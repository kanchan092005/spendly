import React, { useState } from "react";
import { formatCurrency, formatDate, CATEGORY_COLORS } from "../utils/formatters";
import "./ExpenseTable.css";

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="table-card">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="table-skeleton" />
        ))}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="table-card table-empty">
        <div className="empty-icon">💸</div>
        <p>No expenses found</p>
        <span>Try adjusting your filters or add a new expense</span>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-header-row">
        <span>Date</span>
        <span>Category</span>
        <span>Note</span>
        <span className="align-right">Amount</span>
        <span className="align-right">Actions</span>
      </div>
      <div className="table-body">
        {expenses.map((expense) => (
          <div className="table-row" key={expense.id}>
            <span className="cell-date">{formatDate(expense.date)}</span>
            <span className="cell-category">
              <span
                className="cat-badge"
                style={{
                  background: `${CATEGORY_COLORS[expense.category]}22`,
                  color: CATEGORY_COLORS[expense.category],
                  borderColor: `${CATEGORY_COLORS[expense.category]}44`,
                }}
              >
                {expense.category}
              </span>
            </span>
            <span className="cell-note">{expense.note || <em className="no-note">No note</em>}</span>
            <span className="cell-amount align-right">{formatCurrency(expense.amount)}</span>
            <span className="cell-actions align-right">
              <button className="action-btn edit" onClick={() => onEdit(expense)} title="Edit">✏️</button>
              <button
                className={`action-btn delete ${confirmDelete === expense.id ? "confirm" : ""}`}
                onClick={() => handleDelete(expense.id)}
                title={confirmDelete === expense.id ? "Click again to confirm" : "Delete"}
              >
                {confirmDelete === expense.id ? "Sure?" : "🗑️"}
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className="table-footer">
        <span>{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</span>
        <span className="table-total">
          Total: {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
        </span>
      </div>
    </div>
  );
}
