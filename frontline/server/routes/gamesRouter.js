import express from 'express';
import db from '../db.js'; // Make sure db.js uses ES6 exports too
import authenticateUser from '../middleware/authorization.js'; // Your auth middleware

const router = express.Router();

router.post('/api/games', authenticateUser, async (req, res) => {
  const { title, description, gameTime, maxPlayers, generalRules, countryRules } = req.body;
  const userId = req.user.id;

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
    res.status(500).json({ error: 'Failed to create game.' });
  }
});

export default router;