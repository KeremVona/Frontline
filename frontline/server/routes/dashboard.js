import { Router } from "express";
import pool from "../db.js";
import authorization from "../middleware/authorization.js";
const router = Router();

router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT username FROM users WHERE id = $1", [req.user]);
        res.json(user.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json("Server error, check console in editor");
    }
});

export default router;