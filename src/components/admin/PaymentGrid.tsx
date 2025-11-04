import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Check, Search, Download, CheckCircle2, AlertTriangle, TrendingUp, Filter, ArrowUp, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassButton from '../common/GlassButton';

export default function PaymentGrid() {
  const { payments, updatePayment, currentUser, allUsers } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [justPaidCell, setJustPaidCell] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const members = allUsers.filter(user => user.role === 'member');
  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];
  
  // Get available years from payments data
  const availableYears = useMemo(() => {
    const years = [...new Set(payments.map(p => p.year))].sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [payments]);

  const paymentMatrix = useMemo(() => {
    const matrix: { [key: string]: { [key: string]: boolean } } = {};
    
    members.forEach(member => {
      matrix[member.id] = {};
      months.forEach(month => {
        const payment = payments.find(p => 
          p.memberId === member.id && 
          p.month === month && 
          p.year === selectedYear
        );
        matrix[member.id][month] = payment?.paid || false;
      });
    });
    
    return matrix;
  }, [payments, members, selectedYear]);

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
      
      if (month === 'January') {
        monthlyGrosses[month] = monthlyGross + previousYearTotal;
      } else {
        monthlyGrosses[month] = monthlyGross;
      }
      
      runningTotal += monthlyGross;
      cumulativeTotals[month] = runningTotal;
    });

    const currentYearGross = payments
      .filter(p => p.year === selectedYear && p.paid)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const yearlyGross = currentYearGross + previousYearTotal;

    return { monthlyGrosses, cumulativeTotals, yearlyGross, previousYearTotal };
  }, [payments, selectedYear]);

  // Filter members based on search and unpaid filter
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!showOnlyUnpaid) return matchesSearch;
      
      const hasUnpaid = months.some(month => !paymentMatrix[member.id]?.[month]);
      return matchesSearch && hasUnpaid;
    });
  }, [members, searchTerm, showOnlyUnpaid, paymentMatrix]);

  const getMonthlyStats = (month: string) => {
    const paid = members.filter(member => paymentMatrix[member.id]?.[month]).length;
    const total = members.length;
    return { paid, total, percentage: Math.round((paid / total) * 100) };
  };

  const getCurrentMonthStatus = (month: string, index: number) => {
    if (index > currentMonthIndex) return 'future';
    if (index === currentMonthIndex) return 'current';
    return 'past';
  };

  // Get member stats
  const getMemberStats = (memberId: string) => {
    // Only count payments up to the current month to correctly calculate YTD paid count
    const paidMonths = months.slice(0, currentMonthIndex + 1).filter(month => paymentMatrix[memberId]?.[month]);
    const paidCountYTD = paidMonths.length;
    
    // Get total paid count for the entire year (12 months)
    const paidCountTotal = months.filter(month => paymentMatrix[memberId]?.[month]).length;
    
    // Calculate streak (consecutive months from most recent)
    let streak = 0;
    for (let i = currentMonthIndex; i >= 0; i--) {
      if (paymentMatrix[memberId]?.[months[i]]) {
        streak++;
      } else {
        break;
      }
    }
    
    // Calculate unpaid count (only past months including current)
    const unpaidCount = months.slice(0, currentMonthIndex + 1).filter(month => !paymentMatrix[memberId]?.[month]).length;
    
    // Calculate total paid amount
    const totalPaid = payments
      .filter(p => p.memberId === memberId && p.year === selectedYear && p.paid)
      .reduce((sum, p) => sum + p.amount, 0);
    
    return { paidCountYTD, paidCountTotal, streak, unpaidCount, totalPaid };
  };

  const togglePayment = async (memberId: string, month: string) => {
    const paymentId = `${memberId}_${month}_${selectedYear}`;
    const currentStatus = paymentMatrix[memberId]?.[month];
    const newStatus = !currentStatus;
    
    try {
      await updatePayment(paymentId, newStatus, currentUser?.id);
      
      // Show "Just Paid" animation
      if (newStatus) {
        setJustPaidCell(`${memberId}_${month}`);
        setTimeout(() => setJustPaidCell(null), 2000);
        
        // Check if all members paid for this month
        const allPaidForMonth = members.every(m => {
          if (m.id === memberId) return true; // Current toggle
          return paymentMatrix[m.id]?.[month];
        });
        
        if (allPaidForMonth) {
          triggerConfetti();
        }
      }
    } catch (error) {
      console.error('Failed to update payment:', error);
    }
  };

  const markAllAsPaidForCurrentMonth = async () => {
    if (!window.confirm(`Mark all members as paid for ${currentMonth}?`)) return;
    
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
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-tracking-${selectedYear}.csv`;
    link.click();
  };

  // Scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate summary stats
  const currentMonthStats = getMonthlyStats(currentMonth);
  const totalOutstanding = members.reduce((sum, member) => {
    const unpaid = months.slice(0, currentMonthIndex + 1).filter(month => !paymentMatrix[member.id]?.[month]).length;
    return sum + (unpaid * 300);
  }, 0);
  const overallCompletionRate = Math.round(
    (members.reduce((sum, member) => sum + getMemberStats(member.id).paidCountYTD, 0) / (members.length * (currentMonthIndex + 1))) * 100
  );

  return (
    <div className="space-y-6 relative" ref={scrollContainerRef}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🎉 🎊 ✨
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* This Month Card */}
        <div className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 shadow-lg p-5 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-white/80 mb-1">This Month ({currentMonth})</p>
              <p className="text-3xl font-bold text-white drop-shadow-lg">
                {currentMonthStats.paid}/{currentMonthStats.total}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${currentMonthStats.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-blue-200 font-semibold">{currentMonthStats.percentage}%</span>
              </div>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-300" />
          </div>
        </div>

        {/* Outstanding Card */}
        <div className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 shadow-lg p-5 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-white/80 mb-1">Total Outstanding</p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                LKR {totalOutstanding.toLocaleString()}
              </p>
              <p className="text-xs text-orange-200 mt-2">
                {members.length - currentMonthStats.paid} members pending
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-orange-300" />
            </div>

        {/* Completion Rate Card */}
        <div className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-green-500/20 border border-green-300/30 shadow-lg p-5 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-white/80 mb-1">Overall Completion</p>
              <p className="text-3xl font-bold text-white drop-shadow-lg">{overallCompletionRate}%</p>
              <p className="text-xs text-green-200 mt-2">Year to date progress</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-300" />
          </div>
        </div>

        {/* YTD Collection Card */}
        <div className="group relative overflow-hidden rounded-xl backdrop-blur-xl bg-purple-500/20 border border-purple-300/30 shadow-lg p-5 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-white/80 mb-1">YTD Collection</p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                LKR {monthlyTotals.yearlyGross.toLocaleString()}
              </p>
              <p className="text-xs text-purple-200 mt-2">Total collected {selectedYear}</p>
            </div>
            <Download className="h-10 w-10 text-purple-300" />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search members by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-white/50 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <GlassButton
              variant={showOnlyUnpaid ? "primary" : "secondary"}
              onClick={() => setShowOnlyUnpaid(!showOnlyUnpaid)}
              className="px-4 py-2.5 text-sm font-medium"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showOnlyUnpaid ? 'Show All' : 'Show Unpaid'}
            </GlassButton>
            
            <GlassButton
              variant="accent"
              onClick={markAllAsPaidForCurrentMonth}
              className="px-4 py-2.5 text-sm font-medium"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark All Paid
            </GlassButton>
            
            <GlassButton
              variant="secondary"
              onClick={exportToCSV}
              className="px-4 py-2.5 text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </GlassButton>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2.5 backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg text-sm font-medium text-white hover:bg-white/30 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              {availableYears.map(year => (
                <option key={year} value={year} className="bg-slate-800">{year}</option>
              ))}
            </select>
        </div>
        </div>
      </div>

      {/* Payment Grid */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">Payment Tracking</h2>
              <p className="text-sm text-white/80 drop-shadow mt-1">
                {filteredMembers.length} of {members.length} members shown • Click checkboxes to toggle
              </p>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-green-500/60 border-2 border-green-400 rounded"></div>
                <span className="text-white/90 font-medium">Paid</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-orange-500/60 border-2 border-orange-400 rounded animate-pulse"></div>
                <span className="text-white/90 font-medium">Current</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-red-500/60 border-2 border-red-400 rounded"></div>
                <span className="text-white/90 font-medium">Overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Table Header */}
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
                <th className="px-6 py-5 text-left text-xs font-bold text-white/90 uppercase tracking-wider sticky left-0 bg-white/10 backdrop-blur-xl z-30 min-w-[200px]">
                  <div>Member</div>
                  <div className="text-xs text-white/60 normal-case font-normal mt-1">Progress & Stats</div>
                </th>
                
                {months.map((month, index) => {
                  const stats = getMonthlyStats(month);
                  const status = getCurrentMonthStatus(month, index);
                  const colorClass = 
                    stats.percentage >= 80 ? 'text-green-300' :
                    stats.percentage >= 50 ? 'text-yellow-300' :
                    stats.percentage < 50 && index <= currentMonthIndex ? 'text-red-300' :
                    'text-white/50';
                  
                  return (
                    <th 
                      key={month} 
                      className={`px-5 py-5 text-center text-xs font-bold uppercase tracking-wider min-w-[120px] transition-all duration-300 relative group ${
                        status === 'current' ? 'bg-blue-500/30 scale-105' : ''
                      }`}
                      title={`${month} ${selectedYear} - ${stats.paid}/${stats.total} paid (${stats.percentage}%)`}
                    >
                      <div className={`font-bold transition-all ${
                        status === 'current' ? 'text-blue-200 text-base' : colorClass
                      }`}>
                        {month.slice(0, 3).toUpperCase()}
                        {status === 'current' && (
                          <div className="inline-block ml-1.5 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      
                      {/* Full month name on hover */}
                      <div className="absolute hidden group-hover:block top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-slate-900/95 text-white rounded-lg shadow-xl whitespace-nowrap z-40 text-sm font-normal">
                        <div className="font-semibold">{month} {selectedYear}</div>
                        <div className="text-xs text-white/80 mt-1">{stats.paid} of {stats.total} paid</div>
                        <div className={`text-xs font-bold mt-1 ${colorClass}`}>{stats.percentage}% complete</div>
                      </div>
                      
                      <div className={`text-xs mt-2 font-semibold ${colorClass}`}>
                        {stats.paid}/{stats.total}
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            stats.percentage >= 80 ? 'bg-green-500' :
                            stats.percentage >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </th>
                  );
                })}
                
                <th className="px-6 py-5 text-center text-xs font-bold text-white/90 uppercase tracking-wider sticky right-0 bg-white/10 backdrop-blur-xl z-30 min-w-[140px]">
                  <div>Total</div>
                  <div className="text-xs text-white/60 normal-case font-normal mt-1">Progress</div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white/5 divide-y divide-white/10 backdrop-blur-sm">
              {/* Gross Row */}
              <tr className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-b-2 border-red-300/50 backdrop-blur-sm sticky top-[73px] z-10">
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl z-20">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-red-200 drop-shadow">Gross</div>
                    <div className="px-2 py-0.5 bg-red-500/40 text-red-100 text-xs rounded-full">Monthly</div>
                  </div>
                </td>
                {months.map((month) => (
                  <td key={month} className="px-5 py-4 text-center">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
                      LKR {monthlyTotals.monthlyGrosses[month]?.toLocaleString() || '0'}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center sticky right-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl z-20">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg">
                    LKR {monthlyTotals.yearlyGross.toLocaleString()}
                  </div>
                </td>
              </tr>
              
              {/* Total Row */}
              <tr className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-b-2 border-red-300/50 backdrop-blur-sm sticky top-[121px] z-10">
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl z-20">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-red-200 drop-shadow">Total</div>
                    <div className="px-2 py-0.5 bg-red-500/40 text-red-100 text-xs rounded-full">Cumulative</div>
                  </div>
                </td>
                {months.map((month) => (
                  <td key={month} className="px-5 py-4 text-center">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg hover:scale-105 transition-transform">
                      LKR {monthlyTotals.cumulativeTotals[month]?.toLocaleString() || '0'}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center sticky right-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl z-20">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm px-3 py-2 rounded-lg backdrop-blur-sm shadow-lg">
                    LKR {monthlyTotals.yearlyGross.toLocaleString()}
                  </div>
                </td>
              </tr>

              {/* Member Rows */}
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 text-white/30" />
                      <p className="text-white/70 text-lg">No members found matching "{searchTerm}"</p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-300 hover:text-blue-200 text-sm underline"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, memberIndex) => {
                  const { paidCountTotal, streak, unpaidCount, totalPaid } = getMemberStats(member.id);
                  // MODIFIED: Calculate percentage based on 12 months total
                  const percentage = Math.round((paidCountTotal / 12) * 100);
                  const isAllPaidYTD = getMemberStats(member.id).paidCountYTD === currentMonthIndex + 1;
                  
                  return (
                    <tr 
                      key={member.id} 
                      className={`group hover:bg-white/15 transition-all duration-200 ${
                        memberIndex % 2 === 0 ? 'bg-white/5' : 'bg-white/0'
                      }`}
                    >
                      {/* Member Info Cell */}
                      <td className="px-6 py-5 whitespace-nowrap sticky left-0 bg-white/5 group-hover:bg-white/15 backdrop-blur-xl z-10">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                              <span className="text-base font-bold text-white drop-shadow">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-sm font-semibold text-white truncate">
                                  {member.name}
                                </div>
                                {isAllPaidYTD && (
                                  <div className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-100 text-xs rounded-full font-medium flex items-center gap-1 animate-pulse">
<Sparkles className="h-3 w-3" />
All Paid!
</div>
)}
{unpaidCount >= 3 && !isAllPaidYTD && (
<div className="flex-shrink-0 px-2 py-0.5 bg-red-500/40 text-red-100 text-xs rounded-full font-medium flex items-center gap-1">
<AlertTriangle className="h-3 w-3" />
{unpaidCount} overdue
</div>
)}
</div>
<div className="flex items-center gap-3 text-xs text-white/70">
{streak > 0 && (
<div className="flex items-center gap-1 text-orange-300">
<span>🔥</span>
<span className="font-semibold">{streak} month streak</span>
</div>
)}
<div className="flex items-center gap-1">
<span>Paid:</span>
<span className="font-semibold text-white/90">LKR {totalPaid.toLocaleString()}</span>
</div>
</div>
</div>
</div>
                        </div>
                      </td>
                      
                      {/* Payment Checkboxes */}
                      {months.map((month, index) => {
                        const isPaid = paymentMatrix[member.id]?.[month];
                        const status = getCurrentMonthStatus(month, index);
                        const cellKey = `${member.id}_${month}`;
                        const isJustPaid = justPaidCell === cellKey;
                        
                        return (
                          <td key={month} className="px-5 py-5 text-center">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => togglePayment(member.id, month)}
                                aria-label={`${isPaid ? 'Unmark' : 'Mark'} ${member.name}'s payment for ${month} as ${isPaid ? 'unpaid' : 'paid'}`}
                                className={`relative w-9 h-9 rounded-lg border-2 transition-all duration-200 flex items-center justify-center shadow-md hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed focus:ring-2 focus:ring-white/50 focus:outline-none ${
                                  isPaid
                                    ? 'bg-green-500/60 border-green-400 hover:bg-green-500/80'
                                    : status === 'current'
                                    ? 'bg-orange-500/60 border-orange-400 hover:bg-orange-500/80 animate-pulse'
                                    : status === 'past'
                                    ? 'bg-red-500/60 border-red-400 hover:bg-red-500/80'
                                    : 'bg-white/10 border-white/30 hover:bg-white/20'
                                  } ${isJustPaid ? 'animate-bounce' : ''}`}
                                title={isPaid ? `Paid on ${month} - Click to unmark` : `Not paid for ${month} - Click to mark as paid (LKR 300)`}
                              >
                                {isPaid && (
                                  <Check className="h-5 w-5 text-white drop-shadow" />
                                )}
                                
                                {/* Just Paid Animation */}
                                {isJustPaid && (
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap animate-fade-in-up">
                                    Just Paid! 🎉
                                  </div>
                                )}
                                
                                {/* Hover Tooltip */}
                                {!isPaid && status !== 'future' && (
                                  <div className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap z-40">
                                    Click to pay LKR 300
                                  </div>
                                )}
                              </button>
                            </div>
                          </td>
                        );
                      })}
                      
                      {/* Total Cell */}
                      <td className="px-6 py-5 whitespace-nowrap text-center sticky right-0 bg-white/5 group-hover:bg-white/15 backdrop-blur-xl z-10">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-white drop-shadow">
                            {/* MODIFIED: Always show progress out of 12 */}
                            **{paidCountTotal}/12**
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                'bg-gradient-to-r from-red-500 to-pink-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className={`text-xs font-semibold ${
                            percentage >= 80 ? 'text-green-300' :
                            percentage >= 50 ? 'text-yellow-300' :
                            'text-red-300'
                          }`}>
                            {percentage}% Complete
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

    {/* Footer */}
    <div className="px-6 py-4 bg-white/10 border-t border-white/20 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="text-white/80">
          Monthly Contribution: <span className="font-semibold text-white">LKR 300</span> per member
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white/80">
            Annual Target: <span className="font-semibold text-white">LKR {(members.length * 300 * 12).toLocaleString()}</span>
          </div>
          <div className="text-white/80">
            YTD Collected: <span className="font-semibold text-green-300">LKR {monthlyTotals.yearlyGross.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Back to Top Button */}
  {showScrollTop && (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-4 rounded-full backdrop-blur-xl bg-blue-500/30 border border-blue-400/50 text-white shadow-2xl hover:scale-110 hover:bg-blue-500/40 transition-all duration-300 z-40 animate-bounce"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  )}

  {/* Custom Animations */}
  <style jsx>{`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translate(-50%, 10px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    
    .animate-fade-in-up {
      animation: fade-in-up 0.3s ease-out;
    }
    
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite linear;
      background: linear-gradient(
        to right,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      background-size: 1000px 100%;
    }
  `}</style>
</div>;)
}