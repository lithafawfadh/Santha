import { useState, useMemo } from 'react';
import MeetingReportsManagement from './MeetingReportsManagement';
import { BarChart3, Users, DollarSign, CreditCard, FileText, Settings, Gift, X, FileSpreadsheet, AlertCircle, Award, Bell, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import PaymentGrid from './PaymentGrid';
import LoanManagement from './LoanManagement';
import MemberManagement from './MemberManagement';
import Reports from './Reports';
import DonationManagement from './DonationManagement';
import WarningManagement from './WarningManagement';
import ActivityNotifications from './ActivityNotifications';
import { Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { groupStats, currentUser, logout, loading, isDarkMode, payments, loans, allUsers, donations, activities } = useApp();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('adminActiveTab') || 'overview';
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    sessionStorage.setItem('adminActiveTab', tabId);
    setIsMobileMenuOpen(false);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const safeActivities = activities || [];

  // Updated tabs configuration with Warnings (using Bell icon)
const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'loans', label: 'Loans', icon: CreditCard },
  { id: 'donations', label: 'Donations', icon: Gift },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'warnings', label: 'Warnings', icon: Bell },
  { id: 'meetings', label: 'Meeting Reports', icon: FileText },
  { id: 'finances', label: 'Finances DB', icon: FileSpreadsheet },
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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-luxury-bg`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-gold"></div>
          <p className="text-gray-400 font-sans">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex bg-luxury-bg text-gray-200 font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Noise texture overlay for depth */}
      <div className="noise-overlay" />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-luxury-surface border-r border-ghost-border/30 h-screen sticky top-0 left-0 z-20">
        <div className="p-6">
          <h1 className="text-3xl font-serif font-bold text-gold hero-number">Aureum<br/>Ledger</h1>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">{currentUser?.name}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => handleTabChange(tab.id)} 
                className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'nav-item-active bg-gold/10 text-gold shadow-ambient' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-luxury-card-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-ghost-border/30 space-y-2">
          <button 
            onClick={logout} 
            className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-luxury-surface border-b border-ghost-border/30 z-30 flex items-center justify-between px-4">
        <h1 className="text-xl font-serif font-bold text-gold">Aureum Ledger</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsActivityOpen(!isActivityOpen)} className="text-gray-400 hover:text-gold relative p-2 transition-colors">
            <Activity className="w-5 h-5" />
            {safeActivities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-luxury-surface"></span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gold p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Activity Dropdown */}
      {isActivityOpen && (
        <div className="md:hidden fixed top-16 right-4 z-40">
           <ActivityNotifications />
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-luxury-bg pt-16 h-screen overflow-y-auto w-full">
          <nav className="p-4 space-y-2 pb-24">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => handleTabChange(tab.id)} 
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gold/10 text-gold shadow-ambient' 
                      : 'text-gray-400 hover:text-gray-200 active:bg-luxury-card-hover'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium text-lg">{tab.label}</span>
                </button>
              )
            })}
            <div className="pt-4 border-t border-ghost-border/30 space-y-2">
              <button onClick={logout} className="w-full text-left px-4 py-3 text-red-500 font-medium">Logout</button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 min-h-screen overflow-x-hidden relative bg-luxury-bg">
        
        {/* Desktop Notification Bell */}
        <div className="hidden md:block absolute top-6 right-8 z-30">
          <button 
            onClick={() => setIsActivityOpen(!isActivityOpen)} 
            className="text-gray-400 hover:text-gold relative p-2 rounded-full hover:bg-luxury-card-hover transition-colors"
          >
            <Activity className="w-5 h-5" />
            {safeActivities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-luxury-bg"></span>
            )}
          </button>
          
          {isActivityOpen && (
            <div className="absolute right-0 mt-2 z-40">
              <ActivityNotifications />
            </div>
          )}
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          

          {/* Overview Dashboard */}
          {activeTab === 'overview' && (
            <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6">
              
              {/* Portfolio / Group Funds Card */}
              <div className="bento-card col-span-1 md:col-span-2 lg:col-span-3 bg-luxury-card rounded-2xl p-6 md:p-8 hover:bg-luxury-card-hover shadow-ambient flex flex-col justify-between">
                <div>
                  <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Available Group Funds</h2>
                  <p className="hero-number text-5xl md:text-7xl font-serif font-bold text-gold-light mt-4 tracking-tight">
                    <span className="text-2xl md:text-4xl text-gold/60 align-top mr-2 leading-tight">LKR</span>
                    {groupStats.totalFunds.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-10 md:mt-12 pt-6 border-t border-ghost-border/30">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">Total Members</p>
                    <p className="stat-number text-2xl font-serif font-medium text-gray-200 mt-2">{groupStats.totalMembers}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">This Month Collection</p>
                    <p className="stat-number text-2xl font-serif font-medium text-luxury-emerald mt-2">LKR {groupStats.monthlyCollection.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Smaller Stat Cards Column */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-4 md:gap-6">
                <div className="bento-card bg-luxury-card rounded-2xl p-6 flex-1 hover:bg-luxury-card-hover shadow-ambient">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400">Active Loans</h3>
                  <p className="stat-number text-4xl font-serif font-bold text-gold-light mt-3">{groupStats.activeLoans}</p>
                  <p className="stat-number text-md text-luxury-emerald mt-2 font-medium">LKR {groupStats.totalLoanAmount.toLocaleString()}</p>
                </div>
                <div className="bento-card bg-luxury-card rounded-2xl p-6 flex-1 hover:bg-luxury-card-hover shadow-ambient">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400">Total Donations</h3>
                  <p className="stat-number text-3xl font-serif font-bold text-gold-light mt-3">LKR <br/> {analytics.totalDonations.toLocaleString()}</p>
                </div>
              </div>

              {/* Operational Health (Payment Compliance) */}
              <div className="bento-card col-span-1 md:col-span-2 bg-luxury-card rounded-2xl p-6 hover:bg-luxury-card-hover shadow-ambient">
                <h3 className="text-2xl font-serif font-bold text-gray-200">Operational Health</h3>
                <div className="mt-8 flex justify-between items-end mb-3">
                  <p className="text-xs uppercase tracking-widest text-luxury-emerald">Payment Compliance</p>
                  <p className="stat-number text-xl font-serif font-bold text-luxury-emerald">{Math.round(analytics.complianceRate)}%</p>
                </div>
                <div className="h-2 w-full bg-luxury-surface rounded-full overflow-hidden">
                  <div 
                    className="compliance-bar h-full bg-luxury-emerald rounded-full" 
                    style={{ width: `${analytics.complianceRate}%` }}
                  />
                </div>
                <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
                  <p className="uppercase tracking-widest">{analytics.currentMonth}</p>
                  <p>{analytics.paidCurrentMonth} / {analytics.totalMembers} Paid</p>
                </div>
              </div>

              {/* Priority Alerts */}
              <div className="bento-card col-span-1 md:col-span-2 bg-luxury-card rounded-2xl p-6 hover:bg-luxury-card-hover shadow-ambient flex flex-col">
                <h3 className="text-2xl font-serif font-bold text-gray-200 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-gold award-icon" />
                  Priority Alerts
                </h3>
                <div className="mt-6 flex-1 space-y-3">
                  {analytics.overdueLoans.length > 0 && (
                    <div className="alert-card-danger bg-red-900/20 p-4 rounded-xl border-l-2 border-red-500 cursor-default">
                      <p className="text-sm text-red-400 font-medium">{analytics.overdueLoans.length} Overdue Loan(s)</p>
                    </div>
                  )}
                  {analytics.unpaidMembers.length > 0 && (
                    <div className="alert-card bg-gold/10 p-4 rounded-xl border-l-2 border-gold flex justify-between items-center cursor-default">
                      <p className="text-sm text-gold-light font-medium">{analytics.unpaidMembers.length} Pending Payments</p>
                      <p className="text-xs text-gold/70 uppercase tracking-widest">{analytics.currentMonth}</p>
                    </div>
                  )}
                  {analytics.overdueLoans.length === 0 && analytics.unpaidMembers.length === 0 && (
                    <div className="bg-luxury-emerald/10 p-4 rounded-xl border-l-2 border-luxury-emerald">
                      <p className="text-sm text-luxury-emerald font-medium tracking-wide">All systems green. No active alerts.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Loan Recovery Rate */}
              <div className="bento-card col-span-1 md:col-span-2 bg-luxury-card rounded-2xl p-6 md:p-8 hover:bg-luxury-card-hover shadow-ambient">
                <h3 className="text-xs uppercase tracking-widest text-gray-400">Loan Recovery Rate</h3>
                <p className="hero-number text-6xl font-serif font-bold text-gray-200 mt-6">{Math.round(analytics.recoveryRate)}<span className="text-3xl text-gray-500">%</span></p>
                <div className="mt-8 flex justify-between text-xs text-gray-400 font-medium">
                  <p className="uppercase tracking-widest text-gold">Target: 100%</p>
                </div>
              </div>

              {/* Top Contributor */}
              <div className="bento-card col-span-1 md:col-span-2 bg-luxury-card rounded-2xl p-6 md:p-8 hover:bg-luxury-card-hover shadow-ambient">
                <h3 className="text-xs uppercase tracking-widest text-gray-400">Top Contributor</h3>
                {analytics.topContributor ? (
                  <div className="mt-6 flex items-center gap-5">
                    <div className="award-badge w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30">
                      <Award className="award-icon w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <p className="stat-number text-2xl font-serif font-bold text-gray-200 mb-1">{analytics.topContributor.member.name}</p>
                      <p className="stat-number text-sm font-medium text-luxury-emerald">LKR {analytics.topContributor.totalPaid.toLocaleString()} contributed</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-gray-400">No data available for this year.</p>
                )}
              </div>
            </div>
          )}

          {/* Other Tabs Rendering block */}
          <div className="rounded-2xl overflow-hidden bg-luxury-surface ring-1 ring-ghost-border/30">
            {activeTab === 'payments' && <PaymentGrid />}
            {activeTab === 'loans' && <LoanManagement />}
            {activeTab === 'donations' && <DonationManagement />}
            {activeTab === 'members' && <MemberManagement />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'warnings' && <WarningManagement />}
            {activeTab === 'meetings' && <MeetingReportsManagement />}
            {activeTab === 'finances' && (
              <div className="h-[80vh] flex flex-col bg-luxury-surface">
                <div className="p-4 bg-luxury-card flex justify-between items-center border-b border-ghost-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-emerald/10 rounded-xl flex items-center justify-center border border-luxury-emerald/20">
                      <FileSpreadsheet className="w-5 h-5 text-luxury-emerald" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gray-200">Finances Database</h3>
                      <p className="text-xs text-gray-400">Live Google Sheets Sync</p>
                    </div>
                  </div>
                  <a 
                    href="https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?gid=1433307170#gid=1433307170" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-luxury-emerald/10 hover:bg-luxury-emerald/20 text-luxury-emerald rounded-lg text-xs font-bold transition-all border border-luxury-emerald/20 flex items-center gap-2"
                  >
                    Open Full Sheet <FileSpreadsheet className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex-1 bg-white relative">
                  <iframe 
                    src="https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?rm=minimal" 
                    className="absolute inset-0 w-full h-full border-none"
                    title="Finances Database"
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}