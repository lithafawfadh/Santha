import React from 'react';
import { useApp } from '../../context/AppContext';

interface DashboardSkeletonProps {
  isAdmin?: boolean;
}

export default function DashboardSkeleton({ isAdmin = false }: DashboardSkeletonProps) {
  const { isDarkMode } = useApp();

  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const cardBg = isDarkMode ? '#171B26' : '#FFFFFF';
  const headerBg = isDarkMode ? '#0E1117' : '#FAF7F2';
  const shadow = isDarkMode ? '3px 3px 0px rgba(0,0,0,0.6)' : '3px 3px 0px #121212';
  const blockBg = isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-black font-sans selection:bg-[#FFE600] flex flex-col">
        {/* Admin Header Skeleton */}
        <header
          className="sticky top-0 z-40 w-full bg-white border-b-2 border-black"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 0px), var(--sat, 0px))',
          }}
        >
          <div className="w-full h-16 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] animate-pulse" />
              <div className="h-5 w-32 bg-black/10 rounded-md animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white border-2 border-black shadow-[2px_2px_0px_#000] animate-pulse" />
              <div className="w-9 h-9 bg-[#A855F7] border-2 border-black shadow-[2px_2px_0px_#000] animate-pulse" />
            </div>
          </div>
        </header>

        {/* Admin Content Skeleton */}
        <div className="p-4 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] relative overflow-hidden space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 bg-black/10 border-2 border-black animate-pulse" />
                  <div className="w-16 h-4 bg-black/10 animate-pulse" />
                </div>
                <div className="h-7 w-28 bg-black/15 animate-pulse" />
                <div className="h-3 w-36 bg-black/10 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="h-64 bg-white border-2 border-black shadow-[3px_3px_0px_#000] p-6 animate-pulse" />
        </div>
      </div>
    );
  }

  // Member Dashboard Skeleton (Matching tactile folder cards and 12-month matrix)
  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: isDarkMode ? '#0E1117' : '#FAF7F2' }}
    >
      {/* ── Top Navigation Bar Skeleton ── */}
      <header
        className="sticky top-0 z-40 border-b-2 transition-colors select-none"
        style={{
          backgroundColor: headerBg,
          borderColor,
          paddingTop: 'max(env(safe-area-inset-top, 0px), var(--sat, 0px))',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Avatar & Identity Placeholder */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border-2 shrink-0 animate-pulse"
              style={{
                backgroundColor: '#FF7A00',
                borderColor,
                boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
              }}
            />
            <div className="space-y-1.5">
              <div
                className="h-3.5 w-24 rounded-md animate-pulse"
                style={{ backgroundColor: blockBg }}
              />
              <div
                className="h-2.5 w-36 rounded-md animate-pulse"
                style={{ backgroundColor: blockBg }}
              />
            </div>
          </div>

          {/* Right: Tactile Action Buttons Placeholder */}
          <div className="flex items-center gap-2">
            <div
              className="h-10 w-28 rounded-xl border-2 animate-pulse hidden sm:block"
              style={{
                backgroundColor: cardBg,
                borderColor,
                boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
              }}
            />
            <div
              className="w-10 h-10 rounded-xl border-2 animate-pulse"
              style={{
                backgroundColor: cardBg,
                borderColor,
                boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
              }}
            />
            <div
              className="w-10 h-10 rounded-xl border-2 animate-pulse"
              style={{
                backgroundColor: cardBg,
                borderColor,
                boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
              }}
            />
          </div>
        </div>
      </header>

      {/* ── Main Content Skeleton ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Section Title: My Overview */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1.5">
            <div
              className="h-6 w-36 rounded-md animate-pulse"
              style={{ backgroundColor: blockBg }}
            />
            <div
              className="h-3.5 w-60 rounded-md animate-pulse"
              style={{ backgroundColor: blockBg }}
            />
          </div>
          <div
            className="h-8 w-24 rounded-xl border-2 animate-pulse"
            style={{
              borderColor,
              backgroundColor: cardBg,
              boxShadow: isDarkMode ? '2px 2px 0px rgba(0,0,0,0.6)' : '2px 2px 0px #121212',
            }}
          />
        </div>

        {/* ── 4 Overview Cards (2x2 on mobile, 4x1 on desktop) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'CONTRIBUTIONS', color: '#22C55E' },
            { label: 'SAVINGS', color: '#FF7A00' },
            { label: 'MUTUAL POOL', color: '#3B82F6' },
            { label: '0% LOAN', color: '#EC4899' },
          ].map((card, idx) => (
            <div key={idx} className="relative pt-[20px] flex flex-col">
              {/* Tab Header */}
              <div className="absolute top-0 left-3.5 z-10 flex items-end">
                <div
                  className="h-[20px] px-3 min-w-[64px] rounded-tl-md border-t-2 border-l-2 flex items-center justify-center text-[10px] font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: card.color,
                    borderColor,
                    color: '#FFFFFF',
                  }}
                >
                  {card.label}
                </div>
                <svg
                  width="11"
                  height="20"
                  viewBox="0 0 11 20"
                  fill="none"
                  className="shrink-0 -ml-[1px]"
                  style={{ color: borderColor }}
                >
                  <path
                    d="M0 0 L1.5 1.5 L6.8 14.2 C8 17 9.4 20 11 20 L0 20 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Card Body */}
              <div
                className="relative rounded-2xl border-2 flex-1 p-3.5 sm:p-4 flex flex-col justify-between"
                style={{
                  backgroundColor: cardBg,
                  borderColor,
                  boxShadow: shadow,
                }}
              >
                {/* Top Row: Icon + Badge */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div
                    className="w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0 animate-pulse"
                    style={{
                      backgroundColor: card.color,
                      borderColor,
                    }}
                  />
                  <div
                    className="h-5 w-16 rounded-full border-2 animate-pulse"
                    style={{
                      backgroundColor: blockBg,
                      borderColor,
                    }}
                  />
                </div>

                {/* Bottom Row: Title & Values */}
                <div className="mt-auto pt-1 space-y-2">
                  <div
                    className="h-3.5 w-24 rounded-md animate-pulse"
                    style={{ backgroundColor: blockBg }}
                  />
                  <div
                    className="h-6 w-32 rounded-md animate-pulse"
                    style={{ backgroundColor: blockBg }}
                  />
                  <div
                    className="h-3 w-28 rounded-md animate-pulse"
                    style={{ backgroundColor: blockBg }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Ledger Matrix Skeleton (12-Month Calendar) ── */}
        <div className="relative pt-[20px] flex flex-col">
          <div className="absolute top-0 left-3.5 z-10 flex items-end">
            <div
              className="h-[20px] px-3 min-w-[64px] rounded-tl-md border-t-2 border-l-2 flex items-center justify-center text-[10px] font-black uppercase tracking-wider"
              style={{
                backgroundColor: '#06D6A0',
                borderColor,
                color: '#121212',
              }}
            >
              LEDGER MATRIX
            </div>
            <svg
              width="11"
              height="20"
              viewBox="0 0 11 20"
              fill="none"
              className="shrink-0 -ml-[1px]"
              style={{ color: borderColor }}
            >
              <path
                d="M0 0 L1.5 1.5 L6.8 14.2 C8 17 9.4 20 11 20 L0 20 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div
            className="relative rounded-2xl border-2 p-4 sm:p-5 space-y-4"
            style={{
              backgroundColor: cardBg,
              borderColor,
              boxShadow: shadow,
            }}
          >
            {/* Calendar Header Placeholder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2" style={{ borderColor }}>
              <div className="space-y-1">
                <div
                  className="h-5 w-40 rounded-md animate-pulse"
                  style={{ backgroundColor: blockBg }}
                />
                <div
                  className="h-3 w-52 rounded-md animate-pulse"
                  style={{ backgroundColor: blockBg }}
                />
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((y) => (
                  <div
                    key={y}
                    className="h-7 w-14 rounded-full border-2 animate-pulse"
                    style={{ backgroundColor: blockBg, borderColor }}
                  />
                ))}
              </div>
            </div>

            {/* 12-Month Grid Placeholder */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <div
                  key={m}
                  className="rounded-2xl border-2 py-3 px-2 sm:py-3.5 sm:px-3 flex flex-col items-center justify-center gap-2 animate-pulse"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    borderColor,
                    boxShadow: shadow,
                  }}
                >
                  <div
                    className="h-3 w-8 rounded-md"
                    style={{ backgroundColor: blockBg }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: blockBg }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
