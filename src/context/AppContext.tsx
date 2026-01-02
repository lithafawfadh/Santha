import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Payment, Loan, GroupStats, Donation } from '../types';
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
  login: (username: string, role: 'admin' | 'member', password?: string) => Promise<boolean>;
  logout: () => void;
  updatePayment: (paymentId: string, paid: boolean, markedBy?: string) => Promise<void>;
  addLoan: (loan: Omit<Loan, 'id'>) => Promise<void>;
  updateLoanRepayment: (loanId: string, repaidAmount: number) => Promise<void>;
  addDonation: (donation: Omit<Donation, 'id'>) => Promise<void>;
  addMember: (member: Omit<User, 'id'>) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  deactivateMember: (memberId: string, reason?: string) => Promise<void>;
  reactivateMember: (memberId: string) => Promise<void>;
  permanentlyDeleteMember: (memberId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  updateUsername: (userId: string, newUsername: string) => Promise<boolean>;
  updateAdminProfile: (userId: string, updates: { name?: string; password?: string }) => Promise<boolean>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updateLoanDueDate: (loanId: string, newDueDate: string) => Promise<void>;
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const darkModeKey = currentUser ? `darkMode_${currentUser.id}` : 'darkMode_guest';
  const [isDarkMode, setIsDarkMode] = useLocalStorage(darkModeKey, false);
  
  const [groupStats, setGroupStats] = useState<GroupStats>({
    totalMembers: 0,
    totalFunds: 0,
    monthlyCollection: 0,
    activeLoans: 0,
    totalLoanAmount: 0
  });

  const activeMembers = useMemo(
    () => allUsers.filter(user => user.role === 'member' && user.status === 'active'),
    [allUsers]
  );

  const inactiveMembers = useMemo(
    () => allUsers.filter(user => user.role === 'member' && user.status === 'inactive'),
    [allUsers]
  );

  const calculateGroupStats = () => {
    const members = activeMembers;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const paidPayments = payments.filter(payment => payment.paid);
    const totalFunds = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    
    const activeLoansData = loans.filter(loan => loan.status === 'active');
    const totalLoanAmount = activeLoansData.reduce((sum, loan) => sum - loan.repaidAmount + loan.amount, 0);
    
    const monthlyPayments = payments.filter(payment => 
      payment.year === currentYear && 
      payment.month === new Date().toLocaleString('default', { month: 'long' }) &&
      payment.paid
    );
    
    setGroupStats({
      totalMembers: members.length,
      totalFunds: totalFunds + totalDonations - totalLoanAmount,
      monthlyCollection: monthlyPayments.length * MONTHLY_CONTRIBUTION,
      activeLoans: activeLoansData.length,
      totalLoanAmount
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [usersData, paymentsData, loansData, donationsData] = await Promise.all([
        dataService.getUsers(),
        dataService.getPayments(),
        dataService.getLoans(),
        dataService.getDonations()
      ]);

      setAllUsers(usersData);
      setPayments(paymentsData);
      setLoans(loansData);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    calculateGroupStats();
  }, [payments, loans, donations, allUsers]);

  const login = async (username: string, role: 'admin' | 'member', password?: string): Promise<boolean> => {
    try {
      const user = await authService.loginWithUsername(username, role, password);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updatePayment = async (paymentId: string, paid: boolean, markedBy?: string) => {
    try {
      const success = await dataService.updatePayment(paymentId, paid, markedBy);
      if (success) {
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { 
                ...payment, 
                paid, 
                paidDate: paid ? new Date().toISOString().split('T')[0] : undefined,
                markedBy: paid ? markedBy : undefined
              }
            : payment
        ));
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const addLoan = async (loanData: Omit<Loan, 'id'>) => {
    try {
      const newLoan = await dataService.addLoan(loanData);
      if (newLoan) {
        setLoans(prev => [...prev, newLoan]);
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
      toggleDarkMode
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