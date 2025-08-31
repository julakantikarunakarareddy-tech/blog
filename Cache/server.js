const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');

const app = express();
const PORT = 3000;

// --- MySQL Connection ---
const db = mysql.createPool({
  host: 'host.docker.internal',
  user: 'energex',
  password: 'energex',
  database: 'energex'
});

// --- Redis Connection ---
const redisClient = redis.createClient({
  socket: { host: 'host.docker.internal', port: 6379 }
});

redisClient.on('error', err => console.error('Redis error:', err));
redisClient.connect();

// --- GET /cache/posts (fetch all posts from cache or DB) ---
app.get('/cache/posts', async (req, res) => {
  try {
    // 1. Check Redis
    const cached = await redisClient.get('all_posts');
    if (cached) {
      console.log('Serving from Redis cache');
      return res.json(JSON.parse(cached));
    }

    // 2. If not in Redis, fetch from MySQL
    const [rows] = await db.query('SELECT * FROM posts');
    // Store in Redis for 1 hour (3600 seconds)
    await redisClient.setEx('all_posts', 3600, JSON.stringify(rows));

    console.log('Serving from MySQL');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- GET /cache/posts/:id (fetch single post) ---
app.get('/cache/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check Redis
    const cached = await redisClient.get(`post_${id}`);
    if (cached) {
      console.log('Serving from Redis cache');
      return res.json(JSON.parse(cached));
    }

    // 2. If not cached, query MySQL
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = rows[0];
    // Store in Redis for 1 hour
    await redisClient.setEx(`post_${id}`, 3600, JSON.stringify(post));

    console.log('Serving from MySQL');
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Cache service running at http://localhost:${PORT}`);
});
