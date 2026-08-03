import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Search, 
  FileDown, 
  Wifi, 
  WifiOff, 
  BookOpen,
  Edit3,
  Play
} from 'lucide-react';
import { NoteItem, OfflinePackage, Lecture } from '../types';
import { OfflineStorageService } from '../services/offlineStorage';

interface OfflineNotesManagerProps {
  notes: NoteItem[];
  downloadedLectures: OfflinePackage[];
  allLectures: Lecture[];
  onNoteChange: () => void;
  onSyncPendingNotes: () => void;
  bandwidthMode: string;
  onPlayOfflineLecture?: (lectureId: string) => void;
  onDeleteDownloadedLecture?: (lectureId: string) => void;
  onDownloadLecture?: (lecture: Lecture) => void;
}

export const OfflineNotesManager: React.FC<OfflineNotesManagerProps> = ({
  notes,
  downloadedLectures,
  allLectures,
  onNoteChange,
  onSyncPendingNotes,
  bandwidthMode,
  onPlayOfflineLecture,
  onDeleteDownloadedLecture,
  onDownloadLecture
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLectureId, setSelectedLectureId] = useState<string>(allLectures[0]?.id || '');
  const [noteContent, setNoteContent] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const pendingCount = notes.filter(n => n.syncStatus === 'pending').length;

  const handleCreateOrUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const lecture = allLectures.find(l => l.id === selectedLectureId);
    const isOnline = bandwidthMode !== 'offline';

    if (editingNoteId) {
      OfflineStorageService.updateNote(editingNoteId, noteContent, isOnline);
      setEditingNoteId(null);
    } else {
      OfflineStorageService.saveNote(
        selectedLectureId,
        lecture?.title || 'General Class Note',
        noteContent,
        0,
        isOnline
      );
    }

    setNoteContent('');
    onNoteChange();
  };

  const handleEditNote = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
    setSelectedLectureId(note.lectureId);
  };

  const handleDeleteNote = (id: string) => {
    OfflineStorageService.deleteNote(id);
    onNoteChange();
  };

  const handleExportMarkdown = (note: NoteItem) => {
    const text = `# ${note.lectureTitle}\n*Date: ${note.createdTime}*\n*Sync Status: ${note.syncStatus}*\n\n${note.content}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.lectureTitle.replace(/\s+/g, '_')}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter(
    n => n.lectureTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
         n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header Stat & Auto-Sync Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Offline Materials & Study Notes</h1>
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              IndexedDB / LocalStorage Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Write notes and download lectures when internet is slow or unavailable. Changes automatically sync when online!
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 ? (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-right">
                <p className="text-xs font-bold text-amber-300">{pendingCount} Notes Pending Sync</p>
                <p className="text-[10px] text-amber-200/70">Will auto-upload when reconnected</p>
              </div>
              <button
                id="btn-manual-sync-offline-notes"
                onClick={onSyncPendingNotes}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sync Now</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Notes Synced with Cloud</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Offline Downloaded Lecture Packages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Downloaded Offline Classes</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {downloadedLectures.length} Saved
              </span>
            </div>

            {downloadedLectures.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800/80 p-4">
                <Download className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No offline lectures downloaded yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">Select any lecture from the list below to download for 100% offline study.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {downloadedLectures.map((pkg) => {
                  const lec = allLectures.find(l => l.id === pkg.lectureId);
                  return (
                    <div 
                      key={pkg.lectureId} 
                      className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 space-y-3 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 
                            onClick={() => onPlayOfflineLecture?.(pkg.lectureId)}
                            className="text-xs font-bold text-slate-100 hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
                          >
                            {lec?.title || 'Lecture Material'}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {lec?.subject || 'Engineering'} • {lec?.professorName}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1.5 font-mono">
                            <span>Size: <strong className="text-emerald-400">{pkg.totalSizeMb} MB</strong></span>
                            <span>•</span>
                            <span>Slides: {pkg.slidesData.length}</span>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold flex-shrink-0">
                          Ready Offline
                        </span>
                      </div>

                      {/* Action Buttons: Play & Delete */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 gap-2">
                        <button
                          onClick={() => onPlayOfflineLecture?.(pkg.lectureId)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Class Offline</span>
                        </button>

                        {onDeleteDownloadedLecture && (
                          <button
                            onClick={() => onDeleteDownloadedLecture(pkg.lectureId)}
                            title="Delete Offline Download"
                            className="p-1.5 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Course Download Library */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Available Lectures Library ({allLectures.length})</span>
              </span>
              <span className="text-[10px] text-slate-400">Download for Offline</span>
            </h2>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {allLectures.map((lec) => {
                const isAlreadyDownloaded = downloadedLectures.some(d => d.lectureId === lec.id);
                return (
                  <div key={lec.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{lec.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{lec.subject} • {lec.professorName}</p>
                    </div>

                    {isAlreadyDownloaded ? (
                      <button
                        onClick={() => onPlayOfflineLecture?.(lec.id)}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        <Play className="w-3 h-3 fill-current" /> Play Offline
                      </button>
                    ) : (
                      <button
                        onClick={() => onDownloadLecture?.(lec)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer flex-shrink-0 shadow-sm"
                      >
                        <Download className="w-3 h-3" /> Download
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Note Editor Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>{editingNoteId ? 'Edit Note' : 'Create New Study Note'}</span>
            </h2>

            <form onSubmit={handleCreateOrUpdateNote} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Lecture / Topic:</label>
                <select
                  value={selectedLectureId}
                  onChange={(e) => setSelectedLectureId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {allLectures.map(l => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Note Content:</label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write formulas, summary, or doubt reminders... Works 100% offline!"
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {bandwidthMode === 'offline' ? '🔒 Saving locally (offline)' : '☁️ Saving to cloud'}
                </span>
                <div className="flex gap-2">
                  {editingNoteId && (
                    <button
                      type="button"
                      onClick={() => { setEditingNoteId(null); setNoteContent(''); }}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{editingNoteId ? 'Update Note' : 'Save Note'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Searchable Saved Notes List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Saved Study Notes ({notes.length})</span>
              </h2>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Notes Cards */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No notes found matching your search.</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div key={note.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-indigo-300">{note.lectureTitle}</h3>
                      
                      <div className="flex items-center gap-2">
                        {note.syncStatus === 'synced' ? (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Synced
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-semibold flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> Pending Sync
                          </span>
                        )}

                        <button
                          onClick={() => handleExportMarkdown(note)}
                          title="Export as Markdown"
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all cursor-pointer"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleEditNote(note)}
                          title="Edit Note"
                          className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete Note"
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Created: {note.createdTime}</span>
                      {note.timestampSeconds && (
                        <span>Timestamp: {note.timestampSeconds}s</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
