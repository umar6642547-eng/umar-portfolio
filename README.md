# Muhammad Umar Farooq: MERN Portfolio

Upgraded from a single HTML file to a MERN-style app:

| Layer | Tech | What it does |
|---|---|---|
| **M**ongoDB | Mongoose (`server/models/Message.js`) | Stores contact-form messages |
| **E**xpress | `server/app.js` | `/api/portfolio`, `/api/contact`, `/api/health` |
| **R**eact | Vite + React 18 (`client/`) | Tabbed samples, contact form, same design as the original |
| **N**ode | v22 | Runtime. Also deployed as a Vercel serverless function (`api/index.js`) |

Invoice, quotation, payroll and P&L figures are **calculated** by `server/lib/finance.js`
(integer thousandths of a dinar, so no floating-point errors) instead of being typed in by hand.

## Run locally
```bash
npm install
npm --prefix client install
cp .env.example .env        # add MONGODB_URI (optional; only needed for the contact form)
npm run dev:server          # terminal 1 -> http://localhost:5000
npm run dev:client          # terminal 2 -> http://localhost:5173
```

## Test
```bash
npm test      # node:test: finance, validation, data regression, client/server parity, API
```

## Deploy to Vercel
1. Create a free MongoDB Atlas cluster -> *Database Access* (user) -> *Network Access* (allow `0.0.0.0/0`) -> copy the connection string.
2. Push this folder to a GitHub repo.
3. vercel.com -> **Add New -> Project** -> import the repo. Leave the settings alone (`vercel.json` configures them).
4. **Environment Variables:** add `MONGODB_URI` = your Atlas string.
5. Deploy. Check `https://<your-app>.vercel.app/api/health` returns `{"ok":true,"db":true}`.

CLI alternative: `npm i -g vercel && vercel --prod`.

Without `MONGODB_URI` the site still works fully; the contact form just reports that messages are not enabled.
