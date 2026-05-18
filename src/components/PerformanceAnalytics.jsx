import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom inline SVGs for PerformanceAnalytics (No standard logos or Lucide)
const TrophyIcon = () => (
  <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a4 4 0 0 1 4 4v6H8V6a4 4 0 0 1 4-4Z" />
  </svg>
);

const DepartmentIcon = () => (
  <svg className="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M12 5v14M12 12h9M3 12h9" />
  </svg>
);

const LeaderboardIcon = () => (
  <svg className="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M3 20h4M3 12h4M12 12h9M3 4h4M12 4h9" />
  </svg>
);

const TerminalIcon = () => (
  <svg className="w-5 h-5 text-cyan-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const BulletChevron = () => (
  <svg className="w-3 h-3 text-cyan-400 shrink-0 inline-block mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function PerformanceAnalytics({ employees, selectedEmployeeForAi, onClearAiSelection, token }) {
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'aiConsult'
  const [analytics, setAnalytics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // AI Consulting state
  const [targetEmployeeId, setTargetEmployeeId] = useState('');
  const [aiReport, setAiReport] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Fetch stats and leaderboard
  const fetchAnalytics = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('https://ese-project-1.onrender.com/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.stats);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [employees]);

  // Handle direct navigation to AI Consulting if card clicked
  useEffect(() => {
    if (selectedEmployeeForAi) {
      setTargetEmployeeId(selectedEmployeeForAi._id);
      setActiveTab('aiConsult');
      setAiReport('');
      setAiError('');
    }
  }, [selectedEmployeeForAi]);

  const handleClearAi = () => {
    setTargetEmployeeId('');
    setAiReport('');
    setAiError('');
    if (onClearAiSelection) onClearAiSelection();
  };

  const generateAiRecommendation = async () => {
    if (!targetEmployeeId) return;
    setLoadingAi(true);
    setAiError('');
    setAiReport('');

    try {
      const response = await fetch(`https://ese-project-1.onrender.com/api/ai-recommendation/${targetEmployeeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'AI generation failed.');
      }

      setAiReport(data.recommendation);
    } catch (err) {
      setAiError(err.message || 'Failed to call Gemini AI.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Custom regex-based Markdown-to-HTML parser matching design specifications
  const parseMarkdown = (text) => {
    if (!text) return '';
    let html = text;

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-white font-bold text-xs uppercase tracking-wide mt-4 mb-2 flex items-center border-l-2 border-cyan-500 pl-2">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-white font-bold text-sm uppercase tracking-wider mt-5 mb-2.5 flex items-center border-l-2 border-blue-500 pl-2">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-white font-bold text-base uppercase tracking-widest mt-6 mb-3">$1</h2>');

    // Bold text highlights
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300 font-bold">$1</strong>');

    // Bullet Lists
    html = html.replace(/^\s*[-*+]\s+(.*$)/gim, '<li class="text-[11px] text-slate-300 mb-1.5 ml-2 list-none flex items-start gap-1"><span class="text-cyan-400 font-bold shrink-0 mt-0.5">•</span> <span>$1</span></li>');

    // Horizontal Rules
    html = html.replace(/^\s*---(.*$)/gim, '<hr class="border-slate-800 my-4" />');

    // Paragraph wrapping for rest lines
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<hr')) {
        return line;
      }
      return `<p class="text-[11px] text-slate-300 leading-relaxed mb-2.5">${line}</p>`;
    }).join('\n');

    return html;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 h-full flex flex-col min-h-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full" />
      
      {/* Workspace Tabs */}
      <div className="flex gap-2 bg-slate-950/40 p-1 rounded-xl mb-4 shrink-0 border border-slate-900 w-fit">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-black border border-blue-500/30 text-blue-400 shadow-md shadow-blue-500/5'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          <LeaderboardIcon />
          <span>Performance Rankings</span>
        </button>

        <button
          onClick={() => setActiveTab('aiConsult')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'aiConsult'
              ? 'bg-black border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-500/5'
              : 'text-slate-500 hover:text-slate-300 border border-transparent'
          }`}
        >
          <BrainIcon />
          <span>AI consultant</span>
        </button>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 min-h-0 overflow-hidden h-full flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* Tab 1: Leaderboard & Aggregations */}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-h-0 overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-5"
            >
              
              {/* Leaderboard Table (Col-8) */}
              <div className="md:col-span-8 flex flex-col min-h-0 overflow-hidden bg-slate-950/20 border border-slate-900 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3 shrink-0">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrophyIcon />
                    Employee Performance Rankings (Top 10)
                  </h3>
                </div>

                {loadingStats ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Compiling rankings...</p>
                  </div>
                ) : !analytics || analytics.leaderboard.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 border border-dashed border-slate-900 rounded-xl">
                    <LeaderboardIcon />
                    <p className="text-xs text-slate-500 mt-2">No employee performance data logged yet.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-2.5">
                    {analytics.leaderboard.map((emp, index) => (
                      <div 
                        key={emp.id} 
                        className="bg-black/50 border border-slate-900 rounded-xl p-3 flex items-center justify-between gap-4 hover:border-blue-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Rank Icon */}
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                            index === 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            index === 1 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' :
                            index === 2 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-slate-900/60 text-slate-500 border border-slate-800'
                          }`}>
                            {index === 0 ? '★' : index + 1}
                          </div>
                          
                          <div className="min-w-0 text-left">
                            <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">{emp.name}</h4>
                            <p className="text-[9px] text-slate-500 truncate mt-0.5">{emp.department} • <span className="text-slate-400">{emp.experience} Yrs Exp</span></p>
                          </div>
                        </div>

                        {/* Ratings Bar */}
                        <div className="flex items-center gap-4 shrink-0">
                          {/* Overall Score Progress Bar */}
                          <div className="w-20 text-right">
                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 mb-1">
                              <span>SCORE</span>
                              <span className={(emp.performanceScore ?? emp.overallScore ?? 0) >= 85 ? 'text-cyan-400' : 'text-blue-400'}>{(emp.performanceScore ?? emp.overallScore ?? 0)}%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${(emp.performanceScore ?? emp.overallScore ?? 0) >= 85 ? 'bg-cyan-500' : 'bg-blue-500'}`}
                                style={{ width: `${(emp.performanceScore ?? emp.overallScore ?? 0)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Department break (Col-4) */}
              <div className="md:col-span-4 flex flex-col min-h-0 overflow-hidden bg-slate-950/20 border border-slate-900 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 shrink-0">
                  <DepartmentIcon />
                  Department Breakdowns
                </h3>

                {loadingStats ? (
                  <div className="flex-1 flex items-center justify-center py-20">
                    <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : !analytics || analytics.departmentBreakdown.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <p className="text-[10px] text-slate-600 uppercase">Awaiting details...</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-4">
                    {analytics.departmentBreakdown.map((dept, index) => (
                      <div key={index} className="space-y-1.5 text-left border-b border-slate-900/50 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-200">{dept.department}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md shrink-0">
                            {dept.employeeCount} staff
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" 
                              style={{ width: `${dept.avgScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-blue-400 shrink-0 w-8 text-right">
                            {dept.avgScore}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 2: AI HR Consultant Recommendations */}
          {activeTab === 'aiConsult' && (
            <motion.div
              key="ai-consult-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4 text-left"
            >
              {/* Employee AI trigger panel */}
              <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <div className="w-9 h-9 rounded-xl bg-black border border-cyan-500/30 flex items-center justify-center shadow-md shadow-cyan-500/5 shrink-0">
                    <BrainIcon />
                  </div>
                  
                  <div className="w-full sm:w-64">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Employee for Review</label>
                    <select
                      value={targetEmployeeId}
                      onChange={(e) => {
                        setTargetEmployeeId(e.target.value);
                        setAiReport('');
                        setAiError('');
                      }}
                      className="w-full bg-black border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                    >
                      <option value="">-- Choose Employee --</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.department} • Rating: {emp.performanceScore ?? emp.overallScore ?? 0}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {targetEmployeeId && (
                    <button
                      onClick={handleClearAi}
                      className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-black text-slate-400 hover:text-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear selection
                    </button>
                  )}
                  
                  <button
                    onClick={generateAiRecommendation}
                    disabled={!targetEmployeeId || loadingAi}
                    className="flex-1 sm:flex-none px-6 py-2 bg-black hover:bg-cyan-950/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Generate AI Recommendation Report
                  </button>
                </div>
              </div>

              {/* AI Report Card viewport */}
              <div className="flex-1 bg-slate-950/30 border border-slate-900 rounded-3xl p-5 relative overflow-hidden min-h-0 flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
                
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <TerminalIcon />
                    Gemini Performance Consultant Console
                  </span>
                  {aiReport && (
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full shrink-0">
                      Report Compiled
                    </span>
                  )}
                </div>

                {/* Report pane viewport */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin min-h-0">
                  <AnimatePresence mode="wait">
                    {loadingAi ? (
                      <motion.div
                        key="ai-loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center py-20 text-center"
                      >
                        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                        <h4 className="font-semibold text-xs text-cyan-400 uppercase tracking-widest animate-pulse">Running AI Synthesis...</h4>
                        <p className="text-[10px] text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                          Gemini is examining performance indexes, manager ratings, and skill matrices to construct career advancement suitability reports.
                        </p>
                      </motion.div>
                    ) : aiError ? (
                      <motion.div
                        key="ai-error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center py-10"
                      >
                        <svg className="w-8 h-8 text-rose-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <h4 className="font-semibold text-xs text-rose-400 uppercase tracking-wide">Analysis Blocked</h4>
                        <p className="text-[10px] text-slate-500 max-w-sm mt-1">{aiError}</p>
                      </motion.div>
                    ) : aiReport ? (
                      <motion.div
                        key="ai-report-html"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 max-w-3xl"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(aiReport) }}
                      />
                    ) : (
                      <motion.div
                        key="ai-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center py-20 border border-dashed border-slate-900/60 rounded-2xl"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-600 mb-3.5">
                          <TerminalIcon />
                        </div>
                        <h4 className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Awaiting Evaluation Instruction</h4>
                        <p className="text-[10px] text-slate-600 mt-1 max-w-xs leading-relaxed">
                          Select an employee and click "Generate AI Recommendation" above to compute promotions eligibility and training path matrices.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
