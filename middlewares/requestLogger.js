const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../logs/access.log"),
  { flags: "a" }
);

const requestLogger = morgan("combined", {
  stream: accessLogStream,
});

module.exports = requestLogger;
