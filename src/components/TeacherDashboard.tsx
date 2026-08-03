import React, { useState } from 'react';
import { 
  UserCheck, 
  Tv, 
  Sliders, 
  HelpCircle, 
  FileSpreadsheet, 
  Plus, 
  Send, 
  Radio, 
  Users, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles,
  Award
} from 'lucide-react';
import { College, Lecture, DoubtItem, AttendanceRecord } from '../types';

interface TeacherDashboardProps {
  colleges: College[];
  lectures: Lecture[];
  doubts: DoubtItem[];
  onAnswerDoubt: (doubtId: string, answer: string) => void;
  attendanceRecords: AttendanceRecord[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  colleges,
  lectures,
  doubts,
  onAnswerDoubt,
  attendanceRecords
}) => {
  const [selectedLectureId, setSelectedLectureId] = useState<string>(lectures[0]?.id || '');
  const [doubtAnswers, setDoubtAnswers] = useState<Record<string, string>>({});
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const activeLecture = lectures.find(l => l.id === selectedLectureId) || lectures[0];
  const ruralColleges = colleges.filter(c => c.type === 'rural-partner');

  const handleAnswerSubmit = (doubtId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = doubtAnswers[doubtId];
    if (!text?.trim()) return;
    onAnswerDoubt(doubtId, text);
    setDoubtAnswers(prev => ({ ...prev, [doubtId]: '' }));
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleExportAttendanceCsv = () => {
    const csvRows = [
      ['Student Name', 'College', 'Lecture ID', 'Joined At', 'Duration (mins)', 'Bandwidth Mode Used'],
      ...attendanceRecords.map(r => [
        r.studentName,
        r.collegeName,
        r.lectureId,
        r.joinedAt,
        r.durationWatchedMinutes.toString(),
        r.bandwidthModeUsed
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${activeLecture.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>Urban Professor & Host Administration Portal</span>
            </h1>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              MNIT Jaipur Central Node
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Control live video bitrate, answer rural college doubts, monitor active attendance, and dispatch low-bandwidth slide updates.
          </p>
        </div>

        <button
          id="btn-export-attendance-csv"
          onClick={handleExportAttendanceCsv}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Attendance CSV</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Broadcast Controls & Connected Rural College Nodes */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Broadcast Controller */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Live Broadcast Controller</span>
            </h2>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Active Broadcast Class:</label>
              <select
                value={selectedLectureId}
                onChange={(e) => setSelectedLectureId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {lectures.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>

            {/* Instant Announcement Broadcast */}
            <form onSubmit={handleSendBroadcast} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 block">📢 Broadcast Instant Alert to Rural Campuses:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g., 'Please turn to slide 3 for formula revision'..."
                  className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
              {broadcastSent && (
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Alert broadcasted to all connected rural nodes!
                </p>
              )}
            </form>
          </div>

          {/* Connected Rural Partner Institutions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Connected Rural Campuses</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                4 Active Hubs
              </span>
            </h2>

            <div className="space-y-2.5">
              {ruralColleges.map((c) => (
                <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{c.name}</h4>
                    <p className="text-[10px] text-slate-400">{c.district}, Rajasthan • Avg Speed: {c.avgBandwidthKbps} Kbps</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">{c.studentCount}</span>
                    <p className="text-[9px] text-slate-500">Students Active</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Doubt Queue & Student Attendance Roster */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Rural Campus Doubts Resolution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Priority Doubts from Rural Campuses ({doubts.length})</span>
              </span>
              <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
                Sorted by Upvotes
              </span>
            </h2>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {doubts.map((doubt) => (
                <div key={doubt.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">{doubt.studentName} ({doubt.collegeName})</span>
                    <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                      👍 {doubt.upvotes} Upvotes
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    "{doubt.question}"
                  </p>

                  {doubt.answer ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-xs text-emerald-300">
                      <strong>Answered:</strong> {doubt.answer}
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleAnswerSubmit(doubt.id, e)} className="flex gap-2">
                      <input
                        type="text"
                        value={doubtAnswers[doubt.id] || ''}
                        onChange={(e) => setDoubtAnswers(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                        placeholder="Type answer to post directly to student..."
                        className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Reply
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Student Attendance Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Live Student Attendance Log</span>
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Auto-Logged</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Rural College</th>
                    <th className="py-2.5 px-3">Joined</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Bandwidth Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                  {attendanceRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-white">{r.studentName}</td>
                      <td className="py-2.5 px-3">{r.collegeName}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{r.joinedAt}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">{r.durationWatchedMinutes} mins</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {r.bandwidthModeUsed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
