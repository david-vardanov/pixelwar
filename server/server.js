const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

const gameController = require("./controllers/gameController");

// Initialize Express and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection
mongoose.connect("mongodb://localhost/pixelwar", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connected");
});

// Redis client setup
const redisClient = redis.createClient();
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
redisClient.connect().catch(console.error);

// Express session setup with Redis
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static files
app.use(express.static("client"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/matchmake", (req, res) => {
  res.sendFile(__dirname + "/client/matchmake.html");
});

app.get("/game", (req, res) => {
  res.sendFile(__dirname + "/client/game.html");
});

// Socket.io handling
io.on("connection", (socket) => {
  gameController.initializeSocket(io, socket, redisClient);
});

// Start the server
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
