import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator.js";
import validInfo from "../middleware/validInfo.js";
import authorization from "../middleware/authorization.js";
const router = Router();

// Register

router.post("/register", validInfo, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (user.rows.length !== 0) {
            console.log("Let's see");
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

        return res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error, check console in editor");
    }
});

router.post("/login", validInfo, async (req, res) => {
    console.log("login")
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        console.log(`tryın içi ve user: ${user.email}`)
        console.log(`tryın içi ve email: ${email} pass: ${password}`)

        if (user.rows.length === 0) {
            console.log("if")
            res.status(401).json("Password or email is incorrect");
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!validPassword) {
            console.log("valid")
            return res.status(401).json("Password or email is incorrect");
        }

        const token = jwtGenerator(user.rows[0].id);
        console.log("buraya geldik mi")

        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error, check console in editor");
    }
});

router.get("/is-verify", authorization, async (req, res) => {
    console.log("is verify")
    try {
        res.json(true);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error, check console in editor");
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out');
      }
      res.redirect('/login');
    });
  });

export default router;