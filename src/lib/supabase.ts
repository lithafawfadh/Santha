import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          username: string;
          role: 'admin' | 'member';
          email: string | null;
          password: string | null;
          join_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          username: string;
          role: 'admin' | 'member';
          email?: string | null;
          password?: string | null;
          join_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          username?: string;
          role?: 'admin' | 'member';
          email?: string | null;
          password?: string | null;
          join_date?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          member_id: string;
          month: string;
          year: number;
          amount: number;
          paid: boolean;
          paid_date: string | null;
          marked_by: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          member_id: string;
          month: string;
          year: number;
          amount?: number;
          paid?: boolean;
          paid_date?: string | null;
          marked_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          month?: string;
          year?: number;
          amount?: number;
          paid?: boolean;
          paid_date?: string | null;
          marked_by?: string | null;
          created_at?: string;
        };
      };
      loans: {
        Row: {
          id: string;
          member_id: string;
          amount: number;
          issue_date: string;
          due_date: string;
          repaid_amount: number;
          status: 'active' | 'repaid' | 'overdue';
          issued_by: string;
          created_at: string;
        };
        Insert: {
          id: string;
          member_id: string;
          amount: number;
          issue_date: string;
          due_date: string;
          repaid_amount?: number;
          status?: 'active' | 'repaid' | 'overdue';
          issued_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          amount?: number;
          issue_date?: string;
          due_date?: string;
          repaid_amount?: number;
          status?: 'active' | 'repaid' | 'overdue';
          issued_by?: string;
          created_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          amount: number;
          date: string;
          description: string;
          added_by: string;
          created_at: string;
        };
        Insert: {
          id: string;
          amount: number;
          date: string;
          description: string;
          added_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          amount?: number;
          date?: string;
          description?: string;
          added_by?: string;
          created_at?: string;
        };
      };
    };
  };
}