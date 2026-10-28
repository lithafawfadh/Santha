import React, { useState } from 'react';
import { Bell, Send, Users, User, AlertTriangle, Trash2, X, Plus, Clock, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'payment': return 'bg-[#FFE600] text-black';
      case 'loan': return 'bg-amber-400 text-black';
      default: return 'bg-gray-200 text-black';
    }
  };

  const urgentCount = warnings.filter(w => w.type === 'urgent').length;
  const paymentCount = warnings.filter(w => w.type === 'payment').length;

  return (
    <div className="space-y-6 text-black animate-fadeIn">
      
      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              WARNINGS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#FF6B6B] text-white border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                DISCIPLINARY & NOTICE ENGINE v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {warnings.length} LOGGED NOTICES
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="brutal-btn bg-[#FF6B6B] hover:bg-[#ef4444] text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showCreateForm ? 'Close Form' : 'Issue Notice'}</span>
          </button>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── ROW 1: METRIC SUMMARY CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Active Warnings (Signal Coral Hero Card) */}
        <div className="brutal-card-warnings p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-[#FF6B6B] flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>ISSUED</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              ACTIVE NOTICES
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {warnings.length} Alerts
              </h2>
            </div>
          </div>
        </div>

        {/* Card 2: Payment Notices */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <AlertTriangle className="w-5 h-5 text-[#FFE600]" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>PAYMENTS</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              PAYMENT REMINDERS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {paymentCount} Sent
              </h2>
            </div>
          </div>
        </div>

        {/* Card 3: Urgent Alerts */}
        <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-lg border border-black shadow-[2px_2px_0px_#000]">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <span>CRITICAL</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-[11px] font-black tracking-wider uppercase text-black underline underline-offset-4 decoration-2">
              URGENT ALERTS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-black tracking-tight font-sans">
                {urgentCount} Critical
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* ─── CREATE WARNING FORM ─── */}
      {showCreateForm && (
        <div className="brutal-card p-6 bg-white space-y-4 animate-slideDown">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h3 className="font-black text-sm uppercase tracking-wider text-black">
              Dispatch Warning Notice
            </h3>
            <button onClick={() => setShowCreateForm(false)} className="p-1 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black">Notice Title *</label>
                <input
                  type="text"
                  value={warningForm.title}
                  onChange={(e) => setWarningForm({ ...warningForm, title: e.target.value })}
                  placeholder="e.g. October Contribution Overdue"
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black">Notice Category *</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['payment', 'loan', 'general', 'urgent'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWarningForm({ ...warningForm, type })}
                      className={`py-2 text-[10px] font-black uppercase border-2 border-black transition-all ${
                        warningForm.type === type
                          ? 'bg-black text-white shadow-[2px_2px_0px_#FFE600]'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-black">Message Content *</label>
              <textarea
                value={warningForm.message}
                onChange={(e) => setWarningForm({ ...warningForm, message: e.target.value })}
                placeholder="Enter warning message..."
                className="w-full p-2.5 bg-white border-2 border-black text-xs font-mono font-bold text-black"
                rows={3}
                required
              />
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-black">Recipients *</label>
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-2 p-2 bg-yellow-50 border-2 border-black font-mono font-bold text-xs cursor-pointer shadow-[1.5px_1.5px_0px_#000]">
                  <input
                    type="checkbox"
                    checked={sendToAll}
                    onChange={(e) => {
                      setSendToAll(e.target.checked);
                      if (e.target.checked) setSelectedMembers([]);
                    }}
                    className="w-4 h-4 accent-black"
                  />
                  <span>Dispatch to All Active Members ({activeMembers.length})</span>
                </label>
              </div>

              {!sendToAll && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-gray-50 border-2 border-black">
                  {activeMembers.map(m => (
                    <label
                      key={m.id}
                      className={`p-2 border border-black text-xs font-mono font-bold flex items-center justify-between cursor-pointer ${
                        selectedMembers.includes(m.id) ? 'bg-[#FFE600] text-black font-black' : 'bg-white'
                      }`}
                    >
                      <span className="truncate">{m.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(m.id)}
                        onChange={() => toggleMember(m.id)}
                        className="w-3.5 h-3.5 accent-black"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="brutal-btn py-2.5 px-6 bg-[#FF6B6B] hover:bg-[#ef4444] text-white font-black text-xs uppercase tracking-wider"
              >
                Dispatch Warning Notice
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="brutal-btn py-2.5 px-4 bg-white text-black font-black text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── WARNINGS LOGGED LIST ─── */}
      <div className="brutal-card overflow-hidden">
        <div className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#FF6B6B]" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              Notice Log Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#FFE600] font-bold">
            Live Database
          </span>
        </div>

        {warnings.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-10 h-10 text-black/30 mx-auto" />
            <p className="font-mono font-bold text-xs text-black/60">No warnings currently active.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black/10">
            {warnings.map((w) => (
              <div key={w.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-yellow-50/50">
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-1 border-2 border-black text-[9px] font-mono font-black uppercase shadow-[1.5px_1.5px_0px_#000] flex-shrink-0 mt-0.5 ${getTypeBadge(w.type)}`}>
                    {w.type}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-black">{w.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-black/60">
                        → Recipient: {getMemberName(w.memberId)}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-black/80 mt-1">{w.message}</p>
                    <p className="text-[10px] font-mono text-black/50 mt-1">
                      Issued: {new Date(w.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteWarning(w.id)}
                  className="brutal-btn p-2 bg-red-100 hover:bg-red-200 text-red-900 self-end sm:self-auto"
                  title="Revoke / Delete Warning"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
