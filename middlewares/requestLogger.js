const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

const requestLogger = morgan("combined", {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400,
});

module.exports = requestLogger;
