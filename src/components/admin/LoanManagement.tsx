import React, { useState } from 'react';
import { DollarSign, Calendar, AlertCircle, CheckCircle2, TrendingUp, CreditCard, Plus, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassButton from '../common/GlassButton';

export default function LoanManagement() {
  const { loans, allUsers, activeMembers, addLoan, updateLoanRepayment, editLoanRepaidAmount, currentUser, updateLoanDueDate } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState<string | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [showEditRepaymentModal, setShowEditRepaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [editRepaymentAmount, setEditRepaymentAmount] = useState('');
  
  const [newLoan, setNewLoan] = useState({
    memberId: '',
    amount: '',
    dueDate: ''
  });

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLoan.memberId || !newLoan.amount || !newLoan.dueDate) {
      alert('Please fill in all fields');
      return;
    }

    await addLoan({
      memberId: newLoan.memberId,
      amount: parseFloat(newLoan.amount),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newLoan.dueDate,
      repaidAmount: 0,
      status: 'active',
      issuedBy: currentUser?.id || ''
    });

    setNewLoan({
      memberId: '',
      amount: '',
      dueDate: ''
    });
    
    setShowAddForm(false);
  };

  const handleRepayment = async () => {
    if (!selectedLoan || !repaymentAmount) {
      alert('Please enter a valid repayment amount');
      return;
    }

    const amount = parseFloat(repaymentAmount);
    if (amount <= 0) {
      alert('Repayment amount must be greater than 0');
      return;
    }

    await updateLoanRepayment(selectedLoan, amount);
    setShowRepaymentModal(false);
    setSelectedLoan(null);
    setRepaymentAmount('');
  };

  const handleEditRepayment = async () => {
    if (!selectedLoan || !editRepaymentAmount) {
      alert('Please enter a valid repayment amount');
      return;
    }

    const amount = parseFloat(editRepaymentAmount);
    if (amount < 0) {
      alert('Repayment amount cannot be negative');
      return;
    }

    const loan = loans.find(l => l.id === selectedLoan);
    if (loan && amount > loan.amount) {
      alert(`Repayment amount cannot exceed loan amount of LKR ${loan.amount.toLocaleString()}`);
      return;
    }

    await editLoanRepaidAmount(selectedLoan, amount);
    setShowEditRepaymentModal(false);
    setSelectedLoan(null);
    setEditRepaymentAmount('');
  };

  const handleEditDueDate = (loanId: string, currentDueDate: string) => {
    setEditingDueDate(loanId);
    setNewDueDate(currentDueDate);
  };

  const handleSaveDueDate = async (loanId: string) => {
    if (!newDueDate) {
      alert('Please select a valid date');
      return;
    }

    await updateLoanDueDate(loanId, newDueDate);
    setEditingDueDate(null);
    setNewDueDate('');
  };

  const handleCancelEditDueDate = () => {
    setEditingDueDate(null);
    setNewDueDate('');
  };

  const getMemberName = (memberId: string) => {
    const member = allUsers.find(u => u.id === memberId);
    return member?.name || 'Unknown';
  };

  const filteredLoans = selectedMember 
    ? loans.filter(loan => loan.memberId === selectedMember)
    : loans;

  const activeLoans = filteredLoans.filter(loan => loan.status === 'active');
  const repaidLoans = filteredLoans.filter(loan => loan.status === 'repaid');
  const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date());

  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + (loan.amount - loan.repaidAmount), 0);
  const totalRepaidAmount = loans.reduce((sum, loan) => sum + loan.repaidAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            Loan Management
          </h2>
          <p className="text-white/70 mt-1">
            {activeLoans.length} active • {repaidLoans.length} repaid
          </p>
        </div>
        
        <GlassButton
          variant="primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Issue Loan
        </GlassButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="h-8 w-8 text-blue-300" />
          </div>
          <p className="text-sm text-blue-200 mb-1">Active Loans</p>
          <p className="text-2xl font-bold text-white">{activeLoans.length}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8 text-orange-300" />
          </div>
          <p className="text-sm text-orange-200 mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-white">LKR {totalActiveAmount.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-green-300" />
          </div>
          <p className="text-sm text-green-200 mb-1">Total Repaid</p>
          <p className="text-2xl font-bold text-white">LKR {totalRepaidAmount.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-8 w-8 text-red-300" />
          </div>
          <p className="text-sm text-red-200 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-white">{overdueLoans.length}</p>
        </div>
      </div>

      {/* Add Loan Form */}
      {showAddForm && (
        <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Issue New Loan
          </h3>
          <form onSubmit={handleAddLoan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Member *
                </label>
                <select
                  value={newLoan.memberId}
                  onChange={(e) => setNewLoan({ ...newLoan, memberId: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="" className="bg-slate-800">Select Member</option>
                  {activeMembers.map(member => (
                    <option key={member.id} value={member.id} className="bg-slate-800">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Amount (LKR) *
                </label>
                <input
                  type="number"
                  value={newLoan.amount}
                  onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                  min="0"
                  step="100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newLoan.dueDate}
                  onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <GlassButton type="submit" variant="primary">
                Issue Loan
              </GlassButton>
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewLoan({ memberId: '', amount: '', dueDate: '' });
                }}
              >
                Cancel
              </GlassButton>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-white/80">Filter by Member:</label>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" className="bg-slate-800">All Members</option>
            {activeMembers.map(member => (
              <option key={member.id} value={member.id} className="bg-slate-800">
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <div className="text-center py-16 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20">
          <CreditCard className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">No Loans</h3>
          <p className="text-white/50">
            {selectedMember ? 'This member has no loans' : 'No loans have been issued yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const outstanding = loan.amount - loan.repaidAmount;
            const progress = (loan.repaidAmount / loan.amount) * 100;
            const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
            const member = allUsers.find(u => u.id === loan.memberId);
            
            return (
              <div
                key={loan.id}
                className={`p-6 rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-300 ${
                  loan.status === 'repaid'
                    ? 'bg-green-500/10 border-green-400/30'
                    : isOverdue
                    ? 'bg-red-500/10 border-red-400/30'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Loan Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">
                          {member?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                          {getMemberName(loan.memberId)}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.status === 'repaid'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : isOverdue
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {loan.status === 'repaid' ? 'Repaid' : isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Loan Amount</p>
                        <p className="text-lg font-bold text-white">LKR {loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Repaid</p>
                        <p className="text-lg font-bold text-green-300">LKR {loan.repaidAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Outstanding</p>
                        <p className={`text-lg font-bold ${outstanding > 0 ? 'text-orange-300' : 'text-green-300'}`}>
                          LKR {outstanding.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">Issue Date</p>
                        <p className="text-sm text-white/90">{new Date(loan.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Due Date with Edit Option */}
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="h-4 w-4 text-white/60" />
                      {editingDueDate === loan.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="px-3 py-1 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <button
                            onClick={() => handleSaveDueDate(loan.id)}
                            className="p-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-all"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEditDueDate}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-all"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            isOverdue ? 'text-red-300' : 'text-white/90'
                          }`}>
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                          </span>
                          {loan.status === 'active' && (
                            <button
                              onClick={() => handleEditDueDate(loan.id, loan.dueDate)}
                              className="p-1 hover:bg-white/10 rounded-lg transition-all"
                              title="Edit due date"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-white/60 hover:text-white/90" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/70">Repayment Progress</span>
                        <span className="font-semibold text-white">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            loan.status === 'repaid'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {loan.status === 'active' && (
                    <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2">
                      <GlassButton
                        variant="accent"
                        onClick={() => {
                          setSelectedLoan(loan.id);
                          setShowRepaymentModal(true);
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Add Repayment
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        onClick={() => {
                          setSelectedLoan(loan.id);
                          setEditRepaymentAmount(loan.repaidAmount.toString());
                          setShowEditRepaymentModal(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Repaid
                      </GlassButton>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Repayment Modal */}
      {showRepaymentModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Add Repayment
              </h3>
            </div>

            {(() => {
              const loan = loans.find(l => l.id === selectedLoan);
              if (!loan) return null;
              const outstanding = loan.amount - loan.repaidAmount;
              
              return (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-sm text-white/70 mb-2">Outstanding Amount</p>
                    <p className="text-2xl font-bold text-white">LKR {outstanding.toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Repayment Amount (LKR)
                    </label>
                    <input
                      type="number"
                      value={repaymentAmount}
                      onChange={(e) => setRepaymentAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-green-500 focus:outline-none backdrop-blur-xl"
                      placeholder="0"
                      min="0"
                      max={outstanding}
                      step="100"
                      autoFocus
                    />
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-300">
                        Enter the amount being repaid. The loan status will automatically update when fully repaid.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleRepayment}
                      className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
                    >
                      Confirm Repayment
                    </button>
                    <button
                      onClick={() => {
                        setShowRepaymentModal(false);
                        setSelectedLoan(null);
                        setRepaymentAmount('');
                      }}
                      className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Edit Repayment Modal */}
      {showEditRepaymentModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Edit2 className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Edit Repaid Amount
              </h3>
            </div>

            {(() => {
              const loan = loans.find(l => l.id === selectedLoan);
              if (!loan) return null;
              const outstanding = loan.amount - loan.repaidAmount;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-xs text-white/60 mb-1">Loan Amount</p>
                      <p className="text-lg font-bold text-white">LKR {loan.amount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-xs text-white/60 mb-1">Current Repaid</p>
                      <p className="text-lg font-bold text-green-300">LKR {loan.repaidAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      New Repaid Amount (LKR)
                    </label>
                    <input
                      type="number"
                      value={editRepaymentAmount}
                      onChange={(e) => setEditRepaymentAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:outline-none backdrop-blur-xl"
                      placeholder="0"
                      min="0"
                      max={loan.amount}
                      step="100"
                      autoFocus
                    />
                  </div>

                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-orange-300">
                        This will replace the current repaid amount. Use this to correct mistakes in repayment entries.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleEditRepayment}
                      className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setShowEditRepaymentModal(false);
                        setSelectedLoan(null);
                        setEditRepaymentAmount('');
                      }}
                      className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}