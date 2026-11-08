require("dotenv").config();

const dns = require("node:dns");

// Use public DNS locally to resolve MongoDB Atlas SRV records.
// Render will use its own DNS resolver in production.
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
