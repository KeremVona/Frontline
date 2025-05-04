import { Router } from "express";
import pool from "../db.js";
import authorization from "../middleware/authorization.js";
const router = Router();

router.get("/", authorization, async (req, res) => {
  try {
    const userId = req.user;
    console.log("User ID from token:", req.user);
    console.log("User ID: ", userId)
    const user = await pool.query("SELECT username FROM users WHERE id = $1", [
      userId,
    ]);
    if (user.rows.length > 0) {
      // Ensure that you're returning a valid JSON object
      res.json({ username: user.rows[0].username });
    } else {
      // If no user is found, send a 404 with an error message
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error, check console in editor");
  }
});

export default router;
