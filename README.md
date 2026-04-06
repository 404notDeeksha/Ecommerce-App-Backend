# 🛍️ E-commerce Backend API

> RESTful API powering an Amazon-inspired e-commerce platform — built with production patterns in mind.

[![MIT](https://img.shields.io/github/license/404notDeeksha/Ecommerce-App-Backend?style=flat-square)](https://github.com/404notDeeksha/Ecommerce-App-Backend/blob/main/License) · [![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org) · [![Express](https://img.shields.io/badge/Express.js-Backend-black)](https://expressjs.com) · [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas) · [![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)](https://vercel.com)

**[🌐 Live Demo](https://ecommerce-app-techwithdeekksha.vercel.app)** · **[Frontend Repo](https://github.com/404notDeeksha/Ecommerce-App)**

---

## 🎯 Key Highlights

- **JWT Ready** — Token generation, verification & rotation implemented; middleware wired on frontend
- **Layered Architecture** — Clean separation: Routes → Validation → Controllers → Services → Models
- **MongoDB Indexing** — Text search + compound indexes for fast product filtering
- **Zod Validation** — Schema-based request validation with type coercion
- **Serverless-Ready** — Vercel-compatible Express setup with preview deployment support
- **Security Foundations** — Helmet headers, CORS, bcrypt password hashing, rate limiting

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (token gen/verify, rotation) |
| Validation | Zod |
| Security | Helmet, CORS, bcryptjs |
| Rate Limiting | express-rate-limit |
| Logging | Morgan |
| Deployment | Vercel (serverless) |

---

## 📡 API Surface

| Route | Methods |
|-------|---------|
| `/api/user` | POST signup, login, logout, email check |
| `/api/products` | GET list (10+ filters), get by ID |
| `/api/cart` | POST, GET, PUT, DELETE |
| `/api/auth` | POST refresh-token |
| `/api/carousel` | GET featured |

---

## 🧠 Engineering Highlights

- **Token Rotation** — Refresh tokens stored in DB with expiry; old tokens invalidated on use
- **Auto-Priced Carts** — `pre("save")` middleware keeps totals consistent without manual updates
- **Fail-Fast Config** — Missing env vars crash at startup, not at runtime
- **Password Safety** — `select: false` by default; explicit fetch only where needed

---

## 📊 Performance & Query Optimization

- Text search index across product name, description, brand, category
- Compound indexes on (category, subCategory, price, rating) for filtered queries
- Pagination with configurable limits (max 100 per page)
- Query builder pattern for dynamic filter construction

---

<hr>

<details>
<summary><strong>🔍 Expand: Detailed Engineering Decisions</strong></summary>

### 1. JWT Token Generation & Verification

Dual-token system generates both access and refresh tokens on signup/login:

```javascript
// Access token (15 min) — used in Authorization header
// Refresh token (7 days) — stored in DB with expiry timestamp
```

Token rotation invalidates old refresh tokens on each refresh call.

---

### 2. Refresh Token Storage with Expiry Tracking

```javascript
refreshTokens: [{ token: String, expiresAt: Date }]
```

Tokens validated against both existence and expiry before issuing new access token.

---

### 3. Cart Total Auto-Calculation

Mongoose `pre("save")` hook ensures totals stay consistent:

```javascript
cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.price, 0
  );
  next();
});
```

---

### 4. Query Param Type Coercion

Query strings arrive as strings. Zod transformers handle conversion:

```javascript
minPrice: z.string()
  .or(z.number())
  .transform((val) => (val === "" ? undefined : Number(val)))
```

---

### 5. Vercel Serverless Compatibility

```javascript
// main.js — HTTP server only in dev
if (process.env.NODE_ENV !== "production") {
  app.listen(port, ...);
}

// server.js — exports for Vercel Lambda
module.exports = app;
```

---

### 6. Password Exclusion by Default

```javascript
password: { type: String, select: false }
// Explicitly fetch when needed:
User.findOne({ email }).select("+password")
```

</details>

---

<hr>

<details>
<summary><strong>⚠️ Expand: Challenges & Solutions</strong></summary>

### Async Errors Without Try-Catch

**Problem:** Unhandled promise rejections crash the server.

**Solution:** Lightweight wrapper:

```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

---

### Cart Quantity Without Full Fetch

**Problem:** UI needs item count; fetching entire cart is expensive.

**Solution:** Dedicated endpoint with aggregation:

```javascript
calculateCartQuantity = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
};
```

---

### Dynamic Product Filter Queries

**Problem:** Multiple optional filters (category, price, brand, etc.) with AND logic.

**Solution:** Query builder in service layer:

```javascript
if (filters.search) query.$text = { $search: filters.search };
if (filters.category) query.category = filters.category;
if (filters.brand) query.brand = { $in: filters.brand.split(",") };
```

---

### CORS for Vercel Preview URLs

**Problem:** CORS blocks Vercel's random preview URLs during dev.

**Solution:** Regex allowlist for preview deployments:

```javascript
const isVercelPreview = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin || "");
```

</details>

---

<hr>

<details>
<summary><strong>📁 Expand: Project Structure</strong></summary>

```
├── config/                       Configuration layer
│   ├── dbConnection.js           MongoDB connection
│   ├── envValidator.js           Env validation (fail-fast)
│   ├── jwt.js                    JWT secrets & expiry
│   └── rateLimit.js             Rate limiter configs
│
├── controllers/                  Request handlers
│   ├── User.controller.js
│   ├── Products.controller.js
│   ├── Cart.controller.js
│   └── Carousel.controller.js
│
├── services/                    Business logic
│   ├── auth.service.js          Token generation & verification
│   ├── user.service.js          User operations
│   ├── products.service.js      Product queries
│   └── cart.service.js          Cart management
│
├── routes/                      API definitions
├── validations/                 Zod schemas
├── middlewares/                  Express middleware
│   ├── auth.middleware.js       JWT verification (ready to apply)
│   ├── admin.middleware.js      Role check (ready to apply)
│   ├── errorHandler.js          Centralized errors
│   ├── validateRequest.js        Zod validation
│   └── requestLogger.js         Morgan logging
│
├── models/                      Mongoose schemas
│   ├── User.model.js            (with refresh tokens)
│   ├── Products.model.js         (with indexes)
│   ├── Cart.model.js            (with auto-pricing)
│   └── Carousel.model.js
│
├── utils/
│   └── asyncHandler.js          Async wrapper
│
├── data/                        Seed data (JSON)
├── server.js                    Express setup
└── main.js                      Entry point
```

</details>

---

<hr>

<details>
<summary><strong>🚀 Expand: Setup & Environment</strong></summary>

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)

### Quick Start

```bash
git clone git@github.com:404notDeeksha/Ecommerce-App-Backend.git
cd Ecommerce-App-Backend
npm install
cp .env.example .env
# Edit .env with MONGODB_URL and JWT secrets
npm run dev
```

### Environment Variables

```bash
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce
DEP_FRONTEND_URL=https://your-frontend.vercel.app
DEV_FRONTEND_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=<32+ char random string>
REFRESH_TOKEN_SECRET=<32+ char random string>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "pagination": { "total": 100, "page": 1, "totalPages": 5 }
}
```

**Auth (signup/login):**
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "role": "user" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "code": "TOKEN_EXPIRED"
}
```

</details>

---

## 📈 Roadmap

- [x] JWT token generation & verification
- [x] Refresh token rotation with expiry tracking
- [x] MongoDB indexing for product search
- [x] Global rate limiting on API
- [ ] Connect auth middleware to protected routes
- [ ] Order management system
- [ ] Payment integration (Stripe)
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] API caching (Redis)

---

## 📄 License

MIT — [LICENSE](https://github.com/404notDeeksha/Ecommerce-App-Backend/blob/main/License)
