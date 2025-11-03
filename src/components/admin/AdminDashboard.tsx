import React, { useState } from 'react';
import { BarChart3, Users, DollarSign, Calendar, CreditCard, FileText, Settings, Gift, Moon, Sun, Edit3, Save, X, FileSpreadsheet } from 'lucide-react';
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
  const { groupStats, currentUser, logout, loading, isDarkMode, toggleDarkMode, updateAdminProfile } = useApp();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Shader Background */}
      <ShaderBackground />

      {/* Header */}
      <header className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 border-b border-white/20 dark:border-gray-700/30 shadow-2xl relative z-10">
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
                        className="px-3 py-1 text-lg font-semibold backdrop-blur-xl bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
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
                      className="px-3 py-1 text-sm backdrop-blur-xl bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-600/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                      placeholder="New password (optional)"
                      disabled={isUpdatingProfile}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div>
                      <h1 className="text-xl font-semibold text-white drop-shadow-lg">Admin Portal</h1>
                      <p className="text-sm text-white/80 drop-shadow">Welcome, {currentUser?.name}</p>
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
                    className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/15"
                  >
                    {/* Gradient overlay on hover */}
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

                    {/* Bottom shine effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  </div>
                );
              })}
            </div>

            {/* Recent Activity Card */}
            <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-lg font-semibold text-white mb-4 drop-shadow flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-xl hover:bg-green-500/30 transition-all duration-300 backdrop-blur-sm border border-green-300/30 shadow-lg group">
                  <span className="text-sm text-white/90 group-hover:text-white transition-colors">Monthly collection target achieved</span>
                  <span className="text-xs text-green-300 bg-green-600/40 px-3 py-1 rounded-full backdrop-blur-sm font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-all duration-300 backdrop-blur-sm border border-blue-300/30 shadow-lg group">
                  <span className="text-sm text-white/90 group-hover:text-white transition-colors">New member added to the group</span>
                  <span className="text-xs text-blue-300 bg-blue-600/40 px-3 py-1 rounded-full backdrop-blur-sm font-medium">2 days ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-500/20 rounded-xl hover:bg-orange-500/30 transition-all duration-300 backdrop-blur-sm border border-orange-300/30 shadow-lg group">
                  <span className="text-sm text-white/90 group-hover:text-white transition-colors">Loan repayment received</span>
                  <span className="text-xs text-orange-300 bg-orange-600/40 px-3 py-1 rounded-full backdrop-blur-sm font-medium">3 days ago</span>
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