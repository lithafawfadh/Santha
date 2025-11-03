import React, { useState } from 'react';
import { Plus, Gift, Calendar, User, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../common/GlassCard';
import GlassButton from '../common/GlassButton';

export default function DonationManagement() {
  const { donations, addDonation, currentUser } = useApp();
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [donationForm, setDonationForm] = useState({
    amount: '',
    description: ''
  });

  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationForm.amount || !donationForm.description.trim()) return;

    addDonation({
      amount: parseFloat(donationForm.amount),
      date: new Date().toISOString().split('T')[0],
      description: donationForm.description.trim(),
      addedBy: currentUser?.id || ''
    }).catch(console.error);

    setDonationForm({ amount: '', description: '' });
    setShowAddDonation(false);
  };

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-white">Extra Donations</h2>
          <p className="text-slate-400 dark:text-slate-400">Record additional donations to boost group funds</p>
        </div>
        <GlassButton
          variant="primary"
          onClick={() => setShowAddDonation(true)}
          className="flex items-center px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Donation
        </GlassButton>
      </div>

      {/* Summary Card */}
      <GlassCard variant="highlight" className="p-6 bg-gradient-to-r from-green-500 from-opacity-30 to-emerald-600 to-opacity-30 dark:from-green-600 dark:from-opacity-30 dark:to-emerald-700 dark:to-opacity-30 border-green-300 dark:border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">Total Extra Donations</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">LKR {totalDonations.toLocaleString()}</p>
            <p className="text-green-700 dark:text-green-200 mt-1">{donations.length} donation{donations.length !== 1 ? 's' : ''} recorded</p>
          </div>
          <div className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
            <Gift className="h-8 w-8 text-green-900 dark:text-green-100" />
          </div>
        </div>
      </GlassCard>

      {/* Add Donation Modal */}
      {showAddDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard variant="gradient" className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white dark:text-white mb-4">Record New Donation</h3>
            <form onSubmit={handleAddDonation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 dark:text-slate-400 mb-1">Donation Amount (LKR)</label>
                <input
                  type="number"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 dark:text-slate-400 mb-1">Description (Who gave it)</label>
                <textarea
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
                  className="w-full px-3 py-2 backdrop-blur-lg bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 border border-white border-opacity-30 dark:border-gray-600 dark:border-opacity-30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                  placeholder="e.g., Anonymous donor, John Smith, Community fundraiser..."
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <GlassButton
                  variant="secondary"
                  onClick={() => setShowAddDonation(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  type="submit"
                  className="px-4 py-2"
                >
                  Record Donation
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Donations List */}
      <GlassCard variant="gradient" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-20 bg-gradient-to-r from-green-500 from-opacity-10 to-emerald-500 to-opacity-10 dark:from-green-600 dark:from-opacity-10 dark:to-emerald-600 dark:to-opacity-10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white dark:text-white">Donation History</h3>
        </div>

        {donations.length > 0 ? (
          <div className="divide-y divide-white divide-opacity-20 dark:divide-gray-700 dark:divide-opacity-20">
            {donations
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((donation) => (
                <div key={donation.id} className="p-6 hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-10 transition-colors backdrop-blur-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-teal-500 bg-opacity-20 dark:bg-green-600 dark:bg-opacity-20 p-3 rounded-lg backdrop-blur-sm border border-green-300 border-opacity-30 dark:border-green-600 dark:border-opacity-30">
                        <Gift className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-white dark:text-white">
                            LKR {donation.amount.toLocaleString()}
                          </h4>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-full backdrop-blur-sm">
                            Donation
                          </span>
                        </div>
                        <p className="text-slate-400 dark:text-slate-400 mb-2">{donation.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(donation.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Recorded by admin</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-500 bg-opacity-20 dark:bg-gray-600 dark:bg-opacity-20 p-4 rounded-full backdrop-blur-sm mx-auto mb-4 w-fit">
              <Gift className="h-12 w-12 text-slate-400 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white dark:text-white mb-2">No donations recorded yet</h3>
            <p className="text-slate-400 dark:text-slate-400">Start by recording your first extra donation.</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}