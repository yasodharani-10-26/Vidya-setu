import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NetworkBandwidthBar } from './components/NetworkBandwidthBar';
import { ClassroomPlayer } from './components/ClassroomPlayer';
import { LiveChatAndDoubts } from './components/LiveChatAndDoubts';
import { OfflineNotesManager } from './components/OfflineNotesManager';
import { AISummaryAndFlashcards } from './components/AISummaryAndFlashcards';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationDrawer } from './components/NotificationDrawer';

import { BandwidthMode, College, Lecture, NoteItem, DoubtItem, ChatMessage, OfflinePackage, AttendanceRecord } from './types';
import { COLLEGES, MOCK_LECTURES, MOCK_DOUBTS, MOCK_MESSAGES } from './data/mockData';
import { OfflineStorageService } from './services/offlineStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('classroom');
  const [bandwidthMode, setBandwidthMode] = useState<BandwidthMode>('ultra-low');
  const [selectedCollege, setSelectedCollege] = useState<College>(COLLEGES[1]); // Default Govt College Barmer
  const [selectedLectureId, setSelectedLectureId] = useState<string>('lec-101');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi'); // Default Hindi for Rajasthan Rural
  const [dataSavedMb, setDataSavedMb] = useState<number>(44.8);

  // Storage and interactivity state
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [downloadedLectures, setDownloadedLectures] = useState<OfflinePackage[]>([]);
  const [doubts, setDoubts] = useState<DoubtItem[]>(MOCK_DOUBTS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Load initial notes & downloaded items from IndexedDB/LocalStorage
  useEffect(() => {
    refreshNotesAndDownloads();
  }, []);

  const refreshNotesAndDownloads = () => {
    setNotes(OfflineStorageService.getAllNotes());
    setDownloadedLectures(OfflineStorageService.getDownloadedLectures());
    setAttendanceRecords(OfflineStorageService.getAttendanceRecords());
  };

  const currentLecture = MOCK_LECTURES.find(l => l.id === selectedLectureId) || MOCK_LECTURES[0];
  const isCurrentDownloaded = downloadedLectures.some(d => d.lectureId === currentLecture.id);

  // Track data saved increment
  useEffect(() => {
    if (bandwidthMode === 'ultra-low') {
      const timer = setInterval(() => {
        setDataSavedMb(prev => Number((prev + 0.2).toFixed(1)));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [bandwidthMode]);

  const handleDownloadForOffline = () => {
    OfflineStorageService.saveLectureForOffline(currentLecture);
    refreshNotesAndDownloads();
  };

  const handlePlayOfflineLecture = (lectureId: string) => {
    setSelectedLectureId(lectureId);
    setBandwidthMode('offline');
    setActiveTab('classroom');
  };

  const handleDeleteDownloadedLecture = (lectureId: string) => {
    OfflineStorageService.deleteDownloadedLecture(lectureId);
    refreshNotesAndDownloads();
  };

  const handleDownloadLecture = (lecture: Lecture) => {
    OfflineStorageService.saveLectureForOffline(lecture);
    refreshNotesAndDownloads();
  };

  const handleAddNoteAtTimestamp = (content: string, timestamp: number) => {
    const isOnline = bandwidthMode !== 'offline';
    OfflineStorageService.saveNote(
      currentLecture.id,
      currentLecture.title,
      content,
      timestamp,
      isOnline
    );
    refreshNotesAndDownloads();
  };

  const handleSyncPendingNotes = () => {
    const res = OfflineStorageService.syncPendingNotes();
    refreshNotesAndDownloads();
    alert(`Successfully synced ${res.syncedCount} offline notes with server!`);
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      lectureId: currentLecture.id,
      senderName: `Student (${selectedCollege.district})`,
      collegeName: selectedCollege.name,
      senderRole: 'student',
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleAddDoubt = (question: string, lang: string) => {
    const newDoubt: DoubtItem = {
      id: `doubt-${Date.now()}`,
      lectureId: currentLecture.id,
      studentName: `Student from ${selectedCollege.district}`,
      collegeName: selectedCollege.name,
      question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      upvotes: 1,
      status: 'pending',
      language: lang
    };
    setDoubts(prev => [newDoubt, ...prev]);
  };

  const handleUpvoteDoubt = (id: string) => {
    setDoubts(prev => prev.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
  };

  const handleAnswerDoubt = (doubtId: string, answer: string) => {
    setDoubts(prev => prev.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          status: 'answered' as const,
          answer,
          answeredBy: 'Dr. Ramesh Sharma (MNIT Jaipur)'
        };
      }
      return d;
    }));
  };

  const handleRaiseHand = () => {
    // Log attendance record automatically
    OfflineStorageService.recordAttendance(
      currentLecture.id,
      `Student (${selectedCollege.district})`,
      selectedCollege.name,
      45,
      bandwidthMode
    );
    refreshNotesAndDownloads();
  };

  const pendingNotesCount = notes.filter(n => n.syncStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bandwidthMode={bandwidthMode}
        setBandwidthMode={setBandwidthMode}
        selectedCollege={selectedCollege}
        setSelectedCollege={setSelectedCollege}
        colleges={COLLEGES}
        pendingNotesCount={pendingNotesCount}
        onSyncNotes={handleSyncPendingNotes}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        unreadNotifications={3}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Network Bandwidth Simulator Bar */}
      <NetworkBandwidthBar
        bandwidthMode={bandwidthMode}
        setBandwidthMode={setBandwidthMode}
        dataSavedMb={dataSavedMb}
      />

      {/* Main View Area */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* VIEW 1: LIVE CLASSROOM */}
        {activeTab === 'classroom' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Classroom Video/Canvas Stream Player */}
              <div className="lg:col-span-8">
                <ClassroomPlayer
                  lecture={currentLecture}
                  bandwidthMode={bandwidthMode}
                  isDownloaded={isCurrentDownloaded}
                  onDownloadForOffline={handleDownloadForOffline}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  onAddNoteAtTimestamp={handleAddNoteAtTimestamp}
                  onRaiseHand={handleRaiseHand}
                />
              </div>

              {/* Live Chat, Doubts & Vidya AI Tutor Hub */}
              <div className="lg:col-span-4">
                <LiveChatAndDoubts
                  lectureId={currentLecture.id}
                  lectureTitle={currentLecture.title}
                  subject={currentLecture.subject}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  doubts={doubts}
                  onAddDoubt={handleAddDoubt}
                  onUpvoteDoubt={handleUpvoteDoubt}
                  selectedCollege={selectedCollege}
                  selectedLanguage={selectedLanguage}
                />
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: OFFLINE DOWNLOADS & NOTES MANAGER */}
        {activeTab === 'offline' && (
          <OfflineNotesManager
            notes={notes}
            downloadedLectures={downloadedLectures}
            allLectures={MOCK_LECTURES}
            onNoteChange={refreshNotesAndDownloads}
            onSyncPendingNotes={handleSyncPendingNotes}
            bandwidthMode={bandwidthMode}
            onPlayOfflineLecture={handlePlayOfflineLecture}
            onDeleteDownloadedLecture={handleDeleteDownloadedLecture}
            onDownloadLecture={handleDownloadLecture}
          />
        )}

        {/* VIEW 3: AI STUDY HUB (SUMMARY & FLASHCARDS) */}
        {activeTab === 'ai-study' && (
          <AISummaryAndFlashcards
            lectures={MOCK_LECTURES}
            selectedLectureId={selectedLectureId}
            setSelectedLectureId={setSelectedLectureId}
          />
        )}

        {/* VIEW 4: TEACHER & ADMIN PORTAL */}
        {activeTab === 'teacher' && (
          <TeacherDashboard
            colleges={COLLEGES}
            lectures={MOCK_LECTURES}
            doubts={doubts}
            onAnswerDoubt={handleAnswerDoubt}
            attendanceRecords={attendanceRecords}
          />
        )}

        {/* VIEW 5: ANALYTICS & IMPACT STATS */}
        {activeTab === 'analytics' && (
          <AnalyticsView colleges={COLLEGES} />
        )}

      </main>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        pendingNotesCount={pendingNotesCount}
      />

    </div>
  );
}
