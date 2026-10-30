import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Payment, Loan, GroupStats, Donation, Warning, MemberExit, ActivityLog, BankAccount } from '../types';
import { DEFAULT_BANK_ACCOUNTS } from '../utils/bankingApps';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';
import { MONTHLY_CONTRIBUTION } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  currentUser: User | null;
  payments: Payment[];
  loans: Loan[];
  donations: Donation[];
  allUsers: User[];
  activeMembers: User[];
  inactiveMembers: User[];
  groupStats: GroupStats;
  loading: boolean;
  activities: ActivityLog[];
  login: (username: string, role: 'admin' | 'member', password?: string) => Promise<boolean>;
  logout: () => void;
  updatePayment: (paymentId: string, paid: boolean, markedBy?: string) => Promise<void>;
  addLoan: (loan: Omit<Loan, 'id'>) => Promise<void>;
  updateLoanRepayment: (loanId: string, repaidAmount: number) => Promise<void>;
  editLoanRepaidAmount: (loanId: string, newRepaidAmount: number) => Promise<void>;
  deleteLoan: (loanId: string) => Promise<boolean>;
  addDonation: (donation: Omit<Donation, 'id'>) => Promise<void>;
  addMember: (member: Omit<User, 'id'>) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  deactivateMember: (memberId: string, reason?: string) => Promise<void>;
  reactivateMember: (memberId: string) => Promise<void>;
  permanentlyDeleteMember: (memberId: string) => Promise<void>;
  refreshData: (showGlobalLoading?: boolean) => Promise<void>;
  updateUsername: (userId: string, newUsername: string) => Promise<boolean>;
  updateAdminProfile: (userId: string, updates: { name?: string; password?: string }) => Promise<boolean>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updateLoanDueDate: (loanId: string, newDueDate: string) => Promise<void>;
  warnings: Warning[];
  memberWarnings: Warning[];
  addWarning: (warning: Omit<Warning, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  sendBulkWarnings: (memberIds: string[], warning: Omit<Warning, 'id' | 'memberId' | 'createdAt' | 'isRead'>) => Promise<void>;
  markWarningAsRead: (warningId: string) => Promise<void>;
  deleteWarning: (warningId: string) => Promise<boolean>;
  memberExits: MemberExit[];
  processMemberExit: (memberId: string, extraAmount?: number, notes?: string) => Promise<{ success: boolean; refundAmount: number; error?: string }>;
  clearActivities: () => Promise<void>;
  isOffline: boolean;
  lastSyncedAt: string | null;
  bankAccounts: BankAccount[];
  activeBankAccounts: BankAccount[];
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => Promise<boolean>;
  deleteBankAccount: (id: string) => Promise<boolean>;
  setDefaultBankAccount: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generatePaymentsForMember = (memberId: string, memberJoinDate: string): Payment[] => {
  const payments: Payment[] = [];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const joinDate = new Date(memberJoinDate);
  const currentYear = new Date().getFullYear();
  
  for (let year = joinDate.getFullYear(); year <= currentYear + 1; year++) {
    months.forEach((month, index) => {
      if (year === joinDate.getFullYear() && index < joinDate.getMonth()) {
        return;
      }
      
      payments.push({
        id: `${memberId}_${month}_${year}`,
        memberId,
        month,
        year,
        amount: MONTHLY_CONTRIBUTION,
        paid: false
      });
    });
  }
  
  return payments;
};

interface CachedAppData {
  payments: Payment[];
  loans: Loan[];
  donations: Donation[];
  allUsers: User[];
  warnings: Warning[];
  memberExits: MemberExit[];
  activities: ActivityLog[];
  lastSyncedAt: string;
}

const CACHE_KEY = 'santha_cached_data_v2';

// Automatic legacy cleanup for mobile app WebView
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    window.localStorage.removeItem('santha_cached_data_v1');
  } catch (e) {
    // ignore
  }
}

const getInitialCache = (): CachedAppData => {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate that users in cache are actually user objects with role, not bank accounts
      if (parsed.allUsers && parsed.allUsers.length > 0 && parsed.allUsers[0].role) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse cached app data', e);
  }
  return {
    payments: [],
    loans: [],
    donations: [],
    allUsers: [],
    warnings: [],
    memberExits: [],
    activities: [],
    lastSyncedAt: ''
  };
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('santha_user', null);
  const initialCache = useMemo(() => getInitialCache(), []);
  const [payments, setPayments] = useState<Payment[]>(initialCache.payments || []);
  const [loans, setLoans] = useState<Loan[]>(initialCache.loans || []);
  const [donations, setDonations] = useState<Donation[]>(initialCache.donations || []);
  const [allUsers, setAllUsers] = useState<User[]>(initialCache.allUsers || []);
  const [memberExits, setMemberExits] = useState<MemberExit[]>(initialCache.memberExits || []);
  const [activities, setActivities] = useState<ActivityLog[]>(initialCache.activities || []);
  const hasCachedData = (initialCache.payments && initialCache.payments.length > 0) || (initialCache.allUsers && initialCache.allUsers.length > 0);
  const [loading, setLoading] = useState<boolean>(() => !!currentUser && !hasCachedData);
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(initialCache.lastSyncedAt || null);
  
  const darkModeKey = currentUser ? `darkMode_${currentUser.id}` : 'darkMode_guest';
  const [isDarkMode, setIsDarkMode] = useLocalStorage(darkModeKey, false);
  const [warnings, setWarnings] = useState<Warning[]>(initialCache.warnings || []);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialCache.bankAccounts || DEFAULT_BANK_ACCOUNTS);

  const activeBankAccounts = useMemo(() => {
    const list = bankAccounts.filter(a => a.isActive);
    return list.length > 0 ? list : bankAccounts;
  }, [bankAccounts]);

  
  const [groupStats, setGroupStats] = useState<GroupStats>({
    totalMembers: 0,
    totalFunds: 0,
    monthlyCollection: 0,
    activeLoans: 0,
    totalLoanAmount: 0
  });

  const memberWarnings = useMemo(
    () => warnings.filter(w => w.memberId === currentUser?.id && !w.isRead),
    [warnings, currentUser?.id]
  );

  const activeMembers = useMemo(
    () => allUsers.filter(user => user.role === 'member' && user.status === 'active'),
    [allUsers]
  );

  const inactiveMembers = useMemo(
    () => allUsers.filter(user => user.role === 'member' && user.status === 'inactive'),
    [allUsers]
  );
const updateLoanDueDate = async (loanId: string, newDueDate: string) => {
  try {
    const success = await dataService.updateLoanDueDate(loanId, newDueDate);
    if (success) {
      setLoans(prev => prev.map(loan => 
        loan.id === loanId 
          ? { ...loan, dueDate: newDueDate }
          : loan
      ));
    }
  } catch (error) {
    console.error('Error updating loan due date:', error);
  }
};
  const calculateGroupStats = () => {
    const members = activeMembers;
    const currentYear = new Date().getFullYear();
    
    const paidPayments = payments.filter(payment => payment.paid);
    const totalPaidContributions = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    
    const activeLoansData = loans.filter(loan => loan.status === 'active');
    const totalLoanAmount = activeLoansData.reduce((sum, loan) => sum - loan.repaidAmount + loan.amount, 0);

    // Subtract all refunds issued to exited members
    const totalRefunds = memberExits.reduce((sum, exit) => sum + exit.refundAmount, 0);
    
    const monthlyPayments = payments.filter(payment => 
      payment.year === currentYear && 
      payment.month === new Date().toLocaleString('default', { month: 'long' }) &&
      payment.paid
    );
    
    setGroupStats({
      totalMembers: members.length,
      totalFunds: totalPaidContributions + totalDonations - totalLoanAmount - totalRefunds,
      monthlyCollection: monthlyPayments.length * MONTHLY_CONTRIBUTION,
      activeLoans: activeLoansData.length,
      totalLoanAmount
    });
  };

const refreshData = async (showGlobalLoading: boolean = true) => {
  try {
    if (showGlobalLoading) {
      setLoading(true);
    }
    const [usersData, paymentsData, loansData, donationsData, warningsData, exitsData, activitiesData, bankAccountsData] = await Promise.all([
      dataService.getUsers(),
      dataService.getPayments(),
      dataService.getLoans(),
      dataService.getDonations(),
      dataService.getWarnings(),
      dataService.getMemberExits(),
      dataService.getActivityLogs(),
      dataService.getBankAccounts()
    ]);

    setAllUsers(usersData);
    setPayments(paymentsData);
    setLoans(loansData);
    setDonations(donationsData);
    setWarnings(warningsData);
    setMemberExits(exitsData);
    setActivities(activitiesData);
    if (bankAccountsData && bankAccountsData.length > 0) {
      setBankAccounts(bankAccountsData);
    }

    const now = new Date().toISOString();
    setLastSyncedAt(now);
    setIsOffline(false);

    try {
      const cacheToSave: CachedAppData = {
        payments: paymentsData,
        loans: loansData,
        donations: donationsData,
        allUsers: usersData,
        warnings: warningsData,
        memberExits: exitsData,
        activities: activitiesData,
        lastSyncedAt: now,
        bankAccounts: bankAccountsData || []
      };
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheToSave));
    } catch (cacheErr) {
      console.warn('Could not save data cache to localStorage:', cacheErr);
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
    setIsOffline(true);
  } finally {
    if (showGlobalLoading) {
      setLoading(false);
    }
  }
};

  useEffect(() => {
    if (currentUser) {
      if (!hasCachedData) {
        setLoading(true);
      }
      // Timeout fallback: if loading doesn't resolve in 8s, force it to stop
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 8000);
      refreshData(!hasCachedData).finally(() => clearTimeout(timeout));
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (currentUser) {
        refreshData(false);
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    // 1. Online / Offline listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. App Focus & Visibility Change (triggers instant sync when user reopens/switches to app)
    let lastResumeSync = Date.now();
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && currentUser) {
        // Debounce by 5s to avoid double triggers
        if (Date.now() - lastResumeSync > 5000) {
          lastResumeSync = Date.now();
          refreshData(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    // 3. Gentle Background Heartbeat: sync every 45s only if user is actively viewing the app
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && currentUser && !document.hidden) {
        refreshData(false);
      }
    }, 45000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(syncInterval);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    calculateGroupStats();
  }, [payments, loans, donations, allUsers, memberExits]);

  const login = async (username: string, role: 'admin' | 'member', password?: string): Promise<boolean> => {
    try {
      const user = await authService.loginWithUsername(username, role, password);
      if (user) {
        setCurrentUser(user);
        refreshData(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  const addWarning = async (warningData: Omit<Warning, 'id' | 'createdAt' | 'isRead'>) => {
  try {
    const newWarning = await dataService.addWarning(warningData);
    if (newWarning) {
      setWarnings(prev => [newWarning, ...prev]);
    }
  } catch (error) {
    console.error('Error adding warning:', error);
  }
};

const sendBulkWarnings = async (memberIds: string[], warningData: Omit<Warning, 'id' | 'memberId' | 'createdAt' | 'isRead'>) => {
  try {
    const newWarnings = await dataService.sendBulkWarnings(memberIds, warningData);
    if (newWarnings) {
      setWarnings(prev => [...newWarnings, ...prev]);
    }
  } catch (error) {
    console.error('Error sending bulk warnings:', error);
  }
};

const markWarningAsRead = async (warningId: string) => {
  try {
    const success = await dataService.markWarningAsRead(warningId);
    if (success) {
      setWarnings(prev => prev.map(w => 
        w.id === warningId ? { ...w, isRead: true } : w
      ));
    }
  } catch (error) {
    console.error('Error marking warning as read:', error);
  }
};

  const deleteWarning = async (warningId: string) => {
    try {
      const success = await dataService.deleteWarning(warningId);
      if (success) {
        setWarnings(prev => prev.filter(w => w.id !== warningId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting warning:', error);
      return false;
    }
  };

  const clearActivities = async () => {
    try {
      const success = await dataService.clearActivityLogs();
      if (success) {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error clearing activities:', error);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    // Force clear from localStorage to be safe
    window.localStorage.removeItem('santha_user');
  };

  const processMemberExit = async (
    memberId: string,
    extraAmount: number = 0,
    notes?: string
  ): Promise<{ success: boolean; refundAmount: number; error?: string }> => {
    // Safety: prevent admin from exiting themselves
    if (memberId === currentUser?.id) {
      return { success: false, refundAmount: 0, error: 'Admin cannot exit themselves.' };
    }

    // Check for active loans — hard block
    const activeLoan = loans.find(l => l.memberId === memberId && l.status === 'active');
    if (activeLoan) {
      return { success: false, refundAmount: 0, error: 'Member has an active loan. Loan must be fully repaid before exit.' };
    }

    // Find the member
    const member = allUsers.find(u => u.id === memberId);
    if (!member) {
      return { success: false, refundAmount: 0, error: 'Member not found.' };
    }

    // Calculate total paid contributions (all time, not just current year)
    const memberPaidPayments = payments.filter(p => p.memberId === memberId && p.paid === true);
    const totalPaidMonths = memberPaidPayments.length;
    const baseRefund = totalPaidMonths * MONTHLY_CONTRIBUTION;
    const totalRefund = baseRefund + extraAmount;

    const today = new Date().toISOString().split('T')[0];

    // Build a full notes string that includes the breakdown when extra is given
    let fullNotes = notes || '';
    if (extraAmount > 0) {
      const breakdown =
        `Refund breakdown: LKR ${baseRefund.toLocaleString()} (${totalPaidMonths} months × LKR 300)` +
        ` + LKR ${extraAmount.toLocaleString()} (extra contributions) = LKR ${totalRefund.toLocaleString()} total.`;
      fullNotes = fullNotes ? `${fullNotes} | ${breakdown}` : breakdown;
    }

    // Record the exit in the database first
    const exitRecord = await dataService.recordMemberExit({
      memberId,
      memberName: member.name,
      exitDate: today,
      totalPaidMonths,
      refundAmount: totalRefund,
      processedBy: currentUser?.id || 'admin',
      notes: fullNotes || undefined,
    });

    if (!exitRecord) {
      return { success: false, refundAmount: 0, error: 'Failed to record exit in database. Member has NOT been deactivated.' };
    }

    // Now deactivate the member
    const deactivated = await dataService.deactivateMember(
      memberId,
      currentUser?.id || '',
      `Member exited organization. Refund of LKR ${totalRefund.toLocaleString()} issued on ${today}.`
    );

    if (!deactivated) {
      return { success: false, refundAmount: 0, error: 'Exit recorded but member deactivation failed. Please deactivate manually.' };
    }

    if (currentUser) {
      await dataService.logActivity('MEMBER_EXIT', `${member.name} exited the organization and received a refund of LKR ${totalRefund.toLocaleString()}`, currentUser.id);
    }

    // Update local state
    setMemberExits(prev => [exitRecord, ...prev]);
    setAllUsers(prev => prev.map(user =>
      user.id === memberId
        ? {
            ...user,
            status: 'inactive' as const,
            deactivatedAt: new Date().toISOString(),
            deactivatedBy: currentUser?.id,
            deactivationReason: `Member exited organization. Refund of LKR ${totalRefund.toLocaleString()} issued on ${today}.`
          }
        : user
    ));

    return { success: true, refundAmount: totalRefund };
  };

  const updatePayment = async (paymentId: string, paid: boolean, markedBy?: string) => {
    // 1. Snapshot original state for rollback
    const originalPayments = [...payments];
    const today = new Date().toISOString().split('T')[0];

    // 2. Optimistically update local state immediately
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            paid, 
            paidDate: paid ? today : undefined,
            markedBy: paid ? markedBy : undefined
          }
        : payment
    ));

    try {
      // 3. Perform network call in background
      const success = await dataService.updatePayment(paymentId, paid, markedBy);
      
      if (!success) {
        // Rollback on server failure
        setPayments(originalPayments);
        return;
      }

      // 4. Handle activity log in background (don't await)
      if (currentUser) {
        // Use original snapshot to get metadata (month/year/memberId)
        const paymentInfo = originalPayments.find(p => p.id === paymentId);
        const member = allUsers.find(u => u.id === paymentInfo?.memberId);
        
        if (member && paymentInfo) {
          const status = paid ? 'paid' : 'unpaid';
          dataService.logActivity(
            'PAYMENT_MARKED', 
            `${member.name}'s payment for ${paymentInfo.month} ${paymentInfo.year} marked as ${status}`, 
            currentUser.id
          );
        }
      }
      
      // Note: Removed refreshData(false) as it's redundant with local state updates
      // and dataService now handles cache invalidation correctly.
    } catch (error) {
      console.error('Error updating payment:', error);
      // Rollback on network error
      setPayments(originalPayments);
    }
  };

  const addLoan = async (loanData: Omit<Loan, 'id'>) => {
    try {
      const newLoan = await dataService.addLoan(loanData);
      if (newLoan) {
        setLoans(prev => [...prev, newLoan]);
        if (currentUser) {
          const member = allUsers.find(u => u.id === loanData.memberId);
          if (member) {
            await dataService.logActivity('LOAN_ISSUED', `Issued a new loan of LKR ${loanData.amount.toLocaleString()} to ${member.name}`, currentUser.id);
          }
        }
      }
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  };

  const updateLoanRepayment = async (loanId: string, repaidAmount: number) => {
    try {
      const success = await dataService.updateLoanRepayment(loanId, repaidAmount);
      if (success) {
        setLoans(prev => prev.map(loan => {
          if (loan.id === loanId) {
            const newRepaidAmount = loan.repaidAmount + repaidAmount;
            const isFullyRepaid = newRepaidAmount >= loan.amount;
            return {
              ...loan,
              repaidAmount: newRepaidAmount,
              status: isFullyRepaid ? 'repaid' : 'active'
            };
          }
          return loan;
        }));
      }
    } catch (error) {
      console.error('Error updating loan repayment:', error);
    }
  };

  const editLoanRepaidAmount = async (loanId: string, newRepaidAmount: number) => {
    try {
      const success = await dataService.editLoanRepaidAmount(loanId, newRepaidAmount);
      if (success) {
        setLoans(prev => prev.map(loan => {
          if (loan.id === loanId) {
            const isFullyRepaid = newRepaidAmount >= loan.amount;
            return {
              ...loan,
              repaidAmount: newRepaidAmount,
              status: isFullyRepaid ? 'repaid' : 'active'
            };
          }
          return loan;
        }));
      }
    } catch (error) {
      console.error('Error editing loan repaid amount:', error);
    }
  };

  const deleteLoan = async (loanId: string): Promise<boolean> => {
    try {
      const loanToDelete = loans.find(l => l.id === loanId);
      const success = await dataService.deleteLoan(loanId);
      if (success) {
        setLoans(prev => prev.filter(loan => loan.id !== loanId));
        if (currentUser && loanToDelete) {
          const member = allUsers.find(u => u.id === loanToDelete.memberId);
          if (member) {
            await dataService.logActivity(
              'LOAN_DELETED', 
              `Deleted loan of LKR ${loanToDelete.amount.toLocaleString()} for ${member.name}`, 
              currentUser.id
            );
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting loan:', error);
      return false;
    }
  };

  const addDonation = async (donationData: Omit<Donation, 'id'>) => {
    try {
      const newDonation = await dataService.addDonation(donationData);
      if (newDonation) {
        setDonations(prev => [...prev, newDonation]);
      }
    } catch (error) {
      console.error('Error adding donation:', error);
    }
  };

  const addMember = async (memberData: Omit<User, 'id'>) => {
    try {
      const newMember = await dataService.addUser(memberData);
      if (newMember) {
        setAllUsers(prev => [...prev, newMember]);
        
        const newPayments = generatePaymentsForMember(newMember.id, newMember.joinDate);
        
        const success = await dataService.addPayments(newPayments);
        if (success) {
          setPayments(prev => [...prev, ...newPayments]);
        }
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const removeMember = async (memberId: string) => {
    await deactivateMember(memberId, 'Member removed via removeMember function');
  };

  const deactivateMember = async (memberId: string, reason?: string) => {
    try {
      const success = await dataService.deactivateMember(
        memberId, 
        currentUser?.id || '', 
        reason
      );
      if (success) {
        setAllUsers(prev => prev.map(user => 
          user.id === memberId 
            ? { 
                ...user, 
                status: 'inactive',
                deactivatedAt: new Date().toISOString(),
                deactivatedBy: currentUser?.id,
                deactivationReason: reason || 'No reason provided'
              }
            : user
        ));
        if (currentUser) {
          const member = allUsers.find(u => u.id === memberId);
          if (member) {
            await dataService.logActivity('MEMBER_DEACTIVATED', `Deactivated member ${member.name}`, currentUser.id);
          }
        }
      }
    } catch (error) {
      console.error('Error deactivating member:', error);
    }
  };

  const reactivateMember = async (memberId: string) => {
    try {
      const success = await dataService.reactivateMember(memberId);
      if (success) {
        setAllUsers(prev => prev.map(user => 
          user.id === memberId 
            ? { 
                ...user, 
                status: 'active',
                deactivatedAt: undefined,
                deactivatedBy: undefined,
                deactivationReason: undefined
              }
            : user
        ));
        if (currentUser) {
          const member = allUsers.find(u => u.id === memberId);
          if (member) {
            await dataService.logActivity('MEMBER_REACTIVATED', `Reactivated member ${member.name}`, currentUser.id);
          }
        }
      }
    } catch (error) {
      console.error('Error reactivating member:', error);
    }
  };

  const permanentlyDeleteMember = async (memberId: string) => {
    try {
      const success = await dataService.permanentlyDeleteMember(memberId);
      if (success) {
        setAllUsers(prev => prev.filter(user => user.id !== memberId));
        setPayments(prev => prev.filter(payment => payment.memberId !== memberId));
        setLoans(prev => prev.filter(loan => loan.memberId !== memberId));
      }
    } catch (error) {
      console.error('Error permanently deleting member:', error);
    }
  };

  const updateUsername = async (userId: string, newUsername: string): Promise<boolean> => {
    try {
      const success = await dataService.updateUserUsername(userId, newUsername);
      if (success) {
        if (currentUser?.id === userId) {
          setCurrentUser(prev => prev ? { ...prev, username: newUsername.toLowerCase() } : null);
        }
        setAllUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, username: newUsername.toLowerCase() } : user
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating username:', error);
      return false;
    }
  };

  const updateAdminProfile = async (userId: string, updates: { name?: string; password?: string }): Promise<boolean> => {
    try {
      const success = await dataService.updateUser(userId, updates);
      if (success) {
        if (currentUser?.id === userId) {
          setCurrentUser(prev => prev ? { 
            ...prev, 
            name: updates.name || prev.name,
            password: updates.password || prev.password
          } : null);
        }
        setAllUsers(prev => prev.map(user => 
          user.id === userId ? { 
            ...user, 
            name: updates.name || user.name,
            password: updates.password || user.password
          } : user
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      return false;
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addBankAccount = async (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const created = await dataService.addBankAccount(account);
      setBankAccounts(prev => {
        const updated = account.isPrimary
          ? prev.map(a => ({ ...a, isPrimary: false })).concat(created)
          : prev.concat(created);
        return updated;
      });
      if (currentUser?.id) {
        await dataService.logActivity('bank_account_added', `Admin added bank account: ${account.bankName}`, currentUser.id);
      }
      return true;
    } catch (err) {
      console.error('Error adding bank account:', err);
      return false;
    }
  };

  const updateBankAccount = async (id: string, updates: Partial<BankAccount>): Promise<boolean> => {
    try {
      await dataService.updateBankAccount(id, updates);
      setBankAccounts(prev => prev.map(acc => {
        if (acc.id === id) {
          return { ...acc, ...updates };
        }
        if (updates.isPrimary) {
          return { ...acc, isPrimary: false };
        }
        return acc;
      }));
      if (currentUser?.id) {
        await dataService.logActivity('bank_account_updated', `Admin updated bank account: ${id}`, currentUser.id);
      }
      return true;
    } catch (err) {
      console.error('Error updating bank account:', err);
      return false;
    }
  };

  const deleteBankAccount = async (id: string): Promise<boolean> => {
    try {
      await dataService.deleteBankAccount(id);
      setBankAccounts(prev => prev.filter(acc => acc.id !== id));
      if (currentUser?.id) {
        await dataService.logActivity('bank_account_deleted', `Admin deleted bank account: ${id}`, currentUser.id);
      }
      return true;
    } catch (err) {
      console.error('Error deleting bank account:', err);
      return false;
    }
  };

  const setDefaultBankAccount = async (id: string): Promise<boolean> => {
    return updateBankAccount(id, { isPrimary: true });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      payments,
      loans,
      donations,
      allUsers,
      activeMembers,
      inactiveMembers,
      groupStats,
      loading,
      login,
      logout,
      updatePayment,
      addLoan,
      updateLoanRepayment,
      editLoanRepaidAmount,
      deleteLoan,
      addDonation,
      addMember,
      removeMember,
      deactivateMember,
      reactivateMember,
      permanentlyDeleteMember,
      refreshData,
      updateUsername,
      updateAdminProfile,
      isDarkMode,
      activities,
      updateLoanDueDate,
      warnings,
      memberWarnings,
      addWarning,
      sendBulkWarnings,
      markWarningAsRead,
      deleteWarning,
      toggleDarkMode,
      memberExits,
      processMemberExit,
      clearActivities,
      isOffline,
      lastSyncedAt,
      bankAccounts: bankAccounts || [],
      activeBankAccounts: activeBankAccounts || [],
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      setDefaultBankAccount
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}