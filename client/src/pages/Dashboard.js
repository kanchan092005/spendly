import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../hooks/useExpenses";
import { getMonthRange } from "../utils/formatters";
import Navbar from "../components/Navbar";
import SummaryPanel from "../components/SummaryPanel";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseModal from "../components/ExpenseModal";
import FilterBar from "../components/FilterBar";
import CategoryChart from "../components/CategoryChart";
import BudgetPanel from "../components/BudgetPanel";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate } = getMonthRange(0);
    return { category: "All", startDate, endDate };
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { expenses, summary, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses(filters);

  const handleEdit = (expense) => { setEditingExpense(expense); setModalOpen(true); };
  const handleAdd = () => { setEditingExpense(null); setModalOpen(true); };
  const handleModalClose = () => { setModalOpen(false); setEditingExpense(null); };

  const handleSave = async (data) => {
    if (editingExpense) await updateExpense(editingExpense.id, data);
    else await addExpense(data);
    handleModalClose();
  };

  const handleExportCSV = () => {
    if (!expenses.length) return;
    const headers = ["Date", "Category", "Amount", "Note"];
    const rows = expenses.map((e) => [e.date, e.category, e.amount, `"${e.note || ""}"`]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${filters.startDate}-${filters.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1>Good {getGreeting()}, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋</h1>
            <p className="dash-sub">Here's your spending overview</p>
          </div>
          <div className="header-actions">
            <button className="btn-export" onClick={handleExportCSV} title="Export CSV">
              ↓ Export CSV
            </button>
            <button className="btn-add" onClick={handleAdd}>
              + Add Expense
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["overview", "expenses", "budgets"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="dash-error">{error}</div>}

        {activeTab === "overview" && (
          <>
            <SummaryPanel summary={summary} loading={loading} />
            <div className="dash-two-col">
              <CategoryChart summary={summary} loading={loading} />
              <div className="quick-add-card">
                <h3>Quick Add</h3>
                <button className="btn-add full-width" onClick={handleAdd}>+ New Expense</button>
                <div className="recent-header">Recent</div>
                <div className="recent-list">
                  {loading ? (
                    <div className="skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-row" />)}</div>
                  ) : expenses.slice(0, 5).map((e) => (
                    <div className="recent-item" key={e.id}>
                      <div className="recent-cat">{e.category}</div>
                      <div className="recent-note">{e.note || "—"}</div>
                      <div className="recent-amt">₹{e.amount.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "expenses" && (
          <>
            <FilterBar filters={filters} onChange={setFilters} />
            <ExpenseTable
              expenses={expenses}
              loading={loading}
              onEdit={handleEdit}
              onDelete={deleteExpense}
            />
          </>
        )}

        {activeTab === "budgets" && <BudgetPanel summary={summary} />}
      </div>

      {modalOpen && (
        <ExpenseModal
          expense={editingExpense}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
