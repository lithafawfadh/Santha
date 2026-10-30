import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, DollarSign, Calendar, AlertCircle, TrendingUp, CreditCard, Smartphone,
  Edit3, X, Moon, Sun, CheckCircle2, Clock, AlertTriangle,
  Activity, FileText, Zap, Users, LogOut, Wallet,
  ChevronDown, Copy, Check, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MeetingReport } from '../../types';
import { MONTHLY_CONTRIBUTION } from '../../data/mockData';
import WarningBanner from '../common/WarningBanner';
import TactileFolderCard from '../common/TactileFolderCard';
import MeetingReportCard from './MeetingReportCard';
import BankingAppChooserModal from '../common/BankingAppChooserModal';
import { cleanAccountNumber, openNativePaymentChooser } from '../../utils/bankingApps';

// ─── Spring Presets ──────────────────────────────────────────────────────────
const spring = { type: 'spring', stiffness: 350, damping: 28 };
const springFast = { type: 'spring', stiffness: 420, damping: 28 };

// ─── Tactile Navigation Header ────────────────────────────────────────────────
interface NavBarProps {
  name: string;
  username: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenReports: () => void;
  onOpenProfile: () => void;
  onOpenBankDetails: () => void;
  reportCount: number;
}

const NavBar = React.memo(({
  name,
  username,
  isDarkMode,
  toggleDarkMode,
  onOpenReports,
  onOpenProfile,
  onOpenBankDetails,
  reportCount,
}: NavBarProps) => {
  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const headerBg = isDarkMode ? 'rgba(14, 17, 23, 0.82)' : 'rgba(250, 247, 242, 0.82)';
  const buttonBg = isDarkMode ? '#171B26' : '#FFFFFF';
  const shadow = isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212';

  return (
    <header
      className="sticky top-0 z-40 border-b-2 select-none"
      style={{
        backgroundColor: headerBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderColor,
        paddingTop: 'max(env(safe-area-inset-top, 0px), var(--sat, 0px))',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Member Avatar & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            title="Open Profile Settings"
            className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm text-white shrink-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            style={{
              backgroundColor: '#FF7A00',
              borderColor,
              boxShadow: shadow,
            }}
          >
            {name ? name.charAt(0).toUpperCase() : 'S'}
          </button>

          <div className="flex flex-col justify-center leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-950 dark:text-white">
                {name || 'Member'}
              </span>
              <span
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(52,211,153,0.15)' : 'rgba(34,197,94,0.12)',
                  color: isDarkMode ? '#34D399' : '#16A34A',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Ledger
              </span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              @{username || 'member'}
            </p>
          </div>
        </div>

        {/* Right: Tactile Actions */}
        <div className="flex items-center gap-2">
          {/* Bank Transfer Details Trigger Button */}
          <button
            onClick={onOpenBankDetails}
            title="Bank Transfer Details (LKR 300/mo)"
            className="flex items-center gap-1.5 h-10 px-3 rounded-xl border-2 font-bold text-xs text-neutral-900 dark:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            style={{
              backgroundColor: buttonBg,
              borderColor,
              boxShadow: shadow,
            }}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#FF7A00]" strokeWidth={2.2} />
            <span className="hidden sm:inline">Bank Details</span>
          </button>

          {/* Reports Archive Button */}
          <button
            onClick={onOpenReports}
            title="Community Resolutions & Archive"
            className="relative w-10 h-10 rounded-xl border-2 flex items-center justify-center text-neutral-800 dark:text-neutral-200 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            style={{
              backgroundColor: buttonBg,
              borderColor,
              boxShadow: shadow,
            }}
          >
            <FileText className="w-4 h-4" strokeWidth={2.2} />
            {reportCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border border-black dark:border-white bg-[#FF7A00] flex items-center justify-center text-[8px] font-black text-white"
              >
                {reportCount}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-neutral-800 dark:text-neutral-200 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            style={{
              backgroundColor: buttonBg,
              borderColor,
              boxShadow: shadow,
            }}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" strokeWidth={2.2} />
            ) : (
              <Moon className="w-4 h-4 text-neutral-800" strokeWidth={2.2} />
            )}
          </button>

          {/* Profile Trigger Pill */}
          <button
            onClick={onOpenProfile}
            title="Open Account Menu"
            className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-xl border-2 font-bold text-xs text-neutral-900 dark:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            style={{
              backgroundColor: buttonBg,
              borderColor,
              boxShadow: shadow,
            }}
          >
            <User className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>Profile</span>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
});
NavBar.displayName = 'NavBar';

// ─── Tactile Month Tile Component ─────────────────────────────────────────────
interface MonthTileProps {
  month: string;
  isPaid: boolean;
  isCurrent: boolean;
  isPast: boolean;
  paidDate?: string;
  index: number;
  isDarkMode: boolean;
}

const MonthTile = React.memo(({
  month,
  isPaid,
  isCurrent,
  isPast,
  paidDate,
  index,
  isDarkMode,
}: MonthTileProps) => {
  const shortMonth = month.slice(0, 3).toUpperCase();
  const baseBorderColor = isDarkMode ? '#2E364A' : '#121212';

  let borderStyle = baseBorderColor;
  let bgStyle = isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF';
  let badgeText = isDarkMode ? '#94A3B8' : '#64748B';
  let shadow = isDarkMode ? '2px 2px 0px rgba(0,0,0,0.5)' : '2px 2px 0px #121212';

  if (isPaid) {
    borderStyle = isDarkMode ? '#34D399' : '#16A34A';
    bgStyle = isDarkMode ? 'rgba(52,211,153,0.12)' : 'rgba(34,197,94,0.08)';
    badgeText = isDarkMode ? '#34D399' : '#15803D';
    shadow = isDarkMode ? '2px 2px 0px rgba(52,211,153,0.3)' : '2px 2px 0px #16A34A';
  } else if (isCurrent) {
    borderStyle = '#FF7A00';
    bgStyle = isDarkMode ? 'rgba(255,122,0,0.15)' : 'rgba(255,122,0,0.08)';
    badgeText = '#FF7A00';
    shadow = '2px 2px 0px #FF7A00';
  } else if (isPast) {
    borderStyle = isDarkMode ? '#F87171' : '#DC2626';
    bgStyle = isDarkMode ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.06)';
    badgeText = isDarkMode ? '#F87171' : '#B91C1C';
    shadow = isDarkMode ? '2px 2px 0px rgba(248,113,113,0.3)' : '2px 2px 0px #DC2626';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springFast, delay: index * 0.02 }}
      whileTap={{ scale: 0.95 }}
      title={isPaid && paidDate ? `Paid on ${new Date(paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : month}
      className="relative rounded-2xl border-2 py-3 px-2 sm:py-3.5 sm:px-3 flex flex-col items-center justify-center gap-2 select-none transition-all cursor-default"
      style={{
        backgroundColor: bgStyle,
        borderColor: borderStyle,
        boxShadow: shadow,
      }}
    >
      {/* Month Label */}
      <span
        className="text-xs sm:text-[13px] font-black tracking-wider uppercase leading-none"
        style={{ color: badgeText }}
      >
        {shortMonth}
      </span>

      {/* Center Icon */}
      <div className="flex items-center justify-center">
        {isPaid ? (
          <CheckCircle2
            className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
            strokeWidth={2.5}
          />
        ) : isCurrent ? (
          <div className="relative">
            <Clock className="w-6 h-6 text-orange-500 animate-pulse" strokeWidth={2.5} />
          </div>
        ) : isPast ? (
          <AlertTriangle
            className="w-6 h-6 text-red-500 dark:text-red-400"
            strokeWidth={2.5}
          />
        ) : (
          <div
            className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-700 opacity-60"
          />
        )}
      </div>
    </motion.div>
  );
});
MonthTile.displayName = 'MonthTile';

// ─── Tactile Loan Card Component ──────────────────────────────────────────────
interface LoanCardProps {
  loan: any;
  isDarkMode: boolean;
}

const LoanCard = React.memo(({ loan, isDarkMode }: LoanCardProps) => {
  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const outstanding = loan.amount - loan.repaidAmount;
  const progress = loan.amount > 0 ? (loan.repaidAmount / loan.amount) * 100 : 0;
  const today = new Date();
  const dueDate = new Date(loan.dueDate);
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
  const isOverdue = daysRemaining < 0 && loan.status === 'active';
  const isDueSoon = daysRemaining >= 0 && daysRemaining <= 7 && loan.status === 'active';

  const tabColor = loan.status === 'repaid' ? '#22C55E' : isOverdue ? '#EF4444' : '#FF7A00';

  return (
    <TactileFolderCard
      tabLabel="LOAN RECORD"
      tabColor={tabColor}
      tabTextColor="#FFFFFF"
      isDarkMode={isDarkMode}
      delay={0.12}
    >
      {/* Top Header - Optically Centered */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0"
          style={{
            backgroundColor: tabColor,
            borderColor,
            color: '#FFFFFF',
          }}
        >
          <Zap className="w-4.5 h-4.5" strokeWidth={2.4} />
        </div>

        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2 shrink-0"
          style={{
            borderColor,
            backgroundColor:
              loan.status === 'repaid'
                ? 'rgba(34,197,94,0.15)'
                : isOverdue
                ? 'rgba(239,68,68,0.15)'
                : 'rgba(255,122,0,0.15)',
            color:
              loan.status === 'repaid'
                ? (isDarkMode ? '#34D399' : '#15803D')
                : isOverdue
                ? (isDarkMode ? '#F87171' : '#B91C1C')
                : (isDarkMode ? '#FB923C' : '#C2410C'),
          }}
        >
          {loan.status === 'repaid'
            ? '✓ Repaid'
            : isOverdue
            ? '⚠ Overdue'
            : isDueSoon
            ? '⏰ Due Soon'
            : '⏳ Active Loan'}
        </span>
      </div>

      {/* Main Loan Details & Consolidated Status */}
      <div className="space-y-2">
        <div>
          <h3 className="text-[12px] sm:text-[13px] font-bold tracking-tight text-neutral-600 dark:text-neutral-400 leading-tight">
            Emergency Loan · 0% Interest
          </h3>
          <div className="text-xl sm:text-2xl font-black tabular-nums tracking-tight text-neutral-950 dark:text-white leading-tight mt-0.5">
            LKR {loan.amount.toLocaleString()}
          </div>
        </div>

        {/* Dynamic Repayment Bar & Context */}
        {loan.status !== 'repaid' && (
          <div
            className="p-2.5 rounded-xl border-2 space-y-2"
            style={{
              borderColor,
              backgroundColor: isDarkMode ? 'rgba(255,122,0,0.06)' : '#FFFBF5',
            }}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-600 dark:text-neutral-300">
                {loan.repaidAmount > 0 ? (
                  <>Outstanding: <span className="font-black text-neutral-950 dark:text-white">LKR {outstanding.toLocaleString()}</span></>
                ) : (
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400">Total Outstanding</span>
                )}
              </span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="h-2 rounded-full border overflow-hidden"
              style={{
                borderColor,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                style={{ backgroundColor: '#FF7A00' }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-medium text-neutral-500 dark:text-neutral-400 pt-0.5">
              <span>{Math.round(progress)}% repaid (LKR {loan.repaidAmount.toLocaleString()})</span>
              <span>Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        )}

        {loan.status === 'repaid' && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Loan fully repaid in good standing.</span>
          </div>
        )}
      </div>
    </TactileFolderCard>
  );
});
LoanCard.displayName = 'LoanCard';

// ─── Tactile No Loan State Component ──────────────────────────────────────────
const NoLoan = React.memo(({
  isDarkMode,
  onRequestLoan,
}: {
  isDarkMode: boolean;
  onRequestLoan: () => void;
}) => {
  const borderColor = isDarkMode ? '#2E364A' : '#121212';

  return (
    <TactileFolderCard
      tabLabel="0% EMERGENCY"
      tabColor="#EC4899"
      tabTextColor="#FFFFFF"
      isDarkMode={isDarkMode}
      delay={0.12}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0"
          style={{
            backgroundColor: '#EC4899',
            borderColor,
            color: '#FFFFFF',
          }}
        >
          <Zap className="w-4.5 h-4.5" strokeWidth={2.4} />
        </div>

        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2 shrink-0"
          style={{
            borderColor,
            backgroundColor: 'rgba(236,72,153,0.12)',
            color: isDarkMode ? '#F472B6' : '#BE185D',
          }}
        >
          Eligible
        </span>
      </div>

      <div className="space-y-1 mb-3">
        <h3 className="text-[12px] sm:text-[13px] font-bold tracking-tight text-neutral-600 dark:text-neutral-400 leading-tight">
          0% Emergency Protection
        </h3>
        <div className="text-base sm:text-lg font-black tracking-tight text-neutral-950 dark:text-white leading-tight">
          Instant Aid Ready
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
          Interest-free emergency assistance accessible whenever urgent needs arise.
        </p>
      </div>

      <button
        onClick={onRequestLoan}
        className="w-full py-2 px-3.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        style={{
          borderColor,
          backgroundColor: '#EC4899',
          color: '#FFFFFF',
          boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
        }}
      >
        <span>Request Emergency Aid</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </TactileFolderCard>
  );
});
NoLoan.displayName = 'NoLoan';

// ─── Quick Actions & Bank Details Modal ────────────────────────────────────────
interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const QuickActionModal = React.memo(({ isOpen, onClose, isDarkMode }: QuickActionModalProps) => {
  const { activeBankAccounts } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<string | null>(null);

  const accounts = activeBankAccounts && activeBankAccounts.length > 0
    ? activeBankAccounts
    : [
        {
          id: 'default-combank',
          bankName: 'Commercial Bank of Ceylon',
          accountName: 'Santha Mutual Pool',
          accountNumber: '8010 000 000',
          branchName: 'Colombo Main Branch',
          contributionText: 'Monthly Contribution · LKR 300',
          notes: 'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.',
          isActive: true,
          isPrimary: true,
        }
      ];

  const currentAccount = accounts[selectedIdx] || accounts[0];
  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const modalBg = isDarkMode ? '#171B26' : '#FFFFFF';

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePayViaNativeChooser = async () => {
    setPayStatus('Account copied! Opening app chooser...');
    setCopiedKey('acc');

    // Trigger the native Android bottom chooser (Action Chooser sheet)
    const opened = await openNativePaymentChooser(currentAccount);

    setTimeout(() => {
      setPayStatus(null);
      setCopiedKey(null);
    }, 3500);

    if (!opened) {
      // If running on a desktop browser that has no native chooser sheet, fallback notification
      setPayStatus('Account number copied to clipboard! Paste it into your online banking.');
      setTimeout(() => setPayStatus(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="quick-action-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            key="quick-action-content"
            className="relative w-full max-w-md z-10 rounded-2xl border-2 overflow-hidden shadow-2xl p-5 select-none max-h-[90vh] flex flex-col transform-gpu"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: modalBg,
              borderColor,
              boxShadow: isDarkMode ? '6px 6px 0px rgba(0,0,0,0.8)' : '6px 6px 0px #121212',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2" style={{ borderColor }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border-2 flex items-center justify-center bg-[#FF7A00] text-white"
                  style={{ borderColor }}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-950 dark:text-white">
                    Mutual Aid Transfer
                  </h3>
                  <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    {currentAccount.contributionText || 'Monthly Contribution · LKR 300'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                style={{ borderColor }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Multiple Bank Selector Tabs */}
            {accounts.length > 1 && (
              <div className="pt-3 pb-1">
                <div className="text-[10px] font-black uppercase text-neutral-400 mb-1 tracking-wider">
                  Select Transfer Channel:
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {accounts.map((acc, idx) => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg border-2 text-[11px] font-black whitespace-nowrap transition-all ${
                        selectedIdx === idx
                          ? 'bg-[#FF7A00] text-white shadow-[1px_1px_0px_#000]'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                      style={{ borderColor }}
                    >
                      {acc.bankName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bank Details Card */}
            <div className="py-3 space-y-3 overflow-y-auto">
              <div
                className="p-3.5 rounded-xl border-2 space-y-2.5"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FAF7F2',
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">Bank Name</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{currentAccount.bankName}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">Account Name</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{currentAccount.accountName}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">Account Number</span>
                  <button
                    onClick={() => copyToClipboard('acc', cleanAccountNumber(currentAccount.accountNumber))}
                    className="flex items-center gap-1.5 font-black text-sm text-[#FF7A00] hover:underline"
                  >
                    <span className="font-mono">{currentAccount.accountNumber}</span>
                    {copiedKey === 'acc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">Branch</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{currentAccount.branchName}</span>
                </div>
              </div>

              {/* Note Callout */}
              <div
                className="p-2.5 rounded-xl border-2 flex items-start gap-2 text-xs"
                style={{
                  borderColor,
                  backgroundColor: 'rgba(255,122,0,0.08)',
                  color: isDarkMode ? '#FB923C' : '#C2410C',
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {currentAccount.notes || 'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.'}
                </span>
              </div>

              {/* Live Toast feedback */}
              {payStatus && (
                <div
                  className="p-2 rounded-lg border-2 text-[11px] font-black text-center animate-fadeIn"
                  style={{
                    borderColor,
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                  }}
                >
                  {payStatus}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              {/* Native Android Chooser Button */}
              <button
                onClick={handlePayViaNativeChooser}
                className="w-full py-2.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-2 active:translate-x-[1px] active:translate-y-[1px]"
                style={{
                  borderColor,
                  backgroundColor: '#FF7A00',
                  color: '#FFFFFF',
                  boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
                }}
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay via Banking App</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard('all', `${currentAccount.bankName} | ${currentAccount.accountName} | ${cleanAccountNumber(currentAccount.accountNumber)} | ${currentAccount.contributionText || 'LKR 300'}`)}
                  className="flex-1 py-2 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px]"
                  style={{
                    borderColor,
                    backgroundColor: isDarkMode ? '#232936' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#121212',
                    boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
                  }}
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied Details!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Details</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors"
                  style={{ borderColor }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
QuickActionModal.displayName = 'QuickActionModal';

// ─── Profile Slide-over Sheet ─────────────────────────────────────────────────
interface ProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  isDarkMode: boolean;
  onLogout: () => void;
  onUsernameUpdate: (val: string) => Promise<void>;
}

const ProfileSheet = React.memo(({
  isOpen,
  onClose,
  currentUser,
  isDarkMode,
  onLogout,
  onUsernameUpdate,
}: ProfileSheetProps) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(currentUser?.username || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const sheetBg = isDarkMode ? '#0E1117' : '#FAF7F2';

  const handleSave = async () => {
    if (!newName.trim() || newName.trim() === currentUser?.username) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onUsernameUpdate(newName.trim());
    setSaving(false);
    setMsg('Username updated!');
    setEditing(false);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            key="profile-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Slide-over Sheet */}
          <motion.div
            key="profile-content"
            className="relative z-10 h-full w-full sm:w-88 flex flex-col border-l-2 select-none transform-gpu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            style={{
              backgroundColor: sheetBg,
              borderColor,
              boxShadow: '-4px 0px 0px rgba(0,0,0,0.2)',
            }}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-5 border-b-2" style={{ borderColor }}>
              <p className="text-base font-black text-neutral-950 dark:text-white">
                Member Profile
              </p>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                style={{ borderColor }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Avatar Squircle */}
              <div className="flex flex-col items-center gap-2 py-4">
                <div
                  className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black text-white"
                  style={{
                    backgroundColor: '#FF7A00',
                    borderColor,
                    boxShadow: isDarkMode ? '3px 3px 0px rgba(0,0,0,0.6)' : '3px 3px 0px #121212',
                  }}
                >
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'M'}
                </div>
                <div className="text-center mt-1">
                  <p className="text-base font-black text-neutral-950 dark:text-white">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    @{currentUser?.username}
                  </p>
                  <span
                    className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2"
                    style={{
                      borderColor,
                      backgroundColor: 'rgba(255,122,0,0.15)',
                      color: isDarkMode ? '#FB923C' : '#C2410C',
                    }}
                  >
                    Santha Member
                  </span>
                </div>
              </div>

              {/* Username edit block */}
              <div
                className="rounded-xl border-2 p-4 space-y-2"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Member Handle
                </p>
                {editing ? (
                  <div className="space-y-2">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border-2 font-bold outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      style={{ borderColor }}
                      placeholder="New username"
                      disabled={saving}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-1.5 rounded-lg border-2 text-xs font-black text-white bg-[#FF7A00]"
                        style={{ borderColor }}
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setNewName(currentUser?.username || '');
                        }}
                        className="px-3 py-1.5 rounded-lg border-2 text-xs font-bold text-neutral-600 dark:text-neutral-400"
                        style={{ borderColor }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-between p-2 rounded-lg border-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    style={{ borderColor }}
                  >
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      @{currentUser?.username}
                    </span>
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                )}
                {msg && <p className="text-xs font-bold text-emerald-500">{msg}</p>}
              </div>

              {/* Member Since block */}
              <div
                className="rounded-xl border-2 p-4"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                  Member Status
                </p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                  {currentUser?.joinDate
                    ? `Joined ${new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                    : 'Active founding cohort'}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Monthly contribution: LKR 300 / mo
                </p>
              </div>
            </div>

            {/* Logout Footer */}
            <div className="p-5 border-t-2" style={{ borderColor }}>
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 px-4 rounded-xl border-2 text-xs font-black text-red-600 dark:text-red-400 border-red-500/40 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Ledger</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
ProfileSheet.displayName = 'ProfileSheet';

// ─── Meeting Resolutions Slide-up Sheet ───────────────────────────────────────
interface MeetingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reports: MeetingReport[];
  isDarkMode: boolean;
}

const MeetingSheet = React.memo(({
  isOpen,
  onClose,
  reports,
  isDarkMode,
}: MeetingSheetProps) => {
  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const sheetBg = isDarkMode ? '#0E1117' : '#FAF7F2';
  const headerBg = isDarkMode ? '#131822' : '#F5F0E8';

  // Prevent background scroll bleed when resolution sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <motion.div
            key="meeting-sheet-backdrop"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          {/* Full-Screen Sheet Container */}
          <motion.div
            key="meeting-sheet-content"
            className="relative w-full h-full flex flex-col select-none z-10 transform-gpu"
            style={{
              backgroundColor: sheetBg,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Solid Hardware-Accelerated Header (no GPU backdrop-filter flicker during translate) */}
            <div
              className="border-b-2 shrink-0 sticky top-0 z-10 transition-colors"
              style={{
                borderColor,
                backgroundColor: headerBg,
                paddingTop: 'max(env(safe-area-inset-top, 0px), var(--sat, 0px))',
              }}
            >
              <div className="flex items-center justify-between px-5 h-16">
                <div>
                  <h3 className="text-base font-black text-neutral-950 dark:text-white">
                    Community Resolutions Archive
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {reports.length} official assembly record{reports.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl border-2 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  style={{
                    borderColor,
                    backgroundColor: isDarkMode ? '#171B26' : '#FFFFFF',
                    boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
                  }}
                  aria-label="Close resolutions archive"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Resolution Content Area */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto"
              style={{
                paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 32px)',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {reports.length === 0 ? (
                <div className="text-center py-12 text-neutral-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-bold">No meeting reports filed yet.</p>
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border-2 p-4 space-y-3"
                    style={{
                      borderColor,
                      backgroundColor: isDarkMode ? '#171B26' : '#FFFFFF',
                      boxShadow: isDarkMode ? '3px 3px 0px rgba(0,0,0,0.5)' : '3px 3px 0px #121212',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-neutral-950 dark:text-white">
                          {r.title}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-purple-500" />
                          <span>
                            {new Date(r.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </p>
                      </div>
                    </div>

                    {r.decisions && r.decisions.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Decisions Approved
                        </p>
                        {r.decisions.map((d, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 py-1 px-2 rounded-lg text-xs leading-snug"
                            style={{
                              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                              {d}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {r.attendees && r.attendees.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>Present: {r.attendees.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
MeetingSheet.displayName = 'MeetingSheet';

// ─── Main MemberDashboard Component ──────────────────────────────────────────
export default function MemberDashboard() {
  const {
    currentUser,
    payments,
    loans,
    groupStats,
    logout,
    loading,
    updateUsername,
    isDarkMode,
    toggleDarkMode,
    memberWarnings,
    markWarningAsRead,
  } = useApp();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showProfile, setShowProfile] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showPastLoans, setShowPastLoans] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [meetingReports, setMeetingReports] = useState<MeetingReport[]>([]);

  const months = useMemo(
    () => [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    []
  );

  const availableYears = useMemo(() => {
    const yrs = [
      ...new Set(
        payments
          .filter((p) => p.memberId === currentUser?.id)
          .map((p) => p.year)
      ),
    ].sort((a, b) => b - a);
    return yrs.length > 0 ? yrs : [new Date().getFullYear()];
  }, [payments, currentUser?.id]);

  const myPayments = useMemo(
    () =>
      payments.filter(
        (p) => p.memberId === currentUser?.id && p.year === selectedYear
      ),
    [payments, currentUser?.id, selectedYear]
  );

  const myLoans = useMemo(
    () => loans.filter((l) => l.memberId === currentUser?.id),
    [loans, currentUser?.id]
  );

  const activeLoans = useMemo(
    () => myLoans.filter((l) => l.status === 'active'),
    [myLoans]
  );

  const repaidLoans = useMemo(
    () => myLoans.filter((l) => l.status === 'repaid'),
    [myLoans]
  );

  const stats = useMemo(() => {
    const paidMonths = myPayments.filter((p) => p.paid).length;
    const pendingMonths = myPayments.filter((p) => !p.paid).length;
    const totalPaid = myPayments
      .filter((p) => p.paid)
      .reduce((s, p) => s + p.amount, 0);
    const active = myLoans.filter((l) => l.status === 'active');
    const totalLoanAmt = active.reduce(
      (s, l) => s + (l.amount - l.repaidAmount),
      0
    );
    const completionRate = Math.round((paidMonths / 12) * 100);
    return {
      paidMonths,
      pendingMonths,
      totalPaid,
      activeLoans: active,
      totalLoanAmt,
      completionRate,
    };
  }, [myPayments, myLoans]);

  const currentDate = useMemo(
    () => ({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    }),
    []
  );

  const getPayment = useCallback(
    (month: string) => myPayments.find((p) => p.month === month),
    [myPayments]
  );

  // Load meeting reports
  useEffect(() => {
    (async () => {
      try {
        const { dataService } = await import('../../services/dataService');
        const reports = await dataService.getMeetingReports();
        setMeetingReports(reports);
      } catch (e) {
        console.error('Meeting reports error:', e);
      }
    })();
  }, []);

  const handleUsernameUpdate = useCallback(
    async (val: string) => {
      await updateUsername(currentUser?.id || '', val);
    },
    [currentUser?.id, updateUsername]
  );

  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const shadow = isDarkMode ? '3px 3px 0px rgba(0,0,0,0.6)' : '3px 3px 0px #121212';

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: isDarkMode ? '#0E1117' : '#FAF7F2' }}
      >
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl border-2 border-black dark:border-white bg-[#FF7A00] animate-spin mx-auto" />
          <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Opening your tactile ledger…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: isDarkMode ? '#0E1117' : '#FAF7F2',
        color: isDarkMode ? '#F8FAFC' : '#121212',
      }}
    >
      {/* ── Top Navigation Bar ── */}
      <NavBar
        name={currentUser?.name || ''}
        username={currentUser?.username || ''}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenReports={() => setShowMeetings(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenBankDetails={() => setShowQuickAction(true)}
        reportCount={meetingReports.length}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Warning Banners ── */}
        <WarningBanner
          warnings={memberWarnings}
          onDismiss={markWarningAsRead}
          isDarkMode={isDarkMode}
        />

        {/* ── Section Title: My Overview ── */}
        <div className="flex items-center justify-between pt-1 pb-0.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 dark:text-white leading-none">
            My Overview
          </h1>
          <span
            className="px-2.5 py-1 rounded-lg border-2 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors"
            style={{
              borderColor,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              color: isDarkMode ? '#94A3B8' : '#64748B',
              boxShadow: isDarkMode ? '1.5px 1.5px 0px rgba(0,0,0,0.5)' : '1.5px 1.5px 0px #121212',
            }}
          >
            FY {selectedYear}
          </span>
        </div>

        {/* ── 4 Primary Tactile Folder Cards Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Annual Contributions */}
          <TactileFolderCard
            tabLabel="CONTRIBUTIONS"
            tabColor="#22C55E"
            tabTextColor="#FFFFFF"
            icon={Calendar}
            iconBg="#22C55E"
            iconColor="#FFFFFF"
            badge={
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black border-2 whitespace-nowrap shrink-0"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(52,211,153,0.15)' : 'rgba(34,197,94,0.12)',
                  color: isDarkMode ? '#34D399' : '#15803D',
                }}
              >
                {stats.paidMonths}/12 Paid
              </span>
            }
            title="Annual Contributions"
            value={`${stats.completionRate}% on track`}
            subtitle={`${stats.paidMonths} of 12 months deposited`}
            isDarkMode={isDarkMode}
            delay={0}
          />

          {/* Card 2: Contributed Fund */}
          <TactileFolderCard
            tabLabel="SAVINGS"
            tabColor="#FF7A00"
            tabTextColor="#FFFFFF"
            icon={DollarSign}
            iconBg="#FF7A00"
            iconColor="#FFFFFF"
            badge={
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black border-2 whitespace-nowrap shrink-0"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,122,0,0.15)' : 'rgba(255,122,0,0.12)',
                  color: isDarkMode ? '#FB923C' : '#C2410C',
                }}
              >
                LKR 300/mo
              </span>
            }
            title="Contributed Fund"
            value={`LKR ${stats.totalPaid.toLocaleString()}`}
            subtitle="Personal equity in fund"
            isDarkMode={isDarkMode}
            delay={0.05}
          />

          {/* Card 3: Group Mutual Pool */}
          <TactileFolderCard
            tabLabel="MUTUAL POOL"
            tabColor="#3B82F6"
            tabTextColor="#FFFFFF"
            icon={TrendingUp}
            iconBg="#3B82F6"
            iconColor="#FFFFFF"
            badge={
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black border-2 whitespace-nowrap shrink-0"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(96,165,250,0.15)' : 'rgba(59,130,246,0.12)',
                  color: isDarkMode ? '#60A5FA' : '#1D4ED8',
                }}
              >
                Mutual Aid
              </span>
            }
            title="Group Mutual Pool"
            value={`LKR ${groupStats.totalFunds.toLocaleString()}`}
            subtitle={`${groupStats.totalMembers} trusted friends pool`}
            isDarkMode={isDarkMode}
            delay={0.1}
          />

          {/* Card 4: 0% Emergency Loan */}
          <TactileFolderCard
            tabLabel="0% LOAN"
            tabColor="#EC4899"
            tabTextColor="#FFFFFF"
            icon={Zap}
            iconBg="#EC4899"
            iconColor="#FFFFFF"
            badge={
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-black border-2 whitespace-nowrap shrink-0"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(244,114,182,0.15)' : 'rgba(236,72,153,0.12)',
                  color: isDarkMode ? '#F472B6' : '#BE185D',
                }}
              >
                0% Interest
              </span>
            }
            title="Emergency Aid"
            value={stats.totalLoanAmt > 0 ? `LKR ${stats.totalLoanAmt.toLocaleString()}` : 'Eligible'}
            subtitle={stats.activeLoans.length > 0 ? `${stats.activeLoans.length} active loan` : 'Instant access if needed'}
            isDarkMode={isDarkMode}
            delay={0.15}
          />
        </div>

        {/* ── Main 2-Column Ledger & Loan Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT: 12-Month Contribution Matrix Folder Card (2 cols on lg) */}
          <div className="lg:col-span-2">
            <TactileFolderCard
              tabLabel="LEDGER MATRIX"
              tabColor="#06B6D4"
              tabTextColor="#FFFFFF"
              isDarkMode={isDarkMode}
              delay={0.1}
            >
              {/* Header row with Year Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2" style={{ borderColor }}>
                <div>
                  <h3 className="text-base font-black text-neutral-950 dark:text-white">
                    Contribution Calendar
                  </h3>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                    LKR {MONTHLY_CONTRIBUTION} / month · 12-Month Matrix
                  </p>
                </div>

                {/* Tactile Year Pills */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {availableYears.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className="px-3 py-1 rounded-xl border-2 text-xs font-black transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      style={{
                        borderColor,
                        backgroundColor: selectedYear === yr ? '#FF7A00' : (isDarkMode ? '#171B26' : '#FAF7F2'),
                        color: selectedYear === yr ? '#FFFFFF' : (isDarkMode ? '#94A3B8' : '#64748B'),
                        boxShadow: selectedYear === yr ? shadow : 'none',
                      }}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2024 Initial Founding Note Banner */}
              {selectedYear === 2024 && (
                <div
                  className="mt-4 p-3 rounded-xl border-2 text-xs font-bold"
                  style={{
                    borderColor,
                    backgroundColor: isDarkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
                    color: isDarkMode ? '#93C5FD' : '#1D4ED8',
                  }}
                >
                  💡 <strong>Founding Year Note:</strong> Santha commenced May 2024. Months prior to your membership join date are normal and exempted.
                </div>
              )}

              {/* 12-Month Tactile Stamp Grid */}
              <div className="py-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {months.map((month, index) => {
                    const payment = getPayment(month);
                    const isPaid = payment?.paid ?? false;
                    const isCurrent = index === currentDate.month && selectedYear === currentDate.year;
                    const isPast =
                      selectedYear < currentDate.year ||
                      (selectedYear === currentDate.year && index < currentDate.month);

                    return (
                      <MonthTile
                        key={month}
                        month={month}
                        isPaid={isPaid}
                        isCurrent={isCurrent}
                        isPast={isPast && !isPaid}
                        paidDate={payment?.paidDate}
                        index={index}
                        isDarkMode={isDarkMode}
                      />
                    );
                  })}
                </div>

                {/* Annual Progress Bar */}
                <div className="mt-5 pt-4 border-t-2" style={{ borderColor }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                      Annual Ledger Completion
                    </span>
                    <span
                      className="text-xs font-black tabular-nums"
                      style={{
                        color:
                          stats.completionRate >= 80
                            ? '#22C55E'
                            : stats.completionRate >= 50
                            ? '#FF7A00'
                            : '#EF4444',
                      }}
                    >
                      {stats.completionRate}% ({stats.paidMonths}/12)
                    </span>
                  </div>

                  <div
                    className="h-3 rounded-full border-2 overflow-hidden"
                    style={{
                      borderColor,
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                    }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.completionRate}%` }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                      style={{
                        backgroundColor:
                          stats.completionRate >= 80
                            ? '#22C55E'
                            : stats.completionRate >= 50
                            ? '#FF7A00'
                            : '#EF4444',
                      }}
                    />
                  </div>

                  {stats.pendingMonths > 0 && (
                    <div
                      className="mt-3 flex items-center justify-between p-3 rounded-xl border-2 text-xs font-bold"
                      style={{
                        borderColor,
                        backgroundColor: 'rgba(255,122,0,0.08)',
                        color: isDarkMode ? '#FB923C' : '#C2410C',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {stats.pendingMonths} month{stats.pendingMonths > 1 ? 's' : ''} pending for {selectedYear}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowQuickAction(true)}
                        className="px-2.5 py-1 rounded-lg border-2 bg-[#FF7A00] text-white font-black hover:opacity-90 transition-opacity"
                        style={{ borderColor }}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TactileFolderCard>
          </div>

          {/* RIGHT: Loan Card & Meeting Resolutions (1 col on lg) */}
          <div className="space-y-5">
            {activeLoans.length > 0 ? (
              activeLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} isDarkMode={isDarkMode} />
              ))
            ) : (
              <NoLoan
                isDarkMode={isDarkMode}
                onRequestLoan={() => setShowQuickAction(true)}
              />
            )}

            {/* Past Loans Accordion */}
            {repaidLoans.length > 0 && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowPastLoans((prev) => !prev)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-xs font-bold transition-all active:translate-x-[1px] active:translate-y-[1px]"
                  style={{
                    borderColor,
                    backgroundColor: isDarkMode ? '#171B26' : '#FFFFFF',
                    boxShadow: shadow,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Past Loans ({repaidLoans.length} Repaid)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                    <span>{showPastLoans ? 'Hide' : 'View Archive'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        showPastLoans ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {showPastLoans && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {repaidLoans.map((loan) => (
                        <LoanCard key={loan.id} loan={loan} isDarkMode={isDarkMode} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Community Resolutions Card */}
            <MeetingReportCard
              latestReport={meetingReports[0] || null}
              onViewAll={() => setShowMeetings(true)}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* ── Group Overview Ledger Card ── */}
        <TactileFolderCard
          tabLabel="COMMUNITY SUMMARY"
          tabColor="#64748B"
          tabTextColor="#FFFFFF"
          isDarkMode={isDarkMode}
          delay={0.2}
        >
          <div className="flex items-center gap-2 pb-2.5 border-b-2" style={{ borderColor }}>
            <Activity className="w-4 h-4 text-[#FF7A00]" />
            <h3 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
              Community Ledger Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5">
            {[
              {
                label: 'Active Trusted Members',
                value: String(groupStats.totalMembers),
                icon: Users,
                color: '#3B82F6',
              },
              {
                label: 'Monthly Group Collection',
                value: `LKR ${groupStats.monthlyCollection.toLocaleString()}`,
                icon: DollarSign,
                color: '#22C55E',
              },
              {
                label: 'Total Collected (Pool + Loans)',
                value: `LKR ${(groupStats.totalFunds + groupStats.totalLoanAmount).toLocaleString()}`,
                icon: Wallet,
                color: '#FF7A00',
              },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-xl border-2 flex items-center gap-3 transition-colors"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : '#FAF7F2',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: color,
                    borderColor,
                    color: '#FFFFFF',
                  }}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={2.4} />
                </div>
                <div className="min-w-0">
                  <p className="text-base sm:text-lg font-black tabular-nums text-neutral-950 dark:text-white leading-tight truncate">
                    {value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TactileFolderCard>
      </main>

      {/* ── Slide-over Sheets & Modals ── */}
      <ProfileSheet
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onLogout={logout}
        onUsernameUpdate={handleUsernameUpdate}
      />

      <MeetingSheet
        isOpen={showMeetings}
        onClose={() => setShowMeetings(false)}
        reports={meetingReports}
        isDarkMode={isDarkMode}
      />

      <QuickActionModal
        isOpen={showQuickAction}
        onClose={() => setShowQuickAction(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
