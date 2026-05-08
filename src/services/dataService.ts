import { supabase } from '../lib/supabase';
import { User, Payment, Loan, Donation, MeetingReport, Warning, MemberExit, ActivityLog } from '../types';

// Performance optimization: Simple cache with 30-second duration
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const dataService = {
  // Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    const cacheKey = 'activity_logs';
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 10000) { // Shorter cache for activities
      return cached.data;
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return cached?.data || [];
    }

    const result = data.map((log: any) => ({
      id: log.id,
      actionType: log.action_type,
      description: log.description,
      actorId: log.actor_id,
      createdAt: log.created_at
    }));

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  },

  async logActivity(actionType: string, description: string, actorId: string): Promise<boolean> {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        action_type: actionType,
        description: description,
        actor_id: actorId
      });

    if (error) {
      console.error('Error logging activity:', error);
      return false;
    }

    cache.delete('activity_logs');
    return true;
  },

  async clearActivityLogs(): Promise<boolean> {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error) {
      console.error('Error clearing activity logs:', error);
      return false;
    }

    cache.delete('activity_logs');
    return true;
  },

  // Users
  async getUsers(): Promise<User[]> {
    const cacheKey = 'users';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      return cached?.data || [];
    }

    const result = data.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role as 'admin' | 'member',
      email: user.email || undefined,
      password: user.password || undefined,
      joinDate: user.join_date,
      avatarUrl: user.avatar_url || undefined,
      status: user.status || 'active',
      deactivatedAt: user.deactivated_at || undefined,
      deactivatedBy: user.deactivated_by || undefined,
      deactivationReason: user.deactivation_reason || undefined
    }));
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  },
  // Warnings
async getWarnings(): Promise<Warning[]> {
  const cacheKey = 'warnings';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const { data, error } = await supabase
    .from('warnings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching warnings:', error);
    return cached?.data || [];
  }

  const result = data.map((warning: any) => ({
    id: warning.id,
    memberId: warning.member_id,
    title: warning.title,
    message: warning.message,
    type: warning.type as 'payment' | 'loan' | 'general' | 'urgent',
    createdBy: warning.created_by,
    createdAt: warning.created_at,
    isRead: warning.is_read,
    expiresAt: warning.expires_at || undefined
  }));
  
  cache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
},

async getMemberWarnings(memberId: string): Promise<Warning[]> {
  const { data, error } = await supabase
    .from('warnings')
    .select('*')
    .eq('member_id', memberId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching member warnings:', error);
    return [];
  }

  return data.map((warning: any) => ({
    id: warning.id,
    memberId: warning.member_id,
    title: warning.title,
    message: warning.message,
    type: warning.type as 'payment' | 'loan' | 'general' | 'urgent',
    createdBy: warning.created_by,
    createdAt: warning.created_at,
    isRead: warning.is_read,
    expiresAt: warning.expires_at || undefined
  }));
},

async addWarning(warning: Omit<Warning, 'id' | 'createdAt' | 'isRead'>): Promise<Warning | null> {
  const { data, error } = await supabase
    .from('warnings')
    .insert({
      member_id: warning.memberId,
      title: warning.title,
      message: warning.message,
      type: warning.type,
      created_by: warning.createdBy,
      expires_at: warning.expiresAt || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding warning:', error);
    return null;
  }

  cache.delete('warnings');

  return {
    id: data.id,
    memberId: data.member_id,
    title: data.title,
    message: data.message,
    type: data.type as 'payment' | 'loan' | 'general' | 'urgent',
    createdBy: data.created_by,
    createdAt: data.created_at,
    isRead: data.is_read,
    expiresAt: data.expires_at || undefined
  };
},

async markWarningAsRead(warningId: string): Promise<boolean> {
  const { error } = await supabase
    .from('warnings')
    .update({ is_read: true })
    .eq('id', warningId);

  if (error) {
    console.error('Error marking warning as read:', error);
    return false;
  }

  cache.delete('warnings');
  return true;
},

async deleteWarning(warningId: string): Promise<boolean> {
  const { error } = await supabase
    .from('warnings')
    .delete()
    .eq('id', warningId);

  if (error) {
    console.error('Error deleting warning:', error);
    return false;
  }

  cache.delete('warnings');
  return true;
},

async sendBulkWarnings(memberIds: string[], warning: Omit<Warning, 'id' | 'memberId' | 'createdAt' | 'isRead'>): Promise<boolean> {
  const warnings = memberIds.map(memberId => ({
    member_id: memberId,
    title: warning.title,
    message: warning.message,
    type: warning.type,
    created_by: warning.createdBy,
    expires_at: warning.expiresAt || null
  }));

  const { error } = await supabase
    .from('warnings')
    .insert(warnings);

  if (error) {
    console.error('Error sending bulk warnings:', error);
    return false;
  }

  cache.delete('warnings');
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
        join_date: user.joinDate,
        avatar_url: user.avatarUrl || null,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding user:', error);
      return null;
    }

    cache.delete('users');

    return {
      id: data.id,
      name: data.name,
      username: data.username,
      role: data.role as 'admin' | 'member',
      email: data.email || undefined,
      password: data.password || undefined,
      joinDate: data.join_date,
      avatarUrl: data.avatar_url || undefined,
      status: data.status || 'active'
    };
  },
async updateLoanDueDate(loanId: string, newDueDate: string): Promise<boolean> {
  const { error } = await supabase
    .from('loans')
    .update({
      due_date: newDueDate
    })
    .eq('id', loanId);

  if (error) {
    console.error('Error updating loan due date:', error);
    return false;
  }

  cache.delete('loans');
  return true;
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

    cache.delete('users');
    return true;
  },

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

    cache.delete('users');
    return true;
  },

  async removeUser(memberId: string): Promise<boolean> {
    // This is now just a soft delete wrapper
    return this.deactivateMember(memberId, 'system', 'Member removed');
  },

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

    cache.delete('users');
    cache.delete('payments');
    cache.delete('loans');
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

    cache.delete('users');
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

    cache.delete('users');
    return true;
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    const cacheKey = 'payments';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: true });

    if (error) {
      console.error('Error fetching payments:', error);
      return cached?.data || [];
    }

    const result = data.map((payment: any) => ({
      id: payment.id,
      memberId: payment.member_id,
      month: payment.month,
      year: payment.year,
      amount: payment.amount,
      paid: payment.paid,
      paidDate: payment.paid_date || undefined,
      markedBy: payment.marked_by || undefined
    }));
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
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

    cache.delete('payments');
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

    cache.delete('payments');
    return true;
  },

  // Loans
  async getLoans(): Promise<Loan[]> {
    const cacheKey = 'loans';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loans:', error);
      return cached?.data || [];
    }

    const result = data.map((loan: any) => ({
      id: loan.id,
      memberId: loan.member_id,
      amount: loan.amount,
      issueDate: loan.issue_date,
      dueDate: loan.due_date,
      repaidAmount: loan.repaid_amount,
      status: loan.status as 'active' | 'repaid' | 'overdue',
      issuedBy: loan.issued_by
    }));
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
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

    cache.delete('loans');
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

    cache.delete('loans');
    return true;
  },

  async editLoanRepaidAmount(loanId: string, newRepaidAmount: number): Promise<boolean> {
    const { data: currentLoan, error: fetchError } = await supabase
      .from('loans')
      .select('amount')
      .eq('id', loanId)
      .single();

    if (fetchError) {
      console.error('Error fetching loan:', fetchError);
      return false;
    }

    const isFullyRepaid = newRepaidAmount >= currentLoan.amount;

    const { error } = await supabase
      .from('loans')
      .update({
        repaid_amount: newRepaidAmount,
        status: isFullyRepaid ? 'repaid' : 'active'
      })
      .eq('id', loanId);

    if (error) {
      console.error('Error editing loan repaid amount:', error);
      return false;
    }

    cache.delete('loans');
    return true;
  },

  async deleteLoan(loanId: string): Promise<boolean> {
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', loanId);

    if (error) {
      console.error('Error deleting loan:', error);
      return false;
    }

    cache.delete('loans');
    return true;
  },

  // Donations
  async getDonations(): Promise<Donation[]> {
    const cacheKey = 'donations';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      return cached?.data || [];
    }

    const result = data.map((donation: any) => ({
      id: donation.id,
      amount: donation.amount,
      date: donation.date,
      description: donation.description,
      addedBy: donation.added_by
    }));
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
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

    cache.delete('donations');
    return {
      id: data.id,
      amount: data.amount,
      date: data.date,
      description: data.description,
      addedBy: data.added_by
    };
  },

  // Meeting Reports
  async getMeetingReports(): Promise<MeetingReport[]> {
    const cacheKey = 'meeting_reports';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('meeting_reports')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching meeting reports:', error);
      return cached?.data || [];
    }

    const result = data.map((report: any) => ({
      id: report.id,
      title: report.title,
      date: report.date,
      agenda: report.agenda || [],
      decisions: report.decisions || [],
      attendees: report.attendees || [],
      createdBy: report.created_by,
      createdAt: report.created_at,
      updatedAt: report.updated_at
    }));
    
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  },

  async addMeetingReport(report: Omit<MeetingReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<MeetingReport | null> {
    const { data, error } = await supabase
      .from('meeting_reports')
      .insert({
        title: report.title,
        date: report.date,
        agenda: report.agenda,
        decisions: report.decisions,
        attendees: report.attendees,
        created_by: report.createdBy
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding meeting report:', error);
      return null;
    }

    cache.delete('meeting_reports'); // Invalidate cache
    
    return {
      id: data.id,
      title: data.title,
      date: data.date,
      agenda: data.agenda || [],
      decisions: data.decisions || [],
      attendees: data.attendees || [],
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async updateMeetingReport(reportId: string, updates: Partial<Omit<MeetingReport, 'id' | 'createdBy' | 'createdAt'>>): Promise<boolean> {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.date) updateData.date = updates.date;
    if (updates.agenda) updateData.agenda = updates.agenda;
    if (updates.decisions) updateData.decisions = updates.decisions;
    if (updates.attendees) updateData.attendees = updates.attendees;
    
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('meeting_reports')
      .update(updateData)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating meeting report:', error);
      return false;
    }

    cache.delete('meeting_reports'); // Invalidate cache
    return true;
  },

  async deleteMeetingReport(reportId: string): Promise<boolean> {
    const { error } = await supabase
      .from('meeting_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Error deleting meeting report:', error);
      return false;
    }

    cache.delete('meeting_reports'); // Invalidate cache
    return true;
  },

  // Member Exits
  async getMemberExits(): Promise<MemberExit[]> {
    const cacheKey = 'member_exits';
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const { data, error } = await supabase
      .from('member_exits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching member exits:', error);
      return cached?.data || [];
    }

    const result: MemberExit[] = data.map((row: any) => ({
      id: row.id,
      memberId: row.member_id,
      memberName: row.member_name,
      exitDate: row.exit_date,
      totalPaidMonths: row.total_paid_months,
      refundAmount: row.refund_amount,
      processedBy: row.processed_by,
      notes: row.notes || undefined,
      createdAt: row.created_at,
    }));

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  },

  async recordMemberExit(exit: Omit<MemberExit, 'id' | 'createdAt'>): Promise<MemberExit | null> {
    const { data, error } = await supabase
      .from('member_exits')
      .insert({
        member_id: exit.memberId,
        member_name: exit.memberName,
        exit_date: exit.exitDate,
        total_paid_months: exit.totalPaidMonths,
        refund_amount: exit.refundAmount,
        processed_by: exit.processedBy,
        notes: exit.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording member exit:', error);
      return null;
    }

    cache.delete('member_exits');
    cache.delete('users');

    return {
      id: data.id,
      memberId: data.member_id,
      memberName: data.member_name,
      exitDate: data.exit_date,
      totalPaidMonths: data.total_paid_months,
      refundAmount: data.refund_amount,
      processedBy: data.processed_by,
      notes: data.notes || undefined,
      createdAt: data.created_at,
    };
  },
};