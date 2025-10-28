import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AnimatedNavBarProps {
  items: NavItem[];
  activeItem: string;
  onItemSelect: (itemId: string) => void;
  className?: string;
}

export default function AnimatedNavBar({ items, activeItem, onItemSelect, className = '' }: AnimatedNavBarProps) {
  return (
    <div className={`w-fit ${className}`}>
      <div className="flex items-center gap-3 backdrop-blur-lg bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-700 dark:border-opacity-30 py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              className={`relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <span className="hidden md:flex items-center gap-2">
                <Icon size={18} strokeWidth={2.5} />
                {item.label}
              </span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-blue-500 bg-opacity-10 dark:bg-blue-600 dark:bg-opacity-20 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 dark:bg-blue-400 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-blue-500 bg-opacity-20 dark:bg-blue-400 dark:bg-opacity-20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-blue-500 bg-opacity-20 dark:bg-blue-400 dark:bg-opacity-20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-blue-500 bg-opacity-20 dark:bg-blue-400 dark:bg-opacity-20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
