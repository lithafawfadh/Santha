import React from 'react';
import { FileText, Calendar, ArrowRight, Inbox, CheckCircle2, ChevronRight } from 'lucide-react';
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
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0"
            style={{
              backgroundColor: '#8B5CF6',
              borderColor,
              color: '#FFFFFF',
            }}
          >
            <FileText className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2"
            style={{
              borderColor,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              color: isDarkMode ? '#94A3B8' : '#64748B',
            }}
          >
            Archive Empty
          </span>
        </div>

        <div className="text-center py-5">
          <div
            className="w-12 h-12 rounded-xl border-2 mx-auto mb-2.5 flex items-center justify-center"
            style={{
              borderColor,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : '#FAF7F2',
            }}
          >
            <Inbox className="w-6 h-6 text-neutral-400" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            No Meeting Reports Yet
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-[220px] mx-auto">
            Group minutes and assembly resolutions will appear here.
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="w-full mt-3 py-2.5 px-4 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0"
          style={{
            backgroundColor: '#8B5CF6',
            borderColor,
            color: '#FFFFFF',
          }}
        >
          <FileText className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border-2"
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
      <div className="space-y-3">
        <div>
          <h4 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 leading-snug">
            {latestReport.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
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
          <div className="space-y-1.5 pt-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Key Resolutions
            </p>
            <div className="space-y-1.5">
              {latestReport.decisions.slice(0, 2).map((decision, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-xl border text-xs"
                  style={{
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : '#FAF7F2',
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300 line-clamp-2 leading-relaxed">
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
        className="w-full mt-4 py-2.5 px-4 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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