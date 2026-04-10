const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';
const RESOURCE_SERVICE_URL = process.env.RESOURCE_SERVICE_URL || 'http://localhost:5002';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:5003';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'api-gateway' });
});

// User Service Routes
app.get('/api/users', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users`);
    res.json(response.data);
  } catch (error) {
    console.error('User service error:', error.message);
    res.status(500).json({ error: 'User service unavailable' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('User service error:', error.message);
    res.status(500).json({ error: 'User service unavailable' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/users`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('User service error:', error.message);
    res.status(500).json({ error: 'User service unavailable' });
  }
});

// Resource Service Routes
app.get('/api/resources', async (req, res) => {
  try {
    const response = await axios.get(`${RESOURCE_SERVICE_URL}/resources`);
    res.json(response.data);
  } catch (error) {
    console.error('Resource service error:', error.message);
    res.status(500).json({ error: 'Resource service unavailable' });
  }
});

app.get('/api/resources/:id', async (req, res) => {
  try {
    const response = await axios.get(`${RESOURCE_SERVICE_URL}/resources/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Resource service error:', error.message);
    res.status(500).json({ error: 'Resource service unavailable' });
  }
});

app.post('/api/resources', async (req, res) => {
  try {
    const response = await axios.post(`${RESOURCE_SERVICE_URL}/resources`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Resource service error:', error.message);
    res.status(500).json({ error: 'Resource service unavailable' });
  }
});

// Booking Service Routes
app.get('/api/bookings', async (req, res) => {
  try {
    const response = await axios.get(`${BOOKING_SERVICE_URL}/bookings`);
    res.json(response.data);
  } catch (error) {
    console.error('Booking service error:', error.message);
    res.status(500).json({ error: 'Booking service unavailable' });
  }
});

app.get('/api/bookings/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BOOKING_SERVICE_URL}/bookings/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Booking service error:', error.message);
    res.status(500).json({ error: 'Booking service unavailable' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const response = await axios.post(`${BOOKING_SERVICE_URL}/bookings`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Booking service error:', error.message);
    res.status(500).json({ error: 'Booking service unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
