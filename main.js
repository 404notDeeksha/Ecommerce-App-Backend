require("dotenv").config();

const app = require("./server");
const dbConnection = require("./config/dbConnection");
const env = require("./config/envValidator");

const port = env.PORT;

// async function startServer() {
//   try {
//     await
dbConnection();

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// }

// startServer();
module.exports = app;
