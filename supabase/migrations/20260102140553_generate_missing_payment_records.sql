/*
  # Generate Missing Payment Records for All Members
  
  This migration generates payment records for all existing members for years 2023-2027.
  Each member will have 12 monthly payment records for each year (from their join date onwards).
  
  ## What this does
  
  1. **Data Population**
     - Creates payment records for all members from 2023 to 2027
     - Generates 12 monthly records per year per member
     - Sets all payments as unpaid (paid = false) by default
     - Amount is set to 300 LKR per month
  
  2. **Smart Date Handling**
     - Only creates records from/after member's join date
     - Skips months before the member joined
  
  ## Important Notes
  
  - This is a one-time data population migration
  - Admins can then mark payments as paid through the UI
  - Future members will have their payments auto-generated when they're added
*/

-- Generate payment records for all members from 2023 to 2027
DO $$
DECLARE
  member_record RECORD;
  year_val INTEGER;
  month_name TEXT;
  month_names TEXT[] := ARRAY['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  month_idx INTEGER;
  join_year INTEGER;
  join_month INTEGER;
  payment_id TEXT;
BEGIN
  -- Loop through all members
  FOR member_record IN 
    SELECT id, join_date 
    FROM users 
    WHERE role = 'member'
  LOOP
    -- Extract join year and month
    join_year := EXTRACT(YEAR FROM member_record.join_date);
    join_month := EXTRACT(MONTH FROM member_record.join_date);
    
    -- Generate records for years 2023 to 2027
    FOR year_val IN 2023..2027 LOOP
      -- Loop through all 12 months
      FOR month_idx IN 1..12 LOOP
        month_name := month_names[month_idx];
        
        -- Only create payment record if:
        -- 1. Year is after join year, OR
        -- 2. Year equals join year AND month is >= join month
        IF (year_val > join_year) OR (year_val = join_year AND month_idx >= join_month) THEN
          payment_id := member_record.id || '_' || month_name || '_' || year_val;
          
          -- Insert payment record if it doesn't exist
          INSERT INTO payments (id, member_id, month, year, amount, paid, paid_date, marked_by)
          VALUES (payment_id, member_record.id, month_name, year_val, 300, false, NULL, NULL)
          ON CONFLICT (id) DO NOTHING;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Payment records generated successfully for all members';
END $$;

-- Verify the data
DO $$
DECLARE
  total_payments INTEGER;
  payments_2026 INTEGER;
  payments_2027 INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_payments FROM payments;
  SELECT COUNT(*) INTO payments_2026 FROM payments WHERE year = 2026;
  SELECT COUNT(*) INTO payments_2027 FROM payments WHERE year = 2027;
  
  RAISE NOTICE 'Total payment records created: %', total_payments;
  RAISE NOTICE 'Payment records for 2026: %', payments_2026;
  RAISE NOTICE 'Payment records for 2027: %', payments_2027;
END $$;