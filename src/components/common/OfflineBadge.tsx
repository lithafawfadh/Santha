import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OfflineBadge() {
  const { isOffline, lastSyncedAt, refreshData, loading } = useApp();

  if (!isOffline) {
    return null;
  }

  const formatLastSync = (isoString: string | null) => {
    if (!isoString) return 'Previously';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Previously';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full backdrop-blur-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-medium shadow-lg flex items-center gap-2 max-w-[90vw]"
      >
        <WifiOff className="w-3.5 h-3.5 shrink-0 animate-pulse" />
        <span className="truncate">
          Offline Mode • Synced {formatLastSync(lastSyncedAt)}
        </span>
        <button
          onClick={() => refreshData(true)}
          disabled={loading}
          className="ml-1 p-1 hover:bg-amber-500/20 rounded-full transition-colors active:scale-95 disabled:opacity-50"
          title="Retry connecting"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
