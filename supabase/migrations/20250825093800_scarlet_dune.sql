```sql
/*
  # Complete Database Setup for Savings Group Management

  Run this entire script in your Supabase SQL Editor to create all tables and initial data.

  1. Creates all required tables with proper relationships
  2. Sets up Row Level Security policies
  3. Inserts initial users and sample data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY, -- Changed from uuid to text
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
  member_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Changed from uuid to text
  month text NOT NULL,
  year integer NOT NULL,
  amount numeric NOT NULL DEFAULT 300,
  paid boolean DEFAULT false,
  paid_date date,
  marked_by text REFERENCES users(id), -- Changed from uuid to text
  created_at timestamptz DEFAULT now()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id text PRIMARY KEY,
  member_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Changed from uuid to text
  amount numeric NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  repaid_amount numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'overdue')),
  issued_by text NOT NULL REFERENCES users(id), -- Changed from uuid to text
  created_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id text PRIMARY KEY,
  amount numeric NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  added_by text NOT NULL REFERENCES users(id), -- Changed from uuid to text
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read all user data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can read all payment data" ON payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
DROP POLICY IF EXISTS "Users can read all loan data" ON loans;
DROP POLICY IF EXISTS "Admins can manage loans" ON loans;
DROP POLICY IF EXISTS "Users can read all donation data" ON donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON donations;

-- Create policies for users table
CREATE POLICY "Users can read all user data"
  ON users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update users"
  ON users
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete users"
  ON users
  FOR DELETE
  TO public
  USING (true);

-- Create policies for payments table
CREATE POLICY "Users can read all payment data"
  ON payments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage payments"
  ON payments
  FOR ALL
  TO public
  USING (true);

-- Create policies for loans table
CREATE POLICY "Users can read all loan data"
  ON loans
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage loans"
  ON loans
  FOR ALL
  TO public
  USING (true);

-- Create policies for donations table
CREATE POLICY "Users can read all donation data"
  ON donations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage donations"
  ON donations
  FOR ALL
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_member_year ON payments(member_id, year);
CREATE INDEX IF NOT EXISTS idx_loans_member_status ON loans(member_id, status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert initial users
INSERT INTO users (id, name, username, role, email, password, join_date) VALUES
-- Administrators
('admin1', 'Lithaf', 'lithaf_admin', 'admin', 'lithaf@group.com', 'admin123', '2024-01-01'),
('admin2', 'Raza', 'raza_admin', 'admin', 'raza@group.com', 'admin123', '2024-01-01'),
('admin3', 'Aafiq', 'aafiq_admin', 'admin', 'aafiq@group.com', 'admin123', '2024-01-01'),

-- Members
('member1', 'Awfadh', 'awfadh01', 'member', 'awfadh@group.com', NULL, '2024-01-01'),
('member2', 'Ahsan', 'ahsan02', 'member', 'ahsan@group.com', NULL, '2024-01-01'),
('member3', 'Ali', 'ali03', 'member', 'ali@group.com', NULL, '2024-01-01'),
('member4', 'Rakisthu', 'rakisthu04', 'member', 'rakisthu@group.com', NULL, '2024-01-01'),
('member5', 'Saba', 'saba05', 'member', 'saba@group.com', NULL, '2024-01-01'),
('member6', 'Sahmee', 'sahmee06', 'member', 'sahmee@group.com', NULL, '2024-01-01'),
('member7', 'Sarfaras', 'sarfaras07', 'member', 'sarfaras@group.com', NULL, '2024-01-01'),
('member8', 'Famil', 'famil08', 'member', 'famil@group.com', NULL, '2024-01-01'),
('member9', 'Sajith', 'sajith09', 'member', 'sajith@group.com', NULL, '2024-01-01'),
('member10', 'Ifrah', 'ifrah10', 'member', 'ifrah@group.com', NULL, '2024-01-01'),
('member11', 'Hanan', 'hanan11', 'member', 'hanan@group.com', NULL, '2024-01-01'),
('member12', 'Mazy', 'mazy12', 'member', 'mazy@group.com', NULL, '2024-01-01'),
('member13', 'Ashlah', 'ashlah13', 'member', 'ashlah@group.com', NULL, '2024-01-01'),
('member14', 'Kulshan', 'kulshan14', 'member', 'kulshan@group.com', NULL, '2024-01-01')
ON CONFLICT (id) DO NOTHING;

-- Generate payment records for all members for years 2024-2025
DO $$
DECLARE
    member_record RECORD;
    year_val INTEGER;
    month_name TEXT;
    month_names TEXT[] := ARRAY['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
BEGIN
    -- Loop through all members
    FOR member_record IN SELECT id FROM users WHERE role = 'member' LOOP
        -- Loop through years 2024-2025
        FOR year_val IN 2024..2025 LOOP
            -- Loop through all months
            FOREACH month_name IN ARRAY month_names LOOP
                INSERT INTO payments (id, member_id, month, year, amount, paid, paid_date, marked_by)
                VALUES (
                    member_record.id || '_' || month_name || '_' || year_val,
                    member_record.id,
                    month_name,
                    year_val,
                    300,
                    false,
                    NULL,
                    NULL
                )
                ON CONFLICT (id) DO NOTHING;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- Insert sample loans
INSERT INTO loans (id, member_id, amount, issue_date, due_date, repaid_amount, status, issued_by) VALUES
('loan1', 'member1', 5000, '2024-10-01', '2025-01-01', 1500, 'active', 'admin1'),
('loan2', 'member3', 3000, '2024-09-15', '2024-12-15', 3000, 'repaid', 'admin2')
ON CONFLICT (id) DO NOTHING;

-- Insert sample donations
INSERT INTO donations (id, amount, date, description, added_by) VALUES
('donation1', 1000, '2024-11-01', 'Community fund donation', 'admin1'),
('donation2', 500, '2024-10-15', 'Emergency fund contribution', 'admin2')
ON CONFLICT (id) DO NOTHING;
```