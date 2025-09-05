/*
  # Create Savings Group Management Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `username` (text, unique)
      - `role` (text, admin or member)
      - `email` (text, optional)
      - `password` (text, optional for admin users)
      - `join_date` (date)
      - `created_at` (timestamp)
    - `payments`
      - `id` (text, primary key)
      - `member_id` (uuid, foreign key to users)
      - `month` (text)
      - `year` (integer)
      - `amount` (numeric)
      - `paid` (boolean, default false)
      - `paid_date` (date, optional)
      - `marked_by` (uuid, foreign key to users, optional)
      - `created_at` (timestamp)
    - `loans`
      - `id` (text, primary key)
      - `member_id` (uuid, foreign key to users)
      - `amount` (numeric)
      - `issue_date` (date)
      - `due_date` (date)
      - `repaid_amount` (numeric, default 0)
      - `status` (text, default 'active')
      - `issued_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
    - `donations`
      - `id` (text, primary key)
      - `amount` (numeric)
      - `date` (date)
      - `description` (text)
      - `added_by` (uuid, foreign key to users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  member_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month text NOT NULL,
  year integer NOT NULL,
  amount numeric NOT NULL DEFAULT 300,
  paid boolean DEFAULT false,
  paid_date date,
  marked_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id text PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  repaid_amount numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'overdue')),
  issued_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id text PRIMARY KEY,
  amount numeric NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  added_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for payments table
CREATE POLICY "Users can read all payment data"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for loans table
CREATE POLICY "Users can read all loan data"
  ON loans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage loans"
  ON loans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for donations table
CREATE POLICY "Users can read all donation data"
  ON donations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_member_year ON payments(member_id, year);
CREATE INDEX IF NOT EXISTS idx_loans_member_status ON loans(member_id, status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);