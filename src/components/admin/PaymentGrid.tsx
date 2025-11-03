import React, { useState, useMemo } from 'react';
import { Check, X, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';

export default function PaymentGrid() {
  const { payments, updatePayment, currentUser, allUsers } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const members = allUsers.filter(user => user.role === 'member');
  
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
    // Calculate previous year's total to carry over
    const previousYearTotal = payments
      .filter(p => p.year === selectedYear - 1 && p.paid)
      .reduce((sum, p) => sum + p.amount, 0);

    const monthlyGrosses: { [key: string]: number } = {};
    const cumulativeTotals: { [key: string]: number } = {};
    let runningTotal = previousYearTotal; // Start with previous year's total

    months.forEach(month => {
      const monthlyGross = payments
        .filter(p => p.month === month && p.year === selectedYear && p.paid)
        .reduce((sum, p) => sum + p.amount, 0);
      
      // For January, add the previous year's total to the gross display
      if (month === 'January') {
        monthlyGrosses[month] = monthlyGross + previousYearTotal;
      } else {
        monthlyGrosses[month] = monthlyGross;
      }
      
      runningTotal += monthlyGross;
      cumulativeTotals[month] = runningTotal;
    });

    // Calculate yearly gross (current year only, not including previous year carryover)
    const currentYearGross = payments
      .filter(p => p.year === selectedYear && p.paid)
      .reduce((sum, p) => sum + p.amount, 0);
    
    const yearlyGross = currentYearGross + previousYearTotal;

    return { monthlyGrosses, cumulativeTotals, yearlyGross, previousYearTotal };
  }, [payments, selectedYear]);
  const togglePayment = (memberId: string, month: string) => {
    const paymentId = `${memberId}_${month}_${selectedYear}`;
    const currentStatus = paymentMatrix[memberId][month];
    updatePayment(paymentId, !currentStatus, currentUser?.id).catch(console.error);
  };

  const getMonthlyStats = (month: string) => {
    const paid = members.filter(member => paymentMatrix[member.id][month]).length;
    const total = members.length;
    return { paid, total, percentage: Math.round((paid / total) * 100) };
  };

  return (
    <GlassCard variant="gradient" className="overflow-hidden">
      <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-blue-500 from-opacity-10 to-purple-500 to-opacity-10 dark:from-blue-600 dark:from-opacity-10 dark:to-purple-600 dark:to-opacity-10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Tracking</h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-opacity-40 dark:hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Click on checkboxes to mark payments</p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center">
                <Check className="h-2.5 w-2.5 text-green-600" />
              </div>
              <span className="text-gray-600 dark:text-gray-400">Paid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-10 backdrop-blur-sm">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-10 backdrop-blur-sm z-10">
                Member
              </th>
              {months.map((month) => {
                const stats = getMonthlyStats(month);
                return (
                  <th key={month} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                    <div>
                      <div>{month.slice(0, 3)}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {stats.paid}/{stats.total} ({stats.percentage}%)
                      </div>
                    </div>
                  </th>
                );
              })}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white bg-opacity-5 dark:bg-gray-800 dark:bg-opacity-5 divide-y divide-white divide-opacity-20 dark:divide-gray-700 dark:divide-opacity-20 backdrop-blur-sm">
            {/* Gross Row */}
            <tr className="bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 border-b-2 border-red-300 border-opacity-50 dark:border-red-600 dark:border-opacity-50 backdrop-blur-sm">
              <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 backdrop-blur-sm z-10">
                <div className="text-sm font-bold text-red-600 dark:text-red-400">Gross</div>
              </td>
              {months.map((month) => (
                <td key={month} className="px-4 py-4 text-center">
                  <div className="bg-green-600 dark:bg-green-500 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                    LKR {monthlyTotals.monthlyGrosses[month]?.toLocaleString() || '0'}
                  </div>
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="bg-green-600 dark:bg-green-500 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                  LKR {monthlyTotals.yearlyGross.toLocaleString()}
                </div>
              </td>
            </tr>
            
            {/* Total Row */}
            <tr className="bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 border-b-2 border-red-300 border-opacity-50 dark:border-red-600 dark:border-opacity-50 backdrop-blur-sm">
              <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-20 backdrop-blur-sm z-10">
                <div className="text-sm font-bold text-red-600 dark:text-red-400">Total</div>
              </td>
              {months.map((month) => (
                <td key={month} className="px-4 py-4 text-center">
                  <div className="bg-green-600 dark:bg-green-500 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                    LKR {monthlyTotals.cumulativeTotals[month]?.toLocaleString() || '0'}
                  </div>
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="bg-green-600 dark:bg-green-500 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                  LKR {monthlyTotals.yearlyGross.toLocaleString()}
                </div>
              </td>
            </tr>

            {members.map((member) => {
              const paidCount = months.filter(month => paymentMatrix[member.id][month]).length;
              const percentage = Math.round((paidCount / months.length) * 100);
              
              return (
                <tr key={member.id} className="hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-10 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white bg-opacity-5 dark:bg-gray-800 dark:bg-opacity-5 backdrop-blur-sm z-10">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  {months.map((month) => {
                    const isPaid = paymentMatrix[member.id][month];
                    return (
                      <td key={month} className="px-4 py-4 text-center">
                        <button
                          onClick={() => togglePayment(member.id, month)}
                          className={`w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                            isPaid
                              ? 'bg-green-100 border-green-500 hover:bg-green-200'
                              : 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300'
                          }`}
                        >
                          {isPaid && <Check className="h-3.5 w-3.5 text-green-600" />}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {paidCount}/{months.length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">({percentage}%)</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-10 border-t border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 backdrop-blur-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            Total Monthly Contribution: LKR 300 per member
          </div>
          <div className="text-gray-900 dark:text-white font-medium">
            Expected Annual Collection: LKR {(members.length * 300 * 12).toLocaleString()}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}