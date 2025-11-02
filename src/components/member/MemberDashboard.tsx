import React from 'react';
import { useState, useMemo } from 'react';
import { User, DollarSign, Calendar, AlertCircle, TrendingUp, CreditCard, Edit3, Save, X, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';

export default function MemberDashboard() {
  const { currentUser, payments, loans, groupStats, logout, loading, updateUsername, isDarkMode, toggleDarkMode } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>
      
      {/* Header */}
      <header className="backdrop-blur-lg bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Member Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {currentUser?.name}</p>
              </div>
            </div>
            
            {/* Profile Settings */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <GlassButton
                variant="secondary"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600" />
                )}
              </GlassButton>
              
              <GlassCard className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {isEditingUsername ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="px-2 py-2 text-sm backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                        placeholder="Enter new username"
                        disabled={isUpdatingUsername}
                      />
                      <GlassButton
                        variant="primary"
                        onClick={handleUsernameUpdate}
                        disabled={isUpdatingUsername}
                        className="p-1"
                      >
                        <Save className="h-4 w-4" />
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        onClick={cancelUsernameEdit}
                        disabled={isUpdatingUsername}
                        className="p-1"
                      >
                        <X className="h-4 w-4" />
                      </GlassButton>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">@{currentUser?.username}</span>
                      <GlassButton
                        variant="secondary"
                        onClick={() => setIsEditingUsername(true)}
                        className="p-1"
                      >
                        <Edit3 className="h-3 w-3" />
                      </GlassButton>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
            
            <GlassButton
              variant="secondary"
              onClick={logout}
              className="px-3 py-2 text-sm font-medium"
            >
              Logout
            </GlassButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Username Update Message */}
        {usernameMessage && (
          <GlassCard className={`mb-6 p-4 ${
            usernameMessage.includes('successfully') 
              ? 'text-green-800 dark:text-green-200' 
              : 'text-red-800 dark:text-red-200'
          }`}>
            {usernameMessage}
          </GlassCard>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Months Paid</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{paidMonths}/12</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-green-700 dark:text-green-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Paid</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">LKR {totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Group Funds</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">LKR {groupStats.totalFunds.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="gradient" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding Loans</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">LKR {totalLoanAmount.toLocaleString()}</p>
              </div>
              <div className="bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <CreditCard className="h-6 w-6 text-orange-700 dark:text-orange-400" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Payment Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard variant="highlight" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-blue-500 from-opacity-10 to-purple-500 to-opacity-10 dark:from-blue-600 dark:from-opacity-10 dark:to-purple-600 dark:to-opacity-10 backdrop-blur-sm flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Status - {selectedYear}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly contribution: LKR {MONTHLY_CONTRIBUTION}</p>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-opacity-40 dark:hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
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
                      className={`p-3 rounded-lg backdrop-blur-sm border border-opacity-30 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isPaid
                          ? 'bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300'
                          : isCurrent
                          ? 'bg-yellow-500 bg-opacity-20 dark:bg-yellow-600 dark:bg-opacity-20 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300'
                          : isPast
                          ? 'bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300'
                          : 'bg-gray-500 bg-opacity-20 dark:bg-gray-600 dark:bg-opacity-20 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="text-xs font-medium">{month.slice(0, 3)}</div>
                      <div className="mt-1">
                        {isPaid ? (
                          <div className="text-green-700 dark:text-green-400 text-lg">✓</div>
                        ) : isCurrent ? (
                          <div className="text-yellow-700 dark:text-yellow-400 text-lg">○</div>
                        ) : isPast ? (
                          <div className="text-red-700 dark:text-red-400 text-lg">✗</div>
                        ) : (
                          <div className="text-gray-600 dark:text-gray-400 text-lg">-</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.round((paidMonths / 12) * 100)}%</span>
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${(paidMonths / 12) * 100}%` }}
                  ></div>
                </div>
              </div>

              {pendingMonths > 0 && (
                <div className="mt-4 p-3 bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 border border-orange-400 border-opacity-30 dark:border-orange-600 dark:border-opacity-30 rounded-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-700 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      {pendingMonths} payment{pendingMonths > 1 ? 's' : ''} pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* My Loans */}
          <GlassCard variant="highlight" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-purple-500 from-opacity-10 to-pink-500 to-opacity-10 dark:from-purple-600 dark:from-opacity-10 dark:to-pink-600 dark:to-opacity-10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Loans</h3>
            </div>
            <div className="p-6">
              {myLoans.length > 0 ? (
                <div className="space-y-4">
                  {myLoans.map((loan) => {
                    const outstanding = loan.amount - loan.repaidAmount;
                    const progress = (loan.repaidAmount / loan.amount) * 100;
                    const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
                    
                    return (
                      <div key={loan.id} className={`p-4 rounded-lg backdrop-blur-sm border border-opacity-30 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        loan.status === 'repaid' ? 'bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 border-green-400 dark:border-green-600' :
                        isOverdue ? 'bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 border-red-400 dark:border-red-600' :
                        'bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 border-blue-400 dark:border-blue-600'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">LKR {loan.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Issued: {new Date(loan.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                            loan.status === 'repaid' ? 'bg-green-500 bg-opacity-30 text-green-800 dark:text-green-200' :
                            isOverdue ? 'bg-red-500 bg-opacity-30 text-red-800 dark:text-red-200' :
                            'bg-orange-500 bg-opacity-30 text-orange-800 dark:text-orange-200'
                          }`}>
                            {loan.status === 'repaid' ? 'Repaid' : isOverdue ? 'Overdue' : 'Active'}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Repaid</span>
                            <span className="font-medium text-gray-900 dark:text-white">LKR {loan.repaidAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Outstanding</span>
                            <span className="font-medium text-gray-900 dark:text-white">LKR {outstanding.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Due Date</span>
                            <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                              {new Date(loan.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="bg-gray-300 bg-opacity-50 dark:bg-gray-600 dark:bg-opacity-50 rounded-full h-1.5 backdrop-blur-sm">
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
                  <div className="bg-gray-500 bg-opacity-20 dark:bg-gray-600 dark:bg-opacity-20 p-4 rounded-full backdrop-blur-sm mx-auto mb-4 w-fit">
                    <CreditCard className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No loans</h3>
                  <p className="text-gray-500 dark:text-gray-400">You don't have any active or past loans.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Group Info */}
        <GlassCard variant="gradient" className="mt-6 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Group Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center p-5 sm:p-6 rounded-lg bg-blue-500 bg-opacity-10 dark:bg-blue-600 dark:bg-opacity-10 backdrop-blur-sm border border-blue-300 border-opacity-20 dark:border-blue-600 dark:border-opacity-20 transition-transform duration-300 hover:scale-105 touch-manipulation min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">{groupStats.totalMembers}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">Total Members</div>
            </div>
            <div className="text-center p-5 sm:p-6 rounded-lg bg-green-500 bg-opacity-10 dark:bg-green-600 dark:bg-opacity-10 backdrop-blur-sm border border-green-300 border-opacity-20 dark:border-green-600 dark:border-opacity-20 transition-transform duration-300 hover:scale-105 touch-manipulation min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
              <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">LKR {groupStats.monthlyCollection.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">This Month Collection</div>
            </div>
            <div className="text-center p-5 sm:p-6 rounded-lg bg-purple-500 bg-opacity-10 dark:bg-purple-600 dark:bg-opacity-10 backdrop-blur-sm border border-purple-300 border-opacity-20 dark:border-purple-600 dark:border-opacity-20 transition-transform duration-300 hover:scale-105 touch-manipulation min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">{groupStats.activeLoans}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">Active Loans</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
