import React from 'react';
import { 
  BarChart3, 
  HardDrive, 
  Users, 
  TrendingUp, 
  Globe, 
  Award, 
  Download, 
  Zap, 
  Building2, 
  PieChart, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { College } from '../types';

interface AnalyticsViewProps {
  colleges: College[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ colleges }) => {
  const ruralColleges = colleges.filter(c => c.type === 'rural-partner');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Learning & Low-Bandwidth Network Analytics</span>
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Government of Rajasthan SIH Dashboard
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry tracking mobile internet savings, rural student attendance, doubt topic heatmaps, and regional caption usage.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading full SIH25101 Impact Analytics PDF Report...")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Impact PDF Report</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mobile Data Saved</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">84.2 GB</div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> 88% reduction vs 720p stream
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rural Attendance Rate</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">92.4%</div>
          <p className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28% vs traditional video calls
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Regional Caption Usage</span>
            <Globe className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">76.8%</div>
          <p className="text-[11px] text-amber-300 font-semibold">
            Hindi & Tamil top languages
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Doubts Resolved</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,420</div>
          <p className="text-[11px] text-emerald-400 font-semibold">
            By Vidya AI & Urban Professors
          </p>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Rural College Attendance Comparison */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Rural Partner Campus Attendance & Bandwidth Efficiency</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Rajasthan District Nodes</span>
          </h2>

          <div className="space-y-4">
            {ruralColleges.map((c, i) => {
              const attendancePerc = [94, 91, 88, 92][i % 4];
              return (
                <div key={c.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{c.name} ({c.district})</span>
                    <span className="font-bold text-emerald-400 font-mono">{attendancePerc}% Attendance ({c.studentCount} students)</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${attendancePerc}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Avg Connectivity: {c.avgBandwidthKbps} Kbps</span>
                    <span>Saved ~{(c.studentCount * 0.18).toFixed(1)} GB Data</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Doubt Topic Heatmap & Regional Languages */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Doubt Topic Heatmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <PieChart className="w-4 h-4 text-amber-400" />
              <span>Student Doubt Topic Heatmap</span>
            </h2>

            <div className="space-y-2.5">
              {[
                { topic: 'Battery Capacity & Autonomy Sizing', perc: 38, color: 'bg-amber-500' },
                { topic: 'PV Open-Circuit Voltage Heat Loss', perc: 29, color: 'bg-indigo-500' },
                { topic: 'Microgrid Inverter Phase Balancing', perc: 21, color: 'bg-emerald-500' },
                { topic: 'Off-grid Charge Controller Wiring', perc: 12, color: 'bg-blue-500' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">{item.topic}</span>
                    <span className="font-bold text-slate-300 font-mono">{item.perc}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.perc}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Languages Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Regional Subtitle Preferred Languages</span>
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Hindi (हिंदी)</p>
                <p className="text-lg font-bold text-emerald-400 font-mono">52%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Tamil (தமிழ்)</p>
                <p className="text-lg font-bold text-indigo-400 font-mono">18%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Telugu (తెలుగు)</p>
                <p className="text-lg font-bold text-amber-400 font-mono">14%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[10px]">Gujarati / Marathi / Others</p>
                <p className="text-lg font-bold text-rose-400 font-mono">16%</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
