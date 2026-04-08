import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, Calendar, DollarSign, CheckSquare, Square, LogOut, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';

export default function Reports() {
  const { payments, loans, allUsers, memberExits } = useApp();
  const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const members = allUsers.filter(user => user.role === 'member');

  // Get available years from payments data
  const availableYears = useMemo(() => {
    return [...new Set(payments.map(p => p.year))].sort((a, b) => b - a);
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

    // Get payments for selected months and year
    const relevantPayments = payments.filter(p => 
      selectedMonthNames.includes(p.month) && 
      p.year === selectedYear
    );

    // Calculate member payment status
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
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Months</label>
              <GlassButton
                variant="secondary"
                onClick={toggleAllMonths}
                className="text-xs px-3 py-1"
              >
                {selectedMonths.length === 12 ? 'Deselect All' : 'Select All'}
              </GlassButton>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {months.map((month, index) => {
                const isSelected = selectedMonths.includes(index);
                return (
                  <GlassButton
                    key={month}
                    variant={isSelected ? "primary" : "secondary"}
                    onClick={() => toggleMonth(index)}
                    className={`text-xs px-2 py-2 flex items-center justify-center ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 ring-opacity-50' 
                        : ''
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="h-3 w-3 mr-1" />
                    ) : (
                      <Square className="h-3 w-3 mr-1" />
                    )}
                    {month.slice(0, 3)}
                  </GlassButton>
                );
              })}
            </div>
            {selectedMonths.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedMonths.length === 12 ? 'All months' : `${selectedMonths.length} month${selectedMonths.length > 1 ? 's' : ''}`}
              </div>
            )}
          </div>
          <div className="flex items-end">
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedMonths.length === 1 ? 'Monthly' : 'Multi-Month'} Report - {monthlyReport.monthNames} {monthlyReport.year}
          </h3>
          {selectedMonths.length > 1 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Members are considered "paid" only if they have paid for ALL selected months
            </p>
          )}
        </div>
        <div className="p-6">
          {selectedMonths.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-500 bg-opacity-20 dark:bg-gray-600 dark:bg-opacity-20 p-4 rounded-full backdrop-blur-sm mx-auto mb-4 w-fit">
                <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No months selected</h3>
              <p className="text-gray-500 dark:text-gray-400">Please select at least one month to view the report.</p>
            </div>
          ) : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{monthlyReport.collectionRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMonths.length === 1 ? 'Collection Rate' : 'Full Payment Rate'}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-30 dark:border-blue-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{monthlyReport.paidMembers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMonths.length === 1 ? 'Members Paid' : 'Members Fully Paid'}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 backdrop-blur-sm border border-orange-300 border-opacity-30 dark:border-orange-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{monthlyReport.unpaidMembers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMonths.length === 1 ? 'Members Pending' : 'Members Partially/Not Paid'}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20 backdrop-blur-sm border border-purple-300 border-opacity-30 dark:border-purple-600 dark:border-opacity-30">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">LKR {monthlyReport.totalCollected.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Amount Collected</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {selectedMonths.length === 1 ? 'Members Who Paid' : 'Members Who Paid All Selected Months'} ({monthlyReport.paidMembers})
              </h4>
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
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {selectedMonths.length === 1 ? 'Pending Payments' : 'Members With Missing Payments'} ({monthlyReport.unpaidMembers})
              </h4>
              <div className="bg-orange-500 bg-opacity-20 dark:bg-orange-600 dark:bg-opacity-20 rounded-lg p-4 max-h-40 overflow-y-auto backdrop-blur-sm border border-orange-300 border-opacity-30 dark:border-orange-600 dark:border-opacity-30">
                {monthlyReport.unpaidMembersList.length > 0 ? (
                  <div className="space-y-1">
                    {monthlyReport.unpaidMembersList.map((name, index) => (
                      <div key={index} className="text-sm text-orange-800 dark:text-orange-200">
                        ⚠ {name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedMonths.length === 1 ? 'All members have paid' : 'All members have paid for all selected months'}
                  </div>
                )}
              </div>
            </div>
          </div>
            </>
          )}
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

      {/* Member Exits Report */}
      <GlassCard variant="gradient">
        <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <LogOut className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Member Exit History</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{memberExits.length} exit{memberExits.length !== 1 ? 's' : ''} recorded</p>
              </div>
            </div>
            {memberExits.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-white/60">Total Refunds Issued</p>
                <p className="text-xl font-bold text-emerald-400">
                  LKR {memberExits.reduce((sum, e) => sum + e.refundAmount, 0).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          {memberExits.length === 0 ? (
            <div className="text-center py-10">
              <UserCheck className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No member exits recorded yet.</p>
              <p className="text-white/35 text-xs mt-1">Exit records will appear here when a member leaves the organization.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left pb-3 text-white/60 font-medium">Member</th>
                    <th className="text-left pb-3 text-white/60 font-medium">Exit Date</th>
                    <th className="text-center pb-3 text-white/60 font-medium">Months Paid</th>
                    <th className="text-right pb-3 text-white/60 font-medium">Refund Issued</th>
                    <th className="text-left pb-3 text-white/60 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {memberExits.map((exit) => (
                    <tr key={exit.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{exit.memberName.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-white font-medium">{exit.memberName}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-white/70">
                        {new Date(exit.exitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                          {exit.totalPaidMonths} months
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className="text-emerald-400 font-bold">LKR {exit.refundAmount.toLocaleString()}</span>
                      </td>
                      <td className="py-3 text-white/50 text-xs italic">
                        {exit.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-emerald-500/30">
                    <td colSpan={3} className="pt-3 text-white/70 font-semibold">Total Refunds Issued</td>
                    <td className="pt-3 text-right text-emerald-400 font-bold text-base">
                      LKR {memberExits.reduce((sum, e) => sum + e.refundAmount, 0).toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}