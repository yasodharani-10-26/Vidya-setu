import React from 'react';
import { Bell, X, CheckCircle2, Clock, Radio, Wifi } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pendingNotesCount: number;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  pendingNotesCount
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: '🎥 Live Lecture In Progress',
      body: 'MNIT Jaipur is broadcasting Solar Photovoltaic Systems to rural partner colleges.',
      time: 'Just now',
      badge: 'Live',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'n2',
      title: pendingNotesCount > 0 ? `📥 ${pendingNotesCount} Offline Notes Pending` : '✅ All Notes Synced',
      body: pendingNotesCount > 0 ? 'Will auto-upload when network connectivity is detected.' : 'Your study notes are fully backed up to the cloud.',
      time: '2 mins ago',
      badge: pendingNotesCount > 0 ? 'Offline Queue' : 'Synced',
      badgeColor: pendingNotesCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
    },
    {
      id: 'n3',
      title: '❓ Doubt Resolved',
      body: 'Prof. Sharma answered Vikram Singh\'s query regarding desert MPPT efficiency.',
      time: '15 mins ago',
      badge: 'Answered',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'n4',
      title: '⚡ Ultra-Low Bandwidth Engine Enabled',
      body: 'Operating at 50 Kbps audio + vector slides mode to preserve mobile data in rural Western Rajasthan.',
      time: '1 hour ago',
      badge: 'Data Saver',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Classroom Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div key={n.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${n.badgeColor}`}>
                    {n.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{n.body}</p>
                <span className="text-[10px] text-slate-500 block text-right">{n.time}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
};
