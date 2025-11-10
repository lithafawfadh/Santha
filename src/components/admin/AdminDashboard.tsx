import React, { useState, useMemo } from 'react';
import { BarChart3, Users, DollarSign, Calendar, CreditCard, FileText, Settings, Gift, Moon, Sun, Edit3, Save, X, FileSpreadsheet, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Award, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import AnimatedNavBar from '../common/AnimatedNavBar';
import PaymentGrid from './PaymentGrid';
import LoanManagement from './LoanManagement';
import MemberManagement from './MemberManagement';
import Reports from './Reports';
import DonationManagement from './DonationManagement';
import ShaderBackground from '../common/ShaderBackground';

export default function AdminDashboard() {
  const { groupStats, currentUser, logout, loading, isDarkMode, toggleDarkMode, updateAdminProfile, payments, loans, allUsers, donations } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    password: ''
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'loans', label: 'Loans', icon: CreditCard },
    { id: 'donations', label: 'Donations', icon: Gift },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  // Calculate advanced analytics
  const analytics = useMemo(() => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const members = allUsers.filter(user => user.role === 'member');
    
    // Payment compliance
    const currentMonthPayments = payments.filter(p => 
      p.month === currentMonth && 
      p.year === currentYear
    );
    const paidCurrentMonth = currentMonthPayments.filter(p => p.paid).length;
    const complianceRate = members.length > 0 ? (paidCurrentMonth / members.length) * 100 : 0;
    
    // Members who haven't paid this month
    const unpaidMembers = members.filter(member => {
      const payment = currentMonthPayments.find(p => p.memberId === member.id);
      return !payment?.paid;
    });
    
    // Overdue loans
    const today = new Date();
    const overdueLoans = loans.filter(loan => 
      loan.status === 'active' && 
      new Date(loan.dueDate) < today
    );
    
    // Top contributors (members with most payments this year)
    const yearPayments = payments.filter(p => p.year === currentYear && p.paid);
    const memberPaymentCount = members.map(member => ({
      member,
      paymentsCount: yearPayments.filter(p => p.memberId === member.id).length,
      totalPaid: yearPayments
        .filter(p => p.memberId === member.id)
        .reduce((sum, p) => sum + p.amount, 0)
    })).sort((a, b) => b.paymentsCount - a.paymentsCount);
    
    const topContributor = memberPaymentCount[0];
    
    // Average payment time (days)
    const paidPaymentsWithDate = payments.filter(p => p.paid && p.paidDate);
    
    // Collection rate trend
    const lastMonthName = new Date(currentYear, new Date().getMonth() - 1).toLocaleString('default', { month: 'long' });
    const lastMonthPayments = payments.filter(p => 
      p.month === lastMonthName && 
      p.year === currentYear && 
      p.paid
    );
    const lastMonthCollection = lastMonthPayments.length;
    const trend = paidCurrentMonth - lastMonthCollection;
    
    // Total donations
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const donationsThisMonth = donations.filter(d => {
      const donationDate = new Date(d.date);
      return donationDate.getMonth() === new Date().getMonth() && 
             donationDate.getFullYear() === currentYear;
    }).reduce((sum, d) => sum + d.amount, 0);
    
    // Loan recovery rate
    const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalRepaid = loans.reduce((sum, l) => sum + l.repaidAmount, 0);
    const recoveryRate = totalLoaned > 0 ? (totalRepaid / totalLoaned) * 100 : 0;
    
    return {
      complianceRate,
      unpaidMembers,
      overdueLoans,
      topContributor,
      trend,
      totalDonations,
      donationsThisMonth,
      recoveryRate,
      currentMonth,
      paidCurrentMonth,
      totalMembers: members.length
    };
  }, [payments, loans, allUsers, donations]);

  const handleProfileUpdate = async () => {
    if (!profileForm.name.trim()) {
      setProfileMessage('Name cannot be empty');
      return;
    }

    setIsUpdatingProfile(true);
    setProfileMessage('');

    const updates: { name?: string; password?: string } = {};
    
    if (profileForm.name.trim() !== currentUser?.name) {
      updates.name = profileForm.name.trim();
    }
    
    if (profileForm.password.trim()) {
      updates.password = profileForm.password.trim();
    }

    if (Object.keys(updates).length === 0) {
      setIsEditingProfile(false);
      setIsUpdatingProfile(false);
      return;
    }

    try {
      const success = await updateAdminProfile(currentUser?.id || '', updates);
      if (success) {
        setProfileMessage('Profile updated successfully!');
        setIsEditingProfile(false);
        setProfileForm({ ...profileForm, password: '' });
        setTimeout(() => setProfileMessage(''), 3000);
      } else {
        setProfileMessage('Error: Failed to update profile.');
      }
    } catch (error) {
      setProfileMessage('Error: Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileForm({
      name: currentUser?.name || '',
      password: ''
    });
    setProfileMessage('');
  };

  const statsCards = [
    {
      title: 'Total Members',
      value: groupStats.totalMembers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Available Group Funds',
      value: `LKR ${groupStats.totalFunds.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-500',
    },
    {
      title: 'This Month Collection',
      value: `LKR ${groupStats.monthlyCollection.toLocaleString()}`,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-500',
    },
    {
      title: 'Active Loans',
      value: `${groupStats.activeLoans} (LKR ${groupStats.totalLoanAmount.toLocaleString()})`,
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center animate-pulse">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Animated Shader Background */}
      <ShaderBackground />

      {/* Header */}
      <header className={`backdrop-blur-xl border-b shadow-2xl relative z-10 ${
        isDarkMode 
          ? 'bg-gray-900/30 border-gray-700/30' 
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform duration-300 hover:rotate-12 shadow-lg">
                <Settings className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <div className="flex-1">
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className={`px-3 py-1 text-lg font-semibold backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 dark:placeholder-gray-400 ${
                          isDarkMode
                            ? 'bg-gray-800/50 border-gray-600/50 text-white'
                            : 'bg-white/20 border-white/30 text-gray-900'
                        }`}
                        placeholder="Enter your name"
                        disabled={isUpdatingProfile}
                      />
                      <GlassButton
                        variant="primary"
                        onClick={handleProfileUpdate}
                        disabled={isUpdatingProfile}
                        className="p-2"
                      >
                        <Save className="h-4 w-4" />
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        onClick={cancelProfileEdit}
                        disabled={isUpdatingProfile}
                        className="p-2"
                      >
                        <X className="h-4 w-4" />
                      </GlassButton>
                    </div>
                    <input
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      className={`px-3 py-1 text-sm backdrop-blur-xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 dark:placeholder-gray-400 ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-600/50 text-white'
                          : 'bg-white/20 border-white/30 text-gray-900'
                      }`}
                      placeholder="New password (optional)"
                      disabled={isUpdatingProfile}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div>
                      <h1 className="text-xl font-semibold text-white drop-shadow-lg">Admin Portal</h1>
                      <p className="text-sm text-white drop-shadow">Welcome, {currentUser?.name}</p>
                    </div>
                    <GlassButton
                      variant="secondary"
                      onClick={() => {
                        setIsEditingProfile(true);
                        setProfileForm({
                          name: currentUser?.name || '',
                          password: ''
                        });
                      }}
                      className="p-2"
                    >
                      <Edit3 className="h-4 w-4" />
                    </GlassButton>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
              
              {/* Google Sheet Link */}
              <GlassButton
                variant="secondary"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?gid=1433307170#gid=1433307170', '_blank')}
                className="p-2"
                title="Open Google Sheet"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-400" />
              </GlassButton>
              
              <GlassButton
                variant="secondary"
                onClick={logout}
                className="px-3 py-2 text-sm font-medium"
              >
                Logout
              </GlassButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Profile Update Message */}
        {profileMessage && (
          <div className={`mb-6 p-4 rounded-xl backdrop-blur-xl border shadow-xl ${
            profileMessage.includes('successfully')
              ? 'text-green-100 bg-green-500/20 border-green-400/50'
              : 'text-red-100 bg-red-500/20 border-red-400/50'
          }`}>
            {profileMessage}
          </div>
        )}

        {/* Animated Navigation Bar */}
        <AnimatedNavBar
          items={tabs}
          activeItem={activeTab}
          onItemSelect={setActiveTab}
          className="mb-6"
        />

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Glass Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white/70 mb-1">{card.title}</p>
                          <p className="text-2xl font-bold text-white drop-shadow-lg">{card.value}</p>
                        </div>
                        <div className={`${card.iconBg} bg-opacity-80 p-3 rounded-xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-xl`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                );
              })}
            </div>

            {/* Quick Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Compliance */}
              <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white drop-shadow flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    Payment Compliance
                  </h3>
                  {analytics.trend > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : analytics.trend < 0 ? (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">{analytics.currentMonth} {new Date().getFullYear()}</span>
                      <span className="font-medium text-white">{analytics.paidCurrentMonth}/{analytics.totalMembers}</span>
                    </div>
                    <div className={`rounded-full h-2 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${analytics.complianceRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-2xl font-bold text-white">{Math.round(analytics.complianceRate)}%</p>
                    <p className="text-xs text-white/60">Compliance Rate</p>
                  </div>
                </div>
              </div>

              {/* Loan Recovery */}
              <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white drop-shadow flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                    Loan Recovery
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Recovery Rate</span>
                      <span className="font-medium text-white">{Math.round(analytics.recoveryRate)}%</span>
                    </div>
                    <div className={`rounded-full h-2 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'}`}>
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                        style={{ width: `${analytics.recoveryRate}%` }}
                      ></div>
                    </div>
                  </div>
                  {analytics.overdueLoans.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <p className="text-sm text-red-300">{analytics.overdueLoans.length} overdue loan{analytics.overdueLoans.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Donations Summary */}
              <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white drop-shadow flex items-center gap-2">
                    <Gift className="h-5 w-5 text-pink-400" />
                    Donations
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white/70 mb-1">Total Donations</p>
                    <p className="text-2xl font-bold text-white">LKR {analytics.totalDonations.toLocaleString()}</p>
                  </div>
                  {analytics.donationsThisMonth > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-sm text-white/70">This Month</p>
                      <p className="text-lg font-semibold text-green-300">LKR {analytics.donationsThisMonth.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Alerts & Top Contributor Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alerts & Actions */}
              <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-4 drop-shadow flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Alerts & Actions Required
                </h3>
                <div className="space-y-3">
                  {analytics.unpaidMembers.length > 0 && (
                    <div className="p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/50 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-100 mb-1">Pending Payments</p>
                          <p className="text-xs text-yellow-200/80">
                            {analytics.unpaidMembers.length} member{analytics.unpaidMembers.length > 1 ? 's have' : ' has'} not paid for {analytics.currentMonth}
                          </p>
                          {analytics.unpaidMembers.length <= 3 && (
                            <div className="mt-2 space-y-1">
                              {analytics.unpaidMembers.map(member => (
                                <p key={member.id} className="text-xs text-yellow-200/70">• {member.name}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {analytics.overdueLoans.length > 0 && (
                    <div className="p-4 bg-red-500/20 rounded-xl border border-red-400/50 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-100 mb-1">Overdue Loans</p>
                          <p className="text-xs text-red-200/80">
                            {analytics.overdueLoans.length} loan{analytics.overdueLoans.length > 1 ? 's are' : ' is'} past due date
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {analytics.unpaidMembers.length === 0 && analytics.overdueLoans.length === 0 && (
                    <div className="p-4 bg-green-500/20 rounded-xl border border-green-400/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-300" />
                        <div>
                          <p className="text-sm font-medium text-green-100">All Clear!</p>
                          <p className="text-xs text-green-200/80">No pending actions required</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Contributor */}
              <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}>
                <h3 className="text-lg font-semibold text-white mb-4 drop-shadow flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Top Contributor {new Date().getFullYear()}
                </h3>
                {analytics.topContributor && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-bold text-white">{analytics.topContributor.member.name}</p>
                        <p className="text-sm text-white/70">@{analytics.topContributor.member.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-sm text-white/70 mb-1">Payments Made</p>
                        <p className="text-2xl font-bold text-white">{analytics.topContributor.paymentsCount}/12</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/70 mb-1">Total Paid</p>
                        <p className="text-lg font-bold text-green-300">LKR {analytics.topContributor.totalPaid.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-2xl backdrop-blur-xl border shadow-2xl p-6 transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-4 drop-shadow flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Quick Stats Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-300/30 backdrop-blur-sm">
                  <p className="text-sm text-white/70 mb-1">Monthly Target</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.paidCurrentMonth}/{analytics.totalMembers}
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    {analytics.totalMembers - analytics.paidCurrentMonth} remaining</p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-300/30 backdrop-blur-sm">
                  <p className="text-sm text-white/70 mb-1">Active Loans Value</p>
                  <p className="text-2xl font-bold text-white">
                    LKR {groupStats.totalLoanAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-300 mt-1">
                    {groupStats.activeLoans} active loan{groupStats.activeLoans !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="p-4 bg-green-500/20 rounded-xl border border-green-300/30 backdrop-blur-sm">
                  <p className="text-sm text-white/70 mb-1">Available Funds</p>
                  <p className="text-2xl font-bold text-white">
                    LKR {groupStats.totalFunds.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-300 mt-1">
                    Ready for disbursement
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'payments' && <PaymentGrid />}
        {activeTab === 'loans' && <LoanManagement />}
        {activeTab === 'donations' && <DonationManagement />}
        {activeTab === 'members' && <MemberManagement />}
        {activeTab === 'reports' && <Reports />}
      </div>
    </div>
  );
}