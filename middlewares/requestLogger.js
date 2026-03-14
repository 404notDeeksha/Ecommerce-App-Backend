const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

let requestLogger;

if (process.env.NODE_ENV === "production") {
  // In production, log to console (platform captures logs)
  requestLogger = morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
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

  requestLogger = morgan("combined", {
    stream: accessLogStream,
    skip: (req, res) => res.statusCode < 400,
  });
}

module.exports = requestLogger;