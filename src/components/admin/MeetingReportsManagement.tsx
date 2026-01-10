import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Users,
  Trash2,
  Edit3,
  Save,
  X,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MeetingReport } from '../../types';
import GlassButton from '../common/GlassButton';

export default function MeetingReportsManagement() {
  const { currentUser, isDarkMode, allUsers } = useApp();
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

  // Load reports on mount
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
        // Update existing report
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
        // Create new report
        const newReport = await dataService.addMeetingReport(reportData);
        if (newReport) {
          setMessage('Meeting report published successfully!');
        } else {
          setMessage('Error: Failed to create report');
        }
      }

      // Reload reports and reset form
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
    setShowForm(false);
    setEditingReport(null);
  };

  const addArrayField = (field: 'agenda' | 'decisions') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
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

  const removeArrayField = (field: 'agenda' | 'decisions', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const toggleAttendee = (memberName: string) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.includes(memberName)
        ? prev.attendees.filter((name) => name !== memberName)
        : [...prev.attendees, memberName],
    }));
  };

  const activeMembers = allUsers.filter(
    (u) => u.role === 'member' && u.status === 'active'
  );

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl border ${
            message.includes('success')
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <p className="text-sm font-medium flex items-center space-x-2">
            {message.includes('success') ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            <span>{message}</span>
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Meeting Reports Management
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Create and manage meeting reports for all members to view
          </p>
        </div>
        {!showForm && (
          <GlassButton
            variant="primary"
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Report</span>
          </GlassButton>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div
          className={`rounded-2xl p-6 border-2 ${
            isDarkMode
              ? 'bg-gray-800/40 border-purple-500/30'
              : 'bg-white/80 border-purple-300'
          } backdrop-blur-xl shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {editingReport ? 'Edit Meeting Report' : 'New Meeting Report'}
            </h3>
            <button
              onClick={resetForm}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Meeting Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDarkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                placeholder="e.g., December 2024 Monthly Meeting"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Meeting Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  isDarkMode
                    ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
            </div>

            {/* Agenda */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Agenda Points
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField('agenda')}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                  }`}
                >
                  + Add Point
                </button>
              </div>
              <div className="space-y-2">
                {formData.agenda.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateArrayField('agenda', index, e.target.value)
                      }
                      className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                        isDarkMode
                          ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={`Agenda point ${index + 1}`}
                    />
                    {formData.agenda.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('agenda', index)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'hover:bg-red-500/20 text-red-400'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Decisions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Decisions Made
                </label>
                <button
                  type="button"
                  onClick={() => addArrayField('decisions')}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                      : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  + Add Decision
                </button>
              </div>
              <div className="space-y-2">
                {formData.decisions.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateArrayField('decisions', index, e.target.value)
                      }
                      className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                        isDarkMode
                          ? 'bg-gray-700/50 border-gray-600 text-white focus:border-green-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                      } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                      placeholder={`Decision ${index + 1}`}
                    />
                    {formData.decisions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('decisions', index)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'hover:bg-red-500/20 text-red-400'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Attendees */}
            <div>
              <label
                className={`block text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Attendees ({formData.attendees.length} selected)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {activeMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleAttendee(member.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.attendees.includes(member.name)
                        ? isDarkMode
                          ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500/50'
                          : 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : isDarkMode
                        ? 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {formData.attendees.includes(member.name) && '✓ '}
                    {member.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 pt-4">
              <GlassButton
                variant="primary"
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 flex-1"
              >
                {editingReport ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>
                  {loading
                    ? 'Saving...'
                    : editingReport
                    ? 'Update Report'
                    : 'Publish Report'}
                </span>
              </GlassButton>
              <GlassButton
                variant="secondary"
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6"
              >
                Cancel
              </GlassButton>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      <div
        className={`rounded-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-gray-800/40 border border-gray-700/50'
            : 'bg-white/40 border border-white/60'
        } backdrop-blur-xl shadow-lg`}
      >
        <div
          className={`px-6 py-4 border-b ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-gray-50 border-gray-200/50'
          }`}
        >
          <h3
            className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Published Reports ({reports.length})
          </h3>
        </div>

        <div className="p-6">
          {loading && reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p
                className={`text-sm mt-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Loading reports...
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <div
                className={`p-4 rounded-full mx-auto mb-4 w-fit ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                }`}
              >
                <FileText
                  className={`h-12 w-12 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
              </div>
              <h4
                className={`text-base font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                No Reports Published Yet
              </h4>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Click "New Report" to create your first meeting report
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    isDarkMode
                      ? 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4
                        className={`text-lg font-bold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {report.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar
                            className={`h-4 w-4 ${
                              isDarkMode ? 'text-purple-400' : 'text-purple-600'
                            }`}
                          />
                          <span
                            className={
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            {new Date(report.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users
                            className={`h-4 w-4 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}
                          />
                          <span
                            className={
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            {report.attendees.length} attendee
                            {report.attendees.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span
                            className={`font-medium ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}
                          >
                            {report.agenda.length} agenda point
                            {report.agenda.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`font-medium ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}
                          >
                            {report.decisions.length} decision
                            {report.decisions.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(report)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'hover:bg-blue-500/20 text-blue-400'
                            : 'hover:bg-blue-50 text-blue-600'
                        }`}
                        title="Edit"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? 'hover:bg-red-500/20 text-red-400'
                            : 'hover:bg-red-50 text-red-600'
                        }`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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