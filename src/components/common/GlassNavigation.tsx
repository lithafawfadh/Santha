import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface GlassNavigationProps {
  items: NavigationItem[];
  activeItem: string;
  onItemSelect: (itemId: string) => void;
  className?: string;
}

export default function GlassNavigation({ items, activeItem, onItemSelect, className = '' }: GlassNavigationProps) {
  return (
    <nav className={`backdrop-blur-lg bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 border border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 shadow-lg rounded-xl p-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-blue-500 bg-opacity-30 dark:bg-blue-600 dark:bg-opacity-30 text-blue-900 dark:text-blue-100 shadow-md border border-blue-300 dark:border-blue-500 border-opacity-30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white hover:bg-opacity-20 dark:hover:bg-gray-700 dark:hover:bg-opacity-20 hover:shadow-md'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}