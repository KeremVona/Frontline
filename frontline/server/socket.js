import { Server } from "socket.io";
import pool from "./db.js"; // PostgreSQL connection

const activeRooms = {}; // { gameId: Set of socket ids }

export const setupSocket = (server) => {
  console.log("hello")
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your frontend origin
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinGame", async ({ gameId, userId }) => {
      socket.join(gameId);

      if (!activeRooms[gameId]) {
        activeRooms[gameId] = new Set();
      }
      activeRooms[gameId].add(socket.id);

      const playerCount = activeRooms[gameId].size;
      io.to(gameId).emit("playerCountUpdate", { gameId, count: playerCount });
    });

    socket.on("leaveGame", ({ gameId }) => {
      socket.leave(gameId);

      if (activeRooms[gameId]) {
        activeRooms[gameId].delete(socket.id);

        const playerCount = activeRooms[gameId].size;
        io.to(gameId).emit("playerCountUpdate", { gameId, count: playerCount });
      }
    });

    socket.on("disconnect", () => {
      for (const gameId in activeRooms) {
        activeRooms[gameId].delete(socket.id);
        const count = activeRooms[gameId].size;
        io.to(gameId).emit("playerCountUpdate", { gameId, count });
      }
    });
  });

  return io;
};