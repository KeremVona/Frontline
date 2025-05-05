import express from "express";
import cors from "cors";
import pool from "./db.js";
import jwtAuth from "./routes/jwtAuth.js";
import dashboard from "./routes/dashboard.js";
import gameRoutes from "./routes/gamesRouter.js";
import cron from "node-cron";
import http from "http";
import { setupSocket } from "./socket.js";
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

// Setup WebSocket
setupSocket(server);

server.listen(5000, () => {
  console.log("Server has started on port 5000");
});
