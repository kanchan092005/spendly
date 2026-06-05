# Spendly — Mini Expense Tracker

A full-stack expense tracker built with React + Node.js/Express. Users can sign up, log in, and manage their daily spending across categories with visual charts, budget goals, and CSV export.

---

## Live Demo

> Deploy instructions below — add your URLs here after deployment.

- **Frontend:** `https://spendly.vercel.app` *(replace after deploy)*
- **Backend:** `https://spendly-api.onrender.com` *(replace after deploy)*

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 (CRA) | Stable, zero config, great ecosystem |
| Routing | React Router v6 | Declarative, hooks-based |
| Charts | Recharts | Simple, composable, works great with React |
| HTTP | Axios | Interceptors make JWT auth cleaner |
| Backend | Node.js + Express | Minimal, fast, familiar |
| Auth | JWT + bcryptjs | Stateless, secure password hashing |
| Storage | In-memory arrays | Fast for development; swap for SQLite/Postgres easily |
| Styling | Plain CSS (custom) | Full control, no build complexity |

---

## How to Run Locally

**Requirements:** Node.js 18+ only.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/spendly.git
cd spendly

# 2. Start the backend
cd server
npm install
npm run dev
# Server runs on http://localhost:5000

# 3. In a new terminal, start the frontend
cd ../client
npm install
npm start
# App opens at http://localhost:3000
```

That's it. The React app proxies `/api` requests to `localhost:5000`.

---

## API Documentation

All protected routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/auth/register` | `{name, email, password}` | `{token, user}` |
| POST | `/api/auth/login` | `{email, password}` | `{token, user}` |
| GET | `/api/auth/me` | — | `{id, name, email}` |

### Expenses

| Method | Path | Params / Body | Response |
|---|---|---|---|
| GET | `/api/expenses` | `?category&startDate&endDate` | `Expense[]` |
| POST | `/api/expenses` | `{amount, category, date, note?}` | `Expense` |
| PUT | `/api/expenses/:id` | `{amount, category, date, note?}` | `Expense` |
| DELETE | `/api/expenses/:id` | — | `204` |
| GET | `/api/expenses/summary` | — | `{totalThisMonth, byCategory, highest}` |

### Budgets

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/budgets` | — | `Budget[]` |
| PUT | `/api/budgets/:category` | `{limit}` | `Budget` |

**Expense shape:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "amount": 420.00,
  "category": "Food",
  "date": "2025-06-01",
  "note": "Swiggy dinner",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

Valid categories: `Food`, `Transport`, `Bills`, `Entertainment`, `Shopping`, `Health`, `Other`

---

## Project Structure

```
spendly/
├── server/
│   ├── index.js          # Express app: auth, expenses, budgets routes
│   └── package.json
│
├── client/
│   ├── public/
│   └── src/
│       ├── context/
│       │   └── AuthContext.js    # JWT auth state, login/register/logout
│       ├── hooks/
│       │   └── useExpenses.js    # Data fetching + CRUD hook
│       ├── pages/
│       │   ├── LandingPage.js    # Marketing/hero page
│       │   ├── LoginPage.js      # Sign-in form
│       │   ├── RegisterPage.js   # Sign-up form
│       │   └── Dashboard.js      # Main app view with tabs
│       ├── components/
│       │   ├── Navbar.js         # Top nav with user menu
│       │   ├── SummaryPanel.js   # 3 stat cards
│       │   ├── CategoryChart.js  # Pie + bar chart (Recharts)
│       │   ├── FilterBar.js      # Category + date range filters
│       │   ├── ExpenseTable.js   # Sortable expense list
│       │   ├── ExpenseModal.js   # Add/edit expense form
│       │   └── BudgetPanel.js    # Per-category budget goals
│       ├── utils/
│       │   ├── api.js            # Axios instance with JWT interceptor
│       │   └── formatters.js     # Currency, dates, category colors
│       ├── App.js                # Router + auth guards
│       └── index.js
│
└── README.md
```

---

## What Works

- ✅ User registration and login with JWT
- ✅ Add, edit, delete expenses
- ✅ Filter by category and date range (presets: this month, last month, all time)
- ✅ Summary panel (total this month, top category, highest expense)
- ✅ Pie + bar chart via Recharts
- ✅ Per-category budget goals with progress bars and over-budget alerts
- ✅ CSV export of filtered expenses
- ✅ Form validation (no future dates, positive amounts, required category)
- ✅ Mobile responsive
- ✅ Loading skeletons and error states throughout

## What Doesn't Work / Known Limitations

- ⚠️ **Data is in-memory** — restarting the server clears all data. Swap for SQLite or Postgres for production.
- ⚠️ **No email verification** — users are trusted on registration.
- ⚠️ **No refresh tokens** — JWT expires after 7 days, then user must log in again.
- ⚠️ **Single-user summary** — the summary panel always shows the current month; no year-level view.

## Next Steps (with more time)

1. **Persistent storage** — swap in-memory arrays for SQLite (better-sqlite3) or Postgres with 2 migrations.
2. **Recurring expenses** — flag an expense as recurring and auto-generate it monthly.
3. **Email notifications** — weekly digest of spending via Nodemailer.
4. **Multi-currency support** — let users set a preferred currency in settings.
5. **Dark/light theme toggle** — CSS variables are already set up for it.
6. **Better testing** — add React Testing Library tests for the modal and auth flow.

---

## Deployment Guide

### Backend → Render (free)

1. Push code to GitHub.
2. Go to [render.com](https://render.com) → New → Web Service.
3. Connect your GitHub repo, set **Root Directory** to `server`.
4. Build command: `npm install`  |  Start command: `node index.js`
5. Add environment variable: `JWT_SECRET=your-secret-key-here`
6. Add `CLIENT_URL=https://your-frontend.vercel.app`
7. Deploy. Copy the service URL.

### Frontend → Vercel (free)

1. Go to [vercel.com](https://vercel.com) → New Project → import your repo.
2. Set **Root Directory** to `client`.
3. Add environment variable: `REACT_APP_API_URL=https://your-render-service.onrender.com/api`
4. Deploy. Done.

> Test from an incognito window before submitting!
