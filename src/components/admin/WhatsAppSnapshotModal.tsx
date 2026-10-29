import React, { useState } from 'react';
import { Share2, Copy, Check, X, Camera, Users, DollarSign, CreditCard, ArrowUpRight } from 'lucide-react';
import { GroupStats, User, Payment, Loan } from '../../types';

interface WhatsAppSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupStats: GroupStats;
  members: User[];
  payments: Payment[];
  loans: Loan[];
  totalDonations: number;
  complianceRate: number;
  adminName: string;
}

export default function WhatsAppSnapshotModal({
  isOpen,
  onClose,
  groupStats,
  members,
  payments,
  loans,
  totalDonations,
  complianceRate,
  adminName
}: WhatsAppSnapshotModalProps) {
  const [copied, setCopied] = useState(false);
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  if (!isOpen) return null;

  // Only active members (exclude inactive/exited members)
  const activeMembersList = members.filter(m => m.role === 'member' && m.status !== 'inactive');

  // Payments for current month for active members only
  const currentMonthPayments = payments.filter(
    p => p.month === currentMonth && 
         p.year === currentYear && 
         activeMembersList.some(m => m.id === p.memberId)
  );

  const paidCount = currentMonthPayments.filter(p => p.paid).length;
  const actualComplianceRate = activeMembersList.length > 0 
    ? (paidCount / activeMembersList.length) * 100 
    : 100;
  
  // Outstanding loans
  const activeLoans = loans.filter(l => l.status === 'active');
  const totalLoanAmount = groupStats.totalLoanAmount || 0;

  const handleCopyText = () => {
    const text = `📊 *F.O.R.T LEDGER OFFICIAL STATUS*
🗓 *Cycle:* ${currentMonth} ${currentYear}
────────────────────────
💰 *Total Available Funds:* LKR ${groupStats.totalFunds.toLocaleString()}
📥 *This Month Collection:* LKR ${groupStats.monthlyCollection.toLocaleString()} (${Math.round(actualComplianceRate)}% Paid - ${paidCount}/${activeMembersList.length})
💳 *Active Loans Out:* LKR ${totalLoanAmount.toLocaleString()} (${activeLoans.length} Active ${activeLoans.length === 1 ? 'Loan' : 'Loans'})
────────────────────────
👥 *Member Roll Call:*
${activeMembersList.map(m => {
  const isPaid = currentMonthPayments.some(p => p.memberId === m.id && p.paid);
  return `${isPaid ? '✅' : '⏳'} ${m.name}: ${isPaid ? 'Settled' : 'Pending'}`;
}).join('\n')}
────────────────────────
Verified by Admin: ${adminName}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-white border-2 sm:border-3 border-black shadow-[6px_6px_0px_#000] sm:shadow-[10px_10px_0px_#000] rounded-none my-auto">
        {/* Modal Top Control Bar */}
        <div className="bg-[#FFE600] border-b-2 sm:border-b-3 border-black p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-[#FFE600] flex items-center justify-center font-black text-xs border border-black shadow-[2px_2px_0px_#000]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm tracking-wider uppercase text-black leading-tight">
                WhatsApp Snapshot Card
              </h3>
              <p className="text-[10px] font-mono font-bold text-black/70">Optimized for Mobile Screenshot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── THE SCREENSHOT FRAME (100% Self-Contained) ─── */}
        <div id="whatsapp-screenshot-node" className="p-4 sm:p-6 bg-[#FAF9F6] text-black">
          {/* Snapshot Header */}
          <div className="bg-black text-white p-3 sm:p-4 border-2 border-black mb-3 sm:mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-[#FFE600] text-black font-black flex items-center justify-center text-sm border border-white">
                FT
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm tracking-widest uppercase text-white">
                  F.O.R.T LEDGER
                </h4>
                <p className="text-[9px] font-mono text-[#FFE600] tracking-wider font-bold">
                  OFFICIAL STATUS REPORT
                </p>
              </div>
            </div>
            <div className="bg-[#FFE600] text-black px-2 py-1 text-[10px] font-black uppercase tracking-wider border border-white">
              {currentMonth.toUpperCase()} {currentYear}
            </div>
          </div>

          {/* Hero Vault Box */}
          <div className="bg-[#FFE600] border-2 border-black p-4 mb-3 sm:mb-4 shadow-[3px_3px_0px_#000]">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-black tracking-widest uppercase text-black underline underline-offset-4 decoration-2">
                TOTAL AVAILABLE FUNDS
              </span>
              <span className="bg-black text-white text-[9px] font-mono font-bold px-1.5 py-0.5 border border-black flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-[#FFE600]" /> +LKR {groupStats.monthlyCollection.toLocaleString()}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-sm sm:text-base font-black text-black/60 font-mono">LKR</span>
              <span className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
                {groupStats.totalFunds.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Dual-Pillar Telemetry Grid: Inflow vs Outflow */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Box 1: Collection / Inflow */}
            <div className="bg-white border-2 border-black p-3 sm:p-3.5 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-between text-black/60 mb-1">
                <span className="text-[9px] font-black tracking-wider uppercase">Collection</span>
                <DollarSign className="w-3.5 h-3.5 text-black" />
              </div>
              <p className="text-lg sm:text-xl font-black text-black tracking-tight">
                LKR {groupStats.monthlyCollection.toLocaleString()}
              </p>
              <span className="text-[10px] font-mono font-bold text-emerald-600 block mt-0.5">
                {Math.round(actualComplianceRate)}% Paid ({paidCount}/{activeMembersList.length})
              </span>
            </div>

            {/* Box 2: Active Loans / Capital Out */}
            <div className="bg-white border-2 border-black p-3 sm:p-3.5 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-between text-black/60 mb-1">
                <span className="text-[9px] font-black tracking-wider uppercase">Active Loans</span>
                <CreditCard className="w-3.5 h-3.5 text-black" />
              </div>
              <p className="text-lg sm:text-xl font-black text-black tracking-tight">
                LKR {totalLoanAmount.toLocaleString()}
              </p>
              <span className="text-[10px] font-mono font-bold text-black/70 block mt-0.5">
                {activeLoans.length} Active {activeLoans.length === 1 ? 'Loan' : 'Loans'} Out
              </span>
            </div>
          </div>

          {/* Member Roll Call Mini Pills */}
          <div className="bg-white border-2 border-black p-3 mb-3 sm:mb-4 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black tracking-wider uppercase text-black">
                MEMBER ROLL CALL ({paidCount}/{activeMembersList.length})
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#FFE600] px-1.5 py-0.2 border border-black">
                {paidCount === activeMembersList.length ? 'ALL SETTLED' : `${activeMembersList.length - paidCount} PENDING`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {activeMembersList.map(member => {
                const isPaid = currentMonthPayments.some(p => p.memberId === member.id && p.paid);
                return (
                  <div
                    key={member.id}
                    className={`px-2 py-1 border text-[10px] font-bold flex items-center justify-between ${
                      isPaid
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-amber-50 border-amber-500 text-amber-900'
                    }`}
                  >
                    <span className="truncate">{member.name}</span>
                    <span className="text-[9px] ml-1">{isPaid ? '✓' : '•'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Seal */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-black/60 pt-2 border-t-2 border-dashed border-black/30">
            <span>Admin: {adminName}</span>
            <span>Secured Protocol v2.4</span>
          </div>
        </div>

        {/* Action Controls for Admin */}
        <div className="p-3 sm:p-4 bg-white border-t-2 sm:border-t-3 border-black flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleCopyText}
            className="flex-1 brutal-btn py-2.5 px-4 bg-[#FFE600] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#FFF275]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                Copied WhatsApp Text!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Text for WhatsApp
              </>
            )}
          </button>
          <div className="text-[11px] font-mono text-black/70 flex items-center justify-center px-2 py-1 bg-gray-100 border border-black/30 text-center">
            📸 Take a mobile screenshot now — zero cropping!
          </div>
        </div>
      </div>
    </div>
  );
}
