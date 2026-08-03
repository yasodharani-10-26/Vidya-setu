import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Hand, 
  FileText, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  Languages, 
  Maximize2,
  Highlighter,
  Sliders
} from 'lucide-react';
import { Lecture, BandwidthMode, RegionalLanguage, SubtitleFrame } from '../types';
import { REGIONAL_LANGUAGES } from '../data/mockData';
import { ApiService } from '../services/api';

interface ClassroomPlayerProps {
  lecture: Lecture;
  bandwidthMode: BandwidthMode;
  isDownloaded: boolean;
  onDownloadForOffline: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  onAddNoteAtTimestamp: (text: string, timestamp: number) => void;
  onRaiseHand: () => void;
}

export const ClassroomPlayer: React.FC<ClassroomPlayerProps> = ({
  lecture,
  bandwidthMode,
  isDownloaded,
  onDownloadForOffline,
  selectedLanguage,
  setSelectedLanguage,
  onAddNoteAtTimestamp,
  onRaiseHand
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // 0.85x default for clear teacher pace
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(0);
  const [dualLanguage, setDualLanguage] = useState<boolean>(true);
  const [subtitleSize, setSubtitleSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [quickNoteText, setQuickNoteText] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [aiTranslating, setAiTranslating] = useState<boolean>(false);
  const [dynamicSubtitles, setDynamicSubtitles] = useState<SubtitleFrame[]>(lecture.subtitles);

  // Auto-advance subtitle & slide simulation for realistic live feel
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSubtitleIndex((prev) => (prev + 1) % dynamicSubtitles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, dynamicSubtitles]);

  const currentSub = dynamicSubtitles[currentSubtitleIndex] || lecture.subtitles[0];
  const currentSlide = lecture.slides[currentSlideIndex] || lecture.slides[0];

  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  // Helper to safely unlock Web Speech API & Web Audio Context on user gesture
  const unlockAudio = () => {
    setAudioUnlocked(true);
    setIsMuted(false);
    setIsPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        // Play subtle soft chime to confirm audio device works
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
        gain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Ignore if web audio isn't allowed
    }
  };

  // Dedicated Speak Function
  const speakCurrentText = useCallback((customText?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    // Resume synth if stuck in paused state (common Chrome bug)
    if (synth.paused) {
      synth.resume();
    }

    const textToSpeak = customText || (
      (selectedLanguage !== 'en' && currentSub?.translations[selectedLanguage]) 
        ? currentSub.translations[selectedLanguage] 
        : currentSub?.originalText
    );

    if (!textToSpeak) return;

    synth.cancel(); // Clear previous queue

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.volume = volume;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // Language mapping for Web Speech API
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      bn: 'bn-IN',
      kn: 'kn-IN',
      pa: 'pa-IN',
      ml: 'ml-IN',
      or: 'or-IN',
      en: 'en-US'
    };
    const targetLang = langMap[selectedLanguage] || 'en-US';
    utterance.lang = targetLang;

    // Voice selection
    if (selectedVoiceURI && availableVoices.length > 0) {
      const matched = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (matched) utterance.voice = matched;
    } else if (availableVoices.length > 0) {
      const matched = availableVoices.find(v => 
        v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.toLowerCase()) ||
        v.lang.toLowerCase().startsWith(selectedLanguage)
      ) || availableVoices.find(v => 
        v.lang.includes('IN') || 
        v.name.toLowerCase().includes('india') || 
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('natural')
      );
      if (matched) utterance.voice = matched;
    }

    utterance.onstart = () => {
      synth.resume();
    };

    synth.speak(utterance);
    synth.resume(); // Ensure speaking triggers immediately
  }, [selectedLanguage, currentSub, volume, speechRate, speechPitch, selectedVoiceURI, availableVoices]);

  // Load available system/browser speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Speech Synthesis Trigger Effect
  useEffect(() => {
    if (!isPlaying || isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    speakCurrentText();

    // Chrome bug fix: periodically call resume while speaking to prevent freeze
    const resumeInterval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }
    }, 3000);

    return () => {
      clearInterval(resumeInterval);
    };
  }, [currentSubtitleIndex, isPlaying, isMuted, speakCurrentText]);

  const handleTranslateLiveSubtitles = async (langCode: string) => {
    setSelectedLanguage(langCode);
    if (langCode === 'en') return;

    const langObj = REGIONAL_LANGUAGES.find(l => l.code === langCode);
    if (!langObj) return;

    setAiTranslating(true);
    try {
      const updated = await Promise.all(
        lecture.subtitles.map(async (sub) => {
          if (sub.translations[langCode]) return sub;
          const translated = await ApiService.translateText(sub.originalText, langObj.name);
          return {
            ...sub,
            translations: { ...sub.translations, [langCode]: translated }
          };
        })
      );
      setDynamicSubtitles(updated);
    } catch {
      // Keep existing
    } finally {
      setAiTranslating(false);
    }
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;
    onAddNoteAtTimestamp(quickNoteText, currentSub?.timestamp || 10);
    setQuickNoteText('');
    setShowNoteInput(false);
  };

  const handleRaiseHandClick = () => {
    setHandRaised(true);
    onRaiseHand();
    setTimeout(() => setHandRaised(false), 4000);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Player Top Banner */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {lecture.isLive ? (
            <span className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE TRANSMISSION</span>
            </span>
          ) : (
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold">
              RECORDED LECTURE
            </span>
          )}

          <div>
            <h2 className="text-white font-bold text-base sm:text-lg leading-tight">{lecture.title}</h2>
            <p className="text-xs text-slate-400">
              {lecture.urbanHostCollege} • {lecture.professorName} ({lecture.subject})
            </p>
          </div>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          {isDownloaded ? (
            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Downloaded Offline</span>
            </span>
          ) : (
            <button
              id="btn-download-lecture-offline"
              onClick={onDownloadForOffline}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Offline ({Number((lecture.fileSizeAudioKb / 1024).toFixed(1))} MB)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-black min-h-[380px] relative">
        
        {/* Left / Main Screen Area */}
        <div className="lg:col-span-8 flex flex-col justify-between p-4 relative bg-slate-950/90 overflow-hidden min-h-[360px]">
          
          {/* 1. ULTRA LOW BANDWIDTH MODE (50 Kbps) - Audio Waveform & Vector Board */}
          {bandwidthMode === 'ultra-low' && (
            <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 relative">
              <div className="absolute top-3 left-3 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>50 Kbps Audio + Vector Draw Stream</span>
              </div>

              {/* Animated Audio Waveform */}
              <div className="w-full max-w-md my-4">
                <div className="flex items-center justify-center gap-1 h-16">
                  {[40, 80, 20, 90, 60, 100, 45, 75, 30, 85, 95, 50, 70, 90, 35, 65, 80, 40].map((height, i) => (
                    <div
                      key={i}
                      className={`w-1.5 bg-gradient-to-t from-amber-500 to-emerald-400 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: isPlaying ? `${Math.max(15, (height * (i % 3 + 1)) % 100)}%` : '15%' }}
                    ></div>
                  ))}
                </div>
                <p className="text-center text-xs text-amber-300/80 font-mono mt-2">
                  🔊 Low-Bitrate Voice Codec (Opus 12kbps) + Syncing Canvas
                </p>
              </div>

              {/* Slide Vector Overlay Card */}
              {currentSlide && (
                <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl text-center">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-1">
                    SLIDE {currentSlide.slideNumber} / {lecture.slides.length}
                  </span>
                  <h4 className="font-bold text-white text-sm mb-2">{currentSlide.title}</h4>
                  <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-sans leading-relaxed text-left">
                    💡 <span className="font-semibold text-emerald-400">Teacher Notes:</span> {currentSlide.notesText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. LOW / STANDARD BANDWIDTH VIDEO STREAM (150 - 500 Kbps) */}
          {(bandwidthMode === 'low' || bandwidthMode === 'standard') && (
            <div className="flex-1 flex items-center justify-center relative min-h-[320px]">
              <img
                src={currentSlide ? currentSlide.imageUrl : lecture.thumbnailUrl}
                alt="Lecture Stream"
                className="w-full h-full object-cover max-h-[380px] rounded-xl border border-slate-800 filter brightness-90"
              />

              {/* Bandwidth Watermark Badge */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${bandwidthMode === 'low' ? 'bg-blue-400' : 'bg-emerald-400'} animate-pulse`}></span>
                <span className="font-mono text-[11px] font-semibold">
                  {bandwidthMode === 'low' ? '240p Low Bitrate (150 Kbps)' : '720p HD Stream (500 Kbps)'}
                </span>
              </div>

              {/* Play Pause Center Overlay */}
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute w-16 h-16 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
              )}
            </div>
          )}

          {/* 3. OFFLINE MODE DISPLAY */}
          {bandwidthMode === 'offline' && (
            <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-base mb-1">Offline Local Playback</h3>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                Playing downloaded offline package. Zero mobile data consumed!
              </p>
              {currentSlide && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Offline Slide #{currentSlide.slideNumber}</span>
                    <span className="text-emerald-400 font-semibold">Cached</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{currentSlide.title}</h4>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {currentSlide.notesText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* LIVE CAPTIONS / REGIONAL SUBTITLE BAR */}
          <div className="mt-3 bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Regional Subtitles:
                </span>
                {aiTranslating && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-3 h-3" /> Translating...
                  </span>
                )}
              </div>

              {/* Language Switcher & Subtitle Options */}
              <div className="flex items-center gap-2">
                <select
                  id="select-regional-caption-language"
                  value={selectedLanguage}
                  onChange={(e) => handleTranslateLiveSubtitles(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  {REGIONAL_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>

                <button
                  id="btn-toggle-dual-subtitle"
                  onClick={() => setDualLanguage(!dualLanguage)}
                  title="Toggle Dual Language Subtitles (English + Regional)"
                  className={`px-2 py-1 text-[11px] rounded-md font-semibold transition-all border ${
                    dualLanguage 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Dual Subtitles
                </button>
              </div>
            </div>

            {/* Subtitle Content Display */}
            <div className="space-y-1 py-1">
              {/* Primary Regional Language Subtitle */}
              {selectedLanguage !== 'en' && currentSub?.translations[selectedLanguage] ? (
                <p className={`font-bold text-amber-300 leading-snug ${subtitleSize === 'sm' ? 'text-sm' : subtitleSize === 'md' ? 'text-base' : 'text-lg'}`}>
                  {currentSub.translations[selectedLanguage]}
                </p>
              ) : (
                <p className={`font-bold text-amber-300 leading-snug ${subtitleSize === 'sm' ? 'text-sm' : subtitleSize === 'md' ? 'text-base' : 'text-lg'}`}>
                  {currentSub?.originalText}
                </p>
              )}

              {/* Secondary English Subtitle if Dual Subtitle active */}
              {dualLanguage && selectedLanguage !== 'en' && (
                <p className="text-xs text-slate-400 font-medium italic">
                  EN: {currentSub?.originalText}
                </p>
              )}
            </div>
          </div>

          {/* UNMUTED / START AUDIO BANNER (for browser gesture unlock) */}
          {(!audioUnlocked || isMuted) && (
            <div 
              onClick={unlockAudio}
              className="mt-2 bg-gradient-to-r from-emerald-950 via-indigo-950 to-slate-900 border border-emerald-500/40 p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 transition-all shadow-lg animate-pulse"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Tap to Enable Teacher Audio Sound (🔊)</h4>
                  <p className="text-[10px] text-emerald-300">Click anywhere here to unlock browser speech & voice narration in Telugu / regional language.</p>
                </div>
              </div>
              <button 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow cursor-pointer flex-shrink-0"
              >
                Enable Sound
              </button>
            </div>
          )}

          {/* DEDICATED AUDIO PLAYBACK CONTROLS BAR */}
          <div className="mt-3 bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Play / Pause Button */}
              <button
                id="btn-toggle-lecture-play"
                onClick={() => {
                  if (!isPlaying) {
                    unlockAudio();
                  } else {
                    setIsPlaying(false);
                  }
                }}
                className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md"
                title={isPlaying ? 'Pause Audio & Presentation' : 'Play Audio & Presentation'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Mute / Unmute Button */}
              <button
                id="btn-toggle-lecture-mute"
                onClick={() => {
                  if (isMuted) {
                    unlockAudio();
                  } else {
                    setIsMuted(true);
                  }
                }}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isMuted 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                    : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute Speech Audio' : 'Mute Speech Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) unlockAudio();
                  }}
                  className="w-20 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
                <span className="text-[10px] font-mono text-slate-400 min-w-[28px]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-mono font-semibold border flex items-center gap-1.5 ${
                isPlaying && !isMuted 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  {isPlaying && !isMuted 
                    ? `🔊 Speech Active (${REGIONAL_LANGUAGES.find(l=>l.code===selectedLanguage)?.name})` 
                    : isMuted ? '🔇 Audio Muted' : '⏸️ Paused'}
                </span>
              </span>

              {/* Voice Settings Toggle Button */}
              <button
                id="btn-toggle-voice-settings"
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  showVoiceSettings 
                    ? 'bg-indigo-600 text-white border-indigo-500' 
                    : 'bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Customize Speech Voice, Speed Rate & Tone"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Voice & Speed ({speechRate}x)</span>
              </button>

              {/* Read Aloud Now Button */}
              <button
                onClick={() => {
                  unlockAudio();
                  speakCurrentText();
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1"
                title="Speak current subtitle line immediately"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Read Aloud</span>
              </button>
            </div>
          </div>

          {/* EXPANDABLE VOICE & TALKING SPEED CUSTOMIZATION PANEL */}
          {showVoiceSettings && (
            <div className="mt-2 bg-slate-950 border border-indigo-500/30 p-4 rounded-xl space-y-3.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Speech Synthesizer Voice & Tone Customization</span>
                </h4>
                <button
                  onClick={() => setShowVoiceSettings(false)}
                  className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Speed Rate Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Talking Speed (Rate): <strong className="text-emerald-400 font-mono">{speechRate}x</strong></span>
                  <span className="text-[10px] text-slate-400">Lower for clearer pronunciation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">0.5x</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">1.5x</span>
                </div>

                {/* Speed Presets */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {[
                    { label: '🐢 Slow (0.7x)', rate: 0.7 },
                    { label: '🎓 Clear Teacher (0.85x)', rate: 0.85 },
                    { label: '⚡ Normal (1.0x)', rate: 1.0 },
                    { label: '🚀 Fast (1.2x)', rate: 1.2 }
                  ].map((p) => (
                    <button
                      key={p.rate}
                      onClick={() => setSpeechRate(p.rate)}
                      className={`text-[10px] px-2 py-1 rounded-md font-semibold border transition-all cursor-pointer ${
                        speechRate === p.rate 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pitch Control */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Voice Tone / Pitch: <strong className="text-indigo-300 font-mono">{speechPitch}</strong></span>
                  <span className="text-[10px] text-slate-400">0.8 = Warm/Deep, 1.2 = High/Crisp</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">0.8</span>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500">1.3</span>
                </div>
              </div>

              {/* Available Browser Voice Accent Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Select Accent / Browser Voice Model ({availableVoices.length || 'Default System Voice'}):
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                >
                  <option value="">✨ Default Auto-Matched Voice ({REGIONAL_LANGUAGES.find(l=>l.code===selectedLanguage)?.name})</option>
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Tip: Pick a voice matching your preferred accent or select Google / Microsoft Natural speech voices for maximum clarity.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Slide Deck Navigation & Control Panel */}
        <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Live Lecture Slide Deck</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {currentSlideIndex + 1} of {lecture.slides.length || 1}
              </span>
            </div>

            {/* Slide Selector List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {lecture.slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center font-bold ${
                    currentSlideIndex === idx ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {slide.slideNumber}
                  </span>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-semibold truncate text-slate-200">{slide.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{slide.notesText}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Slide Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Prev Slide
              </button>

              <button
                onClick={() => setCurrentSlideIndex(prev => Math.min(lecture.slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === lecture.slides.length - 1}
                className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Next Slide <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Note Input Modal / Expand */}
          {showNoteInput && (
            <form onSubmit={handleSaveQuickNote} className="mt-3 bg-slate-950 p-3 rounded-xl border border-indigo-500/40 shadow-xl">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-1">
                <span>📝 Add Timestamped Note ({currentSub?.timestamp || 10}s)</span>
                <button type="button" onClick={() => setShowNoteInput(false)} className="text-slate-500 hover:text-slate-300">✕</button>
              </div>
              <input
                type="text"
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Type lecture note (saved locally & auto-synced)..."
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteInput(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1 rounded-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          {/* Interactive Classroom Action Toolbar */}
          <div className="space-y-2 mt-4 pt-3 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-raise-hand"
                onClick={handleRaiseHandClick}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  handRaised 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold animate-bounce'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Hand className="w-4 h-4 text-amber-400" />
                <span>{handRaised ? 'Hand Raised!' : 'Raise Hand'}</span>
              </button>

              <button
                id="btn-take-quick-note"
                onClick={() => setShowNoteInput(true)}
                className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <Highlighter className="w-4 h-4 text-indigo-400" />
                <span>Take Note</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Attendance Active</span>
              </span>
              <span>Subtitles: <strong className="text-emerald-400">{REGIONAL_LANGUAGES.find(l=>l.code===selectedLanguage)?.name}</strong></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
