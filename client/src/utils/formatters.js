export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export const CATEGORY_COLORS = {
  Food: "#6366f1",
  Transport: "#8b5cf6",
  Bills: "#ec4899",
  Entertainment: "#f59e0b",
  Shopping: "#10b981",
  Health: "#ef4444",
  Other: "#64748b",
};
