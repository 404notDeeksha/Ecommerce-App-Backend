# 🛍️ E-commerce Backend API (Amazon-Inspired)
[![MIT License](https://img.shields.io/github/license/404notDeeksha/Ecommerce-App-Backend?style=flat-square)](https://github.com/404notDeeksha/Ecommerce-App-Backend/blob/main/License)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![REST API](https://img.shields.io/badge/API-REST-blue)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)

A production-style RESTful backend API powering an Amazon-inspired e-commerce platform.

The backend handles **user authentication, product listing, and cart management** with strong emphasis on **security, validation, and scalable architecture**.

## 🔗 Live Demo

- 🌐 **Live Site:** [ecommerce-app-techwithdeekksha.vercel.app](https://ecommerce-app-techwithdeekksha.vercel.app)

## Frontend Repository

[![Ecommerce-App](https://img.shields.io/badge/Ecommerce--App-808080?style=for-the-badge&logo=github&logoColor=white)](https://github.com/404notDeeksha/Ecommerce-App)

## ⚙️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas, Mongoose ODM
- **Hosting:** Vercel (serverless functions)
- **Security & Middleware:** Helmet (security headers), CORS (origin control), Morgan (request logging), Zod (request validation) 

## 🏗️ Architecture

The API follows a layered backend architecture separating responsibilities:

 Client
   │
   ▼
Routes
   │
   ▼
Validation (Zod)
   │
   ▼
Controllers
   │
   ▼
Service Layer
   │
   ▼
Database (MongoDB)

## Middleware Flow

Request
   │
   ▼
Helmet Security Headers
   │
   ▼
CORS Policy
   │
   ▼
Morgan Logger
   │
   ▼
Request Validation (Zod)
   │
   ▼
Controllers
   │
   ▼
Service Layer
   │
   ▼
Central Error Handler

## ✨ Features

🛒 Cart Management

- Add products to cart
- Update quantities
- Remove products

👤 User Management

- User registration
- Email verification
- Password authentication

📦 Product API

- Product listing
- Product filtering
- Product retrieval

⚡ Production-Style Backend Design

- Service layer separation
- Centralized error handling
- Async error wrapper
- Structured request validation

## 🔐 Security & Reliability

The API includes several backend best practices:

- Security: 

Helmet for HTTP security headers

Restricted CORS origins

Environment variable protection using dotenv

- Request Safety

Zod schema validation for all client inputs

Sanitized API responses

- Error Handling

Centralized error middleware

Async route wrapper to catch runtime errors

- Logging

Morgan request logging for API monitoring

## 📁 Project Structure

```bash
src
│
├── controllers
│
├── services
│
├── routes
│
├── validations
│
├── middlewares
│
│   ├── errorHandler.js
│   ├── validateRequest.js
│   └── requestLogger.js
│
├── models
│
├── utils
│   └── asyncHandler.js
│
└── server.js
```

## 🚀 Getting Started

```bash
# 1. Clone the Repo
git clone git@github.com:404notDeeksha/Ecommerce-App-Backend.git

# 2. Navigate to the project folder
cd Ecommerce-App-Backend

# 3. Install dependencies
npm install

# 4. Start the server
npm start
```

## 🌍 Environment Variables

Create a `.env` file using `.env.example` as reference.

```bash
PORT=8000
MONGO_URI=your_database_uri
DEP_FRONTEND_URL=your_frontend_url
DEV_FRONTEND_URL=http://localhost:5173
```

## 📈 Future Improvements

- JWT authentication
- Refresh token system
- Rate limiting
- API caching
- Order management system

## 📄 License

This project is licensed under the MIT License.