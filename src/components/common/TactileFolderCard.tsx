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
      className={`relative pt-[20px] flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Folder Tab sticking out with signature right-side wedge */}
      <div className="absolute top-0 left-3.5 z-10 flex items-end select-none pointer-events-none">
        {/* Main Tab Body */}
        <div
          className="h-[20px] px-3 min-w-[64px] rounded-tl-md border-t-2 border-l-2 flex items-center justify-center text-[10px] font-black uppercase tracking-wider relative z-10"
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
          width="11"
          height="20"
          viewBox="0 0 11 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 -ml-[1px] relative z-0"
          style={{ color: borderColor }}
        >
          <path
            d="M0 0 L1.5 1.5 L6.8 14.2 C8 17 9.4 20 11 20 L0 20 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Folder Card Body */}
      <div
        className={`relative rounded-2xl border-2 flex-1 p-3.5 sm:p-4 flex flex-col justify-between transition-colors ${bodyClassName}`}
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
            {/* Top row: Icon Squircle + Meta Badge */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              {Icon && (
                <div
                  className="w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: iconBg || tabColor,
                    borderColor,
                    color: iconColor || (['#3B82F6', '#8B5CF6', '#64748B'].includes(iconBg || tabColor) ? '#FFFFFF' : '#121212'),
                  }}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>
              )}

              {badge && (
                <div className="flex items-center gap-1.5 self-start pt-0.5 shrink-0 whitespace-nowrap">
                  {badge}
                </div>
              )}
            </div>

            {/* Bottom row: Title & Value/Subtitle */}
            <div className="mt-auto pt-1">
              {title && (
                <div className="min-h-[38px] flex items-end">
                  <h3 className="text-[14px] sm:text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 leading-snug">
                    {title}
                  </h3>
                </div>
              )}
              {value && (
                <div className="text-xl sm:text-2xl font-black tabular-nums tracking-tight text-neutral-950 dark:text-white mt-1">
                  {value}
                </div>
              )}
              {subtitle && (
                <p className="text-[11px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-0.5 leading-normal">
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
