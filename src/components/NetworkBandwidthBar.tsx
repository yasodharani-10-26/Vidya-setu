import React from 'react';
import { Wifi, Gauge, HardDrive, Radio, Cpu, CheckCircle2 } from 'lucide-react';
import { BandwidthMode } from '../types';

interface NetworkBandwidthBarProps {
  bandwidthMode: BandwidthMode;
  setBandwidthMode: (mode: BandwidthMode) => void;
  dataSavedMb: number;
}

export const NetworkBandwidthBar: React.FC<NetworkBandwidthBarProps> = ({
  bandwidthMode,
  setBandwidthMode,
  dataSavedMb
}) => {
  const getSpeedDetails = (mode: BandwidthMode) => {
    switch (mode) {
      case 'ultra-low':
        return { label: '50 Kbps', desc: 'Audio + Vector Slides Stream', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'low':
        return { label: '150 Kbps', desc: 'Low Bitrate 240p Compressed Video', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      case 'standard':
        return { label: '500+ Kbps', desc: 'Standard 720p HD Stream', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'offline':
        return { label: '0 Kbps', desc: 'Offline Local Storage Sync Mode', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    }
  };

  const speed = getSpeedDetails(bandwidthMode);

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mr-1">
            <Gauge className="w-4 h-4 text-indigo-400" />
            <span>Network Adaptive Mode:</span>
          </div>

          <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner flex-wrap gap-1">
            <button
              id="bandwidth-btn-ultra-low"
              onClick={() => setBandwidthMode('ultra-low')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bandwidthMode === 'ultra-low'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>⚡ Ultra-Low (50 Kbps)</span>
            </button>

            <button
              id="bandwidth-btn-low"
              onClick={() => setBandwidthMode('low')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bandwidthMode === 'low'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>📶 Low (150 Kbps)</span>
            </button>

            <button
              id="bandwidth-btn-standard"
              onClick={() => setBandwidthMode('standard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bandwidthMode === 'standard'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🎬 Standard (500 Kbps)</span>
            </button>

            <button
              id="bandwidth-btn-offline"
              onClick={() => setBandwidthMode('offline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                bandwidthMode === 'offline'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🚫 Offline Mode</span>
            </button>
          </div>
        </div>

        {/* Live Bandwidth Telemetry Stats */}
        <div className="flex items-center gap-4 text-xs bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800/80 w-full md:w-auto justify-around sm:justify-end">
          
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-slate-400">Stream Payload:</span>
            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${speed.color}`}>
              {speed.label}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Saved: ~{dataSavedMb} MB</span>
          </div>

        </div>

      </div>
    </div>
  );
};
