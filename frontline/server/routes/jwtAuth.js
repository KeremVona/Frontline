import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
const router = Router();

// Register

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length !== 0) {
            return res.status(401).send("User already exists");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query( 
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPassword]
        );

        const token = jwtGenerator(newUser.rows[0].id);

        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error, check console in editor");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            res.status(401).json("Password or email is incorrect");
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json("Password or email is incorrect");
        }

        const token = jwtGenerator(user.rows[0].id);

        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error, check console in editor");
    }
});

export default router;