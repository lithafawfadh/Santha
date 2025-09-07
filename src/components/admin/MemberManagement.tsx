import React, { useState } from 'react';
import { Plus, UserMinus, Calendar, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';

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
        {members.map((member, index) => (
          <GlassCard 
            key={member.id} 
            variant="gradient" 
            className="p-6 animate-fade-in-up hover:animate-pulse-gentle transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center animate-bounce-gentle hover:animate-spin-slow transition-all duration-300">
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
                className="p-2 text-red-500 hover:text-red-600 hover:animate-shake transition-all duration-300"
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseGentle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-pulse-gentle {
          animation: pulseGentle 2s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

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