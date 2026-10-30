import React from 'react';
import { FileText, Calendar, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { MeetingReport } from '../../types';
import TactileFolderCard from '../common/TactileFolderCard';

interface MeetingReportCardProps {
  latestReport: MeetingReport | null;
  onViewAll: () => void;
  isDarkMode: boolean;
}

export default function MeetingReportCard({
  latestReport,
  onViewAll,
  isDarkMode,
}: MeetingReportCardProps) {
  const borderColor = isDarkMode ? '#2E364A' : '#121212';

  if (!latestReport) {
    return (
      <TactileFolderCard
        tabLabel="RESOLUTIONS"
        tabColor="#8B5CF6"
        tabTextColor="#FFFFFF"
        isDarkMode={isDarkMode}
        delay={0.15}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div
            className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0"
            style={{
              backgroundColor: '#8B5CF6',
              borderColor,
              color: '#FFFFFF',
            }}
          >
            <FileText className="w-4.5 h-4.5" strokeWidth={2.4} />
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2 shrink-0"
            style={{
              borderColor,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              color: isDarkMode ? '#94A3B8' : '#64748B',
            }}
          >
            Archive Empty
          </span>
        </div>

        <div className="py-2.5 text-center">
          <h4 className="text-[13px] font-bold text-neutral-900 dark:text-white">
            No Meeting Reports Yet
          </h4>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-[220px] mx-auto">
            Group minutes and assembly resolutions will appear here.
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="w-full mt-2 py-2 px-3.5 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          style={{
            borderColor,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#FAF7F2',
            color: isDarkMode ? '#FFFFFF' : '#121212',
            boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
          }}
        >
          <span>Open Archive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </TactileFolderCard>
    );
  }

  return (
    <TactileFolderCard
      tabLabel="RESOLUTIONS"
      tabColor="#8B5CF6"
      tabTextColor="#FFFFFF"
      isDarkMode={isDarkMode}
      delay={0.15}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0"
          style={{
            backgroundColor: '#8B5CF6',
            borderColor,
            color: '#FFFFFF',
          }}
        >
          <FileText className="w-4.5 h-4.5" strokeWidth={2.4} />
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2 shrink-0"
          style={{
            borderColor,
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            color: isDarkMode ? '#C4B5FD' : '#7C3AED',
          }}
        >
          Latest Meeting
        </span>
      </div>

      {/* Report Info */}
      <div className="space-y-2">
        <div>
          <h4 className="text-[14px] sm:text-[15px] font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 leading-snug">
            {latestReport.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-3 h-3 text-purple-500 shrink-0" />
            <span>
              {new Date(latestReport.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Resolutions snippet */}
        {latestReport.decisions && latestReport.decisions.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Key Resolutions
            </p>
            <div className="space-y-1">
              {latestReport.decisions.slice(0, 2).map((decision, index) => (
                <div
                  key={index}
                  className="flex items-start gap-1.5 py-1 px-1.5 rounded-lg text-xs leading-snug"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300 line-clamp-2">
                    {decision}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onViewAll}
        className="w-full mt-2.5 py-2 px-3.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        style={{
          borderColor,
          backgroundColor: '#8B5CF6',
          color: '#FFFFFF',
          boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
        }}
      >
        <span>View All Resolutions</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </TactileFolderCard>
  );
}
