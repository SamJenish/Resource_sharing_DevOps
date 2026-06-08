const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Database ---
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'smart_resource_db'
});

app.use(cors());
// Parse JSON bodies
app.use(express.json());

// --- AI Feedback Module (rule-based) ---
function generateFeedback(resource, duration) {
  const tips = [];
  const hour = new Date().getHours();

  if (hour >= 9 && hour <= 11) {
    tips.push('This is peak hours (9–11 AM). Consider booking during off-peak hours for better availability.');
  } else if (hour >= 14 && hour <= 16) {
    tips.push('Afternoon slots (2–4 PM) are moderately busy. You might find better availability early morning.');
  } else {
    tips.push('Great choice! This is an off-peak time slot — resources are usually less contested.');
  }

  if (duration > 3) {
    tips.push(`Booking for ${duration} hours is a long session. Consider splitting into shorter blocks if possible.`);
  }

  if (resource.name.toLowerCase().includes('room')) {
    tips.push('Meeting rooms are frequently used resources. Try to release early if you finish ahead of schedule.');
  }

  if (resource.name.toLowerCase().includes('printer') || resource.name.toLowerCase().includes('lab')) {
    tips.push('Lab equipment has high demand. Please ensure you follow the usage guidelines.');
  }

  return tips.length > 0 ? tips[Math.floor(Math.random() * tips.length)] : 'Resource booked successfully.';
}

// --- Routes ---

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Get all resources
app.get('/resources', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Book a resource
app.post('/book', async (req, res) => {
  const { resource_id, duration } = req.body;

  if (!resource_id || !duration) {
    return res.status(400).json({ error: 'resource_id and duration are required' });
  }

  try {
    // Check resource exists
    const check = await pool.query('SELECT * FROM resources WHERE id = $1', [resource_id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const resource = check.rows[0];

    if (resource.status === 'busy') {
      return res.status(409).json({
        error: 'Resource is currently busy',
        available_time: resource.available_time
      });
    }

    // Compute new available_time
    const availableTime = new Date();
    availableTime.setHours(availableTime.getHours() + parseInt(duration));

    // Update resource
    const result = await pool.query(
      'UPDATE resources SET status = $1, available_time = $2 WHERE id = $3 RETURNING *',
      ['busy', availableTime.toISOString(), resource_id]
    );

    const updatedResource = result.rows[0];
    const feedback = generateFeedback(updatedResource, parseInt(duration));

    res.json({
      message: 'Resource booked successfully',
      resource: updatedResource,
      feedback,
      available_time: availableTime.toISOString()
    });
  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ error: 'Failed to book resource' });
  }
});

// --- Start server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
