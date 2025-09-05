import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';

export default function Reports() {
  const { payments, loans, allUsers } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const members = allUsers.filter(user => user.role === 'member');

  // Get available years from payments data
  const availableYears = useMemo(() => {
    return [...new Set(payments.map(p => p.year))].sort((a, b) => b - a);
  }, [payments]);

  const monthlyReport = useMemo(() => {
    const monthName = months[selectedMonth];
    const monthPayments = payments.filter(p => 
      p.month === monthName && 
      p.year === selectedYear
    );

    const paidMembers = monthPayments.filter(p => p.paid);
    const unpaidMembers = monthPayments.filter(p => !p.paid);
    
    const totalCollected = paidMembers.reduce((sum, p) => sum + p.amount, 0);
    const collectionRate = (paidMembers.length / members.length) * 100;

    return {
      monthName,
      year: selectedYear,
      totalMembers: members.length,
      paidMembers: paidMembers.length,
      unpaidMembers: unpaidMembers.length,
      totalCollected,
      expectedCollection: members.length * MONTHLY_CONTRIBUTION,
      collectionRate: Math.round(collectionRate),
      paidMembersList: paidMembers.map(p => members.find(m => m.id === p.memberId)?.name).filter(Boolean),
      unpaidMembersList: unpaidMembers.map(p => members.find(m => m.id === p.memberId)?.name).filter(Boolean)
    };
  }, [selectedMonth, selectedYear, payments, members]);

  const yearlyReport = useMemo(() => {
    const yearPayments = payments.filter(p => p.year === selectedYear && p.paid);
    const yearLoans = loans.filter(l => new Date(l.issueDate).getFullYear() === selectedYear);
    
    const totalCollected = yearPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalLoaned = yearLoans.reduce((sum, l) => sum + l.amount, 0);
    const totalRepaid = yearLoans.reduce((sum, l) => sum + l.repaidAmount, 0);
    const netFunds = totalCollected - totalLoaned + totalRepaid;

    const monthlyBreakdown = months.map((month, index) => {
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
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `savings-group-report-${selectedYear}-${months[selectedMonth]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">View detailed reports on payments and group performance</p>
        </div>
        <GlassButton
          variant="accent"
          onClick={exportReport}
          className="flex items-center px-4 py-2"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </GlassButton>
      </div>

      {/* Filters */}
      <GlassCard variant="gradient" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Monthly Report */}
      <GlassCard variant="gradient">
        <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-blue-500 from-opacity-10 to-green-500 to-opacity-10 dark:from-blue-600 dark:from-opacity-10 dark:to-green-600 dark:to-opacity-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Report - {monthlyReport.monthName} {monthlyReport.year}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{monthlyReport.collectionRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-30 dark:border-blue-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{monthlyReport.paidMembers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Members Paid</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 backdrop-blur-sm border border-orange-300 border-opacity-30 dark:border-orange-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{monthlyReport.unpaidMembers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Members Pending</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20 backdrop-blur-sm border border-purple-300 border-opacity-30 dark:border-purple-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">LKR {monthlyReport.totalCollected.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Amount Collected</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Members Who Paid ({monthlyReport.paidMembers})</h4>
              <div className="bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 rounded-lg p-4 max-h-40 overflow-y-auto backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
                {monthlyReport.paidMembersList.length > 0 ? (
                  <div className="space-y-1">
                    {monthlyReport.paidMembersList.map((name, index) => (
                      <div key={index} className="text-sm text-green-800 dark:text-green-200">✓ {name}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">No payments recorded</div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Pending Payments ({monthlyReport.unpaidMembers})</h4>
              <div className="bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 rounded-lg p-4 max-h-40 overflow-y-auto backdrop-blur-sm border border-orange-300 border-opacity-30 dark:border-orange-600 dark:border-opacity-30">
                {monthlyReport.unpaidMembersList.length > 0 ? (
                  <div className="space-y-1">
                    {monthlyReport.unpaidMembersList.map((name, index) => (
                      <div key={index} className="text-sm text-orange-800 dark:text-orange-200">⚠ {name}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">All members have paid</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Yearly Report */}
      <GlassCard variant="gradient">
        <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-purple-500 from-opacity-10 to-pink-500 to-opacity-10 dark:from-purple-600 dark:from-opacity-10 dark:to-pink-600 dark:to-opacity-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Yearly Report - {yearlyReport.year}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">LKR {yearlyReport.totalCollected.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Collected</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 backdrop-blur-sm border border-red-300 border-opacity-30 dark:border-red-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">LKR {yearlyReport.totalLoaned.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Loaned</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-30 dark:border-blue-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">LKR {yearlyReport.totalRepaid.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Repaid</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20 backdrop-blur-sm border border-purple-300 border-opacity-30 dark:border-purple-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">LKR {yearlyReport.netFunds.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Net Funds</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Monthly Collection Breakdown</h4>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {yearlyReport.monthlyBreakdown.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{month.month}</div>
                  <div className={`h-12 bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm flex items-end justify-center text-xs text-white font-medium ${
                    month.collected === 0 ? 'opacity-20' : ''
                  }`} style={{
                    height: `${Math.max(12, (month.collected / (members.length * MONTHLY_CONTRIBUTION)) * 48)}px`
                  }}>
                    {month.members}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">₹{Math.round(month.collected / 1000)}k</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">LKR {Math.round(month.collected / 1000)}k</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}