import React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { User, DollarSign, Calendar, AlertCircle, TrendingUp, CreditCard, Edit3, Save, X, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import ShaderBackground from '../common/ShaderBackground';

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
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const availableYears = useMemo(() => {
    const years = [...new Set(payments
      .filter(p => p.memberId === currentUser?.id)
      .map(p => p.year)
    )].sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [payments, currentUser?.id]);
  
  const myPayments = payments.filter(p => p.memberId === currentUser?.id && p.year === selectedYear);
  const myLoans = loans.filter(l => l.memberId === currentUser?.id);
  
  const paidMonths = myPayments.filter(p => p.paid).length;
  const pendingMonths = myPayments.filter(p => !p.paid).length;
  const totalPaid = myPayments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
  
  const activeLoans = myLoans.filter(l => l.status === 'active');
  const totalLoanAmount = activeLoans.reduce((sum, l) => sum + (l.amount - l.repaidAmount), 0);

  const getPaymentStatus = (month: string) => {
    const payment = myPayments.find(p => p.month === month);
    return payment?.paid || false;
  };

  const getCurrentMonthIndex = () => new Date().getMonth();

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

  const handleUsernameUpdate = async () => {
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
  };

  const cancelUsernameEdit = () => {
    setIsEditingUsername(false);
    setNewUsername(currentUser?.username || '');
    setUsernameMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Shader Background */}
      <ShaderBackground />
      
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 border-b border-white/20 dark:border-gray-700/30 shadow-2xl relative z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left - Branding */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">Member Portal</h1>
                <p className="text-xs text-white/70 drop-shadow hidden sm:block">Welcome, {currentUser?.name}</p>
              </div>
            </div>
            
            {/* Right - Actions */}
            <div className="flex items-center space-x-2">
              {/* Dark Mode Toggle */}
              <GlassButton
                variant="secondary"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-white" />
                )}
              </GlassButton>
              
              {/* User Profile Dropdown Trigger */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg relative z-50"
                >
                  <User className="h-4 w-4 text-white/70" />
                  <span className="text-sm text-white/90 hidden sm:inline">@{currentUser?.username}</span>
                  <svg className={`h-3 w-3 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown Menu - Positioned outside header */}
      {showUserMenu && (
        <div 
          ref={dropdownRef}
          className="fixed inset-0 z-[9999]"
          style={{ pointerEvents: 'none' }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/10"
            style={{ pointerEvents: 'auto' }}
            onClick={() => setShowUserMenu(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute right-4 top-20 w-72 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ 
              pointerEvents: 'auto',
              zIndex: 10000
            }}
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/20 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
                  <p className="text-xs text-white/70 truncate">@{currentUser?.username}</p>
                </div>
              </div>
            </div>

            {/* Edit Username Section */}
            <div className="p-4">
              {isEditingUsername ? (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-white/80">Change Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 text-sm backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-white/50"
                    placeholder="Enter new username"
                    disabled={isUpdatingUsername}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <GlassButton
                      variant="primary"
                      onClick={handleUsernameUpdate}
                      disabled={isUpdatingUsername}
                      className="flex-1 py-2 text-sm"
                    >
                      {isUpdatingUsername ? 'Saving...' : 'Save'}
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      onClick={cancelUsernameEdit}
                      disabled={isUpdatingUsername}
                      className="px-3 py-2"
                    >
                      <X className="h-4 w-4" />
                    </GlassButton>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <Edit3 className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                  <span className="text-sm text-white/90 group-hover:text-white transition-colors">Edit Username</span>
                </button>
              )}
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/20">
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
          <div className={`mb-6 p-4 rounded-xl backdrop-blur-xl border shadow-xl ${
            usernameMessage.includes('successfully') 
              ? 'text-green-100 bg-green-500/20 border-green-400/50'
              : 'text-red-100 bg-red-500/20 border-red-400/50'
          }`}>
            {usernameMessage}
          </div>
        )}

        {/* Stats Cards - Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Months Paid</p>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{paidMonths}/12</p>
                </div>
                <div className="bg-green-500 bg-opacity-80 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">LKR {totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-blue-500 bg-opacity-80 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Group Funds</p>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">LKR {groupStats.totalFunds.toLocaleString()}</p>
                </div>
                <div className="bg-purple-500 bg-opacity-80 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70 mb-1">Outstanding Loans</p>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">LKR {totalLoanAmount.toLocaleString()}</p>
                </div>
                <div className="bg-orange-500 bg-opacity-80 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>

        {/* Payment Status & Loans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status Card */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
            <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white drop-shadow">Payment Status - {selectedYear}</h3>
                <p className="text-sm text-white/80 drop-shadow">Monthly contribution: LKR {MONTHLY_CONTRIBUTION}</p>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-sm font-medium text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
                  const isCurrent = index === getCurrentMonthIndex() && selectedYear === new Date().getFullYear();
                  const isPast = selectedYear < new Date().getFullYear() || (selectedYear === new Date().getFullYear() && index < getCurrentMonthIndex());
                  
                  return (
                    <div
                      key={month}
                      className={`p-3 rounded-lg backdrop-blur-sm border text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isPaid
                          ? 'bg-green-500/30 border-green-400/50 text-green-100'
                          : isCurrent
                          ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-100'
                          : isPast
                          ? 'bg-red-500/30 border-red-400/50 text-red-100'
                          : 'bg-white/10 border-white/20 text-white/70'
                      }`}
                    >
                      <div className="text-xs font-medium">{month.slice(0, 3)}</div>
                      <div className="mt-1">
                        {isPaid ? (
                          <div className="text-green-200 text-lg">✓</div>
                        ) : isCurrent ? (
                          <div className="text-yellow-200 text-lg">○</div>
                        ) : isPast ? (
                          <div className="text-red-200 text-lg">✗</div>
                        ) : (
                          <div className="text-white/50 text-lg">-</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">Progress</span>
                  <span className="font-medium text-white">{Math.round((paidMonths / 12) * 100)}%</span>
                </div>
                <div className="mt-2 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${(paidMonths / 12) * 100}%` }}
                  ></div>
                </div>
              </div>

              {pendingMonths > 0 && (
                <div className="mt-4 p-3 bg-orange-500/30 border border-orange-400/50 rounded-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-200" />
                    <span className="text-sm font-medium text-orange-100">
                      {pendingMonths} payment{pendingMonths > 1 ? 's' : ''} pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* My Loans Card */}
          <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
            <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white drop-shadow">My Loans</h3>
            </div>
            <div className="p-6">
              {myLoans.length > 0 ? (
                <div className="space-y-4">
                  {myLoans.map((loan) => {
                    const outstanding = loan.amount - loan.repaidAmount;
                    const progress = (loan.repaidAmount / loan.amount) * 100;
                    const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
                    
                    return (
                      <div key={loan.id} className={`p-4 rounded-lg backdrop-blur-sm border transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        loan.status === 'repaid' ? 'bg-green-500/30 border-green-400/50' :
                        isOverdue ? 'bg-red-500/30 border-red-400/50' :
                        'bg-blue-500/30 border-blue-400/50'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-white">LKR {loan.amount.toLocaleString()}</p>
                            <p className="text-sm text-white/80">
                              Issued: {new Date(loan.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
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
                            <span className="font-medium text-white">LKR {loan.repaidAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">Outstanding</span>
                            <span className="font-medium text-white">LKR {outstanding.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">Due Date</span>
                            <span className={`font-medium ${isOverdue ? 'text-red-200' : 'text-white'}`}>
                              {new Date(loan.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="bg-white/20 rounded-full h-1.5 backdrop-blur-sm">
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
                <div className="text-center py-8">
                  <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm mx-auto mb-4 w-fit">
                    <CreditCard className="h-12 w-12 text-white/50" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No loans</h3>
                  <p className="text-white/70">You don't have any active or past loans.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Info Card */}
        <div className="mt-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-6 drop-shadow flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Group Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 transition-transform duration-300 hover:scale-105 shadow-lg group">
              <div className="text-3xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform">{groupStats.totalMembers}</div>
              <div className="text-sm text-white/80 mt-2">Total Members</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-300/30 transition-transform duration-300 hover:scale-105 shadow-lg group">
              <div className="text-2xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform">LKR {groupStats.monthlyCollection.toLocaleString()}</div>
              <div className="text-sm text-white/80 mt-2">This Month Collection</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-500/20 backdrop-blur-sm border border-purple-300/30 transition-transform duration-300 hover:scale-105 shadow-lg group">
              <div className="text-3xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform">{groupStats.activeLoans}</div>
              <div className="text-sm text-white/80 mt-2">Active Loans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}