export type BandwidthMode = 'ultra-low' | 'low' | 'standard' | 'offline';

export interface RegionalLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface College {
  id: string;
  name: string;
  district: string;
  state: string;
  type: 'urban-host' | 'rural-partner';
  studentCount: number;
  avgBandwidthKbps: number;
}

export interface SubtitleFrame {
  id: string;
  timestamp: number; // in seconds
  speaker: string;
  originalText: string;
  translations: Record<string, string>; // languageCode -> text
}

export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  imageUrl: string;
  vectorDrawingSvg?: string;
  notesText: string;
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  urbanHostCollege: string;
  professorName: string;
  isLive: boolean;
  scheduledTime: string;
  durationMinutes: number;
  thumbnailUrl: string;
  audioUrl?: string;
  videoUrl240p?: string;
  videoUrl720p?: string;
  slides: Slide[];
  subtitles: SubtitleFrame[];
  fileSizeAudioKb: number;
  fileSizeVideoKb: number;
  enrolledStudentsCount: number;
  attendanceRate: number;
  description: string;
  tags: string[];
}

export interface DoubtItem {
  id: string;
  lectureId: string;
  studentName: string;
  collegeName: string;
  question: string;
  timestamp: string;
  upvotes: number;
  status: 'pending' | 'answered' | 'ai-answered';
  answer?: string;
  answeredBy?: string;
  language: string;
}

export interface NoteItem {
  id: string;
  lectureId: string;
  lectureTitle: string;
  content: string;
  timestampSeconds?: number;
  createdTime: string;
  syncStatus: 'synced' | 'pending';
  lastModified: string;
}

export interface ChatMessage {
  id: string;
  lectureId: string;
  senderName: string;
  collegeName: string;
  senderRole: 'student' | 'teacher' | 'ai';
  message: string;
  timestamp: string;
  language?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  collegeName: string;
  lectureId: string;
  joinedAt: string;
  durationWatchedMinutes: number;
  bandwidthModeUsed: BandwidthMode;
  quizScore?: number;
}

export interface AISummary {
  lectureId: string;
  summaryText: string;
  keyTakeaways: string[];
  keyFormulas: string[];
  flashcards: { question: string; answer: string }[];
  generatedAt: string;
}

export interface OfflinePackage {
  lectureId: string;
  downloadedAt: string;
  totalSizeMb: number;
  slidesData: Slide[];
  audioDataAvailable: boolean;
  notes: NoteItem[];
}
