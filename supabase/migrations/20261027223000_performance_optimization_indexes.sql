-- Migration: Add targeted indexes for query optimization
-- Based on Supabase PostgreSQL performance best practices

-- 1. Index for Member Warnings retrieval (filtered by member_id and unread status)
CREATE INDEX IF NOT EXISTS idx_warnings_member_unread 
ON warnings(member_id, is_read) 
WHERE is_read = false;

-- 2. Partial index for Active Loans (fast aggregation of active loan liabilities)
CREATE INDEX IF NOT EXISTS idx_loans_active 
ON loans(member_id, status) 
WHERE status = 'active';

-- 3. Composite index for Payments lookup by year and member
CREATE INDEX IF NOT EXISTS idx_payments_member_year_paid 
ON payments(member_id, year, paid);

-- 4. Index for recent activity logs (ordered by created_at DESC)
CREATE INDEX IF NOT EXISTS idx_activity_logs_recent 
ON activity_logs(created_at DESC);

-- 5. Index for member exits lookup
CREATE INDEX IF NOT EXISTS idx_member_exits_member 
ON member_exits(member_id);
