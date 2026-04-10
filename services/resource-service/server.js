const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'smart_resource_db'
});

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'resource-service' });
});

// Get all resources
app.get('/resources', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get resource by ID
app.get('/resources/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create resource
app.post('/resources', async (req, res) => {
  const { name, type, available } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO resources (name, type, available) VALUES ($1, $2, $3) RETURNING *',
      [name, type, available || true]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update resource
app.put('/resources/:id', async (req, res) => {
  const { name, type, available } = req.body;
  try {
    const result = await pool.query(
      'UPDATE resources SET name = $1, type = $2, available = $3 WHERE id = $4 RETURNING *',
      [name, type, available, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete resource
app.delete('/resources/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Resource Service running on port ${PORT}`);
});
