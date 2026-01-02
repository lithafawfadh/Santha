import React, { useState } from 'react';
import { Plus, UserMinus, Calendar, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';
import { UserX, UserCheck, Trash2 } from 'lucide-react';

export default function MemberManagement() {
  const { 
    allUsers, 
    activeMembers, 
    inactiveMembers, 
    deactivateMember, 
    reactivateMember,
    permanentlyDeleteMember 
  } = useApp();
  
  const [showInactive, setShowInactive] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [memberToDeactivate, setMemberToDeactivate] = useState<string | null>(null);

  const handleDeactivate = async (memberId: string) => {
    setMemberToDeactivate(memberId);
  };

  const confirmDeactivation = async () => {
    if (!memberToDeactivate) return;
    
    await deactivateMember(memberToDeactivate, deactivationReason);
    setMemberToDeactivate(null);
    setDeactivationReason('');
  };

  const handleReactivate = async (memberId: string) => {
    if (window.confirm('Reactivate this member? They will be able to make payments again.')) {
      await reactivateMember(memberId);
    }
  };

  const handlePermanentDelete = async (memberId: string, memberName: string) => {
    const confirmed = window.confirm(
      `⚠️ PERMANENT DELETE WARNING ⚠️\n\n` +
      `This will permanently delete ${memberName} and ALL their records including:\n` +
      `• All payment history\n` +
      `• All loan records\n` +
      `• All personal data\n\n` +
      `This action CANNOT be undone!\n\n` +
      `Are you absolutely sure?`
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        `Final confirmation: Type the member's name to confirm deletion.\n\n` +
        `Type: ${memberName}`
      );
      
      if (doubleConfirm) {
        await permanentlyDeleteMember(memberId);
      }
    }
  };

  const displayMembers = showInactive ? inactiveMembers : activeMembers;

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Member Management</h2>
          <p className="text-white/70">
            {activeMembers.length} active • {inactiveMembers.length} inactive
          </p>
        </div>
        
        <button
          onClick={() => setShowInactive(!showInactive)}
          className={`px-4 py-2 rounded-lg transition-all ${
            showInactive 
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}
        >
          {showInactive ? 'Show Active' : 'Show Inactive'}
        </button>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {displayMembers.map(member => (
          <div 
            key={member.id}
            className={`p-6 rounded-xl backdrop-blur-xl border ${
              member.status === 'inactive'
                ? 'bg-gray-800/40 border-gray-700/50 opacity-75'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {member.name}
                    {member.status === 'inactive' && (
                      <span className="ml-2 text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full">
                        Inactive
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-white/70">@{member.username}</p>
                  {member.deactivatedAt && (
                    <p className="text-xs text-white/50 mt-1">
                      Deactivated: {new Date(member.deactivatedAt).toLocaleDateString()}
                    </p>
                  )}
                  {member.deactivationReason && (
                    <p className="text-xs text-orange-300 mt-1">
                      Reason: {member.deactivationReason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {member.status === 'active' ? (
                  <button
                    onClick={() => handleDeactivate(member.id)}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg border border-orange-500/30 transition-all flex items-center space-x-2"
                  >
                    <UserX className="h-4 w-4" />
                    <span>Deactivate</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleReactivate(member.id)}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 transition-all flex items-center space-x-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Reactivate</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(member.id, member.name)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-all flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Permanent Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deactivation Modal */}
      {memberToDeactivate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Deactivate Member</h3>
            <p className="text-white/70 mb-4">
              This will mark the member as inactive. All their records will be preserved.
            </p>
            
            <label className="block text-sm font-medium text-white/70 mb-2">
              Reason (optional)
            </label>
            <textarea
              value={deactivationReason}
              onChange={(e) => setDeactivationReason(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
              rows={3}
              placeholder="e.g., Left the group, Moved to another city..."
            />

            <div className="flex space-x-3">
              <button
                onClick={confirmDeactivation}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all"
              >
                Confirm Deactivation
              </button>
              <button
                onClick={() => {
                  setMemberToDeactivate(null);
                  setDeactivationReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MemberManagement() {
  const { addMember, removeMember, allUsers } = useApp();
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
  });

  const members = allUsers.filter(user => user.role === 'member');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;

    addMember({
      name: memberForm.name.trim(),
      role: 'member',
      email: memberForm.email.trim() || undefined,
      joinDate: new Date().toISOString().split('T')[0]
    }).catch(console.error);

    setMemberForm({ name: '', email: '' });
    setShowAddMember(false);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the group? This will delete all their payment records and loans.`)) {
      removeMember(memberId).catch(console.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Member Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Add, remove, and manage group members</p>
        </div>
        <GlassButton
          variant="primary"
          onClick={() => setShowAddMember(true)}
          className="flex items-center px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </GlassButton>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard variant="gradient" className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter member's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter email address"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <GlassButton
                  variant="secondary"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  type="submit"
                  className="px-4 py-2"
                >
                  Add Member
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <GlassCard key={member.id} variant="gradient" className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member</p>
                </div>
              </div>
              <GlassButton
                variant="secondary"
                onClick={() => handleRemoveMember(member.id, member.name)}
                className="p-2 text-red-500 hover:text-red-600"
              >
                <UserMinus className="h-4 w-4" />
              </GlassButton>
            </div>

            <div className="space-y-3">
              {member.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  {member.email}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Contribution</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">LKR 300</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Summary */}
      <GlassCard variant="gradient" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-green-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{members.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-500 bg-opacity-20 dark:bg-blue-600 dark:bg-opacity-20 backdrop-blur-sm border border-blue-300 border-opacity-30 dark:border-blue-600 dark:border-opacity-30">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">LKR {(members.length * 300).toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Target</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-500 bg-opacity-20 dark:bg-purple-600 dark:bg-opacity-20 backdrop-blur-sm border border-purple-300 border-opacity-30 dark:border-purple-600 dark:border-opacity-30">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">LKR {(members.length * 300 * 12).toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Annual Target</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}