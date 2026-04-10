-- Smart Resource Management System — Database Schema

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'busy')),
  available_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO resources (name, status, available_time) VALUES
  ('Conference Room A', 'available', CURRENT_TIMESTAMP),
  ('Projector Alpha', 'available', CURRENT_TIMESTAMP),
  ('Meeting Room B', 'busy', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
  ('3D Printer Lab', 'available', CURRENT_TIMESTAMP),
  ('Server Rack #7', 'busy', CURRENT_TIMESTAMP + INTERVAL '4 hours')
ON CONFLICT DO NOTHING;
