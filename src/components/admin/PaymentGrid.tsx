import React, { useState, useMemo } from 'react';
import { Check, X, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PaymentGrid() {
  const { payments, updatePayment, currentUser, allUsers } = useApp();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const members = allUsers.filter(user => user.role === 'member');
  
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
    <div className="relative rounded-2xl backdrop-blur-xl bg-white/10 shadow-2xl overflow-hidden">
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl p-[2px] animated-border-wrapper">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animated-border" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute inset-[2px] rounded-2xl border border-white/20 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white drop-shadow">Payment Tracking</h2>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-1 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-sm font-medium text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {availableYears.map(year => (<option key={year} value={year} className="bg-slate-800">{year}</option>))}
                </select>
              </div>
              <p className="text-sm text-white/80 drop-shadow">Click on checkboxes to mark payments</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400/30 border-2 border-green-400 rounded flex items-center justify-center backdrop-blur-sm">
                  <Check className="h-2.5 w-2.5 text-green-300" />
                </div>
                <span className="text-white/80">Paid</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400/20 border-2 border-red-300/50 rounded backdrop-blur-sm"></div>
                <span className="text-white/80">Pending</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider sticky left-0 bg-white/5 backdrop-blur-sm z-10">Member</th>
                {months.map((month) => {
                  const stats = getMonthlyStats(month);
                  return (
                    <th key={month} className="px-4 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider min-w-[100px]">
                      <div><div>{month.slice(0, 3)}</div>
                      <div className="text-xs text-white/50 mt-1">{stats.paid}/{stats.total} ({stats.percentage}%)</div></div>
                    </th>
                  );
                })}
                <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/10 backdrop-blur-sm">
              <tr className="bg-red-500/30 border-b-2 border-red-400/50 backdrop-blur-sm">
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-red-500/30 backdrop-blur-sm z-10">
                  <div className="text-sm font-bold text-red-200">Gross</div>
                </td>
                {months.map((month) => (
                  <td key={month} className="px-4 py-4 text-center">
                    <div className="bg-green-600/80 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-lg">
                      LKR {monthlyTotals.monthlyGrosses[month]?.toLocaleString() || '0'}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="bg-green-600/80 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-lg">
                    LKR {monthlyTotals.yearlyGross.toLocaleString()}
                  </div>
                </td>
              </tr>
              
              <tr className="bg-red-500/30 border-b-2 border-red-400/50 backdrop-blur-sm">
                <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-red-500/30 backdrop-blur-sm z-10">
                  <div className="text-sm font-bold text-red-200">Total</div>
                </td>
                {months.map((month) => (
                  <td key={month} className="px-4 py-4 text-center">
                    <div className="bg-green-600/80 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-lg">
                      LKR {monthlyTotals.cumulativeTotals[month]?.toLocaleString() || '0'}
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="bg-green-600/80 text-white font-bold text-sm px-2 py-1 rounded backdrop-blur-sm shadow-lg">
                    LKR {monthlyTotals.yearlyGross.toLocaleString()}
                  </div>
                </td>
              </tr>

              {members.map((member) => {
                const paidCount = months.filter(month => paymentMatrix[member.id][month]).length;
                const percentage = Math.round((paidCount / months.length) * 100);
                
                return (
                  <tr key={member.id} className="hover:bg-white/10 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white/5 backdrop-blur-sm z-10">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-medium text-white">{member.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-3"><div className="text-sm font-medium text-white">{member.name}</div></div>
                      </div>
                    </td>
                    {months.map((month) => {
                      const isPaid = paymentMatrix[member.id][month];
                      return (
                        <td key={month} className="px-4 py-4 text-center">
                          <button onClick={() => togglePayment(member.id, month)}
                            className={`w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center backdrop-blur-sm ${
                              isPaid ? 'bg-green-400/30 border-green-400 hover:bg-green-400/40' : 'bg-red-400/20 border-red-300/50 hover:bg-red-400/30 hover:border-red-300'
                            }`}>
                            {isPaid && <Check className="h-3.5 w-3.5 text-green-200" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-white">{paidCount}/{months.length}</div>
                      <div className="text-xs text-white/70">({percentage}%)</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white/5 border-t border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/80">Total Monthly Contribution: LKR 300 per member</div>
            <div className="text-white font-medium">Expected Annual Collection: LKR {(members.length * 300 * 12).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes border-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-border-wrapper { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .animated-border { background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8), transparent); background-size: 200% 200%; animation: border-flow 3s linear infinite; animation-delay: inherit; }
      `}</style>
    </div>
  );
}
