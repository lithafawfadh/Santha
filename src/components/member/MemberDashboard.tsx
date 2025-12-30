import React from 'react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { User, DollarSign, Calendar, AlertCircle, TrendingUp, CreditCard, Edit3, Save, X, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import ShaderBackground from '../common/ShaderBackground';

// Optimized MorphingText - Reduced animation frequency
const MorphingWelcomeText = React.memo(({ userName }: { userName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(`Welcome, ${userName}`);
  const [isAnimating, setIsAnimating] = useState(false);

  const welcomeTexts = useMemo(() => [
    `Welcome`,
    `To Our`,
    `F.O.R.T, ${userName}`,
  ], [userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % welcomeTexts.length);
        setDisplayText(welcomeTexts[(currentIndex + 1) % welcomeTexts.length]);
        setIsAnimating(false);
      }, 300);
    }, 4000); // Increased from 3000 to 4000

    return () => clearInterval(interval);
  }, [currentIndex, welcomeTexts]);

  return (
    <span className={`inline-block bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent transition-opacity duration-300 ${
      isAnimating ? 'opacity-0' : 'opacity-100'
    }`}>
      {displayText}
    </span>
  );
});

MorphingWelcomeText.displayName = 'MorphingWelcomeText';

// Optimized StatCard component
const StatCard = React.memo(({ 
  title, 
  value, 
  icon: Icon, 
  gradientFrom, 
  gradientTo,
  isDarkMode 
}: {
  title: string;
  value: string | number;
  icon: any;
  gradientFrom: string;
  gradientTo: string;
  isDarkMode: boolean;
}) => (
  <div className={`relative overflow-hidden rounded-2xl border shadow-lg transition-transform duration-300 hover:scale-105 ${
    isDarkMode
      ? 'bg-gray-800/50 border-gray-600/50'
      : 'bg-white/10 border-white/20'
  }`}>
    <div className="relative p-6 z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/70 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-white">
            {value}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-3 rounded-xl shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

// Optimized MonthCard component
const MonthCard = React.memo(({ 
  month, 
  isPaid, 
  isCurrent, 
  isPast,
  isDarkMode 
}: {
  month: string;
  isPaid: boolean;
  isCurrent: boolean;
  isPast: boolean;
  isDarkMode: boolean;
}) => (
  <div
    className={`p-3 rounded-lg border text-center transition-transform duration-200 hover:scale-105 ${
      isPaid
        ? 'bg-green-500/20 border-green-400/50'
        : isCurrent
        ? 'bg-yellow-500/20 border-yellow-400/50'
        : isPast
        ? 'bg-red-500/20 border-red-400/50'
        : isDarkMode
        ? 'bg-gray-700/30 border-gray-600/30'
        : 'bg-white/10 border-white/20'
    }`}
  >
    <div className={`text-xs font-medium ${
      isPaid ? 'text-green-200' :
      isCurrent ? 'text-yellow-200' :
      isPast ? 'text-red-200' :
      'text-white/70'
    }`}>
      {month.slice(0, 3)}
    </div>
    <div className="mt-1">
      {isPaid ? (
        <div className="text-2xl text-green-200">✓</div>
      ) : isCurrent ? (
        <div className="text-2xl text-yellow-200">○</div>
      ) : isPast ? (
        <div className="text-2xl text-red-200">✗</div>
      ) : (
        <div className="text-2xl text-white/50">-</div>
      )}
    </div>
  </div>
));

MonthCard.displayName = 'MonthCard';

// Optimized LoanCard component
const LoanCard = React.memo(({ 
  loan, 
  isDarkMode 
}: {
  loan: any;
  isDarkMode: boolean;
}) => {
  const outstanding = loan.amount - loan.repaidAmount;
  const progress = (loan.repaidAmount / loan.amount) * 100;
  const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
  
  return (
    <div className={`p-4 rounded-lg border transition-transform duration-200 hover:scale-[1.02] ${
      loan.status === 'repaid' ? 'bg-green-500/20 border-green-400/50' :
      isOverdue ? 'bg-red-500/20 border-red-400/50' :
      'bg-blue-500/20 border-blue-400/50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-white">
            LKR {loan.amount.toLocaleString()}
          </p>
          <p className="text-sm text-white/80">
            Issued: {new Date(loan.issueDate).toLocaleDateString()}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          loan.status === 'repaid' ? 'bg-green-500/40 text-green-100' :
          isOverdue ? 'bg-red-500/40 text-red-100' :
          'bg-orange-500/40 text-orange-100'
        }`}>
          {loan.status === 'repaid' ? 'Repaid' : isOverdue ? 'Overdue' : 'Active'}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/80">Repaid</span>
          <span className="font-medium text-white">
            LKR {loan.repaidAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/80">Outstanding</span>
          <span className="font-medium text-white">
            LKR {outstanding.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/80">Due Date</span>
          <span className={`font-medium ${isOverdue ? 'text-red-200' : 'text-white'}`}>
            {new Date(loan.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/70">Progress</span>
          <span className="text-white">{Math.round(progress)}%</span>
        </div>
        <div className={`rounded-full h-1.5 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              loan.status === 'repaid' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
});

LoanCard.displayName = 'LoanCard';

export default function MemberDashboard() {
  const { currentUser, payments, loans, groupStats, logout, loading, updateUsername, isDarkMode, toggleDarkMode } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const months = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);
  
  const availableYears = useMemo(() => {
    const years = [...new Set(payments
      .filter(p => p.memberId === currentUser?.id)
      .map(p => p.year)
    )].sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [payments, currentUser?.id]);
  
  // Memoize filtered data
  const myPayments = useMemo(() => 
    payments.filter(p => p.memberId === currentUser?.id && p.year === selectedYear),
    [payments, currentUser?.id, selectedYear]
  );
  
  const myLoans = useMemo(() => 
    loans.filter(l => l.memberId === currentUser?.id),
    [loans, currentUser?.id]
  );
  
  // Memoize computed values
  const stats = useMemo(() => {
    const paidMonths = myPayments.filter(p => p.paid).length;
    const pendingMonths = myPayments.filter(p => !p.paid).length;
    const totalPaid = myPayments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
    const activeLoans = myLoans.filter(l => l.status === 'active');
    const totalLoanAmount = activeLoans.reduce((sum, l) => sum + (l.amount - l.repaidAmount), 0);
    
    return {
      paidMonths,
      pendingMonths,
      totalPaid,
      activeLoans,
      totalLoanAmount
    };
  }, [myPayments, myLoans]);

  const getPaymentStatus = useCallback((month: string) => {
    const payment = myPayments.find(p => p.month === month);
    return payment?.paid || false;
  }, [myPayments]);

  // Memoize current date calculations
  const currentDate = useMemo(() => ({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (userMenuRef.current && !userMenuRef.current.contains(target) && 
          dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowUserMenu(false);
        setIsEditingUsername(false);
        setNewUsername(currentUser?.username || '');
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, currentUser?.username]);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (showUserMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUserMenu]);

  const handleUsernameUpdate = useCallback(async () => {
    if (!newUsername.trim() || newUsername.trim() === currentUser?.username) {
      setIsEditingUsername(false);
      setNewUsername(currentUser?.username || '');
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameMessage('');

    try {
      const success = await updateUsername(currentUser?.id || '', newUsername.trim());
      if (success) {
        setUsernameMessage('Username updated successfully!');
        setIsEditingUsername(false);
        setShowUserMenu(false);
        setTimeout(() => setUsernameMessage(''), 3000);
      } else {
        setUsernameMessage('Error: Username already taken or invalid.');
      }
    } catch (error) {
      setUsernameMessage('Error: Failed to update username.');
    } finally {
      setIsUpdatingUsername(false);
    }
  }, [newUsername, currentUser, updateUsername]);

  const cancelUsernameEdit = useCallback(() => {
    setIsEditingUsername(false);
    setNewUsername(currentUser?.username || '');
    setUsernameMessage('');
  }, [currentUser?.username]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${isDarkMode ? 'border-green-400' : 'border-green-600'}`}></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Simplified Background - Only show on desktop */}
      <div className="hidden md:block">
        <ShaderBackground />
      </div>
      
      {/* Solid color background for mobile */}
      <div className={`md:hidden fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`} />
      
      {/* Header */}
      <header className={`border-b shadow-lg relative z-40 ${
        isDarkMode 
          ? 'bg-gray-900/95 border-gray-700/30' 
          : 'bg-white/95 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left - Branding */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  <MorphingWelcomeText userName={currentUser?.name || ''} />
                </h1>
              </div>
            </div>
            
            {/* Right - Actions */}
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl border transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-600/50'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700" />
                )}
              </button>
              
              {/* User Profile Dropdown Trigger */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-600/50'
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <User className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white hidden sm:inline">
                    @{currentUser?.username}
                  </span>
                  <svg className={`h-3 w-3 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      {showUserMenu && (
        <div 
          ref={dropdownRef}
          className="fixed inset-0 z-[9999]"
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="absolute inset-0 bg-black/10"
            style={{ pointerEvents: 'auto' }}
            onClick={() => setShowUserMenu(false)}
          />
          
          <div 
            className={`absolute right-4 top-20 w-72 rounded-xl border shadow-2xl overflow-hidden ${
              isDarkMode
                ? 'bg-gray-800/95 border-gray-600/50'
                : 'bg-white/95 border-white/20'
            }`}
            style={{ 
              pointerEvents: 'auto',
              zIndex: 10000
            }}
          >
            <div className={`p-4 border-b ${
              isDarkMode ? 'bg-green-900/30 border-gray-700/50' : 'bg-green-100 border-white/20'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    @{currentUser?.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              {isEditingUsername ? (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-white/80">
                    Change Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white ${
                      isDarkMode
                        ? 'bg-gray-700/50 border-gray-600/50'
                        : 'bg-white/20 border-white/30'
                    }`}
                    placeholder="Enter new username"
                    disabled={isUpdatingUsername}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUsernameUpdate}
                      disabled={isUpdatingUsername}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-green-600/50 border-green-500/50'
                          : 'bg-green-500/30 border-green-400/50'
                      } text-white font-medium`}
                    >
                      {isUpdatingUsername ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelUsernameEdit}
                      disabled={isUpdatingUsername}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700/50 border-gray-600/50'
                          : 'bg-white/20 border-white/30'
                      }`}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-white/10'
                  }`}
                >
                  <Edit3 className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/90">
                    Edit Username
                  </span>
                </button>
              )}
            </div>

            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-white/20'}`}>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full px-3 py-2 rounded-lg bg-red-500/20 border border-red-400/50 text-red-100 hover:bg-red-500/30 transition-all duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Username Update Message */}
        {usernameMessage && (
          <div className={`mb-6 p-4 rounded-xl border shadow-lg ${
            usernameMessage.includes('successfully') 
              ? 'bg-green-500/20 border-green-400/50'
              : 'bg-red-500/20 border-red-400/50'
          }`}>
            <p className={`text-sm font-medium ${
              usernameMessage.includes('successfully') 
                ? 'text-green-100'
                : 'text-red-100'
            }`}>
              {usernameMessage}
            </p>
          </div>
        )}

        {/* Stats Cards - Using optimized component */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Months Paid"
            value={`${stats.paidMonths}/12`}
            icon={Calendar}
            gradientFrom="from-green-500"
            gradientTo="to-emerald-600"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Amount Paid"
            value={`LKR ${stats.totalPaid.toLocaleString()}`}
            icon={DollarSign}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Available Group Funds"
            value={`LKR ${groupStats.totalFunds.toLocaleString()}`}
            icon={TrendingUp}
            gradientFrom="from-purple-500"
            gradientTo="to-purple-600"
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Outstanding Loans"
            value={`LKR ${stats.totalLoanAmount.toLocaleString()}`}
            icon={CreditCard}
            gradientFrom="from-orange-500"
            gradientTo="to-orange-600"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Payment Status & Loans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status Card */}
          <div className={`rounded-2xl border shadow-lg overflow-hidden ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50'
              : 'bg-white/90 border-white/20'
          }`}>
            <div className={`px-6 py-4 border-b flex justify-between items-center ${
              isDarkMode ? 'bg-blue-900/30 border-gray-700/50' : 'bg-blue-50 border-white/20'
            }`}>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Payment Status - {selectedYear}
                </h3>
                <p className="text-sm text-white/80">
                  Monthly contribution: LKR {MONTHLY_CONTRIBUTION}
                </p>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={`px-3 py-2 border rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDarkMode
                    ? 'bg-gray-700/50 border-gray-600/50'
                    : 'bg-white/20 border-white/30'
                }`}
              >
                {availableYears.map(year => (
                  <option key={year} value={year} className="bg-slate-800">{year}</option>
                ))}
              </select>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {months.map((month, index) => {
                  const isPaid = getPaymentStatus(month);
                  const isCurrent = index === currentDate.month && selectedYear === currentDate.year;
                  const isPast = selectedYear < currentDate.year || (selectedYear === currentDate.year && index < currentDate.month);
                  
                  return (
                    <MonthCard
                      key={month}
                      month={month}
                      isPaid={isPaid}
                      isCurrent={isCurrent}
                      isPast={isPast}
                      isDarkMode={isDarkMode}
                    />
                  );
                })}
              </div>

              <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-white/20'}`}>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">Progress</span>
                  <span className="font-medium text-white">
                    {Math.round((stats.paidMonths / 12) * 100)}%
                  </span>
                </div>
                <div className={`mt-2 rounded-full h-2 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.paidMonths / 12) * 100}%` }}
                  />
                </div>
              </div>

              {stats.pendingMonths > 0 && (
                <div className="mt-4 p-3 bg-orange-500/20 border border-orange-400/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-200" />
                    <span className="text-sm font-medium text-orange-100">
                      {stats.pendingMonths} payment{stats.pendingMonths > 1 ? 's' : ''} pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* My Loans Card */}
          <div className={`rounded-2xl border shadow-lg overflow-hidden ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50'
              : 'bg-white/90 border-white/20'
          }`}>
            <div className={`px-6 py-4 border-b ${
              isDarkMode ? 'bg-purple-900/30 border-gray-700/50' : 'bg-purple-50 border-white/20'
            }`}>
              <h3 className="text-lg font-semibold text-white">
                My Loans
              </h3>
            </div>
            <div className="p-6">
              {myLoans.length > 0 ? (
                <div className="space-y-4">
                  {myLoans.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} isDarkMode={isDarkMode} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${
                    isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                  }`}>
                    <CreditCard className="h-12 w-12 text-white/50" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No loans
                  </h3>
                  <p className="text-white/70">
                    You don't have any active or past loans.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Info Card */}
        <div className={`mt-6 rounded-2xl border shadow-lg p-6 ${
          isDarkMode
            ? 'bg-gray-800/50 border-gray-600/50'
            : 'bg-white/90 border-white/20'
        }`}>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Group Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={`text-center p-6 rounded-xl border transition-transform duration-200 hover:scale-105 ${
              isDarkMode
                ? 'bg-blue-900/30 border-blue-700/40'
                : 'bg-blue-50 border-blue-300/30'
            }`}>
              <div className="text-3xl font-bold text-white">
                {groupStats.totalMembers}
              </div>
              <div className="text-sm text-white/80 mt-2">
                Total Members
              </div>
            </div>
            <div className={`text-center p-6 rounded-xl border transition-transform duration-200 hover:scale-105 ${
              isDarkMode
                ? 'bg-green-900/30 border-green-700/40'
                : 'bg-green-50 border-green-300/30'
            }`}>
              <div className="text-2xl font-bold text-white">
                LKR {groupStats.monthlyCollection.toLocaleString()}
              </div>
              <div className="text-sm text-white/80 mt-2">
                This Month Collection
              </div>
            </div>
            <div className={`text-center p-6 rounded-xl border transition-transform duration-200 hover:scale-105 ${
              isDarkMode
                ? 'bg-purple-900/30 border-purple-700/40'
                : 'bg-purple-50 border-purple-300/30'
            }`}>
              <div className="text-3xl font-bold text-white">
                {groupStats.activeLoans}
              </div>
              <div className="text-sm text-white/80 mt-2">
                Active Loans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 