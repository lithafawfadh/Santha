import { useState, useMemo, useEffect } from 'react';
import MeetingReportsManagement from './MeetingReportsManagement';
import { 
  BarChart3, Users, DollarSign, CreditCard, FileText, Settings, Gift, X, 
  FileSpreadsheet, AlertCircle, Award, Bell, Menu, Activity, ChevronRight,
  TrendingUp, Wallet, ArrowUpRight, Search, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import PaymentGrid from './PaymentGrid';
import LoanManagement from './LoanManagement';
import MemberManagement from './MemberManagement';
import Reports from './Reports';
import DonationManagement from './DonationManagement';
import WarningManagement from './WarningManagement';
import ActivityNotifications from './ActivityNotifications';

export default function AdminDashboard() {
  const { groupStats, currentUser, logout, loading, isDarkMode, payments, loans, allUsers, donations, activities } = useApp();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('adminActiveTab') || 'overview';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    sessionStorage.setItem('adminActiveTab', tabId);
    setIsMobileMenuOpen(false);
  };

  const safeActivities = activities || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'loans', label: 'Loans', icon: CreditCard },
    { id: 'donations', label: 'Donations', icon: Gift },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'warnings', label: 'Warnings', icon: Bell },
    { id: 'meetings', label: 'Meetings', icon: FileText },
    { id: 'finances', label: 'Finances', icon: FileSpreadsheet },
  ];

  // Mobile nav (primary 4 items)
  const mobileTabs = tabs.slice(0, 4);
  const moreTabs = tabs.slice(4);

  const analytics = useMemo(() => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const members = allUsers.filter(user => user.role === 'member');
    
    const currentMonthPayments = payments.filter(p => 
      p.month === currentMonth && 
      p.year === currentYear
    );
    const paidCurrentMonth = currentMonthPayments.filter(p => p.paid).length;
    const complianceRate = members.length > 0 ? (paidCurrentMonth / members.length) * 100 : 0;
    
    const unpaidMembers = members.filter(member => {
      const payment = currentMonthPayments.find(p => p.memberId === member.id);
      return !payment?.paid;
    });
    
    const today = new Date();
    const overdueLoans = loans.filter(loan => 
      loan.status === 'active' && 
      new Date(loan.dueDate) < today
    );
    
    const yearPayments = payments.filter(p => p.year === currentYear && p.paid);
    const memberPaymentCount = members.map(member => ({
      member,
      paymentsCount: yearPayments.filter(p => p.memberId === member.id).length,
      totalPaid: yearPayments
        .filter(p => p.memberId === member.id)
        .reduce((sum, p) => sum + p.amount, 0)
    })).sort((a, b) => b.paymentsCount - a.paymentsCount);
    
    const topContributor = memberPaymentCount[0];
    
    const lastMonthName = new Date(currentYear, new Date().getMonth() - 1).toLocaleString('default', { month: 'long' });
    const lastMonthPayments = payments.filter(p => 
      p.month === lastMonthName && 
      p.year === currentYear && 
      p.paid
    );
    const lastMonthCollection = lastMonthPayments.length;
    const trend = paidCurrentMonth - lastMonthCollection;
    
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    
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
      recoveryRate,
      currentMonth,
      paidCurrentMonth,
      totalMembers: members.length
    };
  }, [payments, loans, allUsers, donations]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-gold"></div>
          <p className="text-gray-400 font-sans tracking-widest uppercase text-xs">Aureum Protocol Active...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pro-max-theme min-h-screen flex text-gray-200 font-sans selection:bg-gold/30 selection:text-white ${isDarkMode ? 'dark' : ''}`}>
      <div className="noise-overlay" />

      {/* ─── DESKTOP SIDEBAR: GLASS EDITION ─── */}
      <aside className="hidden lg:flex flex-col w-72 bg-luxury-bg/40 backdrop-blur-luxury border-r border-ghost-border h-screen sticky top-0 left-0 z-50 shadow-2xl">
        <div className="p-10 pt-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-gold to-yellow-100 rounded-2xl flex items-center justify-center shadow-gold-glow">
              <BarChart3 className="text-black w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-white leading-none">Aureum</h1>
              <p className="text-[10px] text-gold-light uppercase tracking-[0.3em] font-bold opacity-80">Digital Ledger</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold px-4 mb-4">Command Center</p>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => handleTabChange(tab.id)} 
                className={`w-full flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gold/10 text-gold-light shadow-ambient border border-gold/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`text-sm font-medium ${isActive ? 'tracking-wide' : ''}`}>{tab.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            )
          })}
        </nav>

        <div className="p-6 border-t border-ghost-border mt-auto bg-luxury-surface/50 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-yellow-200 flex items-center justify-center text-black font-bold text-xs">
              {currentUser?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">Administrator</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-bold border border-red-500/20"
          >
            <Settings className="w-4 h-4" />
            Logout System
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        
        {/* ─── TOP APP BAR (Mobile & Desktop) ─── */}
        <header className="sticky top-0 z-40 w-full h-16 lg:h-20 bg-luxury-bg/80 backdrop-blur-luxury border-b border-ghost-border px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="lg:hidden w-8 h-8 bg-gold rounded-lg flex items-center justify-center shadow-gold-glow">
                <BarChart3 className="text-black w-5 h-5" />
             </div>
             <h2 className="text-lg lg:text-xl font-serif font-bold text-white hidden sm:block">
               {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
             </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search ledger..."
                className="bg-white/5 border border-ghost-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setIsActivityOpen(!isActivityOpen)}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-gold/10 text-gray-400 hover:text-gold transition-all"
            >
              <Activity className="w-5 h-5" />
              {safeActivities.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-luxury-bg animate-pulse"></span>
              )}
            </button>

            {isActivityOpen && (
              <div className="absolute top-full right-6 lg:right-10 mt-2 z-50">
                <ActivityNotifications />
              </div>
            )}
            
            <button className="lg:hidden text-gold p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* ─── MOBILE FULL MENU OVERLAY ─── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-luxury-bg/95 backdrop-blur-xl p-8 pt-24 overflow-y-auto">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-bold mb-8">Navigation Menu</p>
              <div className="grid grid-cols-2 gap-4">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300 border ${
                        activeTab === tab.id 
                          ? 'bg-gold/20 border-gold/40 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="pt-10">
                 <button onClick={logout} className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20">Sign Out</button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-10 pb-32">
          
          {/* ─── OVERVIEW TAB RENDER ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-12 animate-fadeIn">
              
              {/* ─── STRIKING HERO CARD: PRO MAX EDITION ─── */}
              <div className="relative group">
                {/* Dynamic Aura */}
                <div className="absolute -inset-8 bg-emerald/5 blur-[100px] opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/5 blur-[120px] rounded-full opacity-30"></div>

                <div className="relative bento-card glass-panel rounded-[2.5rem] p-10 lg:p-16 border-white/5 overflow-hidden">
                   {/* Background Textures */}
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald/10 to-transparent blur-[120px] -mr-48 -mt-48 opacity-40"></div>
                   <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-gold/10 to-transparent blur-[100px] -ml-32 -mb-32 opacity-20"></div>

                   <div className="relative z-10 space-y-12">
                      <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                           Aureum Ledger <br/> 
                           <span className="text-gold-light opacity-90">Overview Pro</span>
                        </h1>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="space-y-6">
                           <div className="flex flex-col">
                              <p className="hero-number text-7xl lg:text-[10rem] font-serif font-bold tracking-tighter leading-none pb-4 pr-12 overflow-visible">
                                <span className="text-2xl lg:text-4xl text-white/40 font-sans font-bold tracking-normal align-top mr-6">LKR</span>
                                {groupStats.totalFunds.toLocaleString()}
                              </p>
                              <p className="text-xs lg:text-sm uppercase tracking-[0.6em] text-gray-500 font-bold mt-8">Available Group Funds</p>
                           </div>
                        </div>

                        <div className="flex gap-12 lg:gap-20 pt-10 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-16">
                          <div className="space-y-3">
                             <p className="text-[10px] lg:text-xs uppercase tracking-widest text-gray-500 font-bold">Total Members</p>
                             <div className="flex items-baseline gap-3">
                                <p className="text-4xl lg:text-6xl font-serif text-white font-bold">{groupStats.totalMembers}</p>
                                <div className="flex items-center gap-1 text-[10px] text-emerald font-bold uppercase">
                                   <TrendingUp className="w-3 h-3" /> 100%
                                </div>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[10px] lg:text-xs uppercase tracking-widest text-gray-500 font-bold">This Month Collection</p>
                             <div className="flex items-baseline gap-3">
                                <p className="text-4xl lg:text-6xl font-serif text-gold-light font-bold">
                                   <span className="text-xs lg:text-sm text-gray-500 mr-1 font-sans">LKR</span>
                                   {groupStats.monthlyCollection.toLocaleString()}
                                </p>
                                <ArrowUpRight className="w-6 h-6 text-emerald" />
                             </div>
                             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">May 2026</p>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* ─── BENTO METRICS GRID ─── */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Active Loans */}
                <div className="bento-card glass-panel rounded-3xl p-8 flex flex-col justify-between min-h-[220px]">
                   <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                         <CreditCard className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-gold bg-gold/10 px-3 py-1 rounded-full uppercase tracking-widest border border-gold/20">Active</span>
                   </div>
                   <div className="mt-8">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Active Loans</p>
                      <h4 className="text-4xl font-serif font-bold text-white mb-2">{groupStats.activeLoans}</h4>
                      <p className="text-sm font-medium text-gold/70">LKR {groupStats.totalLoanAmount.toLocaleString()} out</p>
                   </div>
                </div>

                {/* Total Donations */}
                <div className="bento-card glass-panel rounded-3xl p-8 flex flex-col justify-between min-h-[220px]">
                   <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald border border-emerald/20">
                         <Gift className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald bg-emerald/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald/20">Charity</span>
                   </div>
                   <div className="mt-8">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Donations</p>
                      <h4 className="text-4xl font-serif font-bold text-white mb-2">
                        <span className="text-lg text-gray-500 font-medium mr-1">LKR</span>
                        {analytics.totalDonations.toLocaleString()}
                      </h4>
                      <p className="text-sm font-medium text-emerald/70">Social impact fund</p>
                   </div>
                </div>

                {/* Operational Health: Circular Gauge Version */}
                <div className="bento-card glass-panel rounded-[2rem] p-8 col-span-1 md:col-span-2 flex flex-col justify-between h-[340px]">
                   <div className="flex justify-between items-start">
                      <h3 className="text-lg font-serif font-bold text-white">Operational Health</h3>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald/10 rounded-full border border-emerald/20">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_#10B981]"></span>
                         <span className="text-[10px] font-bold text-white uppercase tracking-widest">Stable</span>
                      </div>
                   </div>
                   
                   <div className="relative flex items-center justify-center py-4">
                      {/* Circular Gauge */}
                      <svg className="w-48 h-48 transform -rotate-90">
                         <circle
                           cx="96" cy="96" r="80"
                           className="stroke-white/5"
                           strokeWidth="10"
                           fill="transparent"
                         />
                         <circle
                           cx="96" cy="96" r="80"
                           className="stroke-emerald transition-all duration-1000"
                           strokeWidth="10"
                           strokeDasharray={2 * Math.PI * 80}
                           strokeDashoffset={2 * Math.PI * 80 * (1 - analytics.complianceRate / 100)}
                           strokeLinecap="round"
                           fill="transparent"
                           style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' }}
                         />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <p className="text-5xl font-serif font-bold text-white">{Math.round(analytics.complianceRate)}%</p>
                         <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Compliance</p>
                      </div>
                   </div>

                   <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] border-t border-white/5 pt-4">
                      <p>{analytics.currentMonth}</p>
                      <p>{analytics.paidCurrentMonth} / {analytics.totalMembers} Paid</p>
                   </div>
                </div>

                {/* Priority Alerts: Mobile-Style Pending Card */}
                <div className="bento-card glass-panel rounded-[2rem] p-8 col-span-1 md:col-span-2 flex flex-col justify-between h-[340px]">
                   <div className="flex items-center justify-between">
                      <h3 className="text-lg font-serif font-bold text-white">Priority Alerts</h3>
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                         <AlertTriangle className="w-5 h-5" />
                      </div>
                   </div>

                   <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                         <div className="absolute -inset-4 bg-gold/10 blur-2xl rounded-full"></div>
                         <h4 className="relative text-7xl font-serif font-bold text-gold-light leading-none">
                            {analytics.unpaidMembers.length + analytics.overdueLoans.length}
                         </h4>
                      </div>
                      <p className="text-sm lg:text-lg text-gold-light/80 font-bold tracking-wide italic font-serif">
                         Pending Actions Required
                      </p>
                   </div>

                   <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] border-t border-white/5 pt-4">
                      <p>{analytics.currentMonth}</p>
                      <ArrowUpRight className="w-4 h-4" />
                   </div>
                </div>

                {/* Loan Recovery Rate */}
                <div className="bento-card glass-panel rounded-3xl p-8 flex flex-col justify-between min-h-[220px]">
                   <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Recovery Rate</p>
                   <div className="flex items-end gap-2">
                      <h4 className="text-5xl font-serif font-bold text-white">{Math.round(analytics.recoveryRate)}</h4>
                      <span className="text-xl text-gray-500 font-bold mb-1.5">%</span>
                   </div>
                   <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Protocol Target: 100%</p>
                   </div>
                </div>

                {/* Top Contributor */}
                <div className="bento-card glass-panel rounded-3xl p-8 flex flex-col justify-between min-h-[220px]">
                   <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Top Benefactor</p>
                   {analytics.topContributor ? (
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold to-gold/20 flex items-center justify-center text-black shadow-gold-glow">
                           <Award className="w-8 h-8" />
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-lg font-serif font-bold text-white truncate">{analytics.topContributor.member.name}</p>
                           <p className="text-[10px] text-emerald font-bold uppercase tracking-tighter">Elite Status</p>
                        </div>
                     </div>
                   ) : (
                     <p className="text-xs text-gray-500">Calculating data...</p>
                   )}
                   <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Yearly Cycle 2026</p>
                   </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── OTHER TABS CONTENT ─── */}
          {activeTab !== 'overview' && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-emerald/20 rounded-3xl blur opacity-10"></div>
              <div className="relative glass-panel rounded-3xl overflow-hidden min-h-[600px]">
                {activeTab === 'payments' && <PaymentGrid />}
                {activeTab === 'loans' && <LoanManagement />}
                {activeTab === 'donations' && <DonationManagement />}
                {activeTab === 'members' && <MemberManagement />}
                {activeTab === 'reports' && <Reports />}
                {activeTab === 'warnings' && <WarningManagement />}
                {activeTab === 'meetings' && <MeetingReportsManagement />}
                {activeTab === 'finances' && (
                  <div className="h-[75vh] flex flex-col">
                    <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center text-emerald border border-emerald/20">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-white">Global Ledger Sync</h3>
                          <p className="text-xs text-gray-500 font-medium">Immutable Record Management</p>
                        </div>
                      </div>
                      <a 
                        href="https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?rm=minimal" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-emerald/10 hover:bg-emerald text-emerald hover:text-black rounded-xl text-xs font-bold transition-all border border-emerald/20 flex items-center gap-2 shadow-emerald-glow"
                      >
                        External Portal <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex-1 bg-white">
                      <iframe 
                        src="https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?rm=minimal" 
                        className="w-full h-full border-none"
                        title="Finances Database"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-luxury-surface/90 backdrop-blur-luxury border-t border-ghost-border flex items-center justify-around px-4 pb-2 z-50">
          {mobileTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-gold-light' : 'text-gray-500'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-gold/20 shadow-gold-glow' : ''}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
              </button>
            )
          })}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1.5 px-3 py-2 text-gray-500"
          >
            <div className="p-2 rounded-xl">
              <Menu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">More</span>
          </button>
        </nav>

      </main>
    </div>
  );
}