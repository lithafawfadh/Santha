import { useState, useMemo } from 'react';
import MeetingReportsManagement from './MeetingReportsManagement';
import {
  BarChart3, Users, DollarSign, CreditCard, FileText, Settings, Gift, X,
  FileSpreadsheet, AlertCircle, Award, Bell, Menu, Activity, ChevronRight,
  TrendingUp, Wallet, ArrowUpRight, Search, AlertTriangle, LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import OverviewDashboard from './OverviewDashboard';
import PaymentGrid from './PaymentGrid';
import LoanManagement from './LoanManagement';
import MemberManagement from './MemberManagement';
import Reports from './Reports';
import DonationManagement from './DonationManagement';
import WarningManagement from './WarningManagement';
import ActivityNotifications from './ActivityNotifications';

export default function AdminDashboard() {
  const { groupStats, currentUser, logout, loading, isDarkMode, payments, loans, allUsers, activeMembers, donations, activities } = useApp();
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

  const TAB_THEMES: Record<string, { accent: string }> = {
    overview: { accent: '#FFE600' },
    payments: { accent: '#06D6A0' },
    loans: { accent: '#38BDF8' },
    donations: { accent: '#C084FC' },
    finances: { accent: '#2DD4BF' },
    members: { accent: '#FB923C' },
    reports: { accent: '#818CF8' },
    warnings: { accent: '#FF6B6B' },
    meetings: { accent: '#F59E0B' },
  };

  const tabSections = [
    {
      title: 'DASHBOARDS',
      items: [
        { id: 'overview', label: 'OVERVIEW', icon: BarChart3 },
      ]
    },
    {
      title: 'FINTECH & OPS',
      items: [
        { id: 'payments', label: 'PAYMENTS', icon: DollarSign },
        { id: 'loans', label: 'LOANS', icon: CreditCard },
        { id: 'donations', label: 'DONATIONS', icon: Gift },
        { id: 'finances', label: 'FINANCES', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'COMMUNITY',
      items: [
        { id: 'members', label: 'MEMBERS', icon: Users },
        { id: 'reports', label: 'REPORTS', icon: FileText },
        { id: 'warnings', label: 'WARNINGS', icon: Bell },
        { id: 'meetings', label: 'MEETINGS', icon: FileText },
      ]
    }
  ];

  const allTabs = tabSections.flatMap(s => s.items);
  const mobilePrimaryTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'loans', label: 'Loans', icon: CreditCard },
    { id: 'donations', label: 'Donations', icon: Gift },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center p-8 bg-white border-3 border-black shadow-[6px_6px_0px_#000]">
          <div className="w-12 h-12 bg-[#FFE600] border-2 border-black mx-auto mb-4 animate-bounce flex items-center justify-center font-black">
            FT
          </div>
          <p className="text-black font-mono font-black uppercase text-xs tracking-widest">
            F.O.R.T PROTOCOL INITIALIZING...
          </p>
        </div>
      </div>
    );
  }

  const activeTabMeta = allTabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-black font-sans selection:bg-[#FFE600] selection:text-black">
      
      {/* ─── DESKTOP SIDEBAR: NEO-BRUTALIST TACTILE (Matching Reference Blueprint) ─── */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r-2 border-black h-screen sticky top-0 left-0 z-50">
        
        {/* Brand Block */}
        <div className="p-6 border-b-2 border-black bg-[#FFE600]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFE600] flex items-center justify-center font-black text-xl border-2 border-black shadow-[2px_2px_0px_#000]">
              ■
            </div>
            <div>
              <h1 className="text-xl font-black text-black tracking-wider leading-none">F.O.R.T</h1>
              <p className="text-[10px] text-black/70 font-mono font-bold tracking-widest mt-1">LEDGER COMMAND</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
          {tabSections.map(section => (
            <div key={section.title} className="space-y-2">
              <p className="text-[10px] font-mono font-black tracking-widest text-black/50 px-2 uppercase">
                {section.title}
              </p>
              <div className="space-y-1.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const tabTheme = TAB_THEMES[item.id] || { accent: '#FFE600' };
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      style={isActive ? { backgroundColor: tabTheme.accent } : undefined}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-none border-2 border-black font-black text-xs tracking-wider transition-all duration-150 ${
                        isActive
                          ? 'text-black shadow-[3px_3px_0px_#000] translate-x-0.5'
                          : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-black stroke-[2.5]" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span className="w-2.5 h-2.5 bg-black inline-block"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card & Logout at Bottom */}
        <div className="p-4 border-t-2 border-black bg-white mt-auto">
          <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 border-2 border-black">
            <div className="w-8 h-8 bg-[#A855F7] text-white border-2 border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000]">
              {currentUser?.name?.[0] || 'L'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-black truncate">{currentUser?.name || 'Lithaf'}</p>
              <p className="text-[9px] font-mono font-bold text-black/60 uppercase">SUPER ADMIN</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-900 border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT REGION ─── */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* ─── TOP APP BAR (Matching Reference Blueprint) ─── */}
        <header
          className="sticky top-0 z-40 w-full bg-white border-b-2 border-black"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), var(--sat, 0px))',
          }}
        >
          <div className="w-full h-16 px-4 sm:px-8 flex items-center justify-between">
          
          {/* Breadcrumb Title */}
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 border-2 border-black flex items-center justify-center font-black text-black shadow-[2px_2px_0px_#000]"
              style={{ backgroundColor: (TAB_THEMES[activeTab] || { accent: '#FFE600' }).accent }}
            >
              FT
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-black font-sans">
                {activeTabMeta?.label || 'DASHBOARD'}
              </h2>
              <span 
                className="hidden sm:inline-block border-2 border-black text-[9px] font-mono font-black px-1.5 py-0.5 tracking-wider shadow-[1.5px_1.5px_0px_#000] text-black uppercase"
                style={{ backgroundColor: (TAB_THEMES[activeTab] || { accent: '#FFE600' }).accent }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Right Controls: Search, Notifications, Avatar Pill */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Box */}
            <div className="relative hidden md:flex items-center">
              <div className="bg-white border-2 border-black flex items-center px-3 py-1.5 shadow-[2px_2px_0px_#000] w-64 focus-within:shadow-[3px_3px_0px_#FFE600] transition-all">
                <Search className="w-4 h-4 text-black/60 mr-2" />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  className="bg-transparent border-none text-xs font-mono font-bold focus:outline-none w-full text-black placeholder:text-black/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Notification Bell Box */}
            <div className="relative">
              <button
                onClick={() => setIsActivityOpen(!isActivityOpen)}
                className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center text-black shadow-[2.5px_2.5px_0px_#000] hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                aria-label="Activity Notifications"
              >
                <Bell className="w-4 h-4 text-black" />
                {safeActivities.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse" />
                )}
              </button>

              {isActivityOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <ActivityNotifications />
                </div>
              )}
            </div>

            {/* Admin Avatar Box (JD style from blueprint) */}
            <div className="w-9 h-9 bg-[#A855F7] text-white border-2 border-black flex items-center justify-center font-black text-xs shadow-[2.5px_2.5px_0px_#000] cursor-pointer">
              {currentUser?.name?.slice(0, 2).toUpperCase() || 'LT'}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden w-9 h-9 bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          </div>
        </header>

        {/* ─── MOBILE FULL MENU OVERLAY ─── */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[60] bg-white p-6 overflow-y-auto border-b-3 border-black"
            style={{
              paddingTop: 'calc(4rem + max(env(safe-area-inset-top, 0px), var(--sat, 0px)))',
            }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-4 w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]"
              style={{
                top: 'calc(1rem + max(env(safe-area-inset-top, 0px), var(--sat, 0px)))',
              }}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-6">
              <div className="p-3 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000]">
                <p className="text-xs font-mono font-black uppercase tracking-wider text-black">
                  F.O.R.T NAVIGATION MENU
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {allTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const tabTheme = TAB_THEMES[tab.id] || { accent: '#FFE600' };
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      style={isActive ? { backgroundColor: tabTheme.accent } : undefined}
                      className={`flex flex-col items-center gap-2 p-4 border-2 border-black font-black text-xs uppercase tracking-wider transition-all ${
                        isActive
                          ? 'text-black shadow-[3px_3px_0px_#000]'
                          : 'bg-white text-black shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-6">
                <button
                  onClick={logout}
                  className="w-full py-3 bg-red-100 border-2 border-black text-red-900 font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN CONTENT VIEWPORT ─── */}
        <div className="p-4 sm:p-8 max-w-[1600px] w-full mx-auto space-y-8 pb-32">
          
          {/* 1. OVERVIEW PAGE (Redesigned with Tactile STACK System) */}
          {activeTab === 'overview' && (
            <OverviewDashboard
              groupStats={groupStats}
              currentUser={currentUser}
              payments={payments}
              loans={loans}
              allUsers={allUsers}
              activeMembers={activeMembers}
              donations={donations}
              activities={activities}
              onNavigateTab={handleTabChange}
            />
          )}

          {/* 2. OTHER TABS (Cleanly wrapped in Brutalist frames) */}
          {activeTab !== 'overview' && (
            <div className="brutal-card p-4 sm:p-6 overflow-hidden min-h-[600px]">
              {activeTab === 'payments' && <PaymentGrid />}
              {activeTab === 'loans' && <LoanManagement />}
              {activeTab === 'donations' && <DonationManagement />}
              {activeTab === 'members' && <MemberManagement />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'warnings' && <WarningManagement />}
              {activeTab === 'meetings' && <MeetingReportsManagement />}
              {activeTab === 'finances' && (
                <div className="h-[75vh] flex flex-col border-2 border-black">
                  <div className="p-4 bg-[#2DD4BF] border-b-2 border-black flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-black text-[#2DD4BF] flex items-center justify-center font-bold border border-black shadow-[2px_2px_0px_#000]">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-black uppercase tracking-wider">Global Ledger Sync</h3>
                        <p className="text-[10px] font-mono font-bold text-black/70">Immutable Google Sheets Database</p>
                      </div>
                    </div>
                    <a
                      href="https://docs.google.com/spreadsheets/d/your-google-sheet-id-placeholder/edit?rm=minimal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 hover:bg-black hover:text-white transition-colors"
                    >
                      External Portal <ArrowUpRight className="w-3.5 h-3.5" />
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
          )}

        </div>

        {/* ─── MOBILE BOTTOM BAR: TACTILE NEO-BRUTALIST ─── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-black flex items-center justify-around px-2 z-50 shadow-[0_-4px_0px_0px_rgba(0,0,0,0.05)]">
          {mobilePrimaryTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const tabTheme = TAB_THEMES[tab.id] || { accent: '#FFE600' };
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
                  isActive ? 'text-black font-black' : 'text-black/60 font-bold'
                }`}
              >
                <div 
                  className={`p-1 border-2 ${isActive ? 'border-black shadow-[1.5px_1.5px_0px_#000]' : 'border-transparent'}`}
                  style={isActive ? { backgroundColor: tabTheme.accent } : undefined}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] uppercase tracking-wider mt-0.5">{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-black/60 font-bold"
          >
            <div className="p-1 border-2 border-transparent">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[9px] uppercase tracking-wider mt-0.5">More</span>
          </button>
        </nav>

      </main>
    </div>
  );
}
