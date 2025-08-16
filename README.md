# Pocket Guru

A minimal expense tracker with JWT auth, filtering, and category-based insights.

- Client: React + Vite + Tailwind + Recharts
- Server: Express + MongoDB + JWT + Zod

Key files
- Server: [server/index.ts](server/index.ts), [server/routes/auth.ts](server/routes/auth.ts), [server/middleware/auth.ts](server/middleware/auth.ts), [server/db.ts](server/db.ts)
- Client: [client/src/App.tsx](client/src/App.tsx), [client/src/components/MainLayout.tsx](client/src/components/MainLayout.tsx), [client/src/pages/Dashboard.tsx](client/src/pages/Dashboard.tsx), [client/src/lib/api.ts](client/src/lib/api.ts)

## Prerequisites

- Node.js 18+ (recommended 20+)
- MongoDB (Atlas or local)

## 1) Backend Setup (server)

1. Open a terminal in `server`
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` (never commit real secrets):
   ```
   MONGO_URI="your-mongodb-connection-string"
   DB_NAME="pocket-guru"
   JWT_SECRET="replace-with-a-long-random-string"
   PORT=5000
   ```
4. Start the API:
   - Dev (nodemon): 
     ```
     npm run dev
     ```
     If nodemon doesn’t pick up TypeScript on your machine, run:
     ```
     npx ts-node index.ts
     ```
   - Prod:
     ```
     npm run build
     npm start
     ```
5. API should be at http://localhost:5000

Endpoints
- POST /api/auth/register — register user
- POST /api/auth/login — login, returns JWT
- CRUD under /expenses — protected with Bearer token (see [server/middleware/auth.ts](server/middleware/auth.ts))

## 2) Frontend Setup (client)

1. Open a new terminal in `client`
2. Install dependencies:
   ```
   npm install
   ```
3. (Optional) Create `client/.env` if your API isn’t on http://localhost:5000:
   ```
   VITE_API_URL="http://localhost:5000"
   ```
   The client uses this in [client/src/lib/api.ts](client/src/lib/api.ts).
4. Start the app:
   ```
   npm run dev
   ```
5. Open the URL shown by Vite (typically http://localhost:5173)

## 3) Demo Data + Demo Login

- The Login page has a “Use Demo Account” button that fills:
  - Email: `jd@ex.com`
  - Password: `123456` (register this first)

Steps to seed demo expenses:
1. Start the backend (server running).
2. Register the demo user at the client Register page with `jd@ex.com` and `123456`.
3. In [server/seed.ts](server/seed.ts), ensure:
   ```
   const TARGET_USER_EMAIL = "jd@ex.com";
   ```
4. Run the seed script (from `server`):
   ```
   npm run seed
   ```
   This adds example expenses for that user only.

## 4) Running Both Together

- Use two terminals:
  - Terminal A in `server`: `npm run dev`
  - Terminal B in `client`: `npm run dev`
- Make sure the server (default 5000) matches `VITE_API_URL` if you changed it.

## 5) Auth Flow

- Login/Register pages live under the global layout ([client/src/components/MainLayout.tsx](client/src/components/MainLayout.tsx)), which shows a context-aware navbar and footer.
- Protected routes are guarded in [client/src/App.tsx](client/src/App.tsx) using `ProtectedRoute` and `PublicRoute`.
- The token is stored in localStorage and attached to requests via [client/src/lib/api.ts](client/src/lib/api.ts).

## 6) Filters and UI

- Dashboard elements:
  - Pie chart of expenses by category: [client/src/components/ExpenseChart.tsx](client/src/components/ExpenseChart.tsx)
  - Filter bar with category + date range: [client/src/pages/Dashboard.tsx](client/src/pages/Dashboard.tsx)
  - Expense list/table with actions: [client/src/components/ExpenseList.tsx](client/src/components/ExpenseList.tsx)
  - Add/Edit modal using `<dialog>` + form: [client/src/pages/Dashboard.tsx](client/src/pages/Dashboard.tsx), [client/src/components/AddExpenseForm.tsx](client/src/components/AddExpenseForm.tsx)

Tips
- If the modal opens top-left, ensure the dialog has `className="m-auto bg-transparent p-0 border-none backdrop:bg-black/60"` and the form has its own padding/border.

## 7) Common Issues

- Mongo connection errors
  - Check `MONGO_URI` and `DB_NAME` in server `.env`.
  - Ensure your IP/network is allowed in Atlas.
- Invalid token / 401 on /expenses
  - Make sure you’re logged in; token is stored in localStorage.
  - Server `JWT_SECRET` must be set (and consistent while tokens are active).
- CORS
  - Server uses `cors()` with default permissive config; if you restrict it, allow the Vite origin.
- Port conflicts
  - Change server `PORT` and set `VITE_API_URL` accordingly.

## 8) Scripts

Server (in `server/package.json`)
- `npm run dev` — dev server (nodemon)
- `npm run build` — compile TS to `dist`
- `npm start` — run compiled server
- `npm run seed` — seed sample expenses for a user

Client (in `client/package.json`)
- `npm run dev` — Vite dev server
- `npm run build` — build client
- `npm run preview` — preview production build

## 9) Project Structure

```
pocket-guru/
├─ server/
│  ├─ index.ts
│  ├─ routes/
│  │  └─ auth.ts
│  ├─ middleware/
│  │  └─ auth.ts
│  ├─ db.ts
│  └─ seed.ts
└─ client/
   ├─ src/
   │  ├─ App.tsx
   │  ├─ context/AuthContext.tsx
   │  ├─ lib/api.ts
   │  ├─ components/
   │  │  ├─ MainLayout.tsx
   │  │  ├─ ExpenseChart.tsx
   │  │  ├─ ExpenseList.tsx
   │  │  ├─ AddExpenseForm.tsx
   │  │  └─ Skeleton.tsx
   │  └─ pages/
   │     ├─ LoginPage.tsx
   │     ├─ RegisterPage.tsx
   │     └─ Dashboard.tsx
   └─ index.html
```

Security notes
- Never commit `.env` with real secrets.
- Rotate `JWT_SECRET` and MongoDB credentials regularly in real deployments.
- VValidate all inputs (see Zod usage in [server/routes/auth.ts](server/routes/auth.ts)).

Happy hacking!