/*import express from 'express';
import pool from '../db.js'; // Make sure db.js also uses ES6 exports

const router = express.Router();

// Join a game
router.post('/join', async (req, res) => {
  const { gameId, userId } = req.body;

  try {
    const { rows: existing } = await pool.query(
      'SELECT * FROM game_players WHERE game_id = $1 AND user_id = $2',
      [gameId, userId]
    );

    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO game_players (game_id, user_id) VALUES ($1, $2)',
        [gameId, userId]
      );
    }

    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM game_players WHERE game_id = $1',
      [gameId]
    );

    res.json({ success: true, count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave a game
router.post('/leave', async (req, res) => {
  const { gameId, userId } = req.body;

  try {
    await pool.query(
      'DELETE FROM game_players WHERE game_id = $1 AND user_id = $2',
      [gameId, userId]
    );

    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM game_players WHERE game_id = $1',
      [gameId]
    );

    res.json({ success: true, count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get count
router.get('/count/:gameId', async (req, res) => {
  const { gameId } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM game_players WHERE game_id = $1',
      [gameId]
    );

    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;*/