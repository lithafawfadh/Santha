import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function GlassButton({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false,
  type = 'button'
}: GlassButtonProps) {
  const baseClasses = "backdrop-blur-lg border border-opacity-30 shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantClasses = {
    primary: "bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 border-blue-300 dark:border-blue-500 text-blue-900 dark:text-blue-100 hover:bg-opacity-30 dark:hover:bg-opacity-30",
    secondary: "bg-gray-500 bg-opacity-20 dark:bg-gray-600 dark:bg-opacity-20 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 hover:bg-opacity-30 dark:hover:bg-opacity-30",
    accent: "bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20 border-purple-300 dark:border-purple-500 text-purple-900 dark:text-purple-100 hover:bg-opacity-30 dark:hover:bg-opacity-30"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}