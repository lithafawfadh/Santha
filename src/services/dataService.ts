import { supabase } from '../lib/supabase';
import { User, Payment, Loan, Donation } from '../types';

export const dataService = {
  // Users
// Replace the existing getUsers function
async getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data.map(user => ({
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role as 'admin' | 'member',
    email: user.email || undefined,
    password: user.password || undefined,
    joinDate: user.join_date,
    avatarUrl: user.avatar_url || undefined,
    status: user.status || 'active', // Add this
    deactivatedAt: user.deactivated_at || undefined, // Add this
    deactivatedBy: user.deactivated_by || undefined, // Add this
    deactivationReason: user.deactivation_reason || undefined // Add this
  }));
},

// Replace the existing removeUser function with deactivateMember
async deactivateMember(memberId: string, deactivatedBy: string, reason?: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      status: 'inactive',
      deactivated_at: new Date().toISOString(),
      deactivated_by: deactivatedBy,
      deactivation_reason: reason || 'No reason provided'
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error deactivating member:', error);
    return false;
  }

  return true;
},

// Add function to reactivate member
async reactivateMember(memberId: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      status: 'active',
      deactivated_at: null,
      deactivated_by: null,
      deactivation_reason: null
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error reactivating member:', error);
    return false;
  }

  return true;
},

// Keep the old removeUser for permanent deletion (admin use only)
async permanentlyDeleteMember(memberId: string): Promise<boolean> {
  // First delete all related records
  const { error: paymentsError } = await supabase
    .from('payments')
    .delete()
    .eq('member_id', memberId);

  if (paymentsError) {
    console.error('Error deleting payments:', paymentsError);
    return false;
  }

  const { error: loansError } = await supabase
    .from('loans')
    .delete()
    .eq('member_id', memberId);

  if (loansError) {
    console.error('Error deleting loans:', loansError);
    return false;
  }

  // Finally delete the user
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return true;
},

  async addUser(user: Omit<User, 'id'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email || null,
        password: user.password || null,
        join_date: user.joinDate
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding user:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      role: data.role as 'admin' | 'member',
      email: data.email || undefined,
      password: data.password || undefined,
      joinDate: data.join_date
    };
  },

async deactivateMember(memberId: string, deactivatedBy: string, reason?: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      status: 'inactive',
      deactivated_at: new Date().toISOString(),
      deactivated_by: deactivatedBy,
      deactivation_reason: reason || 'No reason provided'
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error deactivating member:', error);
    return false;
  }

  return true;
},

// Add function to reactivate member
async reactivateMember(memberId: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      status: 'active',
      deactivated_at: null,
      deactivated_by: null,
      deactivation_reason: null
    })
    .eq('id', memberId);

  if (error) {
    console.error('Error reactivating member:', error);
    return false;
  }

  return true;
},

  async updateUserUsername(userId: string, newUsername: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ username: newUsername.toLowerCase() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating username:', error);
      return false;
    }

    return true;
  },

  async updateUser(userId: string, updates: { name?: string; password?: string }): Promise<boolean> {
    const updateData: any = {};
    
    if (updates.name) {
      updateData.name = updates.name;
    }
    
    if (updates.password) {
      updateData.password = updates.password;
    }

    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user:', error);
      return false;
    }

    return true;
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: true });

    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }

    return data.map(payment => ({
      id: payment.id,
      memberId: payment.member_id,
      month: payment.month,
      year: payment.year,
      amount: payment.amount,
      paid: payment.paid,
      paidDate: payment.paid_date || undefined,
      markedBy: payment.marked_by || undefined
    }));
  },

  async updatePayment(paymentId: string, paid: boolean, markedBy?: string): Promise<boolean> {
    const { error } = await supabase
      .from('payments')
      .update({
        paid,
        paid_date: paid ? new Date().toISOString().split('T')[0] : null,
        marked_by: paid ? markedBy : null
      })
      .eq('id', paymentId);

    if (error) {
      console.error('Error updating payment:', error);
      return false;
    }

    return true;
  },

  async addPayments(payments: Payment[]): Promise<boolean> {
    const { error } = await supabase
      .from('payments')
      .insert(payments.map(payment => ({
        id: payment.id,
        member_id: payment.memberId,
        month: payment.month,
        year: payment.year,
        amount: payment.amount,
        paid: payment.paid,
        paid_date: payment.paidDate || null,
        marked_by: payment.markedBy || null
      })));

    if (error) {
      console.error('Error adding payments:', error);
      return false;
    }

    return true;
  },

  // Loans
  async getLoans(): Promise<Loan[]> {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loans:', error);
      return [];
    }

    return data.map(loan => ({
      id: loan.id,
      memberId: loan.member_id,
      amount: loan.amount,
      issueDate: loan.issue_date,
      dueDate: loan.due_date,
      repaidAmount: loan.repaid_amount,
      status: loan.status as 'active' | 'repaid' | 'overdue',
      issuedBy: loan.issued_by
    }));
  },

  async addLoan(loan: Omit<Loan, 'id'>): Promise<Loan | null> {
    const loanId = `loan_${Date.now()}`;
    const { data, error } = await supabase
      .from('loans')
      .insert({
        id: loanId,
        member_id: loan.memberId,
        amount: loan.amount,
        issue_date: loan.issueDate,
        due_date: loan.dueDate,
        repaid_amount: loan.repaidAmount,
        status: loan.status,
        issued_by: loan.issuedBy
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding loan:', error);
      return null;
    }

    return {
      id: data.id,
      memberId: data.member_id,
      amount: data.amount,
      issueDate: data.issue_date,
      dueDate: data.due_date,
      repaidAmount: data.repaid_amount,
      status: data.status as 'active' | 'repaid' | 'overdue',
      issuedBy: data.issued_by
    };
  },

  async updateLoanRepayment(loanId: string, additionalRepayment: number): Promise<boolean> {
    // First get the current loan data
    const { data: currentLoan, error: fetchError } = await supabase
      .from('loans')
      .select('amount, repaid_amount')
      .eq('id', loanId)
      .single();

    if (fetchError) {
      console.error('Error fetching loan:', fetchError);
      return false;
    }

    const newRepaidAmount = currentLoan.repaid_amount + additionalRepayment;
    const isFullyRepaid = newRepaidAmount >= currentLoan.amount;

    const { error } = await supabase
      .from('loans')
      .update({
        repaid_amount: newRepaidAmount,
        status: isFullyRepaid ? 'repaid' : 'active'
      })
      .eq('id', loanId);

    if (error) {
      console.error('Error updating loan repayment:', error);
      return false;
    }

    return true;
  },

  // Donations
  async getDonations(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return [];
    }

    return data.map(donation => ({
      id: donation.id,
      amount: donation.amount,
      date: donation.date,
      description: donation.description,
      addedBy: donation.added_by
    }));
  },

  async addDonation(donation: Omit<Donation, 'id'>): Promise<Donation | null> {
    const donationId = `donation_${Date.now()}`;
    const { data, error } = await supabase
      .from('donations')
      .insert({
        id: donationId,
        amount: donation.amount,
        date: donation.date,
        description: donation.description,
        added_by: donation.addedBy
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding donation:', error);
      return null;
    }

    return {
      id: data.id,
      amount: data.amount,
      date: data.date,
      description: data.description,
      addedBy: data.added_by
    };
  }
};