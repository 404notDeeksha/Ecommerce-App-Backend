require("dotenv").config();

const app = require("./server");
const dbConnection = require("./config/dbConnection");
const env = require("./config/envValidator");

const port = env.PORT;

dbConnection();

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

module.exports = app;
