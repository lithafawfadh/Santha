import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { Plus, DollarSign, Calendar, User, AlertTriangle, Clock } from 'lucide-react';
import type { Loan, Member } from '../../types';

export const LoanManagement: React.FC = () => {
  const { loans, members, addLoan, updateLoan } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLoan, setNewLoan] = useState({
    memberId: '',
    amount: '',
    interestRate: '5',
    dueDate: '',
    purpose: ''
  });

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLoan.memberId && newLoan.amount && newLoan.dueDate) {
      const loan: Omit<Loan, 'id'> = {
        memberId: newLoan.memberId,
        amount: parseFloat(newLoan.amount),
        interestRate: parseFloat(newLoan.interestRate),
        dueDate: newLoan.dueDate,
        purpose: newLoan.purpose,
        status: 'active',
        issuedDate: new Date().toISOString().split('T')[0]
      };
      addLoan(loan);
      setNewLoan({ memberId: '', amount: '', interestRate: '5', dueDate: '', purpose: '' });
      setShowAddForm(false);
    }
  };

  const handleRepayment = (loanId: string, amount: number) => {
    updateLoan(loanId, { status: 'repaid' });
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCountdownDisplay = (dueDate: string) => {
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (daysRemaining > 0) {
      if (daysRemaining === 1) {
        return {
          text: 'Due tomorrow',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: Clock,
          animate: 'animate-pulse'
        };
      } else if (daysRemaining <= 7) {
        return {
          text: `${daysRemaining} days remaining`,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: Clock,
          animate: 'animate-pulse'
        };
      } else {
        return {
          text: `${daysRemaining} days remaining`,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: Clock,
          animate: ''
        };
      }
    } else if (daysRemaining === 0) {
      return {
        text: 'Due today',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertTriangle,
        animate: 'animate-bounce'
      };
    } else {
      return {
        text: `Overdue by ${Math.abs(daysRemaining)} days`,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertTriangle,
        animate: 'animate-bounce'
      };
    }
  };

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);

  const loanStats = useMemo(() => {
    const total = loans.length;
    const active = loans.filter(l => l.status === 'active').length;
    const repaid = loans.filter(l => l.status === 'repaid').length;
    const overdue = loans.filter(l => {
      if (l.status !== 'active') return false;
      return getDaysRemaining(l.dueDate) < 0;
    }).length;

    return { total, active, repaid, overdue };
  }, [loans]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Loans</p>
              <p className="text-xl font-bold text-gray-800">{loanStats.total}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-xl font-bold text-gray-800">{loanStats.active}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-gray-800">{loanStats.overdue}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-xl font-bold text-gray-800">${totalOutstanding}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Add Loan Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Loan Management</h2>
        <GlassButton
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Loan</span>
        </GlassButton>
      </div>

      {/* Add Loan Form */}
      {showAddForm && (
        <GlassCard className="p-6 animate-slide-down">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Loan</h3>
          <form onSubmit={handleAddLoan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member
                </label>
                <select
                  value={newLoan.memberId}
                  onChange={(e) => setNewLoan({ ...newLoan, memberId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                >
                  <option value="">Select Member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={newLoan.amount}
                  onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={newLoan.interestRate}
                  onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newLoan.dueDate}
                  onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              <input
                type="text"
                value={newLoan.purpose}
                onChange={(e) => setNewLoan({ ...newLoan, purpose: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                placeholder="Loan purpose (optional)"
              />
            </div>

            <div className="flex space-x-3">
              <GlassButton type="submit" className="hover:scale-105 transition-transform duration-200">
                Add Loan
              </GlassButton>
              <GlassButton
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 transition-all duration-200"
              >
                Cancel
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Loans Table */}
      <GlassCard className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Loans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interest Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Countdown
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loans.map((loan, index) => {
                const member = members.find(m => m.id === loan.memberId);
                const countdown = loan.status === 'active' ? getCountdownDisplay(loan.dueDate) : null;
                const IconComponent = countdown?.icon;
                
                return (
                  <tr 
                    key={loan.id} 
                    className="hover:bg-gray-50/50 hover:scale-[1.01] transition-all duration-200 animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {member?.name || 'Unknown Member'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${loan.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.interestRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {loan.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {countdown && (
                        <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${countdown.bgColor} ${countdown.color} ${countdown.animate}`}>
                          {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                          {countdown.text}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loan.status === 'active' && (
                        <GlassButton
                          onClick={() => handleRepayment(loan.id, loan.amount)}
                          className="text-green-600 hover:text-green-900 hover:scale-105 hover:animate-pulse transition-all duration-200"
                        >
                          Mark as Repaid
                        </GlassButton>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loans.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No loans found. Add a loan to get started.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};