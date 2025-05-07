import express from "express";
import db from "../db.js"; // Make sure db.js uses ES6 exports too
import authenticateUser from "../middleware/authorization.js"; // Your auth middleware

const router = express.Router();

router.post("/games", authenticateUser, async (req, res) => {
  const {
    title,
    description,
    gameTime,
    maxPlayers,
    generalRules,
    countryRules,
  } = req.body;
  const userId = req.user;
  // console.log(`userId: ${userId}`)

  try {
    const gameResult = await db.query(
      `INSERT INTO games (host_user_id, title, description, game_time, max_players)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, description, gameTime, maxPlayers]
    );
    const gameId = gameResult.rows[0].id;

    // Add host as first player
    await db.query(
      `INSERT INTO game_players (game_id, user_id) VALUES ($1, $2)`,
      [gameId, userId]
    );

    // Insert general rules
    for (const rule of generalRules || []) {
      await db.query(
        `INSERT INTO game_rules (game_id, rule_type, description)
         VALUES ($1, 'general', $2)`,
        [gameId, rule]
      );
    }

    // Insert country-specific rules
    for (const rule of countryRules || []) {
      await db.query(
        `INSERT INTO game_rules (game_id, rule_type, country, description)
         VALUES ($1, 'country_specific', $2, $3)`,
        [gameId, rule.country, rule.description]
      );
    }

    res.status(201).json(gameResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create game." });
  }
});

router.get("/games/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const gameRes = await db.query("SELECT * FROM games WHERE id = $1", [id]);
    const game = gameRes.rows[0];

    if (!game) return res.status(404).json({ error: "Game not found" });

    const rulesRes = await db.query(
      "SELECT * FROM game_rules WHERE game_id = $1",
      [id]
    );

    const generalRules = rulesRes.rows
      .filter((r) => r.rule_type === "general")
      .map((r) => r.description);

    const countryRules = rulesRes.rows
      .filter((r) => r.rule_type === "country_specific")
      .map((r) => ({ country: r.country, description: r.description }));

    res.json({ ...game, generalRules, countryRules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load game" });
  }
});

// GET /api/games
router.get("/games", authenticateUser, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.*, u.username AS host_name
      FROM games g
      JOIN users u ON g.host_user_id = u.id
      ORDER BY g.game_time DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load games" });
  }
});

// 🟢 Join a game
router.post("/games/join", authenticateUser, async (req, res) => {
  const userId = req.user;
  const { gameId } = req.body;

  if (!gameId) return res.status(400).json({ error: "Missing gameId" });

  try {
    // Check if user already joined
    const existing = await db.query(
      "SELECT * FROM game_players WHERE game_id = $1 AND user_id = $2",
      [gameId, userId]
    );

    if (existing.rows.length === 0) {
      await db.query(
        "INSERT INTO game_players (game_id, user_id, joined_at) VALUES ($1, $2, NOW())",
        [gameId, userId]
      );
    }

    const countRes = await db.query(
      "SELECT COUNT(*) FROM game_players WHERE game_id = $1",
      [gameId]
    );

    const count = parseInt(countRes.rows[0].count, 10);
    res.status(200).json({ message: "Joined game", playerCount: count });
  } catch (err) {
    console.error("Join error:", err.message);
    res.status(500).json({ error: "Failed to join game" });
  }
});

// 🔴 Leave a game
router.post("/games/leave", authenticateUser, async (req, res) => {
  const userId = req.user;
  const { gameId } = req.body;

  if (!gameId) return res.status(400).json({ error: "Missing gameId" });

  try {
    await db.query(
      "DELETE FROM game_players WHERE game_id = $1 AND user_id = $2",
      [gameId, userId]
    );

    const countRes = await db.query(
      "SELECT COUNT(*) FROM game_players WHERE game_id = $1",
      [gameId]
    );

    const count = parseInt(countRes.rows[0].count, 10);
    res.status(200).json({ message: "Left game", playerCount: count });
  } catch (err) {
    console.error("Leave error:", err.message);
    res.status(500).json({ error: "Failed to leave game" });
  }
});

// 👥 Get player count for a game
router.get("/games/:gameId/playerCount", authenticateUser, async (req, res) => {
  const { gameId } = req.params;

  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM game_players WHERE game_id = $1",
      [gameId]
    );

    const count = parseInt(result.rows[0].count, 10);
    res.json({ count });
  } catch (err) {
    console.error("Player count error:", err.message);
    res.status(500).json({ error: "Failed to get player count" });
  }
});

// GET /api/games/:id/players - returns list of users who joined a game
router.get("/games/:id/players", authenticateUser, async (req, res) => {
  const { id: gameId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT u.id, u.username
      FROM game_players gp
      JOIN users u ON gp.user_id = u.id
      WHERE gp.game_id = $1
      ORDER BY gp.joined_at ASC
      `,
      [gameId]
    );

    console.log(`Players in game ${gameId}:`, result.rows); // ✅ Console log on server

    res.json({ players: result.rows });
  } catch (err) {
    console.error("Failed to fetch game players:", err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

export default router;
