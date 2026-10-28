import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, Calendar, DollarSign, CheckSquare, Square, LogOut, UserCheck, ArrowUpRight, BarChart3, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';

export default function Reports() {
  const { payments, loans, allUsers, activeMembers, memberExits } = useApp();
  const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Active members only
  const members = useMemo(() => {
    if (activeMembers && activeMembers.length > 0) return activeMembers;
    return allUsers.filter(user => user.role === 'member' && user.status === 'active');
  }, [activeMembers, allUsers]);

  // Available years from payments
  const availableYears = useMemo(() => {
    const years = [...new Set(payments.map(p => p.year))].sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [payments]);

  const toggleMonth = (monthIndex: number) => {
    setSelectedMonths(prev => {
      if (prev.includes(monthIndex)) {
        return prev.filter(m => m !== monthIndex);
      } else {
        return [...prev, monthIndex].sort((a, b) => a - b);
      }
    });
  };

  const toggleAllMonths = () => {
    if (selectedMonths.length === 12) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    }
  };

  const monthlyReport = useMemo(() => {
    if (selectedMonths.length === 0) {
      return {
        monthNames: 'No months selected',
        year: selectedYear,
        totalMembers: members.length,
        paidMembers: 0,
        unpaidMembers: members.length,
        totalCollected: 0,
        expectedCollection: 0,
        collectionRate: 0,
        paidMembersList: [],
        unpaidMembersList: members.map(m => m.name)
      };
    }

    const selectedMonthNames = selectedMonths.map(index => months[index]);
    const monthNames = selectedMonthNames.length === 12 ? 'All Months' : 
                     selectedMonthNames.length === 1 ? selectedMonthNames[0] :
                     selectedMonthNames.join(', ');

    const relevantPayments = payments.filter(p => 
      selectedMonthNames.includes(p.month) && 
      p.year === selectedYear
    );

    const memberPaymentStatus = members.map(member => {
      const memberPayments = relevantPayments.filter(p => p.memberId === member.id);
      const paidCount = memberPayments.filter(p => p.paid).length;
      const totalExpected = selectedMonths.length;
      
      return {
        member,
        paidCount,
        totalExpected,
        isPaidInFull: paidCount === totalExpected,
        totalPaid: memberPayments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0)
      };
    });

    const paidMembers = memberPaymentStatus.filter(m => m.isPaidInFull);
    const unpaidMembers = memberPaymentStatus.filter(m => !m.isPaidInFull);
    
    const totalCollected = relevantPayments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
    const expectedCollection = members.length * MONTHLY_CONTRIBUTION * selectedMonths.length;
    const collectionRate = members.length > 0 ? Math.round((paidMembers.length / members.length) * 100) : 0;

    const paidMembersList = paidMembers.map(m => m.member.name);
    const unpaidMembersList = unpaidMembers.map(m => m.member.name);

    return {
      monthNames,
      year: selectedYear,
      totalMembers: members.length,
      paidMembers: paidMembers.length,
      unpaidMembers: unpaidMembers.length,
      totalCollected,
      expectedCollection,
      collectionRate,
      paidMembersList,
      unpaidMembersList
    };
  }, [selectedMonths, selectedYear, payments, members]);

  const yearlyReport = useMemo(() => {
    const yearPayments = payments.filter(p => p.year === selectedYear && p.paid);
    const yearLoans = loans.filter(l => new Date(l.issueDate).getFullYear() === selectedYear);
    
    const totalCollected = yearPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalLoaned = yearLoans.reduce((sum, l) => sum + l.amount, 0);
    const totalRepaid = yearLoans.reduce((sum, l) => sum + l.repaidAmount, 0);
    const netFunds = totalCollected - totalLoaned + totalRepaid;

    const monthlyBreakdown = months.map((month) => {
      const monthPayments = yearPayments.filter(p => p.month === month);
      return {
        month: month.slice(0, 3),
        collected: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        members: monthPayments.length
      };
    });

    return {
      year: selectedYear,
      totalCollected,
      totalLoaned,
      totalRepaid,
      netFunds,
      monthlyBreakdown,
      averageMonthlyCollection: totalCollected / 12
    };
  }, [selectedYear, payments, loans, members]);

  const exportReport = () => {
    const reportData = {
      monthlyReport,
      yearlyReport,
      selectedMonths: selectedMonths.map(index => months[index]),
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const monthsText = selectedMonths.length === 12 ? 'All-Months' : 
                     selectedMonths.length === 1 ? months[selectedMonths[0]] :
                     `${selectedMonths.length}-Months`;
    const exportFileDefaultName = `savings-group-report-${selectedYear}-${monthsText}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6 text-black animate-fadeIn">
      
      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              REPORTS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#FFE600] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                FINANCIAL AUDIT ENGINE v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {members.length} MEMBERS AUDITED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={exportReport}
              className="brutal-btn bg-[#FFE600] hover:bg-[#FFF275] text-black px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── MONTH & YEAR SELECTOR BAR ─── */}
      <div className="brutal-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black/10 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            Filter Cycles by Month & Year
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAllMonths}
              className="brutal-btn px-2.5 py-1 bg-white hover:bg-gray-100 text-[10px] font-black uppercase text-black"
            >
              {selectedMonths.length === 12 ? 'Deselect All' : 'Select All 12M'}
            </button>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="brutal-btn bg-white text-black px-2.5 py-1 text-xs font-black cursor-pointer uppercase"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 12-Month Checkbox Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {months.map((month, index) => {
            const isSelected = selectedMonths.includes(index);
            return (
              <button
                key={month}
                onClick={() => toggleMonth(index)}
                className={`py-2 px-1 text-center border-2 border-black font-mono text-xs font-black uppercase transition-all ${
                  isSelected
                    ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]'
                    : 'bg-white text-black/60 hover:bg-gray-50'
                }`}
              >
                {month.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── METRIC CARDS FOR SELECTED PERIOD ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Collection Rate (Electric Yellow Hero) */}
        <div className="brutal-card-yellow p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-[#FFE600] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>COMPLIANCE</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              COLLECTION RATE
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {monthlyReport.collectionRate}%
              </h2>
            </div>
          </div>
        </div>

        {/* Card 2: Members Paid */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>SETTLED</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              MEMBERS CLEARED
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {monthlyReport.paidMembers}
              </h2>
              <span className="text-xs font-mono font-bold text-black/60">
                of {monthlyReport.totalMembers}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Members Pending */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>DUE</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              MEMBERS PENDING
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {monthlyReport.unpaidMembers}
              </h2>
            </div>
          </div>
        </div>

        {/* Card 4: Total Amount */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>TOTAL</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              AMOUNT COLLECTED
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                LKR {monthlyReport.totalCollected.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* ─── CLEARED VS PENDING MEMBER BREAKDOWN ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cleared Members */}
        <div className="brutal-card p-5 space-y-3">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h3 className="font-black text-xs uppercase tracking-wider text-black">
              Cleared Members ({monthlyReport.paidMembers})
            </h3>
            <span className="bg-[#06D6A0] text-black text-[9px] font-mono font-bold px-1.5 py-0.5 border border-black">
              SETTLED
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {monthlyReport.paidMembersList.length > 0 ? (
              monthlyReport.paidMembersList.map((name, idx) => (
                <div key={idx} className="p-2 bg-emerald-50 border border-emerald-600 text-xs font-mono font-bold text-emerald-950 flex items-center justify-between">
                  <span>{name}</span>
                  <span>✓ Cleared</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-black/60 p-4 text-center">No settled records in this period.</p>
            )}
          </div>
        </div>

        {/* Pending Members */}
        <div className="brutal-card p-5 space-y-3">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h3 className="font-black text-xs uppercase tracking-wider text-black">
              Pending Members ({monthlyReport.unpaidMembers})
            </h3>
            <span className="bg-[#FFEAEA] text-red-600 text-[9px] font-mono font-bold px-1.5 py-0.5 border border-black">
              ACTION REQUIRED
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {monthlyReport.unpaidMembersList.length > 0 ? (
              monthlyReport.unpaidMembersList.map((name, idx) => (
                <div key={idx} className="p-2 bg-red-50 border border-red-500 text-xs font-mono font-bold text-red-900 flex items-center justify-between">
                  <span>{name}</span>
                  <span>⏳ Due</span>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-emerald-700 p-4 text-center font-bold">🎉 All active members have paid for this period!</p>
            )}
          </div>
        </div>

      </div>

      {/* ─── YEARLY PERFORMANCE OVERVIEW ─── */}
      <div className="brutal-card p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center border-b-2 border-black pb-2">
          <h3 className="font-black text-sm uppercase tracking-wider text-black">
            Yearly Audit Performance ({yearlyReport.year})
          </h3>
          <span className="bg-[#FFE600] text-black text-[10px] font-mono font-bold px-2 py-0.5 border border-black">
            NET: LKR {yearlyReport.netFunds.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-gray-50 border-2 border-black">
            <p className="text-black/60 uppercase text-[9px] font-black">Total Inflow</p>
            <p className="text-base font-black text-emerald-700 mt-1">LKR {yearlyReport.totalCollected.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-black">
            <p className="text-black/60 uppercase text-[9px] font-black">Loans Issued</p>
            <p className="text-base font-black text-red-600 mt-1">LKR {yearlyReport.totalLoaned.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-black">
            <p className="text-black/60 uppercase text-[9px] font-black">Loans Repaid</p>
            <p className="text-base font-black text-blue-700 mt-1">LKR {yearlyReport.totalRepaid.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gray-50 border-2 border-black">
            <p className="text-black/60 uppercase text-[9px] font-black">Monthly Average</p>
            <p className="text-base font-black text-black mt-1">LKR {Math.round(yearlyReport.averageMonthlyCollection).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ─── MEMBER EXITS AUDIT HISTORY ─── */}
      <div className="brutal-card overflow-hidden">
        <div className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-[#FFE600]" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              Member Exit & Refund History
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#FFE600] font-bold">
            Total Exited: {memberExits.length}
          </span>
        </div>

        {memberExits.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <UserCheck className="w-10 h-10 text-black/30 mx-auto" />
            <p className="font-mono font-bold text-xs text-black/60">No member exit refunds recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="p-3 font-black uppercase text-black">Member</th>
                  <th className="p-3 font-black uppercase text-black">Exit Date</th>
                  <th className="p-3 font-black uppercase text-black">Months Paid</th>
                  <th className="p-3 font-black uppercase text-black text-right">Refund Issued</th>
                  <th className="p-3 font-black uppercase text-black">Admin Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10 bg-white">
                {memberExits.map((exit) => (
                  <tr key={exit.id} className="hover:bg-yellow-50">
                    <td className="p-3 font-black text-black">{exit.memberName}</td>
                    <td className="p-3 text-black/70">{new Date(exit.exitDate).toLocaleDateString()}</td>
                    <td className="p-3 text-black">{exit.totalPaidMonths} months</td>
                    <td className="p-3 text-right font-black text-emerald-700">LKR {exit.refundAmount.toLocaleString()}</td>
                    <td className="p-3 text-black/60 italic">{exit.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
