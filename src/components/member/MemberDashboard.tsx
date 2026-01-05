import React from 'react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { User, DollarSign, Calendar, AlertCircle, TrendingUp, CreditCard, Edit3, X, Moon, Sun, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Award, Target, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';
import ShaderBackground from '../common/ShaderBackground';
import WarningBanner from '../common/WarningBanner';

// Professional Status Badge Component
const StatusBadge = React.memo(({ status, text }: { status: 'success' | 'warning' | 'error' | 'info', text: string }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {text}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Professional Metric Card Component
const MetricCard = React.memo(({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  trend, 
  colorScheme = 'blue',
  isDarkMode 
}: { 
  icon: any, 
  label: string, 
  value: string, 
  subValue?: string, 
  trend?: 'up' | 'down' | 'neutral',
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red',
  isDarkMode: boolean 
}) => {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-amber-500',
    red: 'from-red-500 to-rose-500'
  };

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
      isDarkMode 
        ? 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50' 
        : 'bg-white/40 hover:bg-white/60 border border-white/60'
    } backdrop-blur-xl shadow-lg hover:shadow-xl`}>
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[colorScheme]} opacity-60`} />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[colorScheme]} shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-xs font-medium ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              <ArrowUpRight className={`h-3 w-3 ${trend === 'down' ? 'rotate-90' : ''}`} />
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {subValue && (
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

export default function MemberDashboard() {
  const { 
    currentUser, 
    payments, 
    loans, 
    groupStats, 
    logout, 
    loading, 
    updateUsername, 
    isDarkMode, 
    toggleDarkMode,
    memberWarnings,
    markWarningAsRead
  } = useApp();
  
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
  
  const myPayments = useMemo(() => 
    payments.filter(p => p.memberId === currentUser?.id && p.year === selectedYear),
    [payments, currentUser?.id, selectedYear]
  );
  
  const myLoans = useMemo(() => 
    loans.filter(l => l.memberId === currentUser?.id),
    [loans, currentUser?.id]
  );
  
  const stats = useMemo(() => {
    const paidMonths = myPayments.filter(p => p.paid).length;
    const pendingMonths = myPayments.filter(p => !p.paid).length;
    const totalPaid = myPayments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
    const activeLoans = myLoans.filter(l => l.status === 'active');
    const totalLoanAmount = activeLoans.reduce((sum, l) => sum + (l.amount - l.repaidAmount), 0);
    const completionRate = Math.round((paidMonths / 12) * 100);
    
    return {
      paidMonths,
      pendingMonths,
      totalPaid,
      activeLoans,
      totalLoanAmount,
      completionRate
    };
  }, [myPayments, myLoans]);

  const getPaymentStatus = useCallback((month: string) => {
    const payment = myPayments.find(p => p.month === month);
    return payment?.paid || false;
  }, [myPayments]);

  const currentDate = useMemo(() => ({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }), []);

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
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${isDarkMode ? 'border-emerald-400' : 'border-emerald-600'}`}></div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ShaderBackground />
      
      {/* Professional Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/80 border-gray-800/50' 
          : 'bg-white/80 border-gray-200/50'
      } shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Welcome */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-emerald-500/20">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome back, {currentUser?.name}
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  @{currentUser?.username}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } shadow-sm`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  } shadow-sm`}
                >
                  <User className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <svg className={`h-3 w-3 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div ref={dropdownRef} className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" style={{ pointerEvents: 'auto' }} onClick={() => setShowUserMenu(false)} />
          
          <div className={`absolute right-4 top-20 w-80 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`} style={{ pointerEvents: 'auto', zIndex: 10000 }}>
            {/* Profile Section */}
            <div className={`p-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-emerald-500/10">
                  <span className="text-xl font-bold text-white">{currentUser?.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentUser?.name}
                  </p>
                  <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{currentUser?.username}
                  </p>
                  <StatusBadge status="success" text="Member" />
                </div>
              </div>
            </div>

            {/* Edit Username Section */}
            <div className="p-4">
              {isEditingUsername ? (
                <div className="space-y-3">
                  <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Change Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={`w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                    } border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    placeholder="Enter new username"
                    disabled={isUpdatingUsername}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUsernameUpdate}
                      disabled={isUpdatingUsername}
                      className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isUpdatingUsername ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={cancelUsernameEdit}
                      disabled={isUpdatingUsername}
                      className={`px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Edit3 className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Edit Username
                  </span>
                </button>
              )}
            </div>

            {/* Logout */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => { setShowUserMenu(false); logout(); }}
                className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all duration-300 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* Warning Banner */}
        <WarningBanner 
          warnings={memberWarnings}
          onDismiss={markWarningAsRead}
          isDarkMode={isDarkMode}
        />

        {/* Success Message */}
        {usernameMessage && (
          <div className={`mb-6 p-4 rounded-xl ${
            usernameMessage.includes('successfully')
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              : 'bg-red-500/10 border-red-500/20 text-red-600'
          } border`}>
            <p className="text-sm font-medium flex items-center space-x-2">
              {usernameMessage.includes('successfully') ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{usernameMessage}</span>
            </p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Calendar}
            label="Payment Progress"
            value={`${stats.paidMonths}/12`}
            subValue={`${stats.completionRate}% complete`}
            trend={stats.completionRate >= 80 ? 'up' : stats.completionRate >= 50 ? 'neutral' : 'down'}
            colorScheme="green"
            isDarkMode={isDarkMode}
          />
          <MetricCard
            icon={DollarSign}
            label="Total Contributed"
            value={`LKR ${stats.totalPaid.toLocaleString()}`}
            subValue={`LKR ${MONTHLY_CONTRIBUTION * 12} yearly`}
            colorScheme="blue"
            isDarkMode={isDarkMode}
          />
          <MetricCard
            icon={TrendingUp}
            label="Group Funds"
            value={`LKR ${groupStats.totalFunds.toLocaleString()}`}
            subValue="Available for loans"
            colorScheme="purple"
            isDarkMode={isDarkMode}
          />
          <MetricCard
            icon={CreditCard}
            label="My Loans"
            value={`LKR ${stats.totalLoanAmount.toLocaleString()}`}
            subValue={`${stats.activeLoans.length} active`}
            colorScheme={stats.totalLoanAmount > 0 ? 'orange' : 'green'}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Payment Calendar & Loans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Calendar - 2/3 width */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800/40 border border-gray-700/50' 
                : 'bg-white/40 border border-white/60'
            } backdrop-blur-xl shadow-lg`}>
              {/* Header */}
              <div className={`px-6 py-4 flex items-center justify-between border-b ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200/50'
              }`}>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Payment Status
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    LKR {MONTHLY_CONTRIBUTION}/month
                  </p>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-200'
                  } border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500`}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {months.map((month, index) => {
                    const isPaid = getPaymentStatus(month);
                    const isCurrent = index === currentDate.month && selectedYear === currentDate.year;
                    const isPast = selectedYear < currentDate.year || (selectedYear === currentDate.year && index < currentDate.month);
                    
                    return (
                      <div
                        key={month}
                        className={`relative p-4 rounded-xl transition-all duration-300 border-2 ${
                          isPaid
                            ? isDarkMode 
                              ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                            : isCurrent
                            ? isDarkMode
                              ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                            : isPast
                            ? isDarkMode
                              ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                              : 'bg-red-50 border-red-200 hover:bg-red-100'
                            : isDarkMode
                            ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-center">
                          <p className={`text-xs font-semibold mb-2 ${
                            isPaid ? 'text-emerald-600 dark:text-emerald-400' :
                            isCurrent ? 'text-amber-600 dark:text-amber-400' :
                            isPast ? 'text-red-600 dark:text-red-400' :
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {month.slice(0, 3).toUpperCase()}
                          </p>
                          <div className="flex items-center justify-center">
                            {isPaid ? (
                              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            ) : isCurrent ? (
                              <Clock className="h-6 w-6 text-amber-500" />
                            ) : isPast ? (
                              <AlertTriangle className="h-6 w-6 text-red-500" />
                            ) : (
                              <div className={`h-6 w-6 rounded-full border-2 ${
                                isDarkMode ? 'border-gray-600' : 'border-gray-300'
                              }`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Target className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Annual Progress
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      stats.completionRate >= 80 ? 'text-emerald-500' : 
                      stats.completionRate >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className={`w-full h-3 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        stats.completionRate >= 80 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                          : stats.completionRate >= 50 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                          : 'bg-gradient-to-r from-red-500 to-rose-500'
                      }`}
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Alert */}
                {stats.pendingMonths > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {stats.pendingMonths} payment{stats.pendingMonths > 1 ? 's' : ''} pending
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loans Section - 1/3 width */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800/40 border border-gray-700/50' 
                : 'bg-white/40 border border-white/60'
            } backdrop-blur-xl shadow-lg h-full`}>
              <div className={`px-6 py-4 border-b ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200/50'
              }`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Loans
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {myLoans.length} total
                </p>
              </div>
              <div className="p-6">
                {myLoans.length > 0 ? (
                  <div className="space-y-4">
                    {myLoans.map((loan) => {
                      const outstanding = loan.amount - loan.repaidAmount;
                      const progress = (loan.repaidAmount / loan.amount) * 100;
                      const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
                      
                      return (
                        <div
                          key={loan.id}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            loan.status === 'repaid'
                              ? isDarkMode 
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-emerald-50 border-emerald-200'
                              : isOverdue
                              ? isDarkMode
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-red-50 border-red-200'
                              : isDarkMode
                              ? 'bg-blue-500/10 border-blue-500/30'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                LKR {loan.amount.toLocaleString()}
                              </p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(loan.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            <StatusBadge
                              status={
                                loan.status === 'repaid' ? 'success' : 
                                isOverdue ? 'error' : 'warning'
                              }
                              text={
                                loan.status === 'repaid' ? 'Repaid' : 
                                isOverdue ? 'Overdue' : 'Active'
                              }
                            />
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Repaid</span>
                              <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                LKR {loan.repaidAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Outstanding</span>
                              <span className={`font-semibold ${
                                outstanding > 0
                                  ? isDarkMode ? 'text-orange-400' : 'text-orange-600'
                                  : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                              }`}>
                                LKR {outstanding.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Due</span>
                              <span className={`font-semibold ${
                                isOverdue 
                                  ? isDarkMode ? 'text-red-400' : 'text-red-600'
                                  : isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {new Date(loan.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          {/* Progress */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Repayment Progress</span>
                              <span className={`font-bold ${
                                loan.status === 'repaid'
                                  ? 'text-emerald-500'
                                  : isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  loan.status === 'repaid'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <h4 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      No Loans
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      You don't have any active loans
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Group Stats Footer */}
        <div className={`mt-6 rounded-2xl overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-800/40 border border-gray-700/50' 
            : 'bg-white/40 border border-white/60'
        } backdrop-blur-xl shadow-lg`}>
          <div className={`px-6 py-4 border-b ${
            isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200/50'
          }`}>
            <div className="flex items-center space-x-2">
              <Activity className={`h-5 w-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Group Overview
              </h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-3 ${
                  isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <User className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {groupStats.totalMembers}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Members
                </p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-3 ${
                  isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
                }`}>
                  <DollarSign className={`h-6 w-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
                <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  LKR {groupStats.monthlyCollection.toLocaleString()}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Monthly Collection
                </p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-3 ${
                  isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                }`}>
                  <Award className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <p className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {groupStats.activeLoans}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Loans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}