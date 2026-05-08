import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  DollarSign, Calendar, AlertCircle, CheckCircle2, TrendingUp, 
  CreditCard, Plus, Edit2, Save, X, ChevronDown, ChevronUp,
  User, ArrowUpRight, Search, Clock, Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassButton from '../common/GlassButton';

export default function LoanManagement() {
  const { loans, allUsers, activeMembers, addLoan, updateLoanRepayment, editLoanRepaidAmount, currentUser, updateLoanDueDate, deleteLoan } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState<string | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [showEditRepaymentModal, setShowEditRepaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [editRepaymentAmount, setEditRepaymentAmount] = useState('');
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState<string | null>(null);
  
  // New Filter State
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'overdue' | 'repaid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newLoan, setNewLoan] = useState({
    memberId: '',
    amount: '',
    dueDate: ''
  });

  const toggleLoanExpansion = (loanId: string) => {
    setExpandedLoans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(loanId)) newSet.delete(loanId);
      else newSet.add(loanId);
      return newSet;
    });
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoan.memberId || !newLoan.amount || !newLoan.dueDate) return;
    await addLoan({
      memberId: newLoan.memberId,
      amount: parseFloat(newLoan.amount),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newLoan.dueDate,
      repaidAmount: 0,
      status: 'active',
      issuedBy: currentUser?.id || ''
    });
    setNewLoan({ memberId: '', amount: '', dueDate: '' });
    setShowAddForm(false);
  };

  const handleRepayment = async () => {
    if (!selectedLoan || !repaymentAmount) return;
    await updateLoanRepayment(selectedLoan, parseFloat(repaymentAmount));
    setShowRepaymentModal(false);
    setSelectedLoan(null);
    setRepaymentAmount('');
  };

  const handleEditRepayment = async () => {
    if (!selectedLoan || !editRepaymentAmount) return;
    await editLoanRepaidAmount(selectedLoan, parseFloat(editRepaymentAmount));
    setShowEditRepaymentModal(false);
    setSelectedLoan(null);
    setEditRepaymentAmount('');
  };

  const handleSaveDueDate = async (loanId: string) => {
    if (!newDueDate) return;
    await updateLoanDueDate(loanId, newDueDate);
    setEditingDueDate(null);
    setNewDueDate('');
  };

  const handleDeleteLoan = async () => {
    if (!loanToDelete) return;
    const success = await deleteLoan(loanToDelete);
    if (success) {
      setShowDeleteModal(false);
      setLoanToDelete(null);
    }
  };

  const handleEditDueDate = (loanId: string, currentDueDate: string) => {
    setEditingDueDate(loanId);
    setNewDueDate(currentDueDate);
  };

  const getMemberName = (memberId: string) => {
    const member = allUsers.find(u => u.id === memberId);
    return member?.name || 'Unknown';
  };

  const filteredLoans = loans.filter(loan => {
    // 1. Member Filter
    const memberMatch = !selectedMember || loan.memberId === selectedMember;
    
    // 2. Status Filter
    const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
    let statusMatch = true;
    if (filterStatus === 'active') statusMatch = loan.status === 'active';
    else if (filterStatus === 'overdue') statusMatch = isOverdue;
    else if (filterStatus === 'repaid') statusMatch = loan.status === 'repaid';
    
    // 3. Search Term Filter (Name or ID)
    const member = allUsers.find(u => u.id === loan.memberId);
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || 
      (member?.name?.toLowerCase() || '').includes(searchLower) ||
      loan.id.toLowerCase().includes(searchLower);
      
    return memberMatch && statusMatch && searchMatch;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    // 1. Group by Status (Active before Repaid)
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;

    // 2. Prioritize Overdue loans within the active group
    const aOverdue = new Date(a.dueDate) < new Date() && a.status === 'active';
    const bOverdue = new Date(b.dueDate) < new Date() && b.status === 'active';
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // 3. Within status groups, sort by issueDate descending (Newest first)
    // If issueDate is the same, fallback to ID descending
    const dateCompare = new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.id.localeCompare(a.id);
  });

  const activeLoans = filteredLoans.filter(loan => loan.status === 'active');
  const repaidLoans = filteredLoans.filter(loan => loan.status === 'repaid');
  const overdueLoans = activeLoans.filter(loan => new Date(loan.dueDate) < new Date());
  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + (loan.amount - loan.repaidAmount), 0);
  const totalRepaidAmount = loans.reduce((sum, loan) => sum + loan.repaidAmount, 0);

  return (
    <div className="flex flex-col h-full bg-luxury-surface/50 overflow-hidden">
      {/* Header Info */}
      <div className="p-6 lg:p-8 border-b border-white/5 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Loan Management</h2>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-medium">{activeLoans.length} Active • {repaidLoans.length} Settled</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
             {/* Search Bar */}
             <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-gray-600"
                />
             </div>

             {/* Status Filter */}
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                {(['all', 'active', 'overdue', 'repaid'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      filterStatus === status 
                        ? 'bg-gold text-black shadow-gold-glow' 
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
             </div>

             {/* Member Filter */}
             <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                  value={selectedMember} 
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-10 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-gold/30 appearance-none min-w-[180px] cursor-pointer"
                >
                  <option value="" className="bg-luxury-surface">All Borrowers</option>
                  {activeMembers.map(m => <option key={m.id} value={m.id} className="bg-luxury-surface">{m.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
             </div>

             {/* Reset Button */}
             {(searchTerm || selectedMember || filterStatus !== 'all') && (
               <button 
                 onClick={() => { setSearchTerm(''); setSelectedMember(''); setFilterStatus('all'); }}
                 className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20"
                 title="Clear all filters"
               >
                 <X className="w-5 h-5" />
               </button>
             )}

             <button 
               onClick={() => setShowAddForm(true)}
               className="ml-auto px-6 py-3 bg-gold text-black rounded-2xl text-sm font-bold shadow-gold-glow hover:bg-gold-light transition-all flex items-center gap-2 uppercase tracking-widest"
             >
                <Plus className="w-4 h-4" /> Issue Loan
             </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Active Portfolio</p>
              <p className="text-xl font-serif font-bold text-white">{activeLoans.length} Loans</p>
           </div>
           <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Outstanding</p>
              <p className="text-xl font-serif font-bold text-gold">LKR {totalActiveAmount.toLocaleString()}</p>
           </div>
           <div className="p-4 rounded-2xl bg-emerald/5 border border-emerald/10">
              <p className="text-[10px] uppercase tracking-widest text-emerald/60 font-bold mb-1">Total Recovered</p>
              <p className="text-xl font-serif font-bold text-emerald">LKR {totalRepaidAmount.toLocaleString()}</p>
           </div>
           <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-1">Overdue Risk</p>
              <p className="text-xl font-serif font-bold text-red-500">{overdueLoans.length} Alerts</p>
           </div>
        </div>
      </div>

      {/* Loan List Container */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-8 space-y-4">
        {sortedLoans.length > 0 ? sortedLoans.map((loan) => {
          const outstanding = loan.amount - loan.repaidAmount;
          const progress = (loan.repaidAmount / loan.amount) * 100;
          const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
          const member = allUsers.find(u => u.id === loan.memberId);
          const isExpanded = expandedLoans.has(loan.id);
          
          return (
            <div 
              key={loan.id} 
              className={`bento-card glass-panel rounded-3xl overflow-hidden transition-all duration-500 border ${
                loan.status === 'repaid' ? 'border-emerald/20 opacity-80' : isOverdue ? 'border-red-500/30' : 'border-white/5'
              }`}
            >
              <div 
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleLoanExpansion(loan.id)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                   <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-serif font-bold border ${
                        loan.status === 'repaid' ? 'bg-emerald/10 text-emerald border-emerald/20' : isOverdue ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-gold/10 text-gold border-gold/20'
                      }`}>
                        {member?.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-bold text-white">{member?.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                             loan.status === 'repaid' ? 'text-emerald border-emerald/20' : isOverdue ? 'text-red-500 border-red-500/20' : 'text-gold border-gold/20'
                           }`}>
                             {loan.status === 'repaid' ? 'Settled' : isOverdue ? 'Overdue' : 'Active'}
                           </span>
                           <span className="text-xs text-gray-500">ID: {loan.id.slice(0,8)}</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-10">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Outstanding</p>
                        <p className={`text-xl font-serif font-bold ${outstanding > 0 ? 'text-white' : 'text-emerald'}`}>
                          LKR {outstanding.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                         {loan.status === 'active' && (
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedLoan(loan.id); setShowRepaymentModal(true); }}
                             className="px-4 py-2 bg-emerald/10 text-emerald rounded-xl text-xs font-bold border border-emerald/20 hover:bg-emerald/20 transition-all"
                           >
                             Add Payment
                           </button>
                         )}
                         <div className={`p-2 rounded-xl bg-white/5 text-gray-400 group-hover:text-white transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-5 h-5" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-6 space-y-2">
                   <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-gray-500">
                      <span>Recovery Progress</span>
                      <span>{Math.round(progress)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${loan.status === 'repaid' ? 'bg-emerald' : 'bg-gold'}`} 
                        style={{ width: `${progress}%` }}
                      />
                   </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideDown border-t border-white/5">
                   <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                         <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Timeline</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between">
                               <span className="text-xs text-gray-400">Issued</span>
                               <span className="text-xs text-white font-medium">{new Date(loan.issueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-gray-400">Due Date</span>
                               <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-white'}`}>{new Date(loan.dueDate).toLocaleDateString()}</span>
                                  {loan.status === 'active' && (
                                    <button onClick={() => handleEditDueDate(loan.id, loan.dueDate)} className="p-1 hover:bg-white/10 rounded-md">
                                       <Edit2 className="w-3 h-3 text-gray-500" />
                                    </button>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                         <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-3 h-3 text-gray-500" />
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Financials</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between">
                               <span className="text-xs text-gray-400">Principal</span>
                               <span className="text-xs text-white font-medium">LKR {loan.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-xs text-gray-400">Repaid</span>
                               <span className="text-xs text-emerald font-bold">LKR {loan.repaidAmount.toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setLoanToDelete(loan.id); setShowDeleteModal(true); }}
                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Loan
                      </button>
                      {loan.status === 'active' && (
                        <button 
                          onClick={() => { setSelectedLoan(loan.id); setEditRepaymentAmount(loan.repaidAmount.toString()); setShowEditRepaymentModal(true); }}
                          className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" /> Correct Entry
                        </button>
                      )}
                    </div>
                </div>
              )}
            </div>
          )
        }) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">No matching records found</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-8">Try adjusting your search terms or status filters to find what you're looking for.</p>
            <GlassButton onClick={() => { setSearchTerm(''); setSelectedMember(''); setFilterStatus('all'); }}>
              Clear All Filters
            </GlassButton>
          </div>
        )}
      </div>

      {/* Modals - Refactored for Aureum */}
      {(showRepaymentModal || showEditRepaymentModal) && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[999] flex items-center justify-center p-6">
           <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 space-y-8 animate-scaleUp">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-gold-glow">
                    <DollarSign className="w-8 h-8" />
                 </div>
                 <button onClick={() => { setShowRepaymentModal(false); setShowEditRepaymentModal(false); }} className="p-2 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div>
                 <h3 className="text-2xl font-serif font-bold text-white">{showRepaymentModal ? 'Add Repayment' : 'Correct Repayment'}</h3>
                 <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-medium">Secure Financial Authorization</p>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Target Outstanding</p>
                    <p className="text-2xl font-serif font-bold text-white">LKR {((loans.find(l => l.id === selectedLoan)?.amount || 0) - (loans.find(l => l.id === selectedLoan)?.repaidAmount || 0)).toLocaleString()}</p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-1">Transaction Amount</label>
                    <input 
                      type="number" 
                      value={showRepaymentModal ? repaymentAmount : editRepaymentAmount}
                      onChange={(e) => showRepaymentModal ? setRepaymentAmount(e.target.value) : setEditRepaymentAmount(e.target.value)}
                      placeholder="Enter amount in LKR"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl font-serif font-bold text-white focus:outline-none focus:ring-1 focus:ring-gold/50"
                      autoFocus
                    />
                 </div>
              </div>

              <button 
                onClick={showRepaymentModal ? handleRepayment : handleEditRepayment}
                className="w-full py-5 bg-gold text-black rounded-2xl text-sm font-bold shadow-gold-glow hover:bg-gold-light transition-all uppercase tracking-widest"
              >
                Confirm Transaction
              </button>
           </div>
        </div>,
        document.body
      )}

      {/* Add Loan Modal */}
      {showAddForm && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[999] flex items-center justify-center p-6">
           <div className="w-full max-w-2xl glass-panel rounded-[2rem] p-8 lg:p-10 space-y-10 animate-scaleUp">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-gold-glow">
                    <Plus className="w-8 h-8" />
                 </div>
                 <button onClick={() => setShowAddForm(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div>
                 <h3 className="text-3xl font-serif font-bold text-white tracking-tight">Issue New Loan</h3>
                 <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-medium">Lending Protocol • Cycle 2026</p>
              </div>

              <form onSubmit={handleAddLoan} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-1">Select Beneficiary</label>
                    <select 
                      value={newLoan.memberId} 
                      onChange={(e) => setNewLoan({ ...newLoan, memberId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold/50 appearance-none"
                    >
                       <option value="" className="bg-luxury-surface">Select Member</option>
                       {activeMembers.map(m => <option key={m.id} value={m.id} className="bg-luxury-surface">{m.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-1">Principal Amount</label>
                    <input 
                      type="number" 
                      value={newLoan.amount} 
                      onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                      placeholder="LKR Amount"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold/50"
                    />
                 </div>
                 <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-1">Repayment Deadline</label>
                    <input 
                      type="date" 
                      value={newLoan.dueDate} 
                      onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold/50"
                    />
                 </div>
                 <div className="lg:col-span-2 pt-4">
                    <button type="submit" className="w-full py-5 bg-gold text-black rounded-2xl text-sm font-bold shadow-gold-glow hover:bg-gold-light transition-all uppercase tracking-[0.2em]">Authorize Loan Disbursement</button>
                 </div>
              </form>
           </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[999] flex items-center justify-center p-6">
           <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 space-y-8 animate-scaleUp border border-red-500/20">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-red-glow">
                    <AlertCircle className="w-8 h-8" />
                 </div>
                 <button onClick={() => { setShowDeleteModal(false); setLoanToDelete(null); }} className="p-2 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div>
                 <h3 className="text-2xl font-serif font-bold text-white">Delete Loan Record?</h3>
                 <p className="text-sm text-gray-500 mt-2">This action is permanent and will remove this loan from all financial history and stats. This cannot be undone.</p>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Loan Details</p>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-white font-medium">{getMemberName(loans.find(l => l.id === loanToDelete)?.memberId || '')}</span>
                       <span className="text-lg font-serif font-bold text-white">LKR {loans.find(l => l.id === loanToDelete)?.amount?.toLocaleString() || '0'}</span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 <button 
                   onClick={handleDeleteLoan}
                   className="w-full py-4 bg-red-500 text-white rounded-2xl text-sm font-bold shadow-red-glow hover:bg-red-600 transition-all uppercase tracking-widest"
                 >
                   Confirm Deletion
                 </button>
                 <button 
                   onClick={() => { setShowDeleteModal(false); setLoanToDelete(null); }}
                   className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl text-sm font-bold border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest"
                 >
                   Cancel
                 </button>
              </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
}