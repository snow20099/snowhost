-- Database Schema for User Statistics System
-- This schema supports the user statistics dashboard

-- Users table (if you don't already have one)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255), -- For local auth
  provider VARCHAR(50), -- 'local', 'google', 'github', etc.
  provider_id VARCHAR(255), -- Provider specific user ID
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_users_email (email),
  INDEX idx_users_provider (provider, provider_id)
);

-- Servers table
CREATE TABLE servers (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('active', 'inactive', 'pending', 'error', 'restarting', 'deleted') DEFAULT 'pending',
  server_type VARCHAR(100), -- 'vps', 'dedicated', 'cloud', etc.
  plan VARCHAR(100), -- Server plan/size
  region VARCHAR(100), -- Server region
  ip_address VARCHAR(45), -- IPv4 or IPv6
  monthly_cost DECIMAL(10,2) DEFAULT 0.00,
  specs JSON, -- Server specifications (CPU, RAM, Storage, etc.)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_servers_user_id (user_id),
  INDEX idx_servers_status (status),
  INDEX idx_servers_created_at (created_at),
  INDEX idx_servers_user_status (user_id, status)
);

-- Payments table
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  server_id VARCHAR(36), -- NULL for general payments
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50), -- 'credit_card', 'paypal', 'bank_transfer', etc.
  transaction_id VARCHAR(255), -- Payment gateway transaction ID
  gateway VARCHAR(50), -- 'stripe', 'paypal', 'razorpay', etc.
  description TEXT,
  invoice_number VARCHAR(100),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE SET NULL,
  INDEX idx_payments_user_id (user_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_created_at (created_at),
  INDEX idx_payments_user_status (user_id, status),
  INDEX idx_payments_user_created (user_id, created_at)
);

-- Server logs table (for tracking server actions)
CREATE TABLE server_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  server_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'start', 'stop', 'restart', 'delete', 'create', etc.
  description TEXT,
  metadata JSON, -- Additional action metadata
  ip_address VARCHAR(45), -- IP from which action was performed
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_server_logs_server_id (server_id),
  INDEX idx_server_logs_user_id (user_id),
  INDEX idx_server_logs_created_at (created_at),
  INDEX idx_server_logs_action (action)
);

-- Server metrics table (for monitoring)
CREATE TABLE server_metrics (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  server_id VARCHAR(36) NOT NULL,
  cpu_usage DECIMAL(5,2), -- Percentage
  memory_usage DECIMAL(5,2), -- Percentage
  disk_usage DECIMAL(5,2), -- Percentage
  network_in BIGINT, -- Bytes
  network_out BIGINT, -- Bytes
  uptime BIGINT, -- Seconds
  response_time DECIMAL(8,2), -- Milliseconds
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  INDEX idx_server_metrics_server_id (server_id),
  INDEX idx_server_metrics_recorded_at (recorded_at),
  INDEX idx_server_metrics_server_recorded (server_id, recorded_at)
);

-- User subscriptions table (if you have subscription-based billing)
CREATE TABLE user_subscriptions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status ENUM('active', 'cancelled', 'expired', 'suspended') DEFAULT 'active',
  billing_cycle ENUM('monthly', 'yearly', 'one-time') DEFAULT 'monthly',
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  next_billing_date TIMESTAMP,
  subscription_id VARCHAR(255), -- Payment gateway subscription ID
  gateway VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_subscriptions_user_id (user_id),
  INDEX idx_subscriptions_status (status),
  INDEX idx_subscriptions_billing_date (next_billing_date)
);

-- Sample data for testing (you can remove this in production)
-- INSERT INTO users (id, email, name) VALUES 
-- ('user123', 'test@example.com', 'Test User');

-- INSERT INTO servers (id, user_id, name, status, monthly_cost) VALUES
-- ('server1', 'user123', 'Web Server 1', 'active', 150.00),
-- ('server2', 'user123', 'Database Server', 'active', 200.00),
-- ('server3', 'user123', 'Backup Server', 'inactive', 100.00);

-- INSERT INTO payments (user_id, server_id, amount, status, description, paid_at) VALUES
-- ('user123', 'server1', 150.00, 'completed', 'Monthly server payment', NOW() - INTERVAL 15 DAY),
-- ('user123', 'server2', 200.00, 'completed', 'Monthly server payment', NOW() - INTERVAL 10 DAY),
-- ('user123', NULL, 500.00, 'completed', 'Credit top-up', NOW() - INTERVAL 5 DAY);
