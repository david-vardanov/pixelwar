require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const gameRoutes = require("./routes/gameRoutes");
const gameController = require("./controllers/gameController");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "../client")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
  gameController.initializeSocket(io, socket, redisClient);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
