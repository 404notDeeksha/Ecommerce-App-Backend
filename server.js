require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./routes/index.routes");
const env = require("./config/envValidator");
const requestLogger = require("./middlewares/requestLogger");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandler");
const { apiLimiter } = require("./config/rateLimit");

const app = express();

const allowedOrigins = [env.DEP_FRONTEND_URL, env.DEV_FRONTEND_URL];

const isVercelPreview = (origin) =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin || "");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isVercelPreview(origin)) {
      console.log(
        "CORS policy: Allowing origin:",
        origin,
        allowedOrigins.includes(origin)
      );
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/api", apiLimiter);

app.get("/api/test", (req, res) => {
  console.log("🔵 /api/test route hit!");
  res.json({ message: "API is working!" });
});

app.get("/error-test", (req, res) => {
  throw new Error("Test error");
});

app.use("/api", router);

app.use(errorHandler);

module.exports = app;
