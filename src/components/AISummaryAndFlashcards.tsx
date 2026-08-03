import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Download, 
  Brain,
  Zap,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Lecture, AISummary } from '../types';
import { ApiService } from '../services/api';

interface AISummaryAndFlashcardsProps {
  lectures: Lecture[];
  selectedLectureId: string;
  setSelectedLectureId: (id: string) => void;
}

export const AISummaryAndFlashcards: React.FC<AISummaryAndFlashcardsProps> = ({
  lectures,
  selectedLectureId,
  setSelectedLectureId
}) => {
  const currentLecture = lectures.find(l => l.id === selectedLectureId) || lectures[0];
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const fetchSummary = async (lec: Lecture) => {
    setLoading(true);
    setSummary(null);
    try {
      const slidesText = lec.slides.map(s => `Slide ${s.slideNumber}: ${s.title} - ${s.notesText}`).join('\n');
      const transcriptText = lec.subtitles.map(sub => `${sub.speaker}: ${sub.originalText}`).join('\n');

      const result = await ApiService.generateAISummary(
        lec.title,
        lec.subject,
        lec.professorName,
        transcriptText,
        slidesText
      );
      setSummary(result);
    } catch {
      // Handled in ApiService fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentLecture) {
      fetchSummary(currentLecture);
    }
  }, [selectedLectureId]);

  const activeCard = summary?.flashcards[activeCardIndex];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header & Lecture Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>AI Lecture Summaries & Revision Hub</span>
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Gemini 3.6 Flash Server Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automatically extracts core takeaways, key formulas, and interactive flashcards from live & recorded lectures.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            id="select-lecture-ai-summary"
            value={selectedLectureId}
            onChange={(e) => setSelectedLectureId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-72 font-medium"
          >
            {lectures.map(l => (
              <option key={l.id} value={l.id}>
                {l.title} ({l.subject})
              </option>
            ))}
          </select>

          <button
            id="btn-regenerate-ai-summary"
            onClick={() => currentLecture && fetchSummary(currentLecture)}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl space-y-3">
          <Brain className="w-10 h-10 text-emerald-400 animate-bounce mx-auto" />
          <h3 className="text-white font-bold text-base">Gemini AI Analyzing Lecture Content...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Reading lecture slides, transcripts, and formulas to synthesize a clear summary and revision flashcards.
          </p>
        </div>
      ) : (
        summary && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: AI High-Level Summary & Key Takeaways */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Executive Summary Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Executive Summary</span>
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Generated at {summary.generatedAt}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  {summary.summaryText}
                </p>

                {/* Key Takeaways */}
                <div>
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Key Concepts & Takeaways</span>
                  </h3>
                  <div className="space-y-2">
                    {summary.keyTakeaways.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Formulas / Rules */}
                {summary.keyFormulas.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
                      📐 Core Formulas & Mathematical Equations
                    </h3>
                    <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20 font-mono text-xs text-emerald-300 space-y-1.5">
                      {summary.keyFormulas.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-emerald-500">▪</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Interactive AI Revision Flashcards */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    <span>Interactive AI Revision Flashcards</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeCardIndex + 1} of {summary.flashcards.length}
                  </span>
                </div>

                {/* 3D Flip Flashcard */}
                {activeCard && (
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer perspective-1000 min-h-[220px] bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative transition-all hover:border-emerald-500/40"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span className="uppercase tracking-widest text-emerald-400">
                        {isFlipped ? '💡 ANSWER' : '❓ QUESTION'}
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        Click to Flip 🔄
                      </span>
                    </div>

                    <div className="my-auto py-4 text-center">
                      <p className={`font-bold leading-relaxed transition-all ${
                        isFlipped ? 'text-emerald-300 text-sm' : 'text-white text-base'
                      }`}>
                        {isFlipped ? activeCard.answer : activeCard.question}
                      </p>
                    </div>

                    <div className="text-center text-[10px] text-slate-500">
                      {isFlipped ? 'Answer revealed. Tap to flip back to question.' : 'Tap anywhere on the card to reveal answer.'}
                    </div>
                  </div>
                )}

                {/* Flashcard Navigation */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveCardIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={activeCardIndex === 0}
                    className="flex items-center gap-1 text-xs bg-slate-950 hover:bg-slate-800 disabled:opacity-40 text-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer border border-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveCardIndex(prev => Math.min(summary.flashcards.length - 1, prev + 1));
                    }}
                    disabled={activeCardIndex === summary.flashcards.length - 1}
                    className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Next Flashcard <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )
      )}

    </div>
  );
};
