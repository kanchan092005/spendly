import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.category && filters.category !== "All") params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const [expRes, sumRes] = await Promise.all([
        api.get("/expenses", { params }),
        api.get("/expenses/summary"),
      ]);
      setExpenses(expRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.startDate, filters.endDate]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addExpense = async (data) => {
    const res = await api.post("/expenses", data);
    await fetchExpenses();
    return res.data;
  };

  const updateExpense = async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data);
    await fetchExpenses();
    return res.data;
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    await fetchExpenses();
  };

  return { expenses, summary, loading, error, addExpense, updateExpense, deleteExpense, refetch: fetchExpenses };
}
