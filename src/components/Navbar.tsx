import React from 'react';
import { 
  Tv, 
  Download, 
  Sparkles, 
  UserCheck, 
  BarChart3, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Globe, 
  Bell,
  GraduationCap
} from 'lucide-react';
import { BandwidthMode, College } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bandwidthMode: BandwidthMode;
  setBandwidthMode: (mode: BandwidthMode) => void;
  selectedCollege: College;
  setSelectedCollege: (college: College) => void;
  colleges: College[];
  pendingNotesCount: number;
  onSyncNotes: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bandwidthMode,
  setBandwidthMode,
  selectedCollege,
  setSelectedCollege,
  colleges,
  pendingNotesCount,
  onSyncNotes,
  selectedLanguage,
  setSelectedLanguage,
  unreadNotifications,
  onOpenNotifications
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner for Low Bandwidth Mode notice */}
      {bandwidthMode === 'ultra-low' && (
        <div className="bg-amber-600/90 text-amber-5px text-xs font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
          <Wifi className="w-3.5 h-3.5 animate-pulse text-amber-200" />
          <span>⚡ Ultra-Low Bandwidth Mode Active (50 Kbps) — Audio + Compressed Vector Slide Stream. Saving 88% Mobile Data!</span>
        </div>
      )}
      {bandwidthMode === 'offline' && (
        <div className="bg-rose-900/90 text-rose-100 text-xs font-medium py-1 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-rose-300" />
          <span>🚫 Offline Mode — Viewing Downloaded Materials & Local Notes. Changes queued for auto-sync.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">RuralConnect <span className="text-emerald-400">AI</span></span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  SIH25101
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Adaptive Low-Bandwidth Classroom for Rural Institutions</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
            <button
              id="nav-btn-classroom"
              onClick={() => setActiveTab('classroom')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'classroom'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Live Class</span>
            </button>

            <button
              id="nav-btn-offline"
              onClick={() => setActiveTab('offline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'offline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Offline & Notes</span>
              {pendingNotesCount > 0 && (
                <span className="ml-1 text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingNotesCount}
                </span>
              )}
            </button>

            <button
              id="nav-btn-ai-study"
              onClick={() => setActiveTab('ai-study')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai-study'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Study Hub</span>
            </button>

            <button
              id="nav-btn-teacher"
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Teacher Portal</span>
            </button>

            <button
              id="nav-btn-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* College Selector dropdown */}
            <div className="hidden lg:block">
              <select
                id="college-selector-dropdown"
                value={selectedCollege.id}
                onChange={(e) => {
                  const found = colleges.find(c => c.id === e.target.value);
                  if (found) setSelectedCollege(found);
                }}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Offline Sync Trigger */}
            {pendingNotesCount > 0 && (
              <button
                id="btn-sync-pending-notes"
                onClick={onSyncNotes}
                title="Sync offline notes with server"
                className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Sync ({pendingNotesCount})</span>
              </button>
            )}

            {/* Notifications button */}
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-all"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 py-2 text-xs">
        <button
          onClick={() => setActiveTab('classroom')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${activeTab === 'classroom' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <Tv className="w-4 h-4" />
          <span>Class</span>
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded relative ${activeTab === 'offline' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <Download className="w-4 h-4" />
          <span>Offline</span>
          {pendingNotesCount > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-0 right-1"></span>}
        </button>
        <button
          onClick={() => setActiveTab('ai-study')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${activeTab === 'ai-study' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>AI Study</span>
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${activeTab === 'teacher' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Teacher</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${activeTab === 'analytics' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
      </div>
    </header>
  );
};
