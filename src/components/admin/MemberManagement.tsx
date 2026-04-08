import React, { useState } from 'react';
import { UserPlus, UserX, UserCheck, Trash2, Calendar, AlertCircle, LogOut, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Loan } from '../../types';
import GlassButton from '../common/GlassButton';

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

  // ── Helpers ────────────────────────────────────────────
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

  // ── Handlers ───────────────────────────────────────────
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

  const displayMembers = showInactive ? inactiveMembers : activeMembers;
  const activeMember = memberToDeactivate ? getMember(memberToDeactivate) : null;
  const activeLoan = memberToDeactivate ? getActiveLoan(memberToDeactivate) : undefined;
  const refundAmount = memberToDeactivate ? getRefundAmount(memberToDeactivate) : 0;
  const paidMonths = memberToDeactivate ? getPaidPaymentCount(memberToDeactivate) : 0;
  const totalRefund = refundAmount + extraAmount;

  return (
    <div className="space-y-6">

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-md p-4 bg-green-600/90 backdrop-blur-xl border border-green-400/50 rounded-2xl shadow-2xl text-white">
          <div className="flex items-start space-x-3">
            <UserCheck className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-200" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-lg">
            Member Management
          </h2>
          <p className="text-white/70 mt-1">
            {activeMembers.length} active • {inactiveMembers.length} inactive
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`px-4 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 font-medium shadow-lg ${
              showInactive 
                ? 'bg-orange-500/30 text-orange-200 border-orange-400/50 hover:bg-orange-500/40'
                : 'bg-green-500/30 text-green-200 border-green-400/50 hover:bg-green-500/40'
            }`}
          >
            {showInactive ? 'Show Active' : 'Show Inactive'}
          </button>
          {!showInactive && (
            <GlassButton variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </GlassButton>
          )}
        </div>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-4">
            Add New Member
          </h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Username *</label>
                <input
                  type="text"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value.toLowerCase() })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="johndoe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password (Optional)</label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Join Date *</label>
                <input
                  type="date"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <GlassButton type="submit" variant="primary">Add Member</GlassButton>
              <GlassButton type="button" variant="secondary" onClick={() => {
                setShowAddForm(false);
                setNewMember({ name: '', username: '', email: '', password: '', joinDate: new Date().toISOString().split('T')[0] });
              }}>
                Cancel
              </GlassButton>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      {displayMembers.length === 0 ? (
        <div className="text-center py-16 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20">
          <UserX className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">
            No {showInactive ? 'Inactive' : 'Active'} Members
          </h3>
          <p className="text-white/50">
            {showInactive ? 'All members are currently active' : 'Add your first member to get started'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayMembers.map((member) => (
            <div
              key={member.id}
              className={`p-6 rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                member.status === 'inactive'
                  ? 'bg-gray-800/40 border-gray-700/50 opacity-75'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Member Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
                    <span className="text-xl font-bold text-white">{member.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                        {member.name}
                      </h3>
                      {member.status === 'inactive' && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium border border-red-500/30">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70">@{member.username}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-white/60">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {member.deactivatedAt && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-white/50">
                          Deactivated: {new Date(member.deactivatedAt).toLocaleDateString()}
                        </p>
                        {member.deactivationReason && (
                          <div className="flex items-start space-x-1">
                            <AlertCircle className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-orange-300">{member.deactivationReason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {member.status === 'active' ? (
                    <button
                      onClick={() => handleOpenDeactivate(member.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-xl border border-orange-500/30 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <UserX className="h-4 w-4" />
                      <span>Deactivate</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReactivate(member.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl border border-green-500/30 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Reactivate</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(member.id, member.name)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 transition-all duration-300 flex items-center justify-center shadow-lg"
                        title="Permanently delete all records"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          DEACTIVATION MODAL
      ═══════════════════════════════════════════════════ */}
      {memberToDeactivate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full border border-white/20 shadow-2xl">

            {/* ── SCREEN 1: Choose deactivation type ── */}
            {modalStep === 'choose' && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <UserX className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Deactivate Member</h3>
                    <p className="text-white/60 text-sm">{activeMember?.name}</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-6">
                  Choose the type of deactivation for this member:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard Deactivation */}
                  <button
                    onClick={handleChooseStandard}
                    className="flex flex-col items-start p-5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 text-left group"
                  >
                    <div className="h-10 w-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UserX className="h-5 w-5 text-orange-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">Standard Deactivation</h4>
                    <p className="text-white/55 text-xs leading-relaxed">
                      For violations, bans, or admin decisions. No financial refund is issued.
                    </p>
                  </button>

                  {/* Member Exit with Refund */}
                  <button
                    onClick={() => handleChooseExit(memberToDeactivate)}
                    className="flex flex-col items-start p-5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 text-left group"
                  >
                    <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <LogOut className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">Member Exit with Refund</h4>
                    <p className="text-white/55 text-xs leading-relaxed">
                      Member is leaving voluntarily. Their total paid contributions will be refunded.
                    </p>
                  </button>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={resetModal}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── SCREEN 2: Standard deactivation form ── */}
            {modalStep === 'standard' && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <UserX className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                    Standard Deactivation
                  </h3>
                </div>
                <p className="text-white/70 mb-4 text-sm">
                  This will mark <strong className="text-white">{activeMember?.name}</strong> as inactive. All payment and loan records will be preserved.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/80 mb-2">Reason (optional but recommended)</label>
                  <textarea
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:outline-none backdrop-blur-xl"
                    rows={3}
                    placeholder="e.g., Moved abroad, Violated group rules..."
                  />
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-300">No refund will be issued. The member's historical data remains accessible for reports and audits.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={confirmStandardDeactivation}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Deactivation'}
                  </button>
                  <button
                    onClick={resetModal}
                    className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── SCREEN 3: Exit BLOCKED — active loan ── */}
            {modalStep === 'exit-blocked' && activeLoan && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">⛔ Exit Blocked</h3>
                    <p className="text-red-300 text-sm font-medium">Outstanding Loan</p>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-5">
                  <strong className="text-white">{activeMember?.name}</strong> cannot exit the organization while they have an active loan. The loan must be fully repaid first.
                </p>

                {/* Loan Details */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5">
                  <p className="text-sm font-semibold text-red-300 mb-3 flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Loan Details</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-white/60">Loan Amount:</span>
                    <span className="text-white font-medium">LKR {activeLoan.amount.toLocaleString()}</span>
                    <span className="text-white/60">Issued:</span>
                    <span className="text-white font-medium">{new Date(activeLoan.issueDate).toLocaleDateString()}</span>
                    <span className="text-white/60">Due Date:</span>
                    <span className="text-white font-medium">{new Date(activeLoan.dueDate).toLocaleDateString()}</span>
                    <span className="text-white/60">Repaid So Far:</span>
                    <span className="text-green-300 font-medium">LKR {activeLoan.repaidAmount.toLocaleString()}</span>
                    <span className="text-white/60">Outstanding:</span>
                    <span className="text-red-300 font-bold">LKR {(activeLoan.amount - activeLoan.repaidAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-5">
                  <div className="flex items-start space-x-2">
                    <UserCheck className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-emerald-300">
                      Once this loan is fully repaid, you can process their exit and issue the refund of <strong>LKR {refundAmount.toLocaleString()}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetModal}
                  className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                >
                  Close
                </button>
              </div>
            )}

            {/* ── SCREEN 4: Exit CONFIRM — refund calculation ── */}
            {modalStep === 'exit-confirm' && (
              <div>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <LogOut className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                      Member Exit with Refund
                    </h3>
                    <p className="text-white/60 text-sm">{activeMember?.name}</p>
                  </div>
                </div>

                {/* Member info */}
                <div className="flex items-center space-x-4 mb-5 text-sm text-white/70">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {activeMember ? new Date(activeMember.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
                  </div>
                </div>

                {/* Refund Calculation Box */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 mb-4">
                  <p className="text-sm font-semibold text-emerald-300 mb-4 flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Refund Calculation</span>
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Monthly contributions ({paidMonths} × LKR 300):</span>
                      <span className="text-white font-medium">LKR {refundAmount.toLocaleString()}</span>
                    </div>
                    {extraAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/70">Extra contributions:</span>
                        <span className="text-blue-300 font-medium">+ LKR {extraAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-emerald-500/30 pt-2 flex justify-between">
                      <span className="text-emerald-300 font-semibold">Total Refund:</span>
                      <span className="text-emerald-300 font-bold text-lg">LKR {totalRefund.toLocaleString()}</span>
                    </div>
                  </div>
                  {paidMonths === 0 && extraAmount === 0 && (
                    <p className="text-xs text-white/50 mt-3">⚠️ No payments recorded. Refund will be LKR 0 unless you add extra contributions below.</p>
                  )}
                </div>

                {/* Extra Contributions Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Extra Contributions to Refund
                    <span className="ml-2 text-xs text-white/45 font-normal">(donations, additional payments, etc.)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium">LKR</span>
                    <input
                      type="number"
                      min="0"
                      value={extraAmountInput}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setExtraAmountInput(raw);
                        const parsed = parseFloat(raw);
                        setExtraAmount(!isNaN(parsed) && parsed > 0 ? parsed : 0);
                      }}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-2.5 bg-white/10 border border-white/20 hover:border-blue-400/50 focus:border-blue-400 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500/40 focus:outline-none backdrop-blur-xl transition-all"
                    />
                  </div>
                  {extraAmount > 0 && (
                    <p className="text-xs text-blue-300 mt-1.5">
                      ✓ Total refund updated to LKR {totalRefund.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Admin Notes */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-white/80 mb-2">Admin Notes (optional)</label>
                  <textarea
                    value={exitNotes}
                    onChange={(e) => setExitNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none backdrop-blur-xl"
                    rows={2}
                    placeholder="e.g. Member relocated abroad, left on good terms..."
                  />
                </div>

                {/* Warning */}
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl mb-5">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-300">
                      This action is permanent. <strong>{activeMember?.name}</strong> will be deactivated and <strong>LKR {totalRefund.toLocaleString()}</strong> will be deducted from the group fund.
                    </p>
                  </div>
                </div>

                {/* Error */}
                {exitError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl mb-4">
                    <p className="text-sm text-red-300">{exitError}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={confirmMemberExit}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>  
                        <UserCheck className="h-4 w-4" />
                        <span>Confirm Exit & Issue LKR {totalRefund.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetModal}
                    disabled={isProcessing}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                  >
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