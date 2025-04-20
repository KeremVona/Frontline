import express from 'express';
import cors from 'cors';
import pool from './db';
import jwtAuth from "./routes/jwtAuth.js";
const app = express();

app.use(express.json());
app.use(cors());

// Routes

// Register and Login Routes

app.use("/auth", jwtAuth);

app.listen(5000, () => {
    console.log("Server has started on port 5000");
})