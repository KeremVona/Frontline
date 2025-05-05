import { Server } from "socket.io";
import pool from "./db.js"; // PostgreSQL connection

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on("joinGame", async ({ gameId, userId }) => {
      try {
        // Check if already joined
        const existing = await pool.query(
          "SELECT * FROM game_players WHERE game_id = $1 AND user_id = $2",
          [gameId, userId]
        );

        if (existing.rows.length === 0) {
          await pool.query(
            "INSERT INTO game_players (game_id, user_id, joined_at) VALUES ($1, $2, NOW())",
            [gameId, userId]
          );
        }

        // Join room for real-time updates
        socket.join(gameId);

        // Count players in DB
        const result = await pool.query(
          "SELECT COUNT(*) FROM game_players WHERE game_id = $1",
          [gameId]
        );
        console.log("socket 1")
        const playerCount = parseInt(result.rows[0].count, 10);
        console.log("socket 2")
        io.to(gameId).emit("playerCountUpdate", { gameId, count: playerCount });
        console.log("socket 3")
      } catch (error) {
        console.error("❌ Error in joinGame:", error.message);
      }
    });

    socket.on("leaveGame", async ({ gameId, userId }) => {
      try {
        await pool.query(
          "DELETE FROM game_players WHERE game_id = $1 AND user_id = $2",
          [gameId, userId]
        );

        // Leave socket room
        socket.leave(gameId);

        const result = await pool.query(
          "SELECT COUNT(*) FROM game_players WHERE game_id = $1",
          [gameId]
        );

        const playerCount = parseInt(result.rows[0].count, 10);
        io.to(gameId).emit("playerCountUpdate", { gameId, count: playerCount });
      } catch (error) {
        console.error("❌ Error in leaveGame:", error.message);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`⚠️ Socket disconnected: ${socket.id}`);
      // Optional: Clean-up logic, if necessary
    });
  });

  return io;
};