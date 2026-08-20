# Artisan Finder

A platform for customers to discover artisans, view their profiles/portfolios, and book
their services **without creating an account**. Only artisans have accounts.

```
artisan-finder/
├── backend/     Node.js + Express + MongoDB (Mongoose) API
└── frontend/    React + Vite + Tailwind CSS
```

---

## 1. Local setup

### Prerequisites
- Node.js 18+
- A MongoDB database — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Cloudinary](https://cloudinary.com) account (for profile pictures & portfolio images — see §4)

### Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI, JWT_SECRET, and the CLOUDINARY_* keys
npm install
npm run dev                # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173`. Customers can browse and book immediately with no login.
Go to `/signup` to create an artisan account and see the dashboard.

---

## 2. How the key business rules are implemented

- **Customers never authenticate.** `/artisans`, `/artisan/:id`, `/book/:id`, `/success` hit
  public, unauthenticated backend routes (`GET /api/artisans*`, `POST /api/bookings/artisan/:id`,
  `GET /api/bookings/:id`).
- **Only artisans have accounts.** JWT is issued at signup/login and stored in
  `localStorage` on the frontend; `middleware/auth.js` (`protect`) guards every
  artisan-only route (profile edit, portfolio management, viewing/updating bookings).
- **`confirmPassword` is validated, never stored.** `middleware/validators.js` checks
  it matches `password` via `express-validator`'s `.custom()`. The `Artisan` model has no
  `confirmPassword` field at all — the controller only ever passes `password` into
  `Artisan.create()`, and a Mongoose pre-save hook hashes it with bcrypt before it touches
  the database.
- **Password rules**: minimum 8 characters + at least one special character, enforced on
  both the client (live checklist on the signup form) and the server (source of truth).
- **`profilePicture` and `portfolioImages[]`** are uploaded straight to **Cloudinary**
  via `multer-storage-cloudinary` (`middleware/upload.js`) — no local disk writes, so
  images survive redeploys on hosts with ephemeral filesystems (Render, Railway, etc).
  The API stores the Cloudinary `secure_url` on the model and returns it as-is; the
  frontend's `fileUrl()` helper passes absolute URLs through unchanged.

---

## 3. Security measures already in place

| Concern | What's implemented | Where |
|---|---|---|
| Password storage | bcrypt hashing, `confirmPassword` never persisted | `models/Artisan.js`, `middleware/validators.js` |
| Session/auth | JWT, verified on every protected route | `middleware/auth.js` |
| HTTP headers | `helmet()` — sets sane security headers by default | `server.js` |
| NoSQL injection | `express-mongo-sanitize` strips `$`/`.` keys from `req.body`/`query`/`params` | `server.js` |
| Brute-force login/signup | Rate limit: 10 attempts / 15 min per IP | `middleware/rateLimiters.js` → `authRoutes.js` |
| Booking spam | Rate limit: 20 bookings / hour per IP on the public booking endpoint | `middleware/rateLimiters.js` → `bookingRoutes.js` |
| General abuse backstop | Rate limit: 300 requests / 15 min per IP across all of `/api` | `middleware/rateLimiters.js` → `server.js` |
| CORS | Locked to `CLIENT_URL`, not `*` | `server.js` |
| File uploads | Type-restricted (images only), size-capped, stored off-server on Cloudinary | `middleware/upload.js` |
| Input validation | Every write endpoint validated server-side with `express-validator` | `middleware/validators.js` |
| HTTPS | Provided automatically by Render + Vercel/Netlify once deployed | — |

None of this is exotic — it's the standard baseline you'd want before letting the
public hit a form. If you later add things like password-reset flows or file downloads,
revisit rate limits and validation for those new routes too.

---

## 4. Cloudinary setup (required — profile & portfolio images)

Cloudinary's free tier (25 GB storage + bandwidth/month) is plenty for getting started,
and — unlike writing to local disk — the images won't disappear when your host
redeploys.

### Step A — Create an account and get your keys

1. Go to https://cloudinary.com/users/register/free and sign up (no card required).
2. Once logged in, your **Dashboard** (the default landing page) shows a "Product
   Environment Credentials" panel with three values you need:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click "reveal" to see it)

### Step B — Add them to your backend `.env`

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

That's it locally — `npm run dev` will pick these up automatically. Sign up as an
artisan, upload a profile picture, and check your Cloudinary **Media Library**
(dashboard → Media Library → the `artisan-finder/profiles` folder) — you should see
it appear there instantly.

### Step C — How it works in the code (nothing further to build)

- `config/cloudinary.js` configures the Cloudinary SDK from those three env vars.
- `middleware/upload.js` uses `multer-storage-cloudinary` so uploaded files go
  directly to Cloudinary instead of a local folder — profile pictures land in
  `artisan-finder/profiles/`, portfolio shots in `artisan-finder/portfolio/`, each
  auto-resized to a 1600px max and served at Cloudinary's optimized `quality: auto`.
- When an artisan replaces their profile picture or deletes a portfolio image, the
  old Cloudinary asset is deleted too (`cloudinary.uploader.destroy`), so you don't
  accumulate orphaned files — see `destroyCloudinaryAsset()` in
  `controllers/artisanController.js`.

### Step D — Add the same three variables on Render

When you deploy the backend (Step 3 below), add `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to Render's environment variables
exactly as you did locally. That's the only extra step — the code doesn't change
between environments.

---

## 5. Hosting guide

The simplest, cheapest, production-friendly combination:

| Piece | Where | Why |
|---|---|---|
| Database | **MongoDB Atlas** (free M0 tier) | Managed, works from any host |
| Backend API | **Render** (or Railway) | Free/cheap Node hosting, easy env vars |
| Frontend | **Vercel** (or Netlify) | Best-in-class static/Vite hosting, free tier |

### Step 1 — Create your MongoDB Atlas database

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster**.
3. Under **Database Access**, add a database user with a username/password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) —
   simplest for getting started; you can restrict it later to your host's IP ranges.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add your database name before the `?`, e.g. `.../artisan-finder?retryWrites=true...`.
   This is your `MONGO_URI`.

### Step 2 — Push your code to GitHub

```bash
cd artisan-finder
git init
git add .
git commit -m "Initial commit: Artisan Finder"
gh repo create artisan-finder --private --source=. --push
# or create a repo on github.com and:
# git remote add origin <your-repo-url>
# git push -u origin main
```

### Step 3 — Deploy the backend on Render

1. Go to https://render.com and sign up / log in with GitHub.
2. Click **New → Web Service**, select your repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or the smallest paid tier for no cold-starts)
4. Under **Environment**, add these variables (values from your `.env`):
   - `MONGO_URI`
   - `JWT_SECRET` (generate a long random string, e.g. `openssl rand -hex 32`)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = your frontend URL — you'll get this in Step 4, come back and set it
     (you can deploy once now with a placeholder and update it after, Render redeploys
     automatically on env var changes)
   - `MAX_UPLOAD_SIZE` = `5242880`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from §4
5. Click **Create Web Service**. Render will build and deploy; you'll get a URL like
   `https://artisan-finder-api.onrender.com`.
6. Confirm it's alive: visit `https://artisan-finder-api.onrender.com/api/health`.

*(Railway works almost identically: New Project → Deploy from GitHub repo → set Root
Directory to `backend` → add the same environment variables → Railway auto-detects
`npm start`.)*

### Step 4 — Deploy the frontend on Vercel

1. Go to https://vercel.com and sign up / log in with GitHub.
2. Click **Add New → Project**, select your repo.
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = your Render backend URL from Step 3 (e.g.
     `https://artisan-finder-api.onrender.com`) — **no trailing slash**
5. Click **Deploy**. You'll get a URL like `https://artisan-finder.vercel.app`.
   The included `vercel.json` handles client-side routing so refreshing on
   `/artisan/:id` or `/dashboard` doesn't 404.
6. Go back to Render and set `CLIENT_URL` to this Vercel URL, so CORS allows it.

*(Netlify equivalent: New site from Git → Base directory `frontend` → Build command
`npm run build` → Publish directory `frontend/dist` → add `VITE_API_URL` under Site
settings → Environment variables → add a `_redirects` file with `/* /index.html 200`
for SPA routing, or a `netlify.toml` with an equivalent redirect rule.)*

### Step 5 — Verify end-to-end

1. Visit your Vercel URL, confirm the homepage loads and artisans list (empty at first).
2. Go to `/signup`, create an artisan account, add a profile picture and portfolio images,
   and confirm they show up.
3. Open the artisan's public profile in an incognito window and submit a test booking —
   confirm no login is required and the success page shows booking details.
4. Log back in as the artisan and confirm the booking appears under **Bookings**.

### Ongoing

- Both Render's and Vercel's free tiers redeploy automatically on every push to your
  main branch.
- Rotate `JWT_SECRET` and re-deploy if you ever suspect it's leaked — this invalidates
  all existing artisan sessions.
- Keep an eye on Cloudinary's free-tier usage in their dashboard as your artisan base
  grows; upgrading tiers is a billing change only, no code changes needed.
- If you ever see 429 responses during real usage, the rate limits in
  `middleware/rateLimiters.js` are deliberately conservative defaults — tune the
  `max` values there to fit your actual traffic.
