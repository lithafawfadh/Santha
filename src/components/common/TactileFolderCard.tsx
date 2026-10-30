import React from 'react';
import { motion } from 'framer-motion';

export interface TactileFolderCardProps {
  tabLabel: string;
  tabColor: string;
  tabTextColor?: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  badge?: React.ReactNode;
  title?: string;
  subtitle?: string;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
  isDarkMode: boolean;
  onClick?: () => void;
  className?: string;
  bodyClassName?: string;
  delay?: number;
}

const springTactile = {
  type: 'spring',
  stiffness: 380,
  damping: 26,
};

export default function TactileFolderCard({
  tabLabel,
  tabColor,
  tabTextColor,
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  title,
  subtitle,
  value,
  children,
  isDarkMode,
  onClick,
  className = '',
  bodyClassName = '',
  delay = 0,
}: TactileFolderCardProps) {
  const borderColor = isDarkMode ? '#2E364A' : '#121212';
  const shadowStyle = isDarkMode
    ? '3px 3px 0px rgba(0,0,0,0.6)'
    : '3px 3px 0px #121212';
  const cardBg = isDarkMode ? '#171B26' : '#FFFFFF';

  // Determine good text contrast for tab label if not specified
  const computedTabTextColor =
    tabTextColor ||
    (['#3B82F6', '#8B5CF6', '#64748B', '#1E3A8A'].includes(tabColor)
      ? '#FFFFFF'
      : isDarkMode
      ? '#0E1117'
      : '#121212');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTactile, delay }}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.985, y: 1 } : undefined}
      onClick={onClick}
      className={`relative pt-[18px] flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Folder Tab sticking out with signature right-side wedge */}
      <div className="absolute top-0 left-3.5 z-10 flex items-end select-none pointer-events-none">
        {/* Main Tab Body */}
        <div
          className="h-[18px] px-2.5 min-w-[58px] rounded-tl-md border-t-2 border-l-2 flex items-center justify-center text-[9px] font-black uppercase tracking-wider relative z-10"
          style={{
            backgroundColor: tabColor,
            borderColor,
            color: computedTabTextColor,
          }}
        >
          {tabLabel}
        </div>

        {/* Signature Bevel Wedge on the right */}
        <svg
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 -ml-[1px] relative z-0"
          style={{ color: borderColor }}
        >
          <path
            d="M0 0 L1.5 1.5 L6.2 12.8 C7.3 15.3 8.5 18 10 18 L0 18 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Folder Card Body */}
      <div
        className={`relative rounded-2xl border-2 flex-1 p-3 sm:p-3.5 flex flex-col transition-colors ${bodyClassName}`}
        style={{
          backgroundColor: cardBg,
          borderColor,
          boxShadow: shadowStyle,
        }}
      >
        {children ? (
          children
        ) : (
          <>
            {/* Top row: Compact Icon Squircle + Meta Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              {Icon && (
                <div
                  className="w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: iconBg || tabColor,
                    borderColor,
                    color: iconColor || (['#3B82F6', '#8B5CF6', '#64748B'].includes(iconBg || tabColor) ? '#FFFFFF' : '#121212'),
                  }}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={2.4} />
                </div>
              )}

              {badge && (
                <div className="flex items-center gap-1.5 self-center shrink-0 whitespace-nowrap">
                  {badge}
                </div>
              )}
            </div>

            {/* Bottom Content: Title & Value/Subtitle - No dead void */}
            <div className="space-y-0.5">
              {title && (
                <h3 className="text-[12px] sm:text-[13px] font-bold tracking-tight text-neutral-600 dark:text-neutral-400 leading-tight">
                  {title}
                </h3>
              )}
              {value && (
                <div className="text-lg sm:text-xl font-black tabular-nums tracking-tight text-neutral-950 dark:text-white leading-tight">
                  {value}
                </div>
              )}
              {subtitle && (
                <p className="text-[10px] sm:text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
