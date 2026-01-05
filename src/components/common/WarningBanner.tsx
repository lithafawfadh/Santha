import React, { useState } from 'react';
import { AlertTriangle, X, AlertCircle, Info, Zap } from 'lucide-react';
import { Warning } from '../../types';

interface WarningBannerProps {
  warnings: Warning[];
  onDismiss: (warningId: string) => void;
  isDarkMode?: boolean;
}

export default function WarningBanner({ warnings, onDismiss, isDarkMode = false }: WarningBannerProps) {
  const [expandedWarning, setExpandedWarning] = useState<string | null>(null);

  if (warnings.length === 0) return null;

  const getWarningStyle = (type: Warning['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-50',
          border: 'border-red-500/30',
          text: isDarkMode ? 'text-red-300' : 'text-red-700',
          icon: <AlertTriangle className="h-5 w-5" />,
          iconBg: isDarkMode ? 'bg-red-500/30' : 'bg-red-100'
        };
      case 'payment':
        return {
          bg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50',
          border: 'border-orange-500/30',
          text: isDarkMode ? 'text-orange-300' : 'text-orange-700',
          icon: <AlertCircle className="h-5 w-5" />,
          iconBg: isDarkMode ? 'bg-orange-500/30' : 'bg-orange-100'
        };
      case 'loan':
        return {
          bg: isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-50',
          border: 'border-yellow-500/30',
          text: isDarkMode ? 'text-yellow-300' : 'text-yellow-700',
          icon: <Zap className="h-5 w-5" />,
          iconBg: isDarkMode ? 'bg-yellow-500/30' : 'bg-yellow-100'
        };
      default:
        return {
          bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50',
          border: 'border-blue-500/30',
          text: isDarkMode ? 'text-blue-300' : 'text-blue-700',
          icon: <Info className="h-5 w-5" />,
          iconBg: isDarkMode ? 'bg-blue-500/30' : 'bg-blue-100'
        };
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {warnings.map((warning) => {
        const style = getWarningStyle(warning.type);
        const isExpanded = expandedWarning === warning.id;
        
        return (
          <div
            key={warning.id}
            className={`${style.bg} border ${style.border} rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
              isExpanded ? 'shadow-lg' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`${style.iconBg} rounded-xl p-2 flex-shrink-0`}>
                  <div className={style.text}>
                    {style.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`text-sm font-bold ${style.text}`}>
                      {warning.title}
                    </h4>
                    <button
                      onClick={() => onDismiss(warning.id)}
                      className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0 ml-2`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className={`text-sm ${style.text} opacity-90 ${
                    isExpanded ? '' : 'line-clamp-2'
                  }`}>
                    {warning.message}
                  </p>

                  {warning.message.length > 100 && (
                    <button
                      onClick={() => setExpandedWarning(isExpanded ? null : warning.id)}
                      className={`text-xs ${style.text} font-semibold mt-2 hover:underline`}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}

                  <p className={`text-xs ${style.text} opacity-60 mt-2`}>
                    {new Date(warning.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}