import React, { useState } from 'react';
import {
  FileText, Plus, Calendar, Users, Trash2, Edit3, Save, X, CheckCircle, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MeetingReport } from '../../types';

export default function MeetingReportsManagement() {
  const { currentUser, allUsers, activeMembers } = useApp();
  const [reports, setReports] = useState<MeetingReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState<MeetingReport | null>(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    agenda: [''],
    decisions: [''],
    attendees: [] as string[],
  });

  // Active members only for attendee selection
  const members = activeMembers && activeMembers.length > 0
    ? activeMembers
    : allUsers.filter(u => u.role === 'member' && u.status === 'active');

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const { dataService } = await import('../../services/dataService');
      const data = await dataService.getMeetingReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.date) {
      setMessage('Please fill in title and date');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { dataService } = await import('../../services/dataService');

      const reportData = {
        title: formData.title.trim(),
        date: formData.date,
        agenda: formData.agenda.filter((item) => item.trim()),
        decisions: formData.decisions.filter((item) => item.trim()),
        attendees: formData.attendees,
        createdBy: currentUser?.id || '',
      };

      if (editingReport) {
        const success = await dataService.updateMeetingReport(
          editingReport.id,
          reportData
        );
        if (success) {
          setMessage('Meeting report updated successfully!');
          setEditingReport(null);
        } else {
          setMessage('Error: Failed to update report');
        }
      } else {
        const newReport = await dataService.addMeetingReport(reportData);
        if (newReport) {
          setMessage('Meeting report published successfully!');
        } else {
          setMessage('Error: Failed to create report');
        }
      }

      await loadReports();
      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving report:', error);
      setMessage('Error: Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this meeting report?')) return;

    setLoading(true);
    try {
      const { dataService } = await import('../../services/dataService');
      const success = await dataService.deleteMeetingReport(reportId);

      if (success) {
        setMessage('Report deleted successfully');
        await loadReports();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setMessage('Error: Failed to delete report');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report: MeetingReport) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      date: report.date,
      agenda: report.agenda.length > 0 ? report.agenda : [''],
      decisions: report.decisions.length > 0 ? report.decisions : [''],
      attendees: report.attendees,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      agenda: [''],
      decisions: [''],
      attendees: [],
    });
    setEditingReport(null);
    setShowForm(false);
  };

  const addArrayField = (field: 'agenda' | 'decisions') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (field: 'agenda' | 'decisions', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateArrayField = (
    field: 'agenda' | 'decisions',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const toggleAttendee = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.includes(memberId)
        ? prev.attendees.filter((id) => id !== memberId)
        : [...prev.attendees, memberId],
    }));
  };

  return (
    <div className="space-y-6 text-black animate-fadeIn">
      
      {/* Toast Notification */}
      {message && (
        <div className="p-4 bg-emerald-100 border-2 border-black text-emerald-950 shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <p className="text-xs font-mono font-black">{message}</p>
          <button onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ─── PAGE HEADER & CONTROLS (STACK Neo-Brutalist) ─── */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase font-sans">
              MEETINGS
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#F59E0B] border-2 border-black text-[11px] font-mono font-black px-2 py-0.5 tracking-wider shadow-[2px_2px_0px_#000]">
                MINUTES & DECISIONS PROTOCOL v2.0
              </span>
              <span className="text-xs font-mono font-bold text-black/50 hidden sm:inline">
                • {reports.length} ARCHIVED SESSIONS
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="brutal-btn bg-[#F59E0B] hover:bg-[#d97706] text-black px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{showForm ? 'Close Form' : 'New Report'}</span>
          </button>
        </div>

        {/* Dashed divider */}
        <div className="border-b-2 border-dashed border-black/30 w-full pt-1"></div>
      </div>

      {/* ─── NEW / EDIT REPORT FORM ─── */}
      {showForm && (
        <div className="brutal-card p-6 bg-white space-y-4 animate-slideDown">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <h3 className="font-black text-sm uppercase tracking-wider text-black">
              {editingReport ? 'Edit Meeting Report' : 'Draft New Meeting Report'}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black">Meeting Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. October 2026 Monthly General Meeting"
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black">Meeting Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Agenda Points */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-black">Agenda Points</label>
                <button
                  type="button"
                  onClick={() => addArrayField('agenda')}
                  className="px-2 py-0.5 bg-gray-100 border border-black text-[10px] font-bold"
                >
                  + Add Point
                </button>
              </div>
              {formData.agenda.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('agenda', idx, e.target.value)}
                    placeholder={`Point ${idx + 1}...`}
                    className="flex-1 p-2 bg-white border-2 border-black text-xs font-mono font-bold"
                  />
                  {formData.agenda.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('agenda', idx)}
                      className="px-2.5 bg-red-100 border border-black text-red-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Decisions Made */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-black">Decisions & Resolutions</label>
                <button
                  type="button"
                  onClick={() => addArrayField('decisions')}
                  className="px-2 py-0.5 bg-gray-100 border border-black text-[10px] font-bold"
                >
                  + Add Decision
                </button>
              </div>
              {formData.decisions.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateArrayField('decisions', idx, e.target.value)}
                    placeholder={`Decision ${idx + 1}...`}
                    className="flex-1 p-2 bg-white border-2 border-black text-xs font-mono font-bold"
                  />
                  {formData.decisions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField('decisions', idx)}
                      className="px-2.5 bg-red-100 border border-black text-red-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Attendees Selection */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-black">Select Attendees ({formData.attendees.length})</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 border-2 border-black">
                {members.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleAttendee(m.id)}
                    className={`p-1.5 text-xs font-mono font-bold text-left border flex items-center justify-between ${
                      formData.attendees.includes(m.id)
                        ? 'bg-[#F59E0B] border-black font-black'
                        : 'bg-white border-black/40'
                    }`}
                  >
                    <span className="truncate">{m.name}</span>
                    <span>{formData.attendees.includes(m.id) ? '✓' : ''}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="brutal-btn py-2.5 px-6 bg-[#F59E0B] hover:bg-[#d97706] text-black font-black text-xs uppercase tracking-wider"
              >
                {loading ? 'Saving...' : editingReport ? 'Update Report' : 'Publish Report'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="brutal-btn py-2.5 px-4 bg-white text-black font-black text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── PUBLISHED REPORTS LIST ─── */}
      <div className="brutal-card overflow-hidden">
        <div className="p-4 bg-black text-white border-b-2 border-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="font-black text-xs uppercase tracking-wider text-white">
              Official Minutes Archive
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#FFE600] font-bold">
            {reports.length} Reports
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-black/30 mx-auto" />
            <p className="font-mono font-bold text-xs text-black/60">No meeting reports published yet.</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black/10">
            {reports.map((report) => (
              <div key={report.id} className="p-5 hover:bg-yellow-50/50 space-y-3 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-black text-base text-black">{report.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] font-mono text-black/60 font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(report.date).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {report.attendees.length} Attendees
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleEdit(report)}
                      className="brutal-btn p-1.5 bg-white hover:bg-gray-100 text-black"
                      title="Edit Report"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="brutal-btn p-1.5 bg-red-100 hover:bg-red-200 text-red-900"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="p-3 bg-gray-50 border border-black/40 space-y-1">
                    <p className="font-black uppercase text-black text-[10px]">Agenda Items ({report.agenda.length})</p>
                    {report.agenda.map((ag, i) => (
                      <p key={i} className="text-black/80 truncate">• {ag}</p>
                    ))}
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-600 space-y-1">
                    <p className="font-black uppercase text-emerald-950 text-[10px]">Decisions Made ({report.decisions.length})</p>
                    {report.decisions.map((dec, i) => (
                      <p key={i} className="text-emerald-900 font-bold truncate">✓ {dec}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
