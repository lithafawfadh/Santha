/*
  # Create Savings Group Management Schema

  1. New Tables
    - `users` - Store user information
    - `payments` - Track monthly payments
    - `loans` - Manage loan records
    - `donations` - Record donations

  2. Security
    - Enable RLS on all tables
    - Allow public read/write access (custom auth is handled in app)
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'member')),
  email text,
  password text,
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id text PRIMARY KEY,
  member_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month text NOT NULL,
  year integer NOT NULL,
  amount numeric NOT NULL DEFAULT 300,
  paid boolean DEFAULT false,
  paid_date date,
  marked_by text REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id text PRIMARY KEY,
  member_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  repaid_amount numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'overdue')),
  issued_by text NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id text PRIMARY KEY,
  amount numeric NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  added_by text NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies allowing public access (app handles auth)
CREATE POLICY "Allow all access to users"
  ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to payments"
  ON payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to loans"
  ON loans
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to donations"
  ON donations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_member_year ON payments(member_id, year);
CREATE INDEX IF NOT EXISTS idx_loans_member_status ON loans(member_id, status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);