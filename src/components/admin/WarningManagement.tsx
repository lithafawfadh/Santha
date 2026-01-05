import React, { useState } from 'react';
import { Bell, Send, Users, User, AlertTriangle, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassButton from '../common/GlassButton';

export default function WarningManagement() {
  const { activeMembers, warnings, addWarning, sendBulkWarnings, deleteWarning, currentUser } = useApp();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(false);
  
  const [warningForm, setWarningForm] = useState({
    title: '',
    message: '',
    type: 'payment' as 'payment' | 'loan' | 'general' | 'urgent',
    expiresAt: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!warningForm.title || !warningForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    if (!sendToAll && selectedMembers.length === 0) {
      alert('Please select at least one member or choose "Send to All"');
      return;
    }

    const memberIds = sendToAll 
      ? activeMembers.map(m => m.id)
      : selectedMembers;

    await sendBulkWarnings(memberIds, {
      title: warningForm.title,
      message: warningForm.message,
      type: warningForm.type,
      createdBy: currentUser?.id || '',
      expiresAt: warningForm.expiresAt || undefined
    });

    // Reset form
    setWarningForm({
      title: '',
      message: '',
      type: 'payment',
      expiresAt: ''
    });
    setSelectedMembers([]);
    setSendToAll(false);
    setShowCreateForm(false);
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const getMemberName = (memberId: string) => {
    const member = activeMembers.find(m => m.id === memberId);
    return member?.name || 'Unknown';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'payment': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'loan': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
            Warning Management
          </h2>
          <p className="text-white/70 mt-1">
            Send payment reminders and alerts to members
          </p>
        </div>
        
        <GlassButton
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Bell className="h-4 w-4 mr-2" />
          Create Warning
        </GlassButton>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Create New Warning
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Warning Title *
              </label>
              <input
                type="text"
                value={warningForm.title}
                onChange={(e) => setWarningForm({ ...warningForm, title: e.target.value })}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Payment Reminder"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Warning Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['payment', 'loan', 'general', 'urgent'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWarningForm({ ...warningForm, type })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      warningForm.type === type
                        ? type === 'urgent'
                          ? 'bg-red-500/30 text-red-200 border-2 border-red-400/50'
                          : type === 'payment'
                          ? 'bg-orange-500/30 text-orange-200 border-2 border-orange-400/50'
                          : type === 'loan'
                          ? 'bg-yellow-500/30 text-yellow-200 border-2 border-yellow-400/50'
                          : 'bg-blue-500/30 text-blue-200 border-2 border-blue-400/50'
                        : 'bg-white/10 text-white/70 border-2 border-white/10 hover:bg-white/20'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Message *
              </label>
              <textarea
                value={warningForm.message}
                onChange={(e) => setWarningForm({ ...warningForm, message: e.target.value })}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[120px]"
                placeholder="Enter your warning message here..."
                required
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Expires At (Optional)
              </label>
              <input
                type="datetime-local"
                value={warningForm.expiresAt}
                onChange={(e) => setWarningForm({ ...warningForm, expiresAt: e.target.value })}
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Send To *
              </label>
              
              {/* Send to All Checkbox */}
              <label className="flex items-center space-x-3 p-4 rounded-xl bg-white/10 border border-white/20 cursor-pointer hover:bg-white/15 transition-all mb-4">
                <input
                  type="checkbox"
                  checked={sendToAll}
                  onChange={(e) => {
                    setSendToAll(e.target.checked);
                    if (e.target.checked) {
                      setSelectedMembers([]);
                    }
                  }}
                  className="w-5 h-5 rounded border-white/30 text-orange-500 focus:ring-2 focus:ring-orange-500"
                />
                <Users className="h-5 w-5 text-white/70" />
                <span className="text-white font-medium">Send to All Members ({activeMembers.length})</span>
              </label>

              {/* Member Selection */}
              {!sendToAll && (
                <div className="space-y-2 max-h-60 overflow-y-auto rounded-xl bg-white/5 p-3 border border-white/10">
                  {activeMembers.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="w-4 h-4 rounded border-white/30 text-orange-500 focus:ring-2 focus:ring-orange-500"
                      />
                      <User className="h-4 w-4 text-white/70" />
                      <span className="text-white text-sm">{member.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {!sendToAll && selectedMembers.length > 0 && (
                <p className="text-sm text-white/70 mt-2">
                  {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <GlassButton type="submit" variant="accent" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Warning
              </GlassButton>
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </GlassButton>
            </div>
          </form>
        </div>
      )}

      {/* Warnings List */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-orange-500/20 to-amber-500/20">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
            Recent Warnings
          </h3>
        </div>

        <div className="p-6">
          {warnings.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No warnings sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {warnings.slice(0, 10).map((warning) => (
                <div
                  key={warning.id}
                  className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getTypeColor(warning.type)}`}>
                          {warning.type}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {warning.title}
                        </h4>
                      </div>
                      <p className="text-sm text-white/70 mb-2 line-clamp-2">
                        {warning.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-white/50">
                        <span>To: {getMemberName(warning.memberId)}</span>
                        <span>•</span>
                        <span>{new Date(warning.createdAt).toLocaleDateString()}</span>
                        {warning.isRead && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">Read</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteWarning(warning.id)}
                      className="ml-4 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete warning"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}