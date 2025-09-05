import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'highlight';
}

export default function GlassCard({ children, className = '', variant = 'default' }: GlassCardProps) {
  const baseClasses = "backdrop-blur-lg border border-opacity-20 dark:border-opacity-20 shadow-lg rounded-xl transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]";
  
  const variantClasses = {
    default: "bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 border-white dark:border-gray-700",
    gradient: "bg-gradient-to-br from-white from-opacity-30 to-white to-opacity-10 dark:from-gray-800 dark:from-opacity-30 dark:to-gray-900 dark:to-opacity-10 border-white dark:border-gray-600",
    highlight: "bg-gradient-to-br from-blue-50 from-opacity-40 to-purple-50 to-opacity-20 dark:from-blue-900 dark:from-opacity-30 dark:to-purple-900 dark:to-opacity-20 border-blue-200 dark:border-blue-700"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}