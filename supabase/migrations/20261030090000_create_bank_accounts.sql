/*
  # Create Bank Accounts Schema for Dynamic Bank Management
  
  1. New Table: `bank_accounts`
     - `id`: unique identifier (UUID/text)
     - `bank_name`: Name of the financial institution (e.g., Commercial Bank of Ceylon)
     - `account_name`: Account holder name (e.g., Santha Mutual Pool)
     - `account_number`: Account number string (e.g., 8010 000 000)
     - `branch_name`: Branch location (e.g., Colombo Main Branch)
     - `contribution_text`: Custom badge or text (e.g., Monthly Contribution · LKR 300)
     - `notes`: Instruction or remark note
     - `is_active`: Boolean to toggle visibility
     - `is_primary`: Boolean to set as default
     - `qr_code_url`: Optional LankaQR / Bank QR code image url
     - `display_order`: Display sorting priority
     - `created_at`: Timestamp
     - `updated_at`: Timestamp
*/

CREATE TABLE IF NOT EXISTS bank_accounts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  bank_name text NOT NULL,
  account_name text NOT NULL,
  account_number text NOT NULL,
  branch_name text NOT NULL,
  contribution_text text DEFAULT 'Monthly Contribution · LKR 300',
  notes text DEFAULT 'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.',
  is_active boolean DEFAULT true,
  is_primary boolean DEFAULT false,
  qr_code_url text,
  display_order integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access (consistent with existing schema policy)
CREATE POLICY "Allow all access to bank_accounts" ON bank_accounts FOR ALL USING (true);

-- Insert initial baseline matching hardcoded details
INSERT INTO bank_accounts (
  id,
  bank_name,
  account_name,
  account_number,
  branch_name,
  contribution_text,
  notes,
  is_active,
  is_primary,
  display_order
)
VALUES (
  'default-combank',
  'Commercial Bank of Ceylon',
  'Santha Mutual Pool',
  '8010 000 000',
  'Colombo Main Branch',
  'Monthly Contribution · LKR 300',
  'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.',
  true,
  true,
  1
) ON CONFLICT (id) DO NOTHING;
