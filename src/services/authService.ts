import { supabase } from '../lib/supabase';
import { User } from '../types';

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async loginWithUsername(username: string, role: 'admin' | 'member', password?: string): Promise<User | null> {
    try {
      // Find user by username and role
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('role', role)
        .limit(1);

      if (error) {
        console.error('Error finding user:', error);
        return null;
      }

      if (!users || users.length === 0) {
        return null;
      }

      const user = users[0];

      // For admin users, check password
      if (role === 'admin') {
        if (!user.password || !password || user.password !== password) {
          return null;
        }
      }

      // Convert database user to app user format
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role as 'admin' | 'member',
        email: user.email || undefined,
        password: user.password || undefined,
        joinDate: user.join_date
      };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }
};