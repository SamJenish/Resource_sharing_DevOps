const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

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
  res.status(200).json({ status: 'healthy', service: 'booking-service' });
});

// Get all bookings
app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get booking by ID
app.get('/bookings/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create booking
app.post('/bookings', async (req, res) => {
  const { user_id, resource_id, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, resource_id, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, resource_id, status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update booking
app.put('/bookings/:id', async (req, res) => {
  const { user_id, resource_id, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE bookings SET user_id = $1, resource_id = $2, status = $3 WHERE id = $4 RETURNING *',
      [user_id, resource_id, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete booking
app.delete('/bookings/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
