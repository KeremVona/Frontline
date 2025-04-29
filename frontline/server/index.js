import express from 'express';
import cors from 'cors';
import pool from './db.js';
import jwtAuth from "./routes/jwtAuth.js";
import dashboard from "./routes/dashboard.js";
import gameRoutes from "./routes/gamesRouter.js";
const app = express();

app.use(express.json());
app.use(cors());

// Routes

// Register and Login Routes

app.use("/auth", jwtAuth);

// Dashboard Route

app.use("/dashboard", dashboard);

app.use("/api", gameRoutes);

app.listen(5000, () => {
    console.log("Server has started on port 5000");
})