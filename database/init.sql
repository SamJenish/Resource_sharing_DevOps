CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES 
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Johnson', 'bob@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO resources (name, type, available) VALUES 
  ('Conference Room A', 'room', true),
  ('Projector 1', 'equipment', true),
  ('Meeting Room B', 'room', false)
ON CONFLICT DO NOTHING;

INSERT INTO bookings (user_id, resource_id, status) VALUES 
  (1, 1, 'confirmed'),
  (2, 2, 'pending'),
  (3, 3, 'cancelled')
ON CONFLICT DO NOTHING;
