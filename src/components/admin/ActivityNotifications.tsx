import { useApp } from '../../context/AppContext';
import { Activity, Clock, UserMinus, DollarSign, CreditCard, Trash2 } from 'lucide-react';

export default function ActivityNotifications() {
  const { activities, clearActivities } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_MARKED': return <DollarSign className="w-4 h-4 text-luxury-emerald" />;
      case 'LOAN_ISSUED': return <CreditCard className="w-4 h-4 text-gold" />;
      case 'MEMBER_EXIT':
      case 'MEMBER_DEACTIVATED': return <UserMinus className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRelativeTime = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    
    // convert it to relative text
    const diffInMins = Math.floor(diffInMs / 60000);
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays}d ago`;
  };

  // Safely default to empty array if activities is null/undefined
  const safeActivities = activities || [];

  return (
    <div className="absolute right-0 mt-2 w-80 lg:w-96 bg-luxury-surface border border-ghost-border/50 rounded-xl shadow-ambient overflow-hidden z-50">
      <div className="p-4 border-b border-ghost-border/30 bg-luxury-card/50 flex justify-between items-center">
        <h3 className="font-serif font-medium text-gray-200">Activity Log</h3>
        <div className="flex items-center gap-2">
          {safeActivities.length > 0 && (
            <button 
              onClick={() => clearActivities()} 
              className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors focus:outline-none"
              title="Clear all activities"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{safeActivities.length} total</span>
        </div>
      </div>
      
      <div className="max-h-[360px] overflow-y-auto">
        {safeActivities.length > 0 ? (
          <div className="divide-y divide-ghost-border/20">
            {safeActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-luxury-card-hover transition-colors group">
                <div className="flex gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-luxury-bg border border-ghost-border/30 flex items-center justify-center shrink-0">
                    {getIcon(activity.actionType)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 leading-snug">{activity.description}</p>
                    <div className="flex items-center gap-1 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Clock className="w-3 h-3 text-gold/50" />
                      <span className="text-xs text-gray-400">{getRelativeTime(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Activity className="w-8 h-8 text-ghost-border mx-auto mb-3" />
            <p className="text-sm text-gray-400">No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
