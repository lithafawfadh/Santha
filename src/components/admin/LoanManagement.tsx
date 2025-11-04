import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';

export default function LoanManagement() {
  const { loans, addLoan, updateLoanRepayment, currentUser, allUsers } = useApp();
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');

  const members = allUsers.filter(user => user.role === 'member');

  const [loanForm, setLoanForm] = useState({
    memberId: '',
    amount: '',
    issueDate: '',
    dueDate: ''
  });

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanForm.memberId || !loanForm.amount || !loanForm.issueDate || !loanForm.dueDate) return;

    addLoan({
      memberId: loanForm.memberId,
      amount: parseFloat(loanForm.amount),
      issueDate: loanForm.issueDate,
      dueDate: loanForm.dueDate,
      repaidAmount: 0,
      status: 'active',
      issuedBy: currentUser?.id || ''
    }).catch(console.error);

    setLoanForm({ memberId: '', amount: '', issueDate: '', dueDate: '' });
    setShowAddLoan(false);
  };

  const handleRepayment = (loanId: string) => {
    if (!repaymentAmount) return;
    updateLoanRepayment(loanId, parseFloat(repaymentAmount)).catch(console.error);
    setRepaymentAmount('');
    setSelectedLoanId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'repaid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Loan Management</h2>
          <p className="text-white/80 drop-shadow">Manage member loans and track repayments</p>
        </div>
        <GlassButton
          variant="primary"
          onClick={() => setShowAddLoan(true)}
          className="flex items-center px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </GlassButton>
      </div>

      {/* Add Loan Modal */}
      {showAddLoan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white drop-shadow-lg mb-4">Issue New Loan</h3>
            <form onSubmit={handleAddLoan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Member</label>
                <select
                  value={loanForm.memberId}
                  onChange={(e) => setLoanForm({ ...loanForm, memberId: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  required
                >
                  <option value="" className="bg-slate-800">Select Member</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id} className="bg-slate-800">{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Loan Amount (LKR)</label>
                <input
                  type="number"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-white/50"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Loan Received Date</label>
                <input
                  type="date"
                  value={loanForm.issueDate}
                  onChange={(e) => setLoanForm({ ...loanForm, issueDate: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Due Date</label>
                <input
                  type="date"
                  value={loanForm.dueDate}
                  onChange={(e) => setLoanForm({ ...loanForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <GlassButton
                  variant="secondary"
                  onClick={() => setShowAddLoan(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  type="submit"
                  className="px-4 py-2"
                >
                  Issue Loan
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loans List */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
        <div className="px-6 py-4 border-b border-white/20 bg-purple-500/20 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg">All Loans</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Loan Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Repaid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Outstanding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/20 backdrop-blur-sm">
              {loans.map((loan) => {
                const member = members.find(m => m.id === loan.memberId);
                const outstanding = loan.amount - loan.repaidAmount;
                const overdue = isOverdue(loan.dueDate) && loan.status === 'active';
                const actualStatus = overdue ? 'overdue' : loan.status;

                return (
                  <tr key={loan.id} className="hover:bg-white/10 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-medium text-white">
                            {member?.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{member?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      LKR {loan.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-300">
                      LKR {loan.repaidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      LKR {outstanding.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                        actualStatus === 'active' ? 'bg-orange-500/40 text-orange-200' :
                        actualStatus === 'repaid' ? 'bg-green-500/40 text-green-200' :
                        'bg-red-500/40 text-red-200'
                      }`}>
                        {getStatusIcon(actualStatus)}
                        <span className="ml-1 capitalize">{actualStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {loan.status === 'active' && (
                        <div className="flex items-center space-x-2">
                          {selectedLoanId === loan.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={repaymentAmount}
                                onChange={(e) => setRepaymentAmount(e.target.value)}
                                placeholder="Amount"
                                className="w-20 px-2 py-1 text-xs backdrop-blur-lg bg-white/20 border border-white/30 rounded focus:ring-1 focus:ring-blue-500 text-white placeholder-white/50"
                              />
                              <GlassButton
                                variant="primary"
                                onClick={() => handleRepayment(loan.id)}
                                className="px-2 py-1 text-xs"
                              >
                                Add
                              </GlassButton>
                              <GlassButton
                                variant="secondary"
                                onClick={() => setSelectedLoanId(null)}
                                className="px-2 py-1 text-xs"
                              >
                                Cancel
                              </GlassButton>
                            </div>
                          ) : (
                            <GlassButton
                              variant="accent"
                              onClick={() => setSelectedLoanId(loan.id)}
                              className="text-sm font-medium px-3 py-1"
                            >
                              Add Repayment
                            </GlassButton>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {loans.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm mx-auto mb-4 w-fit">
              <DollarSign className="h-12 w-12 text-white/50" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No loans issued yet</h3>
            <p className="text-white/70">Start by issuing your first loan to a member.</p>
          </div>
        )}
      </div>
    </div>
  );
}