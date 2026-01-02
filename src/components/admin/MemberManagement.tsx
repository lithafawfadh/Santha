import React, { useState } from 'react';
import { UserPlus, UserX, UserCheck, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassButton from '../common/GlassButton';

export default function MemberManagement() {
  const { 
    activeMembers, 
    inactiveMembers, 
    addMember, 
    deactivateMember,
    reactivateMember,
    permanentlyDeleteMember,
    currentUser 
  } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [memberToDeactivate, setMemberToDeactivate] = useState<string | null>(null);
  const [deactivationReason, setDeactivationReason] = useState('');
  
  const [newMember, setNewMember] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.name || !newMember.username) {
      alert('Please fill in all required fields');
      return;
    }

    await addMember({
      name: newMember.name,
      username: newMember.username.toLowerCase(),
      role: 'member',
      email: newMember.email || undefined,
      password: newMember.password || undefined,
      joinDate: newMember.joinDate
    });

    setNewMember({
      name: '',
      username: '',
      email: '',
      password: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    
    setShowAddForm(false);
  };

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
      const doubleConfirm = prompt(
        `Final confirmation: Type "${memberName}" to confirm deletion:`
      );
      
      if (doubleConfirm === memberName) {
        await permanentlyDeleteMember(memberId);
      } else {
        alert('Deletion cancelled - name did not match');
      }
    }
  };

  const displayMembers = showInactive ? inactiveMembers : activeMembers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent drop-shadow-lg">
            Member Management
          </h2>
          <p className="text-white/70 mt-1">
            {activeMembers.length} active • {inactiveMembers.length} inactive
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`px-4 py-2 rounded-xl backdrop-blur-xl border transition-all duration-300 font-medium shadow-lg ${
              showInactive 
                ? 'bg-orange-500/30 text-orange-200 border-orange-400/50 hover:bg-orange-500/40'
                : 'bg-green-500/30 text-green-200 border-green-400/50 hover:bg-green-500/40'
            }`}
          >
            {showInactive ? 'Show Active' : 'Show Inactive'}
          </button>
          
          {!showInactive && (
            <GlassButton
              variant="primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </GlassButton>
          )}
        </div>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-4">
            Add New Member
          </h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value.toLowerCase() })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="johndoe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Join Date *
                </label>
                <input
                  type="date"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <GlassButton type="submit" variant="primary">
                Add Member
              </GlassButton>
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewMember({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    joinDate: new Date().toISOString().split('T')[0]
                  });
                }}
              >
                Cancel
              </GlassButton>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      {displayMembers.length === 0 ? (
        <div className="text-center py-16 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20">
          <UserX className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">
            No {showInactive ? 'Inactive' : 'Active'} Members
          </h3>
          <p className="text-white/50">
            {showInactive 
              ? 'All members are currently active'
              : 'Add your first member to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayMembers.map((member) => (
            <div
              key={member.id}
              className={`p-6 rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                member.status === 'inactive'
                  ? 'bg-gray-800/40 border-gray-700/50 opacity-75'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Member Info */}
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
                    <span className="text-xl font-bold text-white">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                        {member.name}
                      </h3>
                      {member.status === 'inactive' && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium border border-red-500/30">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70">@{member.username}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-white/60">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {member.deactivatedAt && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-white/50">
                          Deactivated: {new Date(member.deactivatedAt).toLocaleDateString()}
                        </p>
                        {member.deactivationReason && (
                          <div className="flex items-start space-x-1">
                            <AlertCircle className="h-3 w-3 text-orange-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-orange-300">
                              {member.deactivationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {member.status === 'active' ? (
                    <button
                      onClick={() => handleDeactivate(member.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-xl border border-orange-500/30 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <UserX className="h-4 w-4" />
                      <span>Deactivate</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReactivate(member.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-xl border border-green-500/30 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Reactivate</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(member.id, member.name)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30 transition-all duration-300 flex items-center justify-center shadow-lg"
                        title="Permanently delete all records"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deactivation Modal */}
      {memberToDeactivate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <UserX className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Deactivate Member
              </h3>
            </div>
            
            <p className="text-white/70 mb-4">
              This will mark the member as inactive. All their payment and loan records will be preserved and can be viewed in reports.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Reason (optional but recommended)
              </label>
              <textarea
                value={deactivationReason}
                onChange={(e) => setDeactivationReason(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:outline-none backdrop-blur-xl"
                rows={3}
                placeholder="e.g., Left the group, Moved to another city, Financial difficulties..."
              />
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-300">
                  The member will no longer appear in active lists, but all their historical data remains accessible for reports and audits.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={confirmDeactivation}
                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                Confirm Deactivation
              </button>
              <button
                onClick={() => {
                  setMemberToDeactivate(null);
                  setDeactivationReason('');
                }}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
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