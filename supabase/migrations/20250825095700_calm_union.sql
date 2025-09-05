-- Fix for loans table missing issued_by column
-- Run this in your Supabase SQL Editor

-- First, check if the loans table exists and what columns it has
-- You can run this query to see the current structure:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'loans';

-- Add the missing issued_by column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'issued_by'
  ) THEN
    ALTER TABLE loans ADD COLUMN issued_by text NOT NULL REFERENCES users(id);
  END IF;
END $$;

-- Ensure the loans table has all required columns
DO $$
BEGIN
  -- Add member_id column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'member_id'
  ) THEN
    ALTER TABLE loans ADD COLUMN member_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add amount column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'amount'
  ) THEN
    ALTER TABLE loans ADD COLUMN amount numeric NOT NULL;
  END IF;

  -- Add issue_date column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'issue_date'
  ) THEN
    ALTER TABLE loans ADD COLUMN issue_date date NOT NULL;
  END IF;

  -- Add due_date column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE loans ADD COLUMN due_date date NOT NULL;
  END IF;

  -- Add repaid_amount column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'repaid_amount'
  ) THEN
    ALTER TABLE loans ADD COLUMN repaid_amount numeric DEFAULT 0;
  END IF;

  -- Add status column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'status'
  ) THEN
    ALTER TABLE loans ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'overdue'));
  END IF;

  -- Add created_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'loans' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE loans ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';