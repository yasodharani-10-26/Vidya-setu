import React, { useState } from 'react';
import { 
  MessageSquare, 
  HelpCircle, 
  ThumbsUp, 
  Sparkles, 
  Send, 
  Bot, 
  CheckCircle2, 
  UserCheck, 
  Globe, 
  CornerDownRight,
  Filter
} from 'lucide-react';
import { ChatMessage, DoubtItem, College } from '../types';
import { ApiService } from '../services/api';
import { REGIONAL_LANGUAGES } from '../data/mockData';

interface LiveChatAndDoubtsProps {
  lectureId: string;
  lectureTitle: string;
  subject: string;
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  doubts: DoubtItem[];
  onAddDoubt: (question: string, lang: string) => void;
  onUpvoteDoubt: (id: string) => void;
  selectedCollege: College;
  selectedLanguage: string;
}

export const LiveChatAndDoubts: React.FC<LiveChatAndDoubtsProps> = ({
  lectureId,
  lectureTitle,
  subject,
  messages,
  onSendMessage,
  doubts,
  onAddDoubt,
  onUpvoteDoubt,
  selectedCollege,
  selectedLanguage
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'doubts' | 'ai-tutor'>('chat');
  const [chatInput, setChatInput] = useState<string>('');
  const [doubtInput, setDoubtInput] = useState<string>('');
  const [doubtLanguage, setDoubtLanguage] = useState<string>(selectedLanguage);
  
  // AI Chatbot local conversation state
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'vidya'; text: string; time: string }[]>([
    {
      sender: 'vidya',
      text: `Namaste! I am Vidya AI Tutor. Ask me any question about "${lectureTitle}" in Hindi, Tamil, Telugu, English or your regional language!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;
    onAddDoubt(doubtInput, doubtLanguage);
    setDoubtInput('');
  };

  const handleAskVidyaAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userQ = aiInput;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAiChatHistory(prev => [...prev, { sender: 'user', text: userQ, time: nowTime }]);
    setAiInput('');
    setAiLoading(true);

    try {
      const langName = REGIONAL_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English';
      const aiAnswer = await ApiService.askVidyaAI(userQ, lectureTitle, subject, langName);
      
      setAiChatHistory(prev => [
        ...prev,
        {
          sender: 'vidya',
          text: aiAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setAiChatHistory(prev => [
        ...prev,
        {
          sender: 'vidya',
          text: 'The concept is based on balancing efficiency against local heat and solar irradiation. Would you like me to break it down further?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      
      {/* Header Tabs */}
      <div className="bg-slate-950 border-b border-slate-800 p-1.5 flex items-center gap-1">
        <button
          id="tab-btn-live-chat"
          onClick={() => setActiveSubTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Live Chat ({messages.length})</span>
        </button>

        <button
          id="tab-btn-doubts"
          onClick={() => setActiveSubTab('doubts')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'doubts'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Priority Doubts ({doubts.length})</span>
        </button>

        <button
          id="tab-btn-vidya-ai"
          onClick={() => setActiveSubTab('ai-tutor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'ai-tutor'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Vidya AI Tutor</span>
        </button>
      </div>

      {/* SUB-TAB 1: LIVE CHAT */}
      {activeSubTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between p-3.5 bg-slate-900/50">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-indigo-300">{msg.senderName}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
                      {msg.collegeName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message as ${selectedCollege.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: PRIORITY DOUBT QUEUE */}
      {activeSubTab === 'doubts' && (
        <div className="flex-1 flex flex-col justify-between p-3.5 bg-slate-900/50">
          
          {/* Post Doubt Form */}
          <form onSubmit={handlePostDoubt} className="bg-slate-950 border border-amber-500/20 rounded-xl p-3 mb-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-2">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Post Doubt to Urban Professor
              </span>
              <select
                value={doubtLanguage}
                onChange={(e) => setDoubtLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded px-1.5 py-0.5"
              >
                {REGIONAL_LANGUAGES.map(l => (
                  <option key={l.code} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={doubtInput}
                onChange={(e) => setDoubtInput(e.target.value)}
                placeholder="Type your question (in English or regional language)..."
                className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition-all cursor-pointer"
              >
                Post
              </button>
            </div>
          </form>

          {/* Doubts List sorted by upvotes */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {doubts.map((doubt) => (
              <div key={doubt.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs text-slate-200">{doubt.studentName}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                        {doubt.collegeName}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto">{doubt.timestamp}</span>
                    </div>
                    <p className="text-xs text-amber-200 font-medium">{doubt.question}</p>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => onUpvoteDoubt(doubt.id)}
                    className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{doubt.upvotes}</span>
                  </button>
                </div>

                {/* Answer Box if answered */}
                {doubt.answer && (
                  <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
                      {doubt.status === 'ai-answered' ? (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span>Vidya AI Tutor Answer:</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{doubt.answeredBy || 'Urban Professor'}:</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-200">{doubt.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: VIDYA AI TUTOR CHATBOT */}
      {activeSubTab === 'ai-tutor' && (
        <div className="flex-1 flex flex-col justify-between p-3.5 bg-slate-900/50">
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {aiChatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {item.sender === 'vidya' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}>
                  <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-semibold">
                    <span>{item.sender === 'user' ? 'You' : 'Vidya AI Tutor'}</span>
                    <span>{item.time}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{item.text}</p>
                </div>
              </div>
            ))}

            {aiLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl w-fit animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Vidya AI is formulating step-by-step answer...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAskVidyaAI} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask Vidya AI any question about this lecture..."
              className="flex-1 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
