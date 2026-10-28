import React, { useState } from 'react';
import { UserPlus, UserX, UserCheck, Trash2, Calendar, AlertCircle, LogOut, DollarSign, Search, X, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Loan } from '../../types';

type ModalStep = 'choose' | 'standard' | 'exit-blocked' | 'exit-confirm';

export default function MemberManagement() {
  const { 
    activeMembers, 
    inactiveMembers, 
    loans,
    payments,
    addMember, 
    deactivateMember,
    reactivateMember,
    permanentlyDeleteMember,
    processMemberExit,
    currentUser 
  } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Deactivation modal state
  const [memberToDeactivate, setMemberToDeactivate] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>('choose');
  const [deactivationReason, setDeactivationReason] = useState('');
  const [exitNotes, setExitNotes] = useState('');
  const [extraAmount, setExtraAmount] = useState<number>(0);
  const [extraAmountInput, setExtraAmountInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exitError, setExitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [newMember, setNewMember] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Helpers
  const getActiveLoan = (memberId: string): Loan | undefined =>
    loans.find(l => l.memberId === memberId && l.status === 'active');

  const getPaidPaymentCount = (memberId: string): number =>
    payments.filter(p => p.memberId === memberId && p.paid === true).length;

  const getRefundAmount = (memberId: string): number =>
    getPaidPaymentCount(memberId) * 300;

  const getMember = (memberId: string) =>
    activeMembers.find(m => m.id === memberId);

  const resetModal = () => {
    setMemberToDeactivate(null);
    setModalStep('choose');
    setDeactivationReason('');
    setExitNotes('');
    setExtraAmount(0);
    setExtraAmountInput('');
    setIsProcessing(false);
    setExitError(null);
  };

  // Handlers
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.username) {
      alert('Please fill in all required fields');
      return;
    }
    await addMember({
      name: newMember.name,
      username: newMember.username.toLowerCase(),
      role: 'member',
      email: newMember.email || undefined,
      password: newMember.password || undefined,
      joinDate: newMember.joinDate
    });
    setNewMember({ name: '', username: '', email: '', password: '', joinDate: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const handleOpenDeactivate = (memberId: string) => {
    setMemberToDeactivate(memberId);
    setModalStep('choose');
    setExitError(null);
  };

  const handleChooseStandard = () => setModalStep('standard');

  const handleChooseExit = (memberId: string) => {
    const activeLoan = getActiveLoan(memberId);
    setModalStep(activeLoan ? 'exit-blocked' : 'exit-confirm');
  };

  const confirmStandardDeactivation = async () => {
    if (!memberToDeactivate) return;
    setIsProcessing(true);
    await deactivateMember(memberToDeactivate, deactivationReason);
    setIsProcessing(false);
    resetModal();
  };

  const confirmMemberExit = async () => {
    if (!memberToDeactivate) return;
    setIsProcessing(true);
    setExitError(null);
    const result = await processMemberExit(memberToDeactivate, extraAmount, exitNotes || undefined);
    setIsProcessing(false);
    if (result.success) {
      setSuccessMessage(`Member exited successfully. LKR ${result.refundAmount.toLocaleString()} refund has been recorded and deducted from the group fund.`);
      resetModal();
      setTimeout(() => setSuccessMessage(null), 6000);
    } else {
      setExitError(result.error || 'An unexpected error occurred.');
    }
  };

  const handleReactivate = async (memberId: string) => {
    if (window.confirm('Reactivate this member? They will be able to make payments again.')) {
      await reactivateMember(memberId);
    }
  };

  const handlePermanentDelete = async (memberId: string, memberName: string) => {
    const confirmed = window.confirm(
      `⚠️ PERMANENT DELETE WARNING ⚠️\n\n` +
      `This will permanently delete ${memberName} and ALL their records including:\n` +
      `• All payment history\n• All loan records\n• All personal data\n\n` +
      `This action CANNOT be undone!\n\nAre you absolutely sure?`
    );
    if (confirmed) {
      const doubleConfirm = prompt(`Final confirmation: Type "${memberName}" to confirm deletion:`);
      if (doubleConfirm === memberName) {
        await permanentlyDeleteMember(memberId);
      } else {
        alert('Deletion cancelled - name did not match');
      }
    }
  };

  const baseMembers = showInactive ? inactiveMembers : activeMembers;
  const displayMembers = baseMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMember = memberToDeactivate ? getMember(memberToDeactivate) : null;
  const activeLoan = memberToDeactivate ? getActiveLoan(memberToDeactivate) : undefined;
  const refundAmount = memberToDeactivate ? getRefundAmount(memberToDeactivate) : 0;
  const paidMonths = memberToDeactivate ? getPaidPaymentCount(memberToDeactivate) : 0;
  const totalRefund = refundAmount + extraAmount;

  return (
    <div className="space-y-6 text-black animate-fadeIn">
      
      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-100 border-2 border-black text-emerald-950 shadow-[3px_3px_0px_#000] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />
            <p className="text-xs font-mono font-black">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="p-1 hover:bg-black/10">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              MEMBERS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#FFE600] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                ACTIVE DIRECTORY & ROSTER v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {activeMembers.length} ACTIVE • {inactiveMembers.length} INACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`brutal-btn px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                showInactive ? 'bg-black text-white' : 'bg-white text-black hover:bg-yellow-50'
              }`}
            >
              <span>{showInactive ? 'Viewing Inactive' : 'View Inactive (5)'}</span>
            </button>

            {!showInactive && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="brutal-btn bg-[#FFE600] hover:bg-[#FFF275] text-black px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>{showAddForm ? 'Close Form' : 'Add Member'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── ROW 1: THE 3 METRIC CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Active Directory (Electric Yellow Hero) */}
        <div className="brutal-card-yellow p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-[#FFE600] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>VERIFIED</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              ACTIVE ROSTER
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {activeMembers.length} Members
              </h2>
            </div>
          </div>
        </div>

        {/* Card 2: Inactive / Exited */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <UserX className="w-5 h-5 text-amber-500" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>EXITED</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              INACTIVE MEMBERS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {inactiveMembers.length} Records
              </h2>
            </div>
          </div>
        </div>

        {/* Card 3: Compliance Status */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>CYCLE 2026</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              MEMBERSHIP STATUS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                100% Active
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* ─── ADD MEMBER FORM (Collapsible Neo-Brutalist Frame) ─── */}
      {showAddForm && (
        <div className="brutal-card p-6 bg-white space-y-4 animate-slideDown">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h3 className="font-black text-sm uppercase tracking-wider text-black">
              Register New Active Member
            </h3>
            <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-black">Full Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-black">Username *</label>
                <input
                  type="text"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value.toLowerCase() })}
                  placeholder="e.g. johndoe"
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-black">Email (Optional)</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-black">Join Date *</label>
                <input
                  type="date"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="brutal-btn py-2.5 px-6 bg-[#FFE600] hover:bg-[#FFF275] text-black font-black text-xs uppercase tracking-wider"
              >
                Save Member Record
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="brutal-btn py-2.5 px-4 bg-white text-black font-black text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── SEARCH BAR ─── */}
      <div className="brutal-card p-3 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
          <input
            type="text"
            placeholder="Search member by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-white border-2 border-black text-xs font-mono font-bold text-black focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─── MEMBERS LIST (Tactile Cards) ─── */}
      <div className="space-y-3">
        {displayMembers.length === 0 ? (
          <div className="brutal-card p-12 text-center space-y-2">
            <UserX className="w-10 h-10 text-black/30 mx-auto" />
            <p className="font-mono font-bold text-xs text-black/60">
              No {showInactive ? 'inactive' : 'active'} members found matching "{searchTerm}"
            </p>
          </div>
        ) : (
          displayMembers.map((member) => {
            const memberActiveLoan = getActiveLoan(member.id);
            const paidCount = getPaidPaymentCount(member.id);

            return (
              <div
                key={member.id}
                className="brutal-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 border-2 border-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#000] ${
                    member.status === 'inactive' ? 'bg-gray-200 text-gray-700' : 'bg-[#FFE600] text-black'
                  }`}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-black">{member.name}</h3>
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-black uppercase border border-black ${
                        member.status === 'inactive' ? 'bg-red-100 text-red-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {member.status === 'inactive' ? 'Inactive' : 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] font-mono font-bold text-black/60 flex-wrap">
                      <span>@{member.username}</span>
                      <span>•</span>
                      <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-black">Paid: {paidCount} Months (LKR {(paidCount * 300).toLocaleString()})</span>
                      {memberActiveLoan && (
                        <span className="bg-amber-100 border border-black px-1.5 py-0.2 text-[9px] text-amber-900 font-bold">
                          Active Loan: LKR {(memberActiveLoan.amount - memberActiveLoan.repaidAmount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {member.status === 'active' ? (
                    <button
                      onClick={() => handleOpenDeactivate(member.id)}
                      className="brutal-btn py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-900 text-xs font-black uppercase flex items-center gap-1.5"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Deactivate / Exit</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReactivate(member.id)}
                        className="brutal-btn py-1.5 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-black uppercase flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Reactivate</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(member.id, member.name)}
                        className="brutal-btn p-2 bg-red-600 hover:bg-red-700 text-white"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── DEACTIVATION / EXIT MODAL ─── */}
      {memberToDeactivate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white border-3 border-black shadow-[8px_8px_0px_#000] p-6 space-y-6">
            
            {/* Step 1: Choose Type */}
            {modalStep === 'choose' && (
              <div className="space-y-4">
                <div className="bg-[#FFE600] border-2 border-black p-3 flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-wider text-black">
                    Deactivate Member: {activeMember?.name}
                  </h3>
                  <button onClick={resetModal} className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-mono font-bold text-black/70">
                  Select the appropriate protocol for this member's deactivation:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleChooseStandard}
                    className="p-4 bg-gray-50 border-2 border-black text-left shadow-[2px_2px_0px_#000] hover:bg-yellow-50 space-y-1"
                  >
                    <p className="font-black text-xs uppercase text-black">A. Standard Deactivation</p>
                    <p className="text-[10px] font-mono text-black/60">
                      Temporary pause or penalty. Preserves all history; no refund is issued.
                    </p>
                  </button>

                  <button
                    onClick={() => handleChooseExit(memberToDeactivate)}
                    className="p-4 bg-emerald-50 border-2 border-black text-left shadow-[2px_2px_0px_#000] hover:bg-emerald-100 space-y-1"
                  >
                    <p className="font-black text-xs uppercase text-emerald-950">B. Official Exit & Refund</p>
                    <p className="text-[10px] font-mono text-emerald-900">
                      Permanent exit. Calculates total contributions for refund from treasury.
                    </p>
                  </button>
                </div>

                <button onClick={resetModal} className="w-full brutal-btn py-2.5 bg-white text-xs font-black uppercase">
                  Cancel
                </button>
              </div>
            )}

            {/* Step 2: Standard Deactivation Form */}
            {modalStep === 'standard' && (
              <div className="space-y-4">
                <div className="bg-[#FFE600] border-2 border-black p-3 flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-wider text-black">
                    Standard Deactivation: {activeMember?.name}
                  </h3>
                  <button onClick={resetModal} className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-black">Reason for deactivation</label>
                  <textarea
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                    placeholder="e.g. Relocated, voluntary break, violation..."
                    className="w-full p-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={confirmStandardDeactivation}
                    disabled={isProcessing}
                    className="flex-1 brutal-btn py-2.5 bg-red-600 text-white font-black text-xs uppercase"
                  >
                    {isProcessing ? 'Saving...' : 'Confirm Deactivation'}
                  </button>
                  <button onClick={resetModal} className="brutal-btn px-4 py-2.5 bg-white text-black text-xs font-black uppercase">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Exit Blocked by Active Loan */}
            {modalStep === 'exit-blocked' && activeLoan && (
              <div className="space-y-4">
                <div className="bg-red-500 text-white border-2 border-black p-3 flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    ⛔ Exit Blocked: Active Loan
                  </h3>
                  <button onClick={resetModal} className="w-7 h-7 bg-white text-black border-2 border-black flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs font-mono font-bold text-black/80">
                  <strong>{activeMember?.name}</strong> has an active loan of <strong>LKR {(activeLoan.amount - activeLoan.repaidAmount).toLocaleString()}</strong> that must be fully repaid before processing an official exit.
                </p>

                <button onClick={resetModal} className="w-full brutal-btn py-2.5 bg-white text-xs font-black uppercase">
                  Close
                </button>
              </div>
            )}

            {/* Step 4: Exit Confirm with Refund Calculation */}
            {modalStep === 'exit-confirm' && (
              <div className="space-y-4">
                <div className="bg-emerald-500 text-white border-2 border-black p-3 flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    Member Exit & Refund Authorization
                  </h3>
                  <button onClick={resetModal} className="w-7 h-7 bg-white text-black border-2 border-black flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-emerald-50 border-2 border-black space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span>Monthly Contributions ({paidMonths} × 300):</span>
                    <span className="font-black">LKR {refundAmount.toLocaleString()}</span>
                  </div>
                  {extraAmount > 0 && (
                    <div className="flex justify-between text-blue-700">
                      <span>Extra Contributions:</span>
                      <span className="font-black">+LKR {extraAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-black pt-1.5 flex justify-between font-black text-sm text-emerald-950">
                    <span>Total Refund Due:</span>
                    <span>LKR {totalRefund.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-black">Extra Contributions to Refund (Optional)</label>
                  <input
                    type="number"
                    value={extraAmountInput}
                    onChange={(e) => {
                      setExtraAmountInput(e.target.value);
                      const parsed = parseFloat(e.target.value);
                      setExtraAmount(!isNaN(parsed) && parsed > 0 ? parsed : 0);
                    }}
                    placeholder="0"
                    className="w-full p-2 bg-white border-2 border-black text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-black">Admin Notes</label>
                  <input
                    type="text"
                    value={exitNotes}
                    onChange={(e) => setExitNotes(e.target.value)}
                    placeholder="e.g. Relocated, good standing..."
                    className="w-full p-2 bg-white border-2 border-black text-xs font-bold"
                  />
                </div>

                {exitError && (
                  <p className="p-2 bg-red-100 border border-red-500 text-red-900 text-xs font-bold">{exitError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={confirmMemberExit}
                    disabled={isProcessing}
                    className="flex-1 brutal-btn py-3 bg-[#FFE600] hover:bg-[#FFF275] text-black font-black text-xs uppercase"
                  >
                    {isProcessing ? 'Processing...' : `Confirm Exit & Issue LKR ${totalRefund.toLocaleString()}`}
                  </button>
                  <button onClick={resetModal} className="brutal-btn px-4 py-3 bg-white text-xs font-black uppercase">
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
