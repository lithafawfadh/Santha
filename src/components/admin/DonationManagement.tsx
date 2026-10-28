import React, { useState } from 'react';
import { Plus, Gift, Calendar, User, DollarSign, X, Heart, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
    <div className="space-y-6 text-black animate-fadeIn">
      
      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              DONATIONS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#C084FC] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                SOCIAL IMPACT & CHARITY VAULT v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {donations.length} RECORDED DONATIONS
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAddDonation(true)}
            className="brutal-btn bg-[#C084FC] hover:bg-[#a855f7] text-black px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Record Donation</span>
          </button>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── ROW 1: METRIC SUMMARY CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Total Donations (Radiant Lavender Hero) */}
        <div className="brutal-card-donations p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-[#C084FC] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>ACTIVE VAULT</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              TOTAL CHARITY FUNDS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                LKR {totalDonations.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* Card 2: Count */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Heart className="w-5 h-5 text-[#FFE600]" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>COUNT</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              CONTRIBUTIONS LOGGED
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {donations.length} Records
              </h2>
            </div>
          </div>
        </div>

        {/* Card 3: Impact Status */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>RESERVE</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              EMERGENCY READINESS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                100% STABLE
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* ─── RECORD NEW DONATION MODAL ─── */}
      {showAddDonation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white border-3 border-black shadow-[8px_8px_0px_#000] p-6 space-y-6">
            <div className="bg-[#FFE600] border-2 border-black p-3 flex justify-between items-center">
              <h3 className="font-black text-sm uppercase tracking-wider text-black">
                Record New Donation
              </h3>
              <button
                onClick={() => setShowAddDonation(false)}
                className="w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_#000]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDonation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Donation Amount (LKR)
                </label>
                <input
                  type="number"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                  placeholder="e.g. 2500"
                  className="w-full p-2.5 bg-white border-2 border-black text-sm font-black text-black focus:outline-none"
                  min="1"
                  step="0.01"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Benefactor / Description
                </label>
                <textarea
                  value={donationForm.description}
                  onChange={(e) => setDonationForm({ ...donationForm, description: e.target.value })}
                  placeholder="e.g., Anonymous benefactor, Community event..."
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 brutal-btn py-3 bg-[#C084FC] hover:bg-[#a855f7] text-black font-black text-xs uppercase tracking-wider"
                >
                  Confirm Donation
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDonation(false)}
                  className="brutal-btn px-4 py-3 bg-white text-black font-black text-xs uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DONATION HISTORY LIST ─── */}
      <div className="brutal-card overflow-hidden">
        <div className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#C084FC]" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              Donation Ledger History
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#C084FC] font-bold">
            All records verified
          </span>
        </div>

        {donations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Gift className="w-10 h-10 text-black/30 mx-auto" />
            <p className="font-mono font-bold text-xs text-black/60">No extra donations recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black/10">
            {donations.map((donation) => (
              <div key={donation.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-purple-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C084FC] border-2 border-black flex items-center justify-center font-black text-sm text-black shadow-[1.5px_1.5px_0px_#000] flex-shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-black">{donation.description}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono font-bold text-black/60">
                      <span>Date: {new Date(donation.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>ID: {donation.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[9px] font-mono font-black uppercase text-black/60 block">Amount</span>
                  <span className="text-lg font-black text-emerald-700 font-sans">
                    +LKR {donation.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
