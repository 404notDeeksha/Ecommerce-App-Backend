const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

let requestLogger;

const format = (tokens, req, res) => {
  return `${tokens.method(req, res)} ${tokens.url(req, res)} | ${tokens.status(
    req,
    res
  )} | ${tokens["response-time"](req, res)} ms`;
};

if (process.env.NODE_ENV === "production") {
  // In production, log to console (platform captures logs)
  requestLogger = morgan(format, {
    skip: () => false,
  });
} else {
  // In development, write logs to file
  const logDirectory = path.join(__dirname, "../logs");

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const accessLogStream = fs.createWriteStream(
    path.join(logDirectory, "access.log"),
    { flags: "a" }
  );

  requestLogger = morgan(format, {
    stream: accessLogStream,
    skip: () => false,
  });
}

module.exports = requestLogger;
