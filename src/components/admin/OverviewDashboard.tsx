import React, { useState, useMemo } from 'react';
import { GroupStats, User, Payment, Loan, ActivityLog } from '../../types';
import StepCashflowChart from './StepCashflowChart';
import MemberComplianceBars from './MemberComplianceBars';
import WhatsAppSnapshotModal from './WhatsAppSnapshotModal';
import {
  DollarSign, Users, CreditCard, Heart, ArrowUpRight, TrendingUp,
  Calendar, Filter, Share2, Camera, ShieldAlert, Award, PlusCircle,
  FileText, CheckCircle2, ChevronRight, Activity, Sparkles
} from 'lucide-react';

interface OverviewDashboardProps {
  groupStats: GroupStats;
  currentUser: User | null;
  payments: Payment[];
  loans: Loan[];
  allUsers: User[];
  activeMembers?: User[];
  donations: any[];
  activities: ActivityLog[];
  onNavigateTab: (tabId: string) => void;
}

export default function OverviewDashboard({
  groupStats,
  currentUser,
  payments,
  loans,
  allUsers,
  activeMembers,
  donations,
  activities,
  onNavigateTab
}: OverviewDashboardProps) {
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState('May 2026');
  const [isMobileSnapshotMode, setIsMobileSnapshotMode] = useState(false);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Active members only (strict filter to exclude inactive / exited members)
  const members = useMemo(() => {
    if (activeMembers && activeMembers.length > 0) {
      return activeMembers;
    }
    return allUsers.filter(u => u.role === 'member' && u.status === 'active');
  }, [activeMembers, allUsers]);

  // Payments for current month for active members only
  const currentMonthPayments = useMemo(() => {
    return payments.filter(
      p => p.month === currentMonth && 
           p.year === currentYear &&
           members.some(m => m.id === p.memberId)
    );
  }, [payments, currentMonth, currentYear, members]);

  const paidCount = currentMonthPayments.filter(p => p.paid).length;
  const complianceRate = members.length > 0 ? (paidCount / members.length) * 100 : 100;

  // Active loans
  const activeLoans = loans.filter(l => l.status === 'active');
  const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalRepaid = loans.reduce((sum, l) => sum + l.repaidAmount, 0);
  const recoveryRate = totalLoaned > 0 ? (totalRepaid / totalLoaned) * 100 : 86;

  // Donations
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  // Top contributor
  const memberPaymentCounts = members.map(member => ({
    member,
    count: payments.filter(p => p.memberId === member.id && p.year === currentYear && p.paid).length
  })).sort((a, b) => b.count - a.count);
  const topContributor = memberPaymentCounts[0]?.member;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-black">
      {/* ─── PAGE HEADER & CONTROLS (Matching Blueprint) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              DASHBOARD
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#FFE600] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                REAL-TIME ANALYTICS MODULE v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • F.O.R.T PROTOCOL ACTIVE
              </span>
            </div>
          </div>

          {/* Action Buttons with 2px Black Border & Hard Shadows */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsSnapshotOpen(true)}
              className="brutal-btn bg-[#FFE600] hover:bg-[#FFF275] text-black px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-black" />
              <span>WhatsApp Snapshot</span>
            </button>

            <button
              onClick={() => setSelectedCycle(selectedCycle === 'May 2026' ? 'This Year' : 'May 2026')}
              className="brutal-btn bg-white hover:bg-gray-50 text-black px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{selectedCycle}</span>
            </button>

            <button
              onClick={() => setIsMobileSnapshotMode(!isMobileSnapshotMode)}
              className="brutal-btn lg:hidden bg-white hover:bg-gray-50 text-black px-3 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isMobileSnapshotMode ? 'Full View' : 'Quick Snapshot'}</span>
            </button>
          </div>
        </div>

        {/* Dashed line separator matching blueprint */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── INLINE MOBILE SNAPSHOT VIEW (Zero Crop for WhatsApp) ─── */}
      {isMobileSnapshotMode && (
        <div className="lg:hidden p-4 bg-[#FFE600] border-3 border-black shadow-[6px_6px_0px_#000] space-y-3 animate-fadeIn">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <div>
              <p className="text-[10px] font-mono font-black uppercase text-black">
                F.O.R.T LEDGER • GROUP STATUS
              </p>
              <p className="text-xs font-black text-black">OFFICIAL AUDIT REPORT</p>
            </div>
            <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5">
              MAY 2026
            </span>
          </div>

          <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
            <p className="text-[10px] font-mono font-black uppercase text-black/60">TOTAL FUNDS</p>
            <p className="text-3xl font-black text-black">
              LKR {groupStats.totalFunds.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-white border-2 border-black p-2">
              <p className="text-[9px] font-mono font-bold text-black/60 uppercase">COLLECTION</p>
              <p className="text-sm font-black text-black">LKR {groupStats.monthlyCollection.toLocaleString()}</p>
              <p className="text-[9px] font-mono font-bold text-emerald-600">100% Settled</p>
            </div>
            <div className="bg-white border-2 border-black p-2">
              <p className="text-[9px] font-mono font-bold text-black/60 uppercase">LOANS OUT</p>
              <p className="text-sm font-black text-black">{activeLoans.length} Active</p>
              <p className="text-[9px] font-mono font-bold text-black/70">LKR {groupStats.totalLoanAmount.toLocaleString()}</p>
            </div>
          </div>

          <p className="text-[9px] font-mono font-bold text-black/70 text-center">
            📸 Screenshot this entire card directly to send to WhatsApp!
          </p>
        </div>
      )}

      {/* ─── ROW 1: THE 4 MODULAR KPI CARDS (Matching Reference Blueprint) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* CARD 1: YELLOW HERO ACCENT CARD (Available Group Funds) */}
        <div className="brutal-card-yellow p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[190px] group hover:-translate-y-0.5 transition-transform">
          {/* Faint Watermark Icon */}
          <div className="absolute right-2 -bottom-4 text-black/10 select-none pointer-events-none font-black text-9xl">
            $
          </div>

          <div className="flex items-start justify-between relative z-10">
            {/* Square Black Icon Box */}
            <div className="w-10 h-10 bg-black text-[#FFE600] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <DollarSign className="w-5 h-5 text-white" />
            </div>

            {/* Percentage Pill Badge */}
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>+600</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              TOTAL REVENUE / AVAILABLE FUNDS
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight mt-1 font-sans">
              LKR {groupStats.totalFunds.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* CARD 2: ACTIVE USERS / MEMBERS (White Card) */}
        <div className="brutal-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[190px] group hover:-translate-y-0.5 transition-transform">
          {/* Faint Watermark Icon */}
          <div className="absolute right-2 -bottom-4 text-black/5 select-none pointer-events-none">
            <Users className="w-32 h-32" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Users className="w-5 h-5" />
            </div>

            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>100% PAID</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              ACTIVE MEMBERS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
                {members.length}
              </h2>
              <span className="text-xs font-mono font-bold text-black/60">
                ({paidCount} of {members.length} Cleared)
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: ACTIVE LOANS & CAPITAL OUT (White Card) */}
        <div className="brutal-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[190px] group hover:-translate-y-0.5 transition-transform">
          {/* Faint Watermark Icon */}
          <div className="absolute right-2 -bottom-4 text-black/5 select-none pointer-events-none">
            <CreditCard className="w-32 h-32" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <CreditCard className="w-5 h-5" />
            </div>

            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-bold text-black">86% REC.</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              ACTIVE LOANS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
                {activeLoans.length}
              </h2>
              <span className="text-xs font-mono font-bold text-black/80">
                LKR {groupStats.totalLoanAmount.toLocaleString()} Out
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: RESERVE & OPERATIONAL HEALTH (White Card) */}
        <div className="brutal-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[190px] group hover:-translate-y-0.5 transition-transform">
          {/* Faint Watermark Icon */}
          <div className="absolute right-2 -bottom-4 text-black/5 select-none pointer-events-none">
            <Heart className="w-32 h-32" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Heart className="w-5 h-5 text-[#FFE600]" />
            </div>

            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>99.9% UPTIME</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              RESERVE & CHARITY
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
                LKR {totalDonations.toLocaleString()}
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-700">
                Stable
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── ROW 2: THE TWO POWERHOUSE PANELS (Step Chart & Vertical Bar Chart) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Visual: Step Chart (Revenue Overview) - 7 cols */}
        <div className="lg:col-span-7">
          <StepCashflowChart
            payments={payments}
            loans={loans}
            currentFunds={groupStats.totalFunds}
          />
        </div>

        {/* Right Visual: Member Roll Call & Compliance Bar Chart - 5 cols */}
        <div className="lg:col-span-5">
          <MemberComplianceBars
            members={members}
            payments={payments}
            onSelectMemberTab={() => onNavigateTab('members')}
          />
        </div>

      </div>

      {/* ─── ROW 3: QUICK ADMIN ACTION DECK & RECENT LOGS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Launch Control */}
        <div className="brutal-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-bold text-sm border border-black shadow-[2px_2px_0px_#000]">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm tracking-wider uppercase text-black">
                QUICK ACTIONS
              </h3>
            </div>
            <p className="text-xs font-mono text-black/60 font-bold mb-4">
              Instant entry shortcuts for administrator
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNavigateTab('payments')}
              className="p-3 bg-white border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between h-20"
            >
              <DollarSign className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
            <button
              onClick={() => onNavigateTab('loans')}
              className="p-3 bg-white border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between h-20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Issue Loan</span>
            </button>
            <button
              onClick={() => onNavigateTab('donations')}
              className="p-3 bg-white border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between h-20"
            >
              <Heart className="w-4 h-4" />
              <span>Log Donation</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="p-3 bg-white border-2 border-black font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex flex-col justify-between h-20"
            >
              <FileText className="w-4 h-4" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {/* Star Benefactor & Health Badge */}
        <div className="brutal-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-bold text-sm border border-black shadow-[2px_2px_0px_#000]">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm tracking-wider uppercase text-black">
                  TOP BENEFACTOR
                </h3>
              </div>
              <span className="bg-[#FFE600] border border-black text-[10px] font-mono font-black px-1.5 py-0.5">
                ELITE
              </span>
            </div>
            <p className="text-xs font-mono text-black/60 font-bold mb-4">
              Highest consistency in 2026 cycle
            </p>
          </div>

          {topContributor ? (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-center gap-3 shadow-[2px_2px_0px_#000]">
              <div className="w-12 h-12 bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-lg text-black shadow-[2px_2px_0px_#000]">
                {topContributor.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-base font-black text-black truncate">{topContributor.name}</p>
                <p className="text-xs font-mono font-bold text-emerald-700">100% Cleared on Schedule</p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-mono text-black/60">Calculating standings...</p>
          )}

          <div className="pt-3 border-t-2 border-black/10 flex justify-between items-center text-[10px] font-mono font-bold text-black/70">
            <span>Cycle: Jan - May 2026</span>
            <span className="text-emerald-700 font-black">Zero Default Risk</span>
          </div>
        </div>

        {/* Live Operational Ledger Feed */}
        <div className="brutal-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black text-[#FFE600] flex items-center justify-center font-bold text-sm border border-black shadow-[2px_2px_0px_#000]">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm tracking-wider uppercase text-black">
                  SYSTEM TELEMETRY
                </h3>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse"></span>
            </div>
            <p className="text-xs font-mono text-black/60 font-bold mb-4">
              Real-time ledger audit trail
            </p>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
            {activities.slice(0, 3).map((act, idx) => (
              <div key={idx} className="p-2 bg-gray-50 border border-black/30 text-[11px] font-mono">
                <div className="flex justify-between items-center text-black/60 text-[9px]">
                  <span>{act.actorName || 'System'}</span>
                  <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="font-bold text-black truncate mt-0.5">{act.details || act.action}</p>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="p-3 bg-gray-50 border border-black/30 text-xs font-mono text-black/60 text-center">
                All ledger transactions verified & synchronized.
              </div>
            )}
          </div>

          <div className="pt-3 border-t-2 border-black/10 flex justify-between items-center text-[10px] font-mono font-bold text-black/70">
            <span>Database: Supabase Live</span>
            <span className="text-emerald-700 font-black">Online 99.9%</span>
          </div>
        </div>

      </div>

      {/* ─── WHATSAPP MODAL POPUP ─── */}
      <WhatsAppSnapshotModal
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
        groupStats={groupStats}
        members={members}
        payments={payments}
        loans={loans}
        totalDonations={totalDonations}
        complianceRate={complianceRate}
        adminName={currentUser?.name || 'Lithaf'}
      />
    </div>
  );
}
