require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const router = require("./routes/index.routes");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");
const { apiLimiter } = require("./config/rateLimit");
const corsOptions = require("./config/corsOptions");

const app = express();

app.use(cors(corsOptions));

app.use(helmet());
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
