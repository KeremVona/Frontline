import express from "express";
import cors from "cors";
import pool from "./db.js";
import jwtAuth from "./routes/jwtAuth.js";
import dashboard from "./routes/dashboard.js";
import gameRoutes from "./routes/gamesRouter.js";
import cron from "node-cron";
import http from "http";
import { Server } from "socket.io";
// import { setupSocket } from "./socket.js";
// import gamePlayersRouter from "./routes/gamePlayers.js";
const app = express();

app.use(express.json());
app.use(cors());
const server = http.createServer(app);

// Routes

// Register and Login Routes

app.use("/auth", jwtAuth);

// Dashboard Route

app.use("/dashboard", dashboard);

app.use("/api", gameRoutes);

// app.use('/api/game-players', gamePlayersRouter);

// ✅ Cron Job to delete outdated games
/*
cron.schedule("0 * * * *", async () => {
    console.log("cron")
  try {
    const result = await pool.query(
      "DELETE FROM games WHERE game_time < NOW()"
    );
    console.log(`🗑️ Deleted ${result.rowCount} outdated games.`);
  } catch (err) {
    console.error("🛑 Cron job error:", err.message);
  }
});
*/

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`socket id: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with Id ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Setup WebSocket
// setupSocket(server);

server.listen(5000, () => {
  console.log("Server has started on port 5000");
});
