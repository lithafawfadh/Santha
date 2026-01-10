import React, { useState } from 'react';
import { X, FileText, Calendar, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { MeetingReport } from '../../types';

interface MeetingReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: MeetingReport[];
  isDarkMode: boolean;
}

export default function MeetingReportsModal({ isOpen, onClose, reports, isDarkMode }: MeetingReportsModalProps) {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className={`w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  📋 Meeting Reports
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {reports.length} report{reports.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <div className={`p-4 rounded-full mx-auto mb-4 w-fit ${
                  isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                }`}>
                  <FileText className={`h-12 w-12 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No Meeting Reports Yet
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Meeting reports will appear here once published by the admin.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      expandedReport === report.id
                        ? isDarkMode
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-purple-50 border-purple-200'
                        : isDarkMode
                        ? 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Report Header */}
                    <button
                      onClick={() => toggleExpand(report.id)}
                      className="w-full p-5 text-left transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {report.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className={`h-4 w-4 ${
                                isDarkMode ? 'text-purple-400' : 'text-purple-600'
                              }`} />
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {new Date(report.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className={`h-4 w-4 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`} />
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {report.attendees.length} attendee{report.attendees.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`p-2 rounded-lg ${
                          expandedReport === report.id
                            ? isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                            : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {expandedReport === report.id ? (
                            <ChevronUp className={`h-5 w-5 ${
                              isDarkMode ? 'text-purple-400' : 'text-purple-600'
                            }`} />
                          ) : (
                            <ChevronDown className={`h-5 w-5 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedReport === report.id && (
                      <div className={`px-5 pb-5 border-t ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        {/* Agenda */}
                        {report.agenda && report.agenda.length > 0 && (
                          <div className="mt-4">
                            <h4 className={`text-sm font-semibold mb-3 flex items-center space-x-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <span>📝</span>
                              <span>Agenda Points</span>
                            </h4>
                            <ul className="space-y-2">
                              {report.agenda.map((item, index) => (
                                <li
                                  key={index}
                                  className={`text-sm pl-4 border-l-2 py-1 ${
                                    isDarkMode
                                      ? 'border-blue-500/30 text-gray-400'
                                      : 'border-blue-300 text-gray-600'
                                  }`}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Decisions */}
                        {report.decisions && report.decisions.length > 0 && (
                          <div className="mt-4">
                            <h4 className={`text-sm font-semibold mb-3 flex items-center space-x-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Decisions Made</span>
                            </h4>
                            <ul className="space-y-2">
                              {report.decisions.map((item, index) => (
                                <li
                                  key={index}
                                  className={`text-sm pl-4 border-l-2 py-1 ${
                                    isDarkMode
                                      ? 'border-green-500/30 text-gray-400'
                                      : 'border-green-300 text-gray-600'
                                  }`}
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Attendees */}
                        {report.attendees && report.attendees.length > 0 && (
                          <div className="mt-4">
                            <h4 className={`text-sm font-semibold mb-3 flex items-center space-x-2 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <Users className="h-4 w-4 text-blue-500" />
                              <span>Attendees</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {report.attendees.map((attendee, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isDarkMode
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {attendee}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}