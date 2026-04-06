# 🛍️ E-commerce Backend API

> Production-ready RESTful API powering an Amazon-inspired e-commerce platform

[![MIT License](https://img.shields.io/github/license/404notDeeksha/Ecommerce-App-Backend?style=flat-square)](https://github.com/404notDeeksha/Ecommerce-App-Backend/blob/main/License) · [![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org) · [![Express](https://img.shields.io/badge/Express.js-Backend-black)](https://expressjs.com) · [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas) · [![Zod](https://img.shields.io/badge/Validation-Zod-blue)](https://zod.dev) · [![JWT](https://img.shields.io/badge/Auth-JWT-orange)](https://jwt.io) · [![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)](https://vercel.com)

**[🌐 Live Demo](https://ecommerce-app-techwithdeekksha.vercel.app)** · **[Frontend Repo](https://github.com/404notDeeksha/Ecommerce-App)**

---

## 📖 Table of Contents

- [⚙️ Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📡 API Endpoints](#-api-endpoints)
- [✨ Features](#-features)
- [🔐 Security](#-security)
- [🛠️ Engineering Decisions](#️-engineering-decisions)
- [⚠️ Challenges & Solutions](#️-challenges--solutions)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🌍 Environment Variables](#-environment-variables)
- [📋 API Response Format](#-api-response-format)
- [📈 Roadmap](#-roadmap)
- [📄 License](#-license)

---

## ⚙️ Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Authentication** | JWT (access + refresh tokens) |
| **Validation** | Zod |
| **Security** | Helmet, CORS, bcryptjs |
| **Rate Limiting** | express-rate-limit |
| **Logging** | Morgan |
| **Utilities** | Cookie Parser, UUID |
| **Hosting** | Vercel (serverless) |
| **Linting** | ESLint |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Request                               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Helmet (Security Headers)  →  CORS (Origin Control)                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Rate Limiter → Morgan Logger → JWT Auth → Zod Validation            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Controllers → Services → Mongoose Models → MongoDB                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Centralized Error Handler (Consistent JSON Responses)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints

### Authentication `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/refresh-token` | Refresh access token |

### User Management `/api/user`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/signup` | Register new user |
| POST | `/user/emailAuth` | Check email existence |
| POST | `/user/passwordAuth` | Login with credentials |
| POST | `/user/logout` | Logout & clear session |

### Products `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (with filters) |
| GET | `/products/product/:id` | Get single product |

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max: 100) |
| `sortBy` | string | rating | Sort: `price`, `name`, `rating` |
| `sortOrder` | string | desc | `asc` or `desc` |
| `search` | string | - | Full-text search |
| `category` | string | - | Filter by category |
| `subCategory` | string | - | Filter by subcategory |
| `minPrice` | number | - | Minimum price |
| `maxPrice` | number | - | Maximum price |
| `brand` | string | - | Filter by brand (comma-separated) |
| `discount` | number | - | Maximum discount % |

### Cart `/api/cart`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cart` | Add items to cart |
| GET | `/cart/:userId` | Get user's cart |
| GET | `/cart/quantity/:userId` | Get item count |
| PUT | `/cart/:userId/:productId/:quantity` | Update quantity |
| DELETE | `/cart/:userId/:productId` | Remove item |

### Carousel `/api/carousel`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/carousel/featured` | Get featured banners |

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Access Tokens** (15-min expiry) for API authorization
- **Refresh Token Rotation** (7-day expiry) with expiry tracking
- **Secure Password Hashing** via bcryptjs (10 salt rounds)
- **Role-Based Access Control** (`user`, `admin`)
- **Token Expiration Handling** with specific error codes

### 🛒 Cart Management
- Add multiple products in one request
- Update individual item quantities
- Remove products from cart
- Get cart with full product details
- Calculate total cart quantity

### 📦 Product API
- Full-text search across name, description, brand, category
- Multi-level filtering (category, subcategory, brand, price, discount)
- Sorting by price, name, or rating
- Pagination with configurable page size (max 100)
- MongoDB indexing for optimized queries

### ⚡ Infrastructure
- Layered architecture (routes → validation → controllers → services → models)
- Centralized error handling with consistent responses
- Async route wrapper (`asyncHandler`) for promise rejection catching
- Zod schema validation for all inputs
- Request logging with Morgan
- Security headers via Helmet
- Configurable CORS with Vercel preview support
- Environment validation at startup
- Rate limiting (global + refresh-token endpoint)

---

## 🔐 Security

| Feature | Implementation |
|---------|---------------|
| **HTTP Headers** | Helmet |
| **CORS** | Restricted origins + Vercel preview regex |
| **Passwords** | bcryptjs (10 rounds), excluded from responses |
| **JWT** | Separate access/refresh secrets |
| **Rate Limiting** | Global API (100/15min) + Refresh endpoint (30/15min) |
| **Validation** | Zod schemas on all inputs |

---

## 🛠️ Engineering Decisions

### 1. JWT Access + Refresh Token Strategy

Single JWT tokens either expire too quickly (bad UX) or stay valid too long (security risk). Implemented a dual-token system:

- **Access Token** (15 min): Short-lived, used for API authorization
- **Refresh Token** (7 days): Long-lived, stored in DB with expiry tracking

Token rotation ensures old refresh tokens are invalidated on use.

### 2. Refresh Token Storage with Expiry Tracking

Embedded refresh tokens in User model with expiry timestamps for validation:

```javascript
refreshTokens: [{ token: String, expiresAt: Date }]
```

### 3. Cart Total Price Auto-Calculation

Mongoose `pre("save")` middleware ensures total is always consistent:

```javascript
cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.quantity * item.price, 0
  );
  next();
});
```

### 4. Unified Validation with String-to-Number Transformation

Query parameters arrive as strings. Zod transformers handle conversion gracefully:

```javascript
minPrice: z.string()
  .or(z.number())
  .transform((val) => (val === "" ? undefined : Number(val)))
```

### 5. MongoDB Indexing for Query Performance

Compound indexes for fast search and filtering:

```javascript
productSchema.index({ productName: "text", brand: "text", ... });
productSchema.index({ category: 1, subCategory: 1, price: 1, rating: -1 });
```

### 6. Vercel Serverless Compatibility

Express app exported separately from server startup for Lambda functions:

```javascript
// main.js - starts HTTP server only in development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, ...);
}

// server.js - exports app for Vercel
module.exports = app;
```

### 7. Environment Validation at Startup

Fail-fast on missing config prevents cryptic runtime errors:

```javascript
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) process.exit(1);
```

### 8. Password Field Exclusion by Default

`select: false` prevents accidental exposure:

```javascript
password: { type: String, select: false }
```

---

## ⚠️ Challenges & Solutions

### 1: Async Error Handling Without Try-Catch Blocks

**Problem:** Unhandled promise rejections crash Express server.

**Solution:** Lightweight `asyncHandler` wrapper:

```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

Controllers stay clean without repetitive try-catch blocks.

---

### 2: Cart Quantity Tracking Without Full Fetch

**Problem:** UI needs item count but fetching entire cart is expensive.

**Solution:** Dedicated aggregation endpoint:

```javascript
calculateCartQuantity = async (userId) => {
  const cart = await Cart.findOne({ userId });
  return cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
}
```

---

### 3: Dynamic Query Building for Product Filters

**Problem:** Products need flexible filtering with multiple optional parameters.

**Solution:** Query builder pattern in service layer:

```javascript
if (filters.search) query.$text = { $search: filters.search };
if (filters.category) query.category = filters.category;
if (filters.brand) query.brand = { $in: filters.brand.split(",") };
```

---

### 4: CORS Support for Vercel Preview Deployments

**Problem:** CORS blocks Vercel's random preview URLs during development.

**Solution:** Regex matching for preview deployments:

```javascript
const isVercelPreview = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin || "");
```

---

## 📁 Project Structure

```
├── config/
│   ├── dbConnection.js          MongoDB connection setup
│   ├── envValidator.js         Environment variable validation
│   ├── jwt.js                  JWT secrets & token expiry config
│   └── rateLimit.js            Rate limiter configurations
│
├── controllers/                Request handlers (input → response)
│   ├── User.controller.js
│   ├── Products.controller.js
│   ├── Cart.controller.js
│   └── Carousel.controller.js
│
├── services/                   Business logic layer
│   ├── auth.service.js         JWT generation & verification
│   ├── user.service.js         User CRUD operations
│   ├── products.service.js     Product queries & filtering
│   └── cart.service.js        Cart management logic
│
├── routes/                     API route definitions
│   ├── index.routes.js         Route aggregator
│   ├── User.routes.js
│   ├── Products.routes.js
│   ├── Cart.routes.js
│   ├── Carousel.routes.js
│   └── auth.routes.js
│
├── validations/                Zod schemas for request validation
│   ├── user.schema.js
│   ├── products.schema.js
│   └── cart.schema.js
│
├── middlewares/                Express middleware functions
│   ├── auth.middleware.js      JWT token verification
│   ├── admin.middleware.js      Role-based access control
│   ├── errorHandler.js         Centralized error handling
│   ├── validateRequest.js       Zod validation middleware
│   └── requestLogger.js        Morgan HTTP logging
│
├── models/                     Mongoose database schemas
│   ├── User.model.js           User schema with refresh tokens
│   ├── Products.model.js       Product schema with indexes
│   ├── Cart.model.js           Cart schema with auto-pricing
│   └── Carousel.model.js       Carousel/banner schema
│
├── utils/                      Utility functions
│   └── asyncHandler.js         Async wrapper for controllers
│
├── data/                       Seed data (JSON files)
│
├── server.js                   Express app setup & middleware
├── main.js                     Entry point & server startup
└── .env.example                Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)

### Quick Start

```bash
# Clone & install
git clone git@github.com:404notDeeksha/Ecommerce-App-Backend.git
cd Ecommerce-App-Backend
npm install

# Configure
cp .env.example .env
# Edit .env with your MONGODB_URL and JWT secrets

# Run
npm run dev    # Development (with hot reload)
npm start      # Production
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon |

---

## 🌍 Environment Variables

```bash
# Server
PORT=8000

# Database
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce

# CORS
DEP_FRONTEND_URL=https://your-frontend.vercel.app
DEV_FRONTEND_URL=http://localhost:5173

# JWT (generate strong random strings, 32+ chars)
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Rate Limiting (optional - defaults work fine)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📋 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "pagination": { "total": 100, "page": 1, "totalPages": 5 }
}
```

### Auth Response (Signup/Login)

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "id": "...", "name": "...", "role": "user" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "code": "TOKEN_EXPIRED"
}
```

---

## 📈 Roadmap

- [ ] Order management system
- [ ] Payment integration (Stripe)
- [ ] Product reviews & ratings API
- [ ] Wishlist functionality
- [ ] API caching (Redis)
- [ ] WebSocket for real-time cart updates

---

## 📄 License

MIT License - see [LICENSE](https://github.com/404notDeeksha/Ecommerce-App-Backend/blob/main/License)
