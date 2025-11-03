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
      color: 'bg-blue-500',
    },
    {
      title: 'Available Group Funds',
      value: `LKR ${groupStats.totalFunds.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'This Month Collection',
      value: `LKR ${groupStats.monthlyCollection.toLocaleString()}`,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Loans',
      value: `${groupStats.activeLoans} (LKR ${groupStats.totalLoanAmount.toLocaleString()})`,
      icon: CreditCard,
      color: 'bg-orange-500',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-10"></div>
      </div>

      {/* Header */}
      <header className="backdrop-blur-lg bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform transition-transform duration-300 hover:rotate-12">
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
                        className="px-3 py-1 text-lg font-semibold backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
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
                      className="px-3 py-1 text-sm backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                      placeholder="New password (optional)"
                      disabled={isUpdatingProfile}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Portal</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {currentUser?.name}</p>
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
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </GlassButton>
              
              {/* Google Sheet Link */}
              <GlassButton
                variant="secondary"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?gid=1433307170#gid=1433307170', '_blank')}
                className="p-2"
                title="Open Google Sheet"
              >
                <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400" />
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
          <GlassCard className={`mb-6 p-4 ${
            profileMessage.includes('successfully')
              ? 'text-green-800 dark:text-green-200 bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 border-green-400 dark:border-green-600'
              : 'text-red-800 dark:text-red-200 bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-red-600 border-red-400 dark:border-red-600'
          } border border-opacity-30 dark:border-opacity-30 backdrop-blur-sm`}>
            {profileMessage}
          </GlassCard>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <GlassCard
                    key={index}
                    variant="gradient"
                    className="p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                      </div>
                      <div className={`${card.color} bg-opacity-80 dark:bg-opacity-60 p-3 rounded-lg transform transition-transform duration-300 hover:scale-110 backdrop-blur-sm shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <GlassCard variant="gradient" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 rounded-lg hover:bg-opacity-30 dark:hover:bg-opacity-30 transition-colors duration-300 backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Monthly collection target achieved</span>
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800 bg-opacity-50 dark:bg-opacity-50 px-2 py-1 rounded-full backdrop-blur-sm">Today</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 rounded-lg hover:bg-opacity-30 dark:hover:bg-opacity-30 transition-colors duration-300 backdrop-blur-sm border border-blue-300 border-opacity-30 dark:border-blue-600 dark:border-opacity-30">
                  <span className="text-sm text-gray-700 dark:text-gray-300">New member added to the group</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 bg-opacity-50 dark:bg-opacity-50 px-2 py-1 rounded-full backdrop-blur-sm">2 days ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 rounded-lg hover:bg-opacity-30 dark:hover:bg-opacity-30 transition-colors duration-300 backdrop-blur-sm border border-orange-300 border-opacity-30 dark:border-orange-600 dark:border-opacity-30">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Loan repayment received</span>
                  <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-800 bg-opacity-50 dark:bg-opacity-50 px-2 py-1 rounded-full backdrop-blur-sm">3 days ago</span>
                </div>
              </div>
            </GlassCard>
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
