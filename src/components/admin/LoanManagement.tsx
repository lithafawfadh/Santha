import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  DollarSign, Calendar, AlertCircle, CheckCircle2, TrendingUp, 
  CreditCard, Plus, Edit2, Save, X, ChevronDown, ChevronUp,
  User, ArrowUpRight, Search, Clock, Trash2, Copy, Check, ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
  const [copiedSummary, setCopiedSummary] = useState(false);
  
  // Filter State
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'overdue' | 'repaid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newLoan, setNewLoan] = useState({
    memberId: '',
    amount: '',
    dueDate: ''
  });

  // Active members only
  const membersList = activeMembers && activeMembers.length > 0
    ? activeMembers
    : allUsers.filter(u => u.role === 'member' && u.status === 'active');

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
    const memberMatch = !selectedMember || loan.memberId === selectedMember;
    const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
    let statusMatch = true;
    if (filterStatus === 'active') statusMatch = loan.status === 'active';
    else if (filterStatus === 'overdue') statusMatch = isOverdue;
    else if (filterStatus === 'repaid') statusMatch = loan.status === 'repaid';
    
    const member = allUsers.find(u => u.id === loan.memberId);
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || 
      (member?.name?.toLowerCase() || '').includes(searchLower) ||
      loan.id.toLowerCase().includes(searchLower);
      
    return memberMatch && statusMatch && searchMatch;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;

    const aOverdue = new Date(a.dueDate) < new Date() && a.status === 'active';
    const bOverdue = new Date(b.dueDate) < new Date() && b.status === 'active';
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const dateCompare = new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
    if (dateCompare !== 0) return dateCompare;
    return b.id.localeCompare(a.id);
  });

  const activeLoansList = loans.filter(loan => loan.status === 'active');
  const repaidLoansList = loans.filter(loan => loan.status === 'repaid');
  const overdueLoansList = activeLoansList.filter(loan => new Date(loan.dueDate) < new Date());
  const totalActiveOutstanding = activeLoansList.reduce((sum, loan) => sum + (loan.amount - loan.repaidAmount), 0);
  const totalRepaidAmount = loans.reduce((sum, loan) => sum + loan.repaidAmount, 0);
  const totalPrincipalOut = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const overallRecoveryRate = totalPrincipalOut > 0 ? Math.round((totalRepaidAmount / totalPrincipalOut) * 100) : 100;

  // WhatsApp Loan Summary
  const copyWhatsAppLoanSummary = () => {
    const message = `💳 *F.O.R.T LEDGER - LOANS STATUS REPORT*
🗓 *Audit Date:* ${new Date().toLocaleDateString('default', { month: 'long', year: 'numeric' })}
────────────────────────
📊 *Portfolio Health:*
• Active Loans: ${activeLoansList.length}
• Total Outstanding: LKR ${totalActiveOutstanding.toLocaleString()}
• Total Repaid: LKR ${totalRepaidAmount.toLocaleString()} (${overallRecoveryRate}% Recovered)
• Overdue Alerts: ${overdueLoansList.length}

📋 *Active Loan Ledger:*
${activeLoansList.map(l => {
  const mName = getMemberName(l.memberId);
  const netDue = l.amount - l.repaidAmount;
  const isOd = new Date(l.dueDate) < new Date();
  return `• ${mName}: LKR ${netDue.toLocaleString()} Due (Due: ${l.dueDate}) ${isOd ? '⚠️ OVERDUE' : '✅'}`;
}).join('\n')}
────────────────────────
Verified by Admin: ${currentUser?.name || 'Lithaf'}`;

    navigator.clipboard.writeText(message);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6 text-black animate-fadeIn">
      
      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              LOANS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#FFE600] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                CAPITAL RECOVERY PROTOCOL v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {activeLoansList.length} ACTIVE • {repaidLoansList.length} SETTLED
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={copyWhatsAppLoanSummary}
              className="brutal-btn bg-[#FFE600] hover:bg-[#FFF275] text-black px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
                  <span>Copied Report!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>WhatsApp Report</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="brutal-btn bg-black text-white hover:bg-neutral-800 px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[3px_3px_0px_#FFE600]"
            >
              <Plus className="w-4 h-4 text-[#FFE600]" />
              <span>Issue Loan</span>
            </button>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── ROW 1: THE 4 TACTILE METRIC CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* CARD 1: ACTIVE PORTFOLIO (Electric Yellow Hero) */}
        <div className="brutal-card-yellow p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-[#FFE600] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              ACTIVE PORTFOLIO
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {activeLoansList.length} Loans
              </h2>
            </div>
          </div>
        </div>

        {/* CARD 2: OUTSTANDING CAPITAL */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <DollarSign className="w-5 h-5 text-[#FFE600]" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>OUTSTANDING</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              TOTAL OUTSTANDING
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                LKR {totalActiveOutstanding.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* CARD 3: TOTAL RECOVERED */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>{overallRecoveryRate}% RECOVERED</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              TOTAL REPAID
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                LKR {totalRepaidAmount.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* CARD 4: OVERDUE RISK */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>{overdueLoansList.length === 0 ? 'ALL CLEAR' : 'RISK'}</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              OVERDUE ALERTS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {overdueLoansList.length} Alerts
              </h2>
              <span className={`text-xs font-mono font-bold ${overdueLoansList.length === 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {overdueLoansList.length === 0 ? 'Zero Default' : 'Attention Req.'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ─── */}
      <div className="brutal-card p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
          <input
            type="text"
            placeholder="Search by borrower name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border-2 border-black text-xs font-mono font-bold text-black placeholder:text-black/40 focus:outline-none focus:shadow-[3px_3px_0px_#FFE600] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex border-2 border-black shadow-[2px_2px_0px_#000] bg-white">
            {(['all', 'active', 'overdue', 'repaid'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                  filterStatus === status
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-yellow-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Member Dropdown */}
          <div className="relative">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="brutal-btn bg-white text-black px-3 py-1.5 text-xs font-black uppercase tracking-wider appearance-none pr-8 cursor-pointer"
            >
              <option value="">All Borrowers</option>
              {membersList.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
          </div>

          {(searchTerm || selectedMember || filterStatus !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedMember(''); setFilterStatus('all'); }}
              className="brutal-btn px-2.5 py-1.5 bg-red-100 text-red-800 text-xs font-black"
              title="Clear filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ─── TACTILE LOANS LIST ─── */}
      <div className="space-y-4">
        {sortedLoans.length > 0 ? (
          sortedLoans.map(loan => {
            const outstanding = loan.amount - loan.repaidAmount;
            const progress = (loan.repaidAmount / loan.amount) * 100;
            const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'active';
            const memberName = getMemberName(loan.memberId);
            const isExpanded = expandedLoans.has(loan.id);

            return (
              <div
                key={loan.id}
                className={`brutal-card p-5 space-y-4 transition-all ${
                  isOverdue ? 'border-red-600 shadow-[4px_4px_0px_#DC2626]' : ''
                }`}
              >
                {/* Main Card Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  onClick={() => toggleLoanExpansion(loan.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#000] ${
                      loan.status === 'repaid'
                        ? 'bg-[#06D6A0] text-black'
                        : isOverdue
                        ? 'bg-red-500 text-white'
                        : 'bg-[#FFE600] text-black'
                    }`}>
                      {memberName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-black">{memberName}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border-2 border-black shadow-[1.5px_1.5px_0px_#000] ${
                          loan.status === 'repaid'
                            ? 'bg-[#06D6A0] text-black'
                            : isOverdue
                            ? 'bg-red-500 text-white'
                            : 'bg-[#FFE600] text-black'
                        }`}>
                          {loan.status === 'repaid' ? 'Settled' : isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-black/60 font-bold mt-0.5">
                        ID: {loan.id.slice(0, 10)} • Issued: {new Date(loan.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-black uppercase tracking-wider text-black/60">Outstanding</p>
                      <p className={`text-xl font-black font-sans ${outstanding > 0 ? 'text-black' : 'text-emerald-700'}`}>
                        LKR {outstanding.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {loan.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLoan(loan.id);
                            setShowRepaymentModal(true);
                          }}
                          className="brutal-btn bg-[#FFE600] hover:bg-[#FFF275] text-black px-3 py-1.5 text-xs font-black uppercase tracking-wider"
                        >
                          + Repayment
                        </button>
                      )}

                      <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                        {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recovery Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-mono font-black text-black">
                    <span>Capital Recovery: LKR {loan.repaidAmount.toLocaleString()} of {loan.amount.toLocaleString()}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 border-2 border-black h-3 overflow-hidden shadow-[1px_1px_0px_#000]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        loan.status === 'repaid' ? 'bg-[#06D6A0]' : isOverdue ? 'bg-red-500' : 'bg-[#FFE600]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="pt-4 border-t-2 border-dashed border-black/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono animate-fadeIn">
                    
                    {/* Timeline Box */}
                    <div className="p-3 bg-gray-50 border-2 border-black shadow-[2px_2px_0px_#000] space-y-1.5">
                      <p className="font-black uppercase text-black/60 text-[10px]">Timeline</p>
                      <div className="flex justify-between">
                        <span className="text-black/60">Issued:</span>
                        <span className="font-black text-black">{new Date(loan.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black/60">Maturity:</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-black ${isOverdue ? 'text-red-600' : 'text-black'}`}>
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </span>
                          {loan.status === 'active' && (
                            <button
                              onClick={() => handleEditDueDate(loan.id, loan.dueDate)}
                              className="p-1 hover:bg-black hover:text-white border border-black"
                              title="Edit Due Date"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary Box */}
                    <div className="p-3 bg-gray-50 border-2 border-black shadow-[2px_2px_0px_#000] space-y-1.5">
                      <p className="font-black uppercase text-black/60 text-[10px]">Financials</p>
                      <div className="flex justify-between">
                        <span className="text-black/60">Principal:</span>
                        <span className="font-black text-black">LKR {loan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black/60">Total Repaid:</span>
                        <span className="font-black text-emerald-700">LKR {loan.repaidAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Operational Controls Box */}
                    <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex flex-col justify-between gap-2">
                      <p className="font-black uppercase text-black/60 text-[10px]">Admin Actions</p>
                      <div className="flex gap-2">
                        {loan.status === 'active' && (
                          <button
                            onClick={() => {
                              setSelectedLoan(loan.id);
                              setEditRepaymentAmount(loan.repaidAmount.toString());
                              setShowEditRepaymentModal(true);
                            }}
                            className="flex-1 brutal-btn py-1.5 bg-white text-xs font-black uppercase text-black"
                          >
                            Correct
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setLoanToDelete(loan.id);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 brutal-btn py-1.5 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-black uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="brutal-card p-12 text-center space-y-3">
            <Search className="w-10 h-10 text-black/40 mx-auto" />
            <h4 className="font-black text-lg text-black uppercase">No matching loan records</h4>
            <p className="text-xs font-mono text-black/60">Try adjusting your borrower or status filters.</p>
          </div>
        )}
      </div>

      {/* ─── ADD REPAYMENT MODAL ─── */}
      {(showRepaymentModal || showEditRepaymentModal) && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white border-3 border-black shadow-[8px_8px_0px_#000] p-6 space-y-6">
            <div className="bg-[#FFE600] border-2 border-black p-3 flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                {showRepaymentModal ? 'Log Repayment' : 'Correct Repayment'}
              </h3>
              <button
                onClick={() => { setShowRepaymentModal(false); setShowEditRepaymentModal(false); }}
                className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_#000]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 border-2 border-black">
              <p className="text-[10px] font-mono font-black uppercase text-black/60">Current Outstanding</p>
              <p className="text-2xl font-black text-black">
                LKR {((loans.find(l => l.id === selectedLoan)?.amount || 0) - (loans.find(l => l.id === selectedLoan)?.repaidAmount || 0)).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Repayment Amount (LKR)
              </label>
              <input
                type="number"
                value={showRepaymentModal ? repaymentAmount : editRepaymentAmount}
                onChange={(e) => showRepaymentModal ? setRepaymentAmount(e.target.value) : setEditRepaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 bg-white border-2 border-black text-lg font-black text-black focus:outline-none focus:shadow-[3px_3px_0px_#FFE600]"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={showRepaymentModal ? handleRepayment : handleEditRepayment}
                className="flex-1 brutal-btn py-3 bg-[#FFE600] hover:bg-[#FFF275] text-black font-black text-xs uppercase tracking-wider"
              >
                Confirm Transaction
              </button>
              <button
                onClick={() => { setShowRepaymentModal(false); setShowEditRepaymentModal(false); }}
                className="brutal-btn px-4 py-3 bg-white text-black font-black text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── ISSUE LOAN MODAL ─── */}
      {showAddForm && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white border-3 border-black shadow-[8px_8px_0px_#000] p-6 space-y-6">
            <div className="bg-[#FFE600] border-2 border-black p-3 flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                Issue New Loan
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_#000]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLoan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Select Active Borrower
                </label>
                <select
                  value={newLoan.memberId}
                  onChange={(e) => setNewLoan({ ...newLoan, memberId: e.target.value })}
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                >
                  <option value="">Choose active member...</option>
                  {membersList.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Principal Amount (LKR)
                </label>
                <input
                  type="number"
                  value={newLoan.amount}
                  onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full p-2.5 bg-white border-2 border-black text-sm font-black text-black focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Repayment Deadline
                </label>
                <input
                  type="date"
                  value={newLoan.dueDate}
                  onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 brutal-btn py-3 bg-[#FFE600] hover:bg-[#FFF275] text-black font-black text-xs uppercase tracking-wider"
                >
                  Authorize Loan Disbursement
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="brutal-btn px-4 py-3 bg-white text-black font-black text-xs uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ─── EDIT DUE DATE MODAL ─── */}
      {editingDueDate && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white border-3 border-black shadow-[8px_8px_0px_#000] p-6 space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider text-black">
              Modify Due Date
            </h3>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full p-2.5 bg-white border-2 border-black text-sm font-bold text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveDueDate(editingDueDate)}
                className="flex-1 brutal-btn py-2.5 bg-[#FFE600] text-black font-black text-xs uppercase"
              >
                Save Date
              </button>
              <button
                onClick={() => setEditingDueDate(null)}
                className="brutal-btn px-3 py-2.5 bg-white text-black font-black text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white border-3 border-black shadow-[8px_8px_0px_#000] p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                Delete Loan Record?
              </h3>
            </div>
            <p className="text-xs font-mono text-black/70">
              This will permanently delete this loan transaction from group records.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDeleteLoan}
                className="flex-1 brutal-btn py-2.5 bg-red-600 text-white font-black text-xs uppercase"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setLoanToDelete(null); }}
                className="brutal-btn px-4 py-2.5 bg-white text-black font-black text-xs uppercase"
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
