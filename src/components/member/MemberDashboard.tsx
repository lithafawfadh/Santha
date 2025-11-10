import React from 'react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { User, DollarSign, Calendar, AlertCircle, TrendingUp, CreditCard, Edit3, Save, X, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import ShaderBackground from '../common/ShaderBackground';

// MorphingText Component for the welcome message - Optimized
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
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, welcomeTexts]);

  return (
    <span className={`inline-block bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent transition-all duration-500 ${
      isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
    }`}>
      {displayText}
    </span>
  );
});

MorphingWelcomeText.displayName = 'MorphingWelcomeText';

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

  const getCurrentMonthIndex = useCallback(() => new Date().getMonth(), []);

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
      {/* Animated Shader Background */}
      <ShaderBackground />
      
      {/* Header */}
      <header className={`backdrop-blur-xl border-b shadow-2xl relative z-40 ${
        isDarkMode 
          ? 'bg-gray-900/30 border-gray-700/30' 
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left - Branding */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent drop-shadow-lg">
                  <MorphingWelcomeText userName={currentUser?.name || ''} />
                </h1>
              </div>
            </div>
            
            {/* Right - Actions */}
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-lg ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-white" />
                )}
              </button>
              
              {/* User Profile Dropdown Trigger */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-lg relative z-50 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <User className="h-4 w-4 text-white/70" />
                  <span className="text-sm bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent hidden sm:inline">
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
            className={`absolute right-4 top-20 w-72 rounded-xl backdrop-blur-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
              isDarkMode
                ? 'bg-gray-800/90 border-gray-600/50'
                : 'bg-white/10 border-white/20'
            }`}
            style={{ 
              pointerEvents: 'auto',
              zIndex: 10000
            }}
          >
            <div className={`p-4 border-b bg-gradient-to-r from-green-500/20 to-emerald-500/20 ${
              isDarkMode ? 'border-gray-700/50' : 'border-white/20'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs bg-gradient-to-r from-white/70 to-emerald-100/70 bg-clip-text text-transparent truncate">
                    @{currentUser?.username}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              {isEditingUsername ? (
                <div className="space-y-3">
                  <label className="text-xs font-medium bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    Change Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={`w-full px-3 py-2 text-sm backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-white/50 ${
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
                      className={`flex-1 py-2 text-sm rounded-lg backdrop-blur-xl border transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-green-600/50 border-green-500/50 hover:bg-green-600/70'
                          : 'bg-green-500/30 border-green-400/50 hover:bg-green-500/50'
                      } text-white font-medium`}
                    >
                      {isUpdatingUsername ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelUsernameEdit}
                      disabled={isUpdatingUsername}
                      className={`px-3 py-2 rounded-lg backdrop-blur-xl border transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
                          : 'bg-white/20 border-white/30 hover:bg-white/30'
                      }`}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-white/10'
                  }`}
                >
                  <Edit3 className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                  <span className="text-sm bg-gradient-to-r from-white/90 to-emerald-200/90 bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-emerald-200 transition-all">
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
                className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 text-red-100 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 text-sm font-medium"
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
          <div className={`mb-6 p-4 rounded-xl backdrop-blur-xl border shadow-xl relative overflow-hidden ${
            usernameMessage.includes('successfully') 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50'
              : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50'
          }`}>
            <p className={`text-sm font-medium bg-clip-text text-transparent relative z-10 ${
              usernameMessage.includes('successfully') 
                ? 'bg-gradient-to-r from-green-100 to-emerald-200'
                : 'bg-gradient-to-r from-red-100 to-pink-200'
            }`}>
              {usernameMessage}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Months Paid Card */}
          <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl hover:shadow-3xl transition-all duration-500 will-change-transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
              : 'bg-white/10 border-white/20 hover:bg-white/15'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium bg-gradient-to-r from-white/70 to-emerald-200/70 bg-clip-text text-transparent mb-1">
                    Months Paid
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-lg">
                    {stats.paidMonths}/12
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 shadow-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Amount Paid Card */}
          <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl hover:shadow-3xl transition-all duration-500 will-change-transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
              : 'bg-white/10 border-white/20 hover:bg-white/15'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium bg-gradient-to-r from-white/70 to-blue-200/70 bg-clip-text text-transparent mb-1">
                    Amount Paid
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                    LKR {stats.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 shadow-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Group Funds Card */}
          <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl hover:shadow-3xl transition-all duration-500 will-change-transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
              : 'bg-white/10 border-white/20 hover:bg-white/15'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium bg-gradient-to-r from-white/70 to-purple-200/70 bg-clip-text text-transparent mb-1">
                    Group Funds
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
                    LKR {groupStats.totalFunds.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 shadow-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Outstanding Loans Card */}
          <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl hover:shadow-3xl transition-all duration-500 will-change-transform hover:scale-105 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
              : 'bg-white/10 border-white/20 hover:bg-white/15'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium bg-gradient-to-r from-white/70 to-orange-200/70 bg-clip-text text-transparent mb-1">
                    Outstanding Loans
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                    LKR {stats.totalLoanAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 shadow-xl">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status & Loans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status Card */}
          <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden transition-all duration-300 relative ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
              : 'bg-white/10 border-white/20 hover:bg-white/15'
          }`}>
            <div className={`px-6 py-4 border-b bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex justify-between items-center relative z-10 ${
              isDarkMode ? 'border-gray-700/50' : 'border-white/20'
            }`}>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow">
                  Payment Status - {selectedYear}
                </h3>
                <p className="text-sm bg-gradient-to-r from-white/80 to-blue-200/80 bg-clip-text text-transparent drop-shadow">
                  Monthly contribution: LKR {MONTHLY_CONTRIBUTION}
                </p>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={`px-3 py-2 backdrop-blur-xl border rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
                    : 'bg-white/20 border-white/30 hover:bg-white/30'
                }`}
              >
                {availableYears.map(year => (
                  <option key={year} value={year} className="bg-slate-800">{year}</option>
                ))}
              </select>
            </div>
            <div className="p-6 relative z-10">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {months.map((month, index) => {
                  const isPaid = getPaymentStatus(month);
                  const isCurrent = index === currentDate.month && selectedYear === currentDate.year;
                  const isPast = selectedYear < currentDate.year || (selectedYear === currentDate.year && index < currentDate.month);
                  
                  return (
                    <div
                      key={month}
                      className={`p-3 rounded-lg backdrop-blur-sm border text-center transition-all duration-300 will-change-transform hover:scale-105 hover:shadow-lg relative overflow-hidden ${
                        isPaid
                          ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400/50'
                          : isCurrent
                          ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-yellow-400/50'
                          : isPast
                          ? 'bg-gradient-to-br from-red-500/30 to-pink-500/30 border-red-400/50'
                          : isDarkMode
                          ? 'bg-gray-700/30 border-gray-600/30'
                          : 'bg-white/10 border-white/20'
                      }`}
                    >
                      <div className={`text-xs font-medium relative z-10 ${
                        isPaid ? 'bg-gradient-to-r from-green-100 to-emerald-200 bg-clip-text text-transparent' :
                        isCurrent ? 'bg-gradient-to-r from-yellow-100 to-amber-200 bg-clip-text text-transparent' :
                        isPast ? 'bg-gradient-to-r from-red-100 to-pink-200 bg-clip-text text-transparent' :
                        'bg-gradient-to-r from-white/70 to-white/50 bg-clip-text text-transparent'
                      }`}>
                        {month.slice(0, 3)}
                      </div>
                      <div className="mt-1 relative z-10">
                        {isPaid ? (
                          <div className="text-2xl bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text text-transparent">✓</div>
                        ) : isCurrent ? (
                          <div className="text-2xl bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">○</div>
                        ) : isPast ? (
                          <div className="text-2xl bg-gradient-to-r from-red-200 to-pink-300 bg-clip-text text-transparent">✗</div>
                        ) : (<div className="text-2xl bg-gradient-to-r from-white/50 to-white/30 bg-clip-text text-transparent">-</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-white/20'}`}>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-gradient-to-r from-white/80 to-emerald-200/80 bg-clip-text text-transparent">Progress</span>
                  <span className="font-medium bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                    {Math.round((stats.paidMonths / 12) * 100)}%
                  </span>
                </div>
                <div className={`mt-2 rounded-full h-2 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${(stats.paidMonths / 12) * 100}%` }}
                  ></div>
                </div>
              </div>

              {stats.pendingMonths > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/50 rounded-lg backdrop-blur-sm transition-transform duration-300 will-change-transform hover:scale-[1.02] relative overflow-hidden">
                  <div className="flex items-center space-x-2 relative z-10">
                    <AlertCircle className="h-4 w-4 text-orange-200" />
                    <span className="text-sm font-medium bg-gradient-to-r from-orange-100 to-amber-200 bg-clip-text text-transparent">
                      {stats.pendingMonths} payment{stats.pendingMonths > 1 ? 's' : ''} pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* My Loans Card */}
          <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden transition-all duration-300 relative ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
              : 'bg-white/10 border-white/20 hover:bg-white/15'
          }`}>
            <div className={`px-6 py-4 border-b bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm relative z-10 ${
              isDarkMode ? 'border-gray-700/50' : 'border-white/20'
            }`}>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow">
                My Loans
              </h3>
            </div>
            <div className="p-6 relative z-10">
              {myLoans.length > 0 ? (
                <div className="space-y-4">
                  {myLoans.map((loan) => {
                    const outstanding = loan.amount - loan.repaidAmount;
                    const progress = (loan.repaidAmount / loan.amount) * 100;
                    const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
                    
                    return (
                      <div key={loan.id} className={`p-4 rounded-lg backdrop-blur-sm border transition-transform duration-300 will-change-transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden ${
                        loan.status === 'repaid' ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400/50' :
                        isOverdue ? 'bg-gradient-to-br from-red-500/30 to-pink-500/30 border-red-400/50' :
                        'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/50'
                      }`}>
                        <div className="flex justify-between items-start mb-3 relative z-10">
                          <div>
                            <p className="font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                              LKR {loan.amount.toLocaleString()}
                            </p>
                            <p className="text-sm bg-gradient-to-r from-white/80 to-blue-200/80 bg-clip-text text-transparent">
                              Issued: {new Date(loan.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                            loan.status === 'repaid' ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/40' :
                            isOverdue ? 'bg-gradient-to-r from-red-500/40 to-pink-500/40' :
                            'bg-gradient-to-r from-orange-500/40 to-amber-500/40'
                          }`}>
                            <span className={`bg-clip-text text-transparent ${
                              loan.status === 'repaid' ? 'bg-gradient-to-r from-green-100 to-emerald-200' :
                              isOverdue ? 'bg-gradient-to-r from-red-100 to-pink-200' :
                              'bg-gradient-to-r from-orange-100 to-amber-200'
                            }`}>
                              {loan.status === 'repaid' ? 'Repaid' : isOverdue ? 'Overdue' : 'Active'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 relative z-10">
                          <div className="flex justify-between text-sm">
                            <span className="bg-gradient-to-r from-white/80 to-blue-200/80 bg-clip-text text-transparent">Repaid</span>
                            <span className="font-medium bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                              LKR {loan.repaidAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="bg-gradient-to-r from-white/80 to-blue-200/80 bg-clip-text text-transparent">Outstanding</span>
                            <span className="font-medium bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                              LKR {outstanding.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="bg-gradient-to-r from-white/80 to-blue-200/80 bg-clip-text text-transparent">Due Date</span>
                            <span className={`font-medium ${
                              isOverdue 
                                ? 'bg-gradient-to-r from-red-200 to-pink-300 bg-clip-text text-transparent' 
                                : 'bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'
                            }`}>
                              {new Date(loan.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 relative z-10">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="bg-gradient-to-r from-white/70 to-blue-200/70 bg-clip-text text-transparent">Progress</span>
                            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{Math.round(progress)}%</span>
                          </div>
                          <div className={`rounded-full h-1.5 backdrop-blur-sm ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm ${
                                loan.status === 'repaid' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 relative">
                  <div className={`p-4 rounded-full backdrop-blur-sm mx-auto mb-4 w-fit relative overflow-hidden ${
                    isDarkMode ? 'bg-gray-700/30' : 'bg-gradient-to-br from-white/10 to-white/5'
                  }`}>
                    <CreditCard className="h-12 w-12 bg-gradient-to-r from-white/50 to-white/30 bg-clip-text text-transparent relative z-10" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2 relative z-10">
                    No loans
                  </h3>
                  <p className="bg-gradient-to-r from-white/70 to-purple-200/70 bg-clip-text text-transparent relative z-10">
                    You don't have any active or past loans.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Info Card */}
        <div className={`mt-6 rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 relative ${
          isDarkMode
            ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
            : 'bg-white/10 border-white/20 hover:bg-white/15'
        }`}>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-6 drop-shadow flex items-center gap-2 relative z-10">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse" />
            Group Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            <div className={`text-center p-6 rounded-xl backdrop-blur-sm border transition-transform duration-300 will-change-transform hover:scale-105 shadow-lg group relative overflow-hidden ${
              isDarkMode
                ? 'bg-blue-900/30 border-blue-700/40'
                : 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-300/30'
            }`}>
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform relative z-10">
                {groupStats.totalMembers}
              </div>
              <div className="text-sm bg-gradient-to-r from-white/80 to-blue-200/80 bg-clip-text text-transparent mt-2 relative z-10">
                Total Members
              </div>
            </div>
            <div className={`text-center p-6 rounded-xl backdrop-blur-sm border transition-transform duration-300 will-change-transform hover:scale-105 shadow-lg group relative overflow-hidden ${
              isDarkMode
                ? 'bg-green-900/30 border-green-700/40'
                : 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-300/30'
            }`}>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform relative z-10">
                LKR {groupStats.monthlyCollection.toLocaleString()}
              </div>
              <div className="text-sm bg-gradient-to-r from-white/80 to-emerald-200/80 bg-clip-text text-transparent mt-2 relative z-10">
                This Month Collection
              </div>
            </div>
            <div className={`text-center p-6 rounded-xl backdrop-blur-sm border transition-transform duration-300 will-change-transform hover:scale-105 shadow-lg group relative overflow-hidden ${
              isDarkMode
                ? 'bg-purple-900/30 border-purple-700/40'
                : 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-300/30'
            }`}>
              <div className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform relative z-10">
                {groupStats.activeLoans}
              </div>
              <div className="text-sm bg-gradient-to-r from-white/80 to-purple-200/80 bg-clip-text text-transparent mt-2 relative z-10">
                Active Loans
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}