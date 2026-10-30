import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Check, Copy, Search, ShieldCheck, Sparkles, Smartphone, ArrowRight } from 'lucide-react';
import { BankingApp, getRecommendedAppsForBank, launchBankingApp, cleanAccountNumber } from '../../utils/bankingApps';
import { BankAccount } from '../../types';

interface BankingAppChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccount: BankAccount;
  isDarkMode: boolean;
}

export default function BankingAppChooserModal({
  isOpen,
  onClose,
  bankAccount,
  isDarkMode,
}: BankingAppChooserModalProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [launchedAppId, setLaunchedAppId] = useState<string | null>(null);

  const recommendedApps = getRecommendedAppsForBank(bankAccount.bankName);
  const filteredApps = searchQuery.trim()
    ? recommendedApps.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recommendedApps;

  const handleCopyAccount = () => {
    const rawNumber = cleanAccountNumber(bankAccount.accountNumber);
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectApp = (app: BankingApp) => {
    // 1. Auto-copy account number to clipboard first
    const rawNumber = cleanAccountNumber(bankAccount.accountNumber);
    navigator.clipboard.writeText(rawNumber);
    setCopied(true);
    setLaunchedAppId(app.id);

    // 2. Launch the banking app
    setTimeout(() => {
      launchBankingApp(app);
      setTimeout(() => {
        setLaunchedAppId(null);
      }, 3000);
    }, 200);
  };

  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const modalBg = isDarkMode ? '#1E2330' : '#FFFFFF';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="banking-chooser-backdrop"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            key="banking-chooser-content"
            className="relative w-full sm:max-w-lg z-10 rounded-t-3xl sm:rounded-2xl border-2 overflow-hidden shadow-2xl p-5 max-h-[88vh] flex flex-col transform-gpu"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: modalBg,
              borderColor,
              boxShadow: isDarkMode ? '6px 6px 0px rgba(0,0,0,0.8)' : '6px 6px 0px #121212',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b-2" style={{ borderColor }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl border-2 flex items-center justify-center bg-[#FF7A00] text-white shadow-[2px_2px_0px_#000]"
                  style={{ borderColor }}
                >
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-950 dark:text-white leading-tight">
                    Pay via Banking App
                  </h3>
                  <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    Instant fund transfer via your mobile device
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

            {/* Quick Auto-Copy Banner */}
            <div className="pt-3 pb-2">
              <div
                className="p-3 rounded-xl border-2 flex items-center justify-between gap-2 text-xs"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,122,0,0.1)' : '#FFF7ED',
                }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FF7A00]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Destination Account</span>
                  </div>
                  <div className="font-black text-neutral-900 dark:text-white truncate">
                    {bankAccount.bankName} · <span className="text-[#FF7A00] font-mono">{bankAccount.accountNumber}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopyAccount}
                  className="px-2.5 py-1.5 rounded-lg border-2 font-black text-[11px] flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-[1px_1px_0px_#000]"
                  style={{
                    borderColor,
                    backgroundColor: copied ? '#10B981' : '#FF7A00',
                    color: '#FFFFFF',
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Acc</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step instructions badge */}
            <div className="px-1 py-1 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Tap your banking app below. We'll copy the account number so you can paste it directly.</span>
            </div>

            {/* Search Box */}
            <div className="pt-2 pb-2">
              <div
                className="flex items-center px-3 py-2 rounded-xl border-2 text-xs gap-2"
                style={{
                  borderColor,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
                }}
              >
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search apps (BOC, Q+, Sampath, People's, HNB)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-neutral-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Apps List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 py-1 max-h-[320px]">
              {filteredApps.map((app, index) => {
                const isRecommended = index < 2 && app.keywords.some(k => (bankAccount.bankName || '').toLowerCase().includes(k));
                const isLaunching = launchedAppId === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className="p-3 rounded-xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all hover:translate-x-0.5 active:translate-y-0.5"
                    style={{
                      borderColor,
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                      boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.5)' : '2px 2px 0px #121212',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-white shrink-0 text-sm shadow-[1px_1px_0px_#000]"
                        style={{
                          backgroundColor: app.primaryColor,
                          borderColor,
                        }}
                      >
                        {app.name.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-xs text-neutral-950 dark:text-white truncate">
                            {app.name}
                          </h4>
                          {isRecommended && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#FFE600] text-black border border-black">
                              Match
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                          {app.bankName} · {app.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isLaunching ? (
                        <span className="text-[10px] font-black text-[#FF7A00] flex items-center gap-1">
                          Opening...
                        </span>
                      ) : (
                        <div
                          className="w-7 h-7 rounded-lg border-2 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:bg-black group-hover:text-white transition-colors"
                          style={{ borderColor }}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredApps.length === 0 && (
                <div className="text-center py-6 text-xs text-neutral-500 dark:text-neutral-400">
                  No matching banking apps found. Tap below to copy account details.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t-2 mt-2 flex items-center justify-between gap-2" style={{ borderColor }}>
              <button
                onClick={handleCopyAccount}
                className="flex-1 py-2.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
                style={{
                  borderColor,
                  backgroundColor: '#FFFFFF',
                  color: '#121212',
                }}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Account Number'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors"
                style={{ borderColor }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
