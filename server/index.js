const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "expense-tracker-secret-key-change-in-production";

const users = [];     
const expenses = [];  
const budgets = [];   

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email: email.toLowerCase(), passwordHash, createdAt: new Date().toISOString() };
  users.push(user);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get("/api/auth/me", authenticate, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, name: user.name, email: user.email });
});


const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Shopping", "Health", "Other"];

function validateExpense({ amount, category, date }) {
  if (amount === undefined || amount === null) return "Amount is required";
  if (isNaN(Number(amount)) || Number(amount) <= 0) return "Amount must be a positive number";
  if (!category) return "Category is required";
  if (!VALID_CATEGORIES.includes(category)) return `Category must be one of: ${VALID_CATEGORIES.join(", ")}`;
  if (!date) return "Date is required";
  const expenseDate = new Date(date);
  if (isNaN(expenseDate.getTime())) return "Invalid date";
  if (expenseDate > new Date()) return "Date cannot be in the future";
  return null;
}

app.get("/api/expenses", authenticate, (req, res) => {
  const { category, startDate, endDate } = req.query;
  let result = expenses.filter((e) => e.userId === req.userId);

  if (category && category !== "All") result = result.filter((e) => e.category === category);
  if (startDate) result = result.filter((e) => new Date(e.date) >= new Date(startDate));
  if (endDate) result = result.filter((e) => new Date(e.date) <= new Date(endDate));

  result.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(result);
});

app.post("/api/expenses", authenticate, (req, res) => {
  const { amount, category, date, note } = req.body;
  const error = validateExpense({ amount, category, date });
  if (error) return res.status(400).json({ error });

  const expense = {
    id: uuidv4(),
    userId: req.userId,
    amount: Number(Number(amount).toFixed(2)),
    category,
    date,
    note: note ? note.trim() : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

app.put("/api/expenses/:id", authenticate, (req, res) => {
  const index = expenses.findIndex((e) => e.id === req.params.id && e.userId === req.userId);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });

  const { amount, category, date, note } = req.body;
  const error = validateExpense({ amount, category, date });
  if (error) return res.status(400).json({ error });

  expenses[index] = {
    ...expenses[index],
    amount: Number(Number(amount).toFixed(2)),
    category,
    date,
    note: note ? note.trim() : "",
    updatedAt: new Date().toISOString(),
  };
  res.json(expenses[index]);
});

app.delete("/api/expenses/:id", authenticate, (req, res) => {
  const index = expenses.findIndex((e) => e.id === req.params.id && e.userId === req.userId);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });
  expenses.splice(index, 1);
  res.status(204).send();
});

app.get("/api/expenses/summary", authenticate, (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const userExpenses = expenses.filter((e) => e.userId === req.userId);
  const thisMonth = userExpenses.filter((e) => new Date(e.date) >= new Date(startOfMonth));

  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  VALID_CATEGORIES.forEach((c) => (byCategory[c] = 0));
  thisMonth.forEach((e) => (byCategory[e.category] = (byCategory[e.category] || 0) + e.amount));

  const highest = userExpenses.length
    ? userExpenses.reduce((max, e) => (e.amount > max.amount ? e : max), userExpenses[0])
    : null;

  res.json({ totalThisMonth, byCategory, highest, categories: VALID_CATEGORIES });
});

app.get("/api/budgets", authenticate, (req, res) => {
  res.json(budgets.filter((b) => b.userId === req.userId));
});

app.put("/api/budgets/:category", authenticate, (req, res) => {
  const { category } = req.params;
  const { limit } = req.body;
  if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ error: "Invalid category" });
  if (isNaN(Number(limit)) || Number(limit) < 0) return res.status(400).json({ error: "Limit must be a non-negative number" });

  const index = budgets.findIndex((b) => b.userId === req.userId && b.category === category);
  if (index >= 0) {
    budgets[index].limit = Number(limit);
    return res.json(budgets[index]);
  }
  const budget = { id: uuidv4(), userId: req.userId, category, limit: Number(limit) };
  budgets.push(budget);
  res.status(201).json(budget);
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
