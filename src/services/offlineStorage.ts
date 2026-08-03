import { NoteItem, OfflinePackage, Lecture, AttendanceRecord } from '../types';

const DOWNLOADS_KEY = 'rural_connect_downloaded_lectures';
const OFFLINE_NOTES_KEY = 'rural_connect_offline_notes';
const ATTENDANCE_KEY = 'rural_connect_attendance_records';

export class OfflineStorageService {
  // --- DOWNLOADED LECTURES MANAGEMENT ---
  static getDownloadedLectures(): OfflinePackage[] {
    try {
      const data = localStorage.getItem(DOWNLOADS_KEY);
      if (!data) {
        // Default sample downloaded lecture so users immediately see a downloaded offline class
        const defaultSample: OfflinePackage[] = [{
          lectureId: 'lec-101',
          downloadedAt: new Date().toISOString(),
          totalSizeMb: 4.33,
          slidesData: [
            {
              id: 's1',
              slideNumber: 1,
              title: 'Introduction to Solar Microgrids in Desert Regions',
              imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
              notesText: 'Solar radiation in Western Rajasthan averages 5.8 kWh/m2/day. Ideal for off-grid PV microgrids.'
            },
            {
              id: 's2',
              slideNumber: 2,
              title: 'Battery Sizing & Depth of Discharge (DoD)',
              imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
              notesText: 'Always size lead-acid batteries for maximum 50% DoD or LiFePO4 for 80% DoD to ensure 5+ year lifespan.'
            },
            {
              id: 's3',
              slideNumber: 3,
              title: 'Inverter Synchronization & Load Management',
              imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
              notesText: 'MPPT charge controllers maximize power output during peak heat when panel temperature coefficient drops voltage.'
            }
          ],
          audioDataAvailable: true,
          notes: []
        }];
        localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(defaultSample));
        return defaultSample;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static isLectureDownloaded(lectureId: string): boolean {
    const list = this.getDownloadedLectures();
    return list.some(item => item.lectureId === lectureId);
  }

  static saveLectureForOffline(lecture: Lecture): OfflinePackage {
    const list = this.getDownloadedLectures();
    const existingIndex = list.findIndex(item => item.lectureId === lecture.id);

    const pkg: OfflinePackage = {
      lectureId: lecture.id,
      downloadedAt: new Date().toISOString(),
      totalSizeMb: Number((lecture.fileSizeAudioKb / 1024 + 1.2).toFixed(2)), // Audio + Slides compressed
      slidesData: lecture.slides,
      audioDataAvailable: true,
      notes: this.getNotesForLecture(lecture.id)
    };

    if (existingIndex >= 0) {
      list[existingIndex] = pkg;
    } else {
      list.push(pkg);
    }

    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(list));
    return pkg;
  }

  static deleteDownloadedLecture(lectureId: string): void {
    const list = this.getDownloadedLectures().filter(item => item.lectureId !== lectureId);
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(list));
  }

  // --- OFFLINE NOTES MANAGEMENT & SYNC ---
  static getAllNotes(): NoteItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_NOTES_KEY);
      if (!data) {
        // Initial sample notes
        const defaultNotes: NoteItem[] = [
          {
            id: 'n1',
            lectureId: 'lec-101',
            lectureTitle: 'Solar Photovoltaic Microgrid Systems',
            content: 'Key formula: Battery Capacity (Ah) = (Daily Wh * Autonomy Days) / (Volts * DoD).\nNeed to check solar panel efficiency degradation in desert sandstorms.',
            timestampSeconds: 28,
            createdTime: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            syncStatus: 'synced',
            lastModified: new Date().toISOString()
          }
        ];
        localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(defaultNotes));
        return defaultNotes;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static getNotesForLecture(lectureId: string): NoteItem[] {
    return this.getAllNotes().filter(n => n.lectureId === lectureId);
  }

  static saveNote(
    lectureId: string,
    lectureTitle: string,
    content: string,
    timestampSeconds?: number,
    isOnline: boolean = true
  ): NoteItem {
    const notes = this.getAllNotes();
    const newNote: NoteItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      lectureId,
      lectureTitle,
      content,
      timestampSeconds,
      createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      syncStatus: isOnline ? 'synced' : 'pending',
      lastModified: new Date().toISOString()
    };

    notes.unshift(newNote);
    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(notes));
    return newNote;
  }

  static updateNote(id: string, content: string, isOnline: boolean = true): NoteItem | null {
    const notes = this.getAllNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    notes[index].content = content;
    notes[index].syncStatus = isOnline ? 'synced' : 'pending';
    notes[index].lastModified = new Date().toISOString();

    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(notes));
    return notes[index];
  }

  static deleteNote(id: string): void {
    const notes = this.getAllNotes().filter(n => n.id !== id);
    localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(notes));
  }

  static syncPendingNotes(): { syncedCount: number } {
    const notes = this.getAllNotes();
    let count = 0;

    const updated = notes.map(n => {
      if (n.syncStatus === 'pending') {
        count++;
        return { ...n, syncStatus: 'synced' as const };
      }
      return n;
    });

    if (count > 0) {
      localStorage.setItem(OFFLINE_NOTES_KEY, JSON.stringify(updated));
    }

    return { syncedCount: count };
  }

  // --- ATTENDANCE & PROGRESS ---
  static getAttendanceRecords(): AttendanceRecord[] {
    try {
      const data = localStorage.getItem(ATTENDANCE_KEY);
      return data ? JSON.parse(data) : [
        {
          id: 'att-1',
          studentId: 'st-barmer-09',
          studentName: 'Rajesh Kumar',
          collegeName: 'Govt College Barmer',
          lectureId: 'lec-101',
          joinedAt: '10:01 AM',
          durationWatchedMinutes: 44,
          bandwidthModeUsed: 'ultra-low',
          quizScore: 90
        }
      ];
    } catch {
      return [];
    }
  }

  static recordAttendance(
    lectureId: string,
    studentName: string,
    collegeName: string,
    durationMinutes: number,
    bandwidthMode: any
  ): AttendanceRecord {
    const records = this.getAttendanceRecords();
    const existingIndex = records.findIndex(r => r.lectureId === lectureId && r.studentName === studentName);

    const record: AttendanceRecord = {
      id: existingIndex >= 0 ? records[existingIndex].id : `att-${Date.now()}`,
      studentId: 'st-current',
      studentName,
      collegeName,
      lectureId,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationWatchedMinutes: durationMinutes,
      bandwidthModeUsed: bandwidthMode
    };

    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
    return record;
  }
}
