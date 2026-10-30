import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  Copy,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  CreditCard,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BankAccount } from '../../types';

const COMMON_BANKS = [
  'Commercial Bank of Ceylon',
  'Bank of Ceylon (BOC)',
  'Sampath Bank',
  "People's Bank",
  'Hatton National Bank (HNB)',
  'Seylan Bank',
  'Nations Trust Bank (NTB)',
];

export default function BankSettingsManagement() {
  const { bankAccounts = [], addBankAccount, updateBankAccount, deleteBankAccount, setDefaultBankAccount } = useApp();
  const safeAccounts = Array.isArray(bankAccounts) && bankAccounts.length > 0 ? bankAccounts : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    bankName: 'Commercial Bank of Ceylon',
    accountName: 'Santha Mutual Pool',
    accountNumber: '',
    branchName: 'Colombo Main Branch',
    contributionText: 'Monthly Contribution · LKR 300',
    notes: 'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.',
    isActive: true,
    isPrimary: false,
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({
      bankName: 'Commercial Bank of Ceylon',
      accountName: 'Santha Mutual Pool',
      accountNumber: '',
      branchName: 'Colombo Main Branch',
      contributionText: 'Monthly Contribution · LKR 300',
      notes: 'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.',
      isActive: true,
      isPrimary: safeAccounts.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (acc: BankAccount) => {
    setEditingAccount(acc);
    setFormData({
      bankName: acc.bankName,
      accountName: acc.accountName,
      accountNumber: acc.accountNumber,
      branchName: acc.branchName,
      contributionText: acc.contributionText || 'Monthly Contribution · LKR 300',
      notes: acc.notes || '',
      isActive: acc.isActive,
      isPrimary: acc.isPrimary,
    });
    setIsModalOpen(true);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName.trim() || !formData.accountNumber.trim()) {
      alert('Please provide Bank Name and Account Number');
      return;
    }

    if (editingAccount) {
      const ok = await updateBankAccount(editingAccount.id, formData);
      if (ok) {
        showToast('Bank details updated successfully!');
      }
    } else {
      const ok = await addBankAccount(formData);
      if (ok) {
        showToast('New bank account added successfully!');
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (safeAccounts.length <= 1) {
      alert('At least one bank account must remain in the system for member payments.');
      return;
    }
    if (confirm(`Are you sure you want to remove the ${name} account? Members will no longer see these bank details.`)) {
      const ok = await deleteBankAccount(id);
      if (ok) {
        showToast('Bank account removed.');
      }
    }
  };

  const primaryAccount = safeAccounts.find(a => a.isPrimary) || safeAccounts[0];
  const activeCount = safeAccounts.filter(a => a.isActive).length;

  return (
    <div className="space-y-6 text-black animate-fadeIn">
      {/* ─── PAGE HEADER & CONTROLS ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans flex items-center gap-3">
              <Landmark className="w-8 h-8 stroke-[2.5] text-[#FF7A00]" />
              BANK & PAYMENT SETTINGS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#FFE600] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                MEMBER MUTUAL AID CHANNELS v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/60 hidden sm:inline">
                • {activeCount} ACTIVE CHANNELS (EDITABLE WITHOUT CODE)
              </span>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="brutal-btn bg-[#FF7A00] hover:bg-[#ea580c] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 self-start md:self-auto shadow-[3px_3px_0px_#000]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Bank Account</span>
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-[#10B981] text-white font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── OVERVIEW METRICS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FFE600] border-2 border-black flex items-center justify-center font-black">
            <Building className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-black uppercase text-black/60">Total Configured</div>
            <div className="text-xl font-black text-black">{safeAccounts.length} Accounts</div>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#10B981] border-2 border-black flex items-center justify-center font-black text-white">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono font-black uppercase text-black/60">Live For Members</div>
            <div className="text-xl font-black text-black">{activeCount} Visible</div>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FF7A00] border-2 border-black flex items-center justify-center font-black text-white">
            <Star className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-mono font-black uppercase text-black/60">Primary Account</div>
            <div className="text-xs font-black text-black truncate">
              {primaryAccount ? primaryAccount.bankName : 'None set'}
            </div>
            {primaryAccount && (
              <div className="text-[10px] font-mono font-bold text-[#FF7A00] truncate">
                {primaryAccount.accountNumber}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── BANK ACCOUNTS LIST ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight">Active Bank Accounts & Texts</h2>
          <span className="text-xs font-mono font-bold text-neutral-500">
            Changes reflect instantly on member devices
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {safeAccounts.map((account) => {
            return (
              <div
                key={account.id}
                className={`p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] transition-all bg-white relative flex flex-col justify-between ${
                  account.isPrimary ? 'ring-2 ring-[#FF7A00]' : ''
                } ${!account.isActive ? 'opacity-65' : ''}`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-black/10 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {account.isPrimary && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#FFE600] text-black border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                          <Star className="w-3 h-3 fill-current" /> Primary Default
                        </span>
                      )}
                      {account.isActive ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#D1FAE5] text-[#065F46] border border-black flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Visible to Members
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#F3F4F6] text-[#4B5563] border border-black flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-neutral-500">
                      {account.contributionText || 'Monthly Contribution · LKR 300'}
                    </div>
                  </div>

                  {/* Bank Details Content */}
                  <div className="py-4 space-y-2.5 text-xs font-medium">
                    <div className="flex justify-between items-center py-1 border-b border-black/5">
                      <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider">Bank Name</span>
                      <span className="font-black text-sm text-neutral-900">{account.bankName}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-black/5">
                      <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider">Account Name</span>
                      <span className="font-bold text-neutral-900">{account.accountName}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-black/5">
                      <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider">Account Number</span>
                      <button
                        onClick={() => handleCopy(`acc_${account.id}`, account.accountNumber)}
                        className="flex items-center gap-1.5 font-black text-sm text-[#FF7A00] hover:underline"
                      >
                        <span className="font-mono">{account.accountNumber}</span>
                        {copiedKey === `acc_${account.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-black/5">
                      <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider">Branch</span>
                      <span className="font-bold text-neutral-900">{account.branchName}</span>
                    </div>

                    {/* Remarks Callout Preview */}
                    <div className="p-2.5 rounded-xl border border-black/20 bg-[#FFF7ED] text-[#C2410C] flex items-start gap-2 mt-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">
                        {account.notes || 'Please include your member name in the transfer remarks.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    {!account.isPrimary && (
                      <button
                        onClick={() => setDefaultBankAccount(account.id)}
                        className="px-2.5 py-1.5 rounded-lg border-2 border-black text-[11px] font-black uppercase hover:bg-[#FFE600] transition-colors flex items-center gap-1 shadow-[1px_1px_0px_#000]"
                      >
                        <Star className="w-3 h-3" /> Make Primary
                      </button>
                    )}

                    <button
                      onClick={() => updateBankAccount(account.id, { isActive: !account.isActive })}
                      className="px-2.5 py-1.5 rounded-lg border-2 border-black text-[11px] font-black uppercase hover:bg-neutral-100 transition-colors flex items-center gap-1 shadow-[1px_1px_0px_#000]"
                    >
                      {account.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {account.isActive ? 'Hide' : 'Activate'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(account)}
                      className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-neutral-100 transition-colors shadow-[1px_1px_0px_#000]"
                      title="Edit Account Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(account.id, account.bankName)}
                      className="p-1.5 rounded-lg border-2 border-black bg-red-100 hover:bg-red-200 text-red-600 transition-colors shadow-[1px_1px_0px_#000]"
                      title="Delete Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-2xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] rounded-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-[#FFE600] border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 stroke-[2.5]" />
                <h3 className="font-black text-base uppercase tracking-tight">
                  {editingAccount ? 'Edit Bank Account & Notice Texts' : 'Add New Bank Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Bank Presets */}
              <div>
                <label className="block text-[11px] font-black uppercase text-black/70 mb-1.5">
                  Quick Select Bank:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_BANKS.map((bank) => (
                    <button
                      type="button"
                      key={bank}
                      onClick={() => setFormData({ ...formData, bankName: bank })}
                      className={`px-2 py-1 rounded text-[10px] font-bold border border-black transition-colors ${
                        formData.bankName === bank
                          ? 'bg-[#FF7A00] text-white'
                          : 'bg-neutral-50 hover:bg-neutral-200'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="e.g. Commercial Bank of Ceylon"
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="e.g. Santha Mutual Pool"
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="e.g. 8010 000 000"
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="e.g. Colombo Main Branch"
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">
                  Monthly Contribution / Amount Header Text
                </label>
                <input
                  type="text"
                  value={formData.contributionText}
                  onChange={(e) => setFormData({ ...formData, contributionText: e.target.value })}
                  placeholder="e.g. Monthly Contribution · LKR 300"
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">
                  Transfer Remarks Notice / Instructions (Shown in Alert Box)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Please include your member name in the transfer remarks so the treasurer can stamp your month promptly."
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-black">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#FF7A00]"
                  />
                  <span>Active & Visible to Members</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-black">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                    className="w-4 h-4 accent-[#FF7A00]"
                  />
                  <span>Set as Default / Primary Account</span>
                </label>
              </div>

              {/* ─── LIVE MEMBER VIEW PREVIEW ─── */}
              <div className="p-3 bg-neutral-100 rounded-xl border-2 border-dashed border-black/40 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-neutral-600">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Live Preview of Member Transfer Card:</span>
                </div>

                <div className="p-3.5 rounded-xl border-2 border-black bg-[#FAF7F2] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Bank Name</span>
                    <span className="font-bold text-neutral-900">{formData.bankName || 'Bank Name'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Account Name</span>
                    <span className="font-bold text-neutral-900">{formData.accountName || 'Account Name'}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-black/10 pt-1.5">
                    <span className="text-neutral-500 font-medium">Account Number</span>
                    <span className="font-black text-sm text-[#FF7A00] font-mono">
                      {formData.accountNumber || '8010 000 000'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Branch</span>
                    <span className="font-bold text-neutral-900">{formData.branchName || 'Branch'}</span>
                  </div>
                  <div className="p-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 text-[11px] flex gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{formData.notes || 'Transfer instructions text'}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border-2 border-black rounded-lg text-xs font-bold hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF7A00] text-white border-2 border-black rounded-lg text-xs font-black uppercase shadow-[2px_2px_0px_#000] hover:bg-[#ea580c] transition-colors"
                >
                  {editingAccount ? 'Save Changes' : 'Create Bank Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
