/*
  # Seed Initial Data

  1. Insert initial users (admins and members)
  2. Generate payment records for all members
  3. Insert sample loans and donations

  This migration populates the database with the initial data from mockData.ts
*/

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

-- Generate payment records for all members for years 2023-2025
DO $$
DECLARE
    member_record RECORD;
    year_val INTEGER;
    month_name TEXT;
    month_names TEXT[] := ARRAY['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
BEGIN
    -- Loop through all members
    FOR member_record IN SELECT id FROM users WHERE role = 'member' LOOP
        -- Loop through years 2023-2025
        FOR year_val IN 2023..2025 LOOP
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