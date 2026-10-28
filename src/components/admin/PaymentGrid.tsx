import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Check, Search, Download, CheckCircle2, AlertTriangle, TrendingUp,
  Filter, ArrowUp, Sparkles, X, Calendar, Share2, Copy, Flame, User as UserIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PaymentGrid() {
  const { payments, updatePayment, currentUser, allUsers, activeMembers } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [justPaidCell, setJustPaidCell] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pendingCells, setPendingCells] = useState<Record<string, boolean>>({});
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'grid'>('cards');
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [copiedReminder, setCopiedReminder] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Strictly filter only active members
  const members = useMemo(() => {
    if (activeMembers && activeMembers.length > 0) {
      return activeMembers;
    }
    return allUsers.filter(user => user.role === 'member' && user.status === 'active');
  }, [activeMembers, allUsers]);
  
  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];
  
  // Available years from payment records
  const availableYears = useMemo(() => {
    const years = [...new Set(payments.map(p => p.year))].sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [payments]);

  // Payment Matrix Map O(P + M*12)
  const paymentMatrix = useMemo(() => {
    const matrix: { [key: string]: { [key: string]: boolean } } = {};
    const paymentLookup = new Map<string, boolean>();

    payments.forEach(p => {
      if (p.year === selectedYear) {
        paymentLookup.set(`${p.memberId}_${p.month}`, p.paid);
      }
    });

    members.forEach(member => {
      matrix[member.id] = {};
      months.forEach(month => {
        matrix[member.id][month] = paymentLookup.get(`${member.id}_${month}`) || false;
      });
    });
    
    return matrix;
  }, [payments, members, selectedYear]);

  // Member Stats Memoization
  const memberStatsMap = useMemo(() => {
    const stats: { [key: string]: any } = {};
    
    members.forEach(member => {
      const memberId = member.id;
      const memberMatrix = paymentMatrix[memberId] || {};
      
      const paidMonthsYTD = months.slice(0, currentMonthIndex + 1).filter(month => memberMatrix[month]);
      const paidCountYTD = paidMonthsYTD.length;
      const paidCountTotal = months.filter(month => memberMatrix[month]).length;
      
      let streak = 0;
      for (let i = currentMonthIndex; i >= 0; i--) {
        if (memberMatrix[months[i]]) streak++;
        else break;
      }
      
      const unpaidCount = months.slice(0, currentMonthIndex + 1).filter(month => !memberMatrix[month]).length;
      const totalPaid = payments
        .filter(p => p.memberId === memberId && p.year === selectedYear && p.paid)
        .reduce((sum, p) => sum + p.amount, 0);
        
      stats[memberId] = { paidCountYTD, paidCountTotal, streak, unpaidCount, totalPaid };
    });
    
    return stats;
  }, [members, paymentMatrix, payments, selectedYear, currentMonthIndex]);

  const getMemberStats = (memberId: string) => {
    return memberStatsMap[memberId] || { paidCountYTD: 0, paidCountTotal: 0, streak: 0, unpaidCount: 0, totalPaid: 0 };
  };

  // Monthly Gross Totals
  const monthlyTotals = useMemo(() => {
    const previousYearTotal = payments
      .filter(p => p.year === selectedYear - 1 && p.paid)
      .reduce((sum, p) => sum + p.amount, 0);

    const monthlyGrosses: { [key: string]: number } = {};
    const cumulativeTotals: { [key: string]: number } = {};
    let runningTotal = previousYearTotal;

    months.forEach(month => {
      const monthlyGross = payments
        .filter(p => p.month === month && p.year === selectedYear && p.paid)
        .reduce((sum, p) => sum + p.amount, 0);
      
      monthlyGrosses[month] = monthlyGross;
      runningTotal += monthlyGross;
      cumulativeTotals[month] = runningTotal;
    });

    const currentYearGross = payments
      .filter(p => p.year === selectedYear && p.paid)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const yearlyGross = currentYearGross;

    return { monthlyGrosses, cumulativeTotals, yearlyGross, previousYearTotal };
  }, [payments, selectedYear]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!showOnlyUnpaid) return matchesSearch;
      
      const stats = memberStatsMap[member.id];
      const hasUnpaid = stats ? stats.unpaidCount > 0 : true;
      return matchesSearch && hasUnpaid;
    });
  }, [members, searchTerm, showOnlyUnpaid, memberStatsMap]);

  const getMonthlyStats = (month: string) => {
    const paid = members.filter(member => paymentMatrix[member.id]?.[month]).length;
    const total = members.length;
    return { paid, total, percentage: total > 0 ? Math.round((paid / total) * 100) : 0 };
  };

  const getCurrentMonthStatus = (month: string, index: number) => {
    if (index > currentMonthIndex) return 'future';
    if (index === currentMonthIndex) return 'current';
    return 'past';
  };

  // Toggle Payment Status
  const togglePayment = async (memberId: string, month: string) => {
    const paymentId = `${memberId}_${month}_${selectedYear}`;
    const cellKey = `${memberId}_${month}_${selectedYear}`;

    if (pendingCells[cellKey]) return;

    const currentStatus = paymentMatrix[memberId]?.[month];
    const newStatus = !currentStatus;

    setPendingCells(prev => ({ ...prev, [cellKey]: true }));
    
    try {
      await updatePayment(paymentId, newStatus, currentUser?.id);
      
      if (newStatus) {
        setJustPaidCell(`${memberId}_${month}`);
        setTimeout(() => setJustPaidCell(null), 2000);
        
        const allPaidForMonth = members.every(m => {
          if (m.id === memberId) return true;
          return paymentMatrix[m.id]?.[month];
        });
        
        if (allPaidForMonth) triggerConfetti();
      }
    } catch (error) {
      console.error('Failed to update payment:', error);
    } finally {
      setPendingCells(prev => {
        const next = { ...prev };
        delete next[cellKey];
        return next;
      });
    }
  };

  const markAllAsPaidForCurrentMonth = async () => {
    if (!window.confirm(`Mark all active members as paid for ${currentMonth}?`)) return;
    
    for (const member of members) {
      if (!paymentMatrix[member.id]?.[currentMonth]) {
        await togglePayment(member.id, currentMonth);
      }
    }
    triggerConfetti();
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Member', ...months, 'Total Paid', 'Percentage'];
    const rows = filteredMembers.map(member => {
      const { paidCountTotal } = getMemberStats(member.id);
      const percentage = Math.round((paidCountTotal / 12) * 100);
      return [
        member.name,
        ...months.map(month => paymentMatrix[member.id]?.[month] ? 'Paid' : 'Unpaid'),
        paidCountTotal,
        `${percentage}%`
      ];
    });
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-tracking-${selectedYear}.csv`;
    link.click();
  };

  // WhatsApp Reminder Generator
  const copyWhatsAppUnpaidReminder = () => {
    const unpaidMembers = members.filter(m => !paymentMatrix[m.id]?.[currentMonth]);
    
    const message = `🔔 *F.O.R.T LEDGER - PAYMENT REMINDER*
🗓 *Cycle:* ${currentMonth} ${selectedYear}
────────────────────────
Hi members, friendly reminder regarding the monthly collection for *${currentMonth}*.

💰 *Contribution:* LKR 300
✅ *Status:* ${members.length - unpaidMembers.length}/${members.length} members settled.

⏳ *Pending Members:*
${unpaidMembers.length === 0 ? '🎉 All active members have settled for this cycle!' : unpaidMembers.map(m => `• ${m.name}`).join('\n')}
────────────────────────
Please send your payments to maintain our 100% group compliance target. Thank you!`;

    navigator.clipboard.writeText(message);
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => setShowScrollTop(container.scrollTop > 300);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Summary Metrics
  const currentMonthStats = getMonthlyStats(currentMonth);
  const currentMonthCollected = monthlyTotals.monthlyGrosses[currentMonth] || 0;
  const unpaidMembersCount = members.length - currentMonthStats.paid;
  const totalOutstanding = members.reduce((sum, member) => {
    const stats = getMemberStats(member.id);
    return sum + (stats.unpaidCount * 300);
  }, 0);
  
  const overallCompletionRate = members.length > 0 ? Math.round(
    (members.reduce((sum, member) => sum + getMemberStats(member.id).paidCountYTD, 0) / (members.length * (currentMonthIndex + 1))) * 100
  ) : 100;

  return (
    <div className="space-y-6 text-black animate-fadeIn" ref={scrollContainerRef}>
      
      {/* Confetti Burst */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉 🎊 ✨</div>
        </div>
      )}

      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              PAYMENTS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#06D6A0] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                REAL-TIME CONTRIBUTION MATRIX v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {members.length} ACTIVE MEMBERS AUDITED
              </span>
            </div>
          </div>

          {/* Quick Actions Header Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={copyWhatsAppUnpaidReminder}
              className="brutal-btn bg-[#06D6A0] hover:bg-[#05b888] text-black px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              {copiedReminder ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
                  <span>Copied Reminder!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>WhatsApp Reminder</span>
                </>
              )}
            </button>

            <button
              onClick={markAllAsPaidForCurrentMonth}
              className="brutal-btn bg-white hover:bg-emerald-50 text-emerald-800 px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Mark All Paid</span>
            </button>

            <button
              onClick={exportToCSV}
              className="brutal-btn bg-white hover:bg-gray-50 text-black px-3 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>

            {/* Year Selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="brutal-btn bg-white text-black px-3 py-2 text-xs font-black uppercase tracking-wider appearance-none pr-8 cursor-pointer"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex border-2 border-black shadow-[2px_2px_0px_#000]">
              <button
                onClick={() => setMobileViewMode('cards')}
                className={`px-2.5 py-1.5 text-[10px] font-black uppercase ${
                  mobileViewMode === 'cards' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setMobileViewMode('grid')}
                className={`px-2.5 py-1.5 text-[10px] font-black uppercase ${
                  mobileViewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── ROW 1: THE 4 TACTILE METRIC CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* CARD 1: CURRENT MONTH (Mint Jade Hero) */}
        <div className="brutal-card-payments p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-[#06D6A0] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>{currentMonthStats.percentage}%</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              {currentMonth.toUpperCase()} COLLECTION
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {currentMonthStats.paid} / {members.length}
              </h2>
              <span className="text-xs font-mono font-bold text-black/70">
                (LKR {currentMonthCollected.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL OUTSTANDING */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-5 h-5 text-[#FFE600]" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>{unpaidMembersCount} Due</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              TOTAL OUTSTANDING
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                LKR {totalOutstanding.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* CARD 3: YTD COMPLETION RATE */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>YTD STATS</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              COMPLETION RATE
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {overallCompletionRate}%
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-700">
                On Schedule
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: YTD COLLECTION TOTAL */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>{selectedYear}</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              TOTAL COLLECTED
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                LKR {monthlyTotals.yearlyGross.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ─── */}
      <div className="brutal-card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search input with 2px black border */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
          <input
            type="text"
            placeholder="Search active member by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_#FFE600] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowOnlyUnpaid(!showOnlyUnpaid)}
            className={`brutal-btn px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              showOnlyUnpaid ? 'bg-black text-white' : 'bg-white text-black hover:bg-yellow-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showOnlyUnpaid ? 'Showing Unpaid' : 'Show Unpaid Only'}</span>
          </button>

          <span className="text-xs font-mono font-bold text-black/60 hidden sm:inline ml-2">
            {filteredMembers.length} of {members.length} active members
          </span>
        </div>
      </div>

      {/* ─── MOBILE CARDS VIEW (Clean & No Horizontal Scroll) ─── */}
      <div className={`lg:hidden ${mobileViewMode === 'cards' ? 'block' : 'hidden'} space-y-3`}>
        {filteredMembers.length === 0 ? (
          <div className="brutal-card p-8 text-center">
            <p className="text-sm font-mono font-bold text-black/60">No members found matching "{searchTerm}"</p>
          </div>
        ) : (
          filteredMembers.map((member) => {
            const stats = getMemberStats(member.id);
            const isPaidCurrentMonth = paymentMatrix[member.id]?.[currentMonth];
            const isPending = !!pendingCells[`${member.id}_${currentMonth}_${selectedYear}`];
            const isExpanded = expandedMemberId === member.id;

            return (
              <div key={member.id} className="brutal-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-sm text-black shadow-[2px_2px_0px_#000]">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-black leading-tight">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-black/60">
                          Paid: LKR {stats.totalPaid.toLocaleString()}
                        </span>
                        {stats.streak > 0 && (
                          <span className="bg-amber-100 border border-black text-[9px] font-mono font-black px-1 text-amber-900 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" /> {stats.streak}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${
                      isPaidCurrentMonth
                        ? 'bg-[#06D6A0] text-black'
                        : 'bg-[#FFEAEA] text-red-600'
                    }`}
                  >
                    {isPaidCurrentMonth ? 'SETTLED' : 'DUE'}
                  </span>
                </div>

                {/* YTD Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-black/60">
                    <span>Yearly Progress</span>
                    <span>{stats.paidCountTotal} / 12 Months ({Math.round((stats.paidCountTotal / 12) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 border border-black h-2 overflow-hidden">
                    <div
                      className="bg-black h-full transition-all duration-300"
                      style={{ width: `${(stats.paidCountTotal / 12) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => togglePayment(member.id, currentMonth)}
                    disabled={isPending}
                    className={`flex-1 brutal-btn py-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 ${
                      isPaidCurrentMonth
                        ? 'bg-white hover:bg-gray-100 text-black'
                        : 'bg-[#FFE600] hover:bg-[#FFF275] text-black'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{isPaidCurrentMonth ? `Paid for ${currentMonth} (Tap to Undo)` : `Mark Paid for ${currentMonth}`}</span>
                  </button>

                  <button
                    onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                    className="brutal-btn px-3 py-2 bg-white text-xs font-black uppercase"
                  >
                    {isExpanded ? 'Less' : '12M'}
                  </button>
                </div>

                {/* Expandable 12-Month Mini Grid */}
                {isExpanded && (
                  <div className="pt-2 border-t-2 border-dashed border-black/20">
                    <p className="text-[10px] font-mono font-black uppercase text-black/60 mb-2">
                      Full Year 12-Month Log ({selectedYear})
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {months.map((m, idx) => {
                        const isMthPaid = paymentMatrix[member.id]?.[m];
                        return (
                          <button
                            key={m}
                            onClick={() => togglePayment(member.id, m)}
                            className={`p-1.5 border border-black text-[10px] font-mono font-black flex items-center justify-between shadow-[1px_1px_0px_#000] ${
                              isMthPaid
                                ? 'bg-[#06D6A0] text-black'
                                : idx <= currentMonthIndex
                                ? 'bg-[#FFEAEA] text-red-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <span>{m.slice(0, 3)}</span>
                            <span>{isMthPaid ? '✓' : '•'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ─── DESKTOP & TABLET MATRIX TABLE (Sticky Columns & Rows) ─── */}
      <div className={`brutal-card overflow-hidden ${mobileViewMode === 'cards' ? 'hidden lg:block' : 'block'}`}>
        
        {/* Table Top Controls & Info Bar */}
        <div className="p-4 bg-[#FFE600] border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs uppercase tracking-wider text-black">
              12-Month Matrix
            </span>
            <span className="bg-black text-white text-[10px] font-mono font-bold px-1.5 py-0.5 border border-black">
              YEAR {selectedYear}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-black/70">
            Click any cell to toggle payment status • Instant Cloud Sync
          </span>
        </div>

        {/* Matrix Container */}
        <div className="overflow-x-auto custom-scrollbar max-h-[70vh]">
          <table className="w-full border-collapse text-left select-none">
            <thead>
              <tr className="bg-white border-b-2 border-black">
                
                {/* Sticky Left: Member Name Column Header */}
                <th className="sticky left-0 bg-white z-30 p-3.5 border-r-2 border-black text-xs font-black uppercase tracking-wider text-black min-w-[200px] shadow-[2px_0px_0px_0px_#000]">
                  Active Member ({filteredMembers.length})
                </th>

                {/* Month Headers */}
                {months.map((month, idx) => {
                  const status = getCurrentMonthStatus(month, idx);
                  const isCurrent = status === 'current';
                  const stats = getMonthlyStats(month);

                  return (
                    <th
                      key={month}
                      className={`p-3 text-center text-xs font-black uppercase tracking-wider min-w-[85px] border-r-2 border-black ${
                        isCurrent ? 'bg-[#FFE600] text-black' : 'bg-white text-black'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{month.slice(0, 3)}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span>}
                      </div>
                      <div className="text-[9px] font-mono font-bold text-black/60 mt-0.5">
                        {stats.paid}/{stats.total}
                      </div>
                    </th>
                  );
                })}

                {/* Sticky Right: Summary Column Header */}
                <th className="sticky right-0 bg-white z-30 p-3 text-center text-xs font-black uppercase tracking-wider text-black min-w-[130px] border-l-2 border-black shadow-[-2px_0px_0px_0px_#000]">
                  Total / Progress
                </th>
              </tr>

              {/* Monthly Gross Totals Row (Pinned just below header) */}
              <tr className="bg-black text-white border-b-2 border-black font-mono text-xs">
                <th className="sticky left-0 bg-black z-30 p-2.5 border-r-2 border-black text-[11px] font-black uppercase tracking-wider text-[#FFE600] shadow-[2px_0px_0px_0px_#000]">
                  GROSS INFLOW
                </th>
                {months.map(month => (
                  <td key={month} className="p-2 text-center border-r-2 border-white/20 text-[10px] font-black text-white">
                    {monthlyTotals.monthlyGrosses[month] ? `${monthlyTotals.monthlyGrosses[month]}` : '-'}
                  </td>
                ))}
                <td className="sticky right-0 bg-black z-30 p-2 text-center border-l-2 border-white/20 text-xs font-black text-[#FFE600] shadow-[-2px_0px_0px_0px_#000]">
                  LKR {monthlyTotals.yearlyGross.toLocaleString()}
                </td>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-black/10 bg-white">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-12 text-center font-mono font-bold text-black/60">
                    No active members found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, memberIdx) => {
                  const stats = getMemberStats(member.id);
                  const isAllPaidYTD = stats.paidCountYTD === currentMonthIndex + 1;

                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-yellow-50/70 transition-colors ${
                        memberIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      {/* Sticky Left: Member Identity Column */}
                      <td className="sticky left-0 bg-white group-hover:bg-yellow-50 z-20 p-3.5 border-r-2 border-black whitespace-nowrap shadow-[2px_0px_0px_0px_#000]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FFE600] border-2 border-black flex items-center justify-center font-black text-xs text-black shadow-[1.5px_1.5px_0px_#000] flex-shrink-0">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-black truncate">{member.name}</span>
                              {isAllPaidYTD && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-black px-1 border border-emerald-600">
                                  PAID
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-black/60">
                              <span>LKR {stats.totalPaid.toLocaleString()}</span>
                              {stats.streak > 0 && (
                                <span className="text-amber-700 font-bold flex items-center">
                                  🔥 {stats.streak}m
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 12 Interactive Month Checkbox Cells */}
                      {months.map((month, idx) => {
                        const isPaid = paymentMatrix[member.id]?.[month];
                        const status = getCurrentMonthStatus(month, idx);
                        const isPending = !!pendingCells[`${member.id}_${month}_${selectedYear}`];
                        const isJustPaid = justPaidCell === `${member.id}_${month}`;

                        return (
                          <td key={month} className="p-2 text-center border-r-2 border-black/10">
                            <button
                              onClick={() => togglePayment(member.id, month)}
                              disabled={isPending}
                              title={isPaid ? `${member.name} - ${month}: Paid (Click to unmark)` : `${member.name} - ${month}: Click to mark Paid`}
                              className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto border-2 border-black flex items-center justify-center font-black transition-all ${
                                isPaid
                                  ? 'bg-[#06D6A0] text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                                  : status === 'current'
                                  ? 'bg-[#FFEAEA] text-red-600 hover:bg-[#FFD6D6] shadow-[1.5px_1.5px_0px_#000]'
                                  : status === 'past'
                                  ? 'bg-[#FFF0F0] text-red-500 hover:bg-[#FFD6D6]'
                                  : 'bg-gray-100 text-gray-400 border-dashed hover:border-black'
                              } ${isJustPaid ? 'scale-110 ring-2 ring-[#FFE600]' : ''}`}
                            >
                              {isPaid ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : status === 'current' ? (
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              ) : (
                                <span className="text-[10px]">•</span>
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Sticky Right: Member Progress Column */}
                      <td className="sticky right-0 bg-white group-hover:bg-yellow-50 z-20 p-3 text-center border-l-2 border-black shadow-[-2px_0px_0px_0px_#000]">
                        <div className="space-y-1">
                          <p className="font-mono font-black text-xs text-black">
                            {stats.paidCountTotal} / 12
                          </p>
                          <div className="w-20 mx-auto bg-gray-200 border border-black h-2 overflow-hidden">
                            <div
                              className="bg-black h-full"
                              style={{ width: `${(stats.paidCountTotal / 12) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer */}
        <div className="p-4 bg-white border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold text-black/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#06D6A0] border border-black inline-block"></span>
              <span>Paid / Settled</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#FFEAEA] border border-black inline-block"></span>
              <span>Pending Action</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#FFE600] border border-black inline-block"></span>
              <span>Current Cycle ({currentMonth})</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Contribution: <strong>LKR 300/mo</strong></span>
            <span>Annual Target: <strong>LKR {(members.length * 300 * 12).toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black active:translate-x-0.5 active:translate-y-0.5 z-40 transition-all"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

    </div>
  );
}
