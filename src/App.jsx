import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom inline SVGs for professional MERN Performance Dashboard (No standard library sparkles/logos)
const MatchProLogo = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-5" />
  </svg>
);

const SyncIcon = ({ className }) => (
  <svg className={`w-3.5 h-3.5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.72 2.73L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const DatabaseCheckIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l7-2a1 1 0 0 1 .48 0l7 2A1 1 0 0 1 20 6v7z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const DatabaseAlertIcon = () => (
  <svg className="w-3.5 h-3.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l7-2a1 1 0 0 1 .48 0l7 2A1 1 0 0 1 20 6v7z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const StatsDbIcon = () => (
  <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const DirectoryAvatarsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MatchMatrixIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const SearchFilterIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ListEmptyGraphic = () => (
  <svg className="w-10 h-10 text-slate-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h10" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

// Import HR components
import AuthSection from './components/AuthSection';
import EmployeeForm from './components/EmployeeForm';
import EmployeeCard from './components/EmployeeCard';
import PerformanceAnalytics from './components/PerformanceAnalytics';

export default function App() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // App core state
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState('directory'); // 'directory' | 'matching'
  
  // Selection states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeForAi, setSelectedEmployeeForAi] = useState(null);

  // Server diagnostics status
  const [backendOnline, setBackendOnline] = useState(false);
  const [checkingServer, setCheckingServer] = useState(true);

  // Sync token and user in localStorage
  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setEmployees([]);
    setSelectedEmployee(null);
    setSelectedEmployeeForAi(null);
  };

  // Fetch employees from MERN backend
  const fetchEmployees = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.status === 401) {
        // Token expired/invalid - logout automatically
        handleLogout();
        return;
      }

      if (data.success) {
        setEmployees(data.employees);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch (err) {
      console.error('Failed to fetch employee roster:', err);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Check server health
  const checkServerStatus = async () => {
    setCheckingServer(true);
    try {
      const res = await fetch('http://localhost:3000/');
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch (err) {
      setBackendOnline(false);
    } finally {
      setCheckingServer(false);
    }
  };

  // Initial checks
  useEffect(() => {
    checkServerStatus();
  }, []);

  // Fetch directory when authenticated
  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token]);

  // Employee removal endpoint handler
  const handleEmployeeDelete = async (id) => {
    if (!window.confirm('Are you sure you want to offboard this employee? This action is permanent.')) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        fetchEmployees();
        if (selectedEmployee?._id === id) setSelectedEmployee(null);
        if (selectedEmployeeForAi?._id === id) setSelectedEmployeeForAi(null);
      } else {
        alert(data.message || 'Failed to offboard employee.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to connect to backend.');
    }
  };

  // Triggering edits prefill
  const handleEmployeeEditSelect = (emp) => {
    setSelectedEmployee(emp);
  };

  // Quick launch AI Consulting evaluations from card buttons
  const handleEmployeeAiSelect = (emp) => {
    setSelectedEmployeeForAi(emp);
    setActiveWorkspace('matching');
  };

  // Client side metrics aggregates calculation
  const totalCount = employees.length;
  
  const averagePerformance = totalCount > 0
    ? Math.round(employees.reduce((sum, e) => sum + (e.performanceScore ?? e.overallScore ?? 0), 0) / totalCount)
    : 0;

  const skillSet = new Set();
  employees.forEach(emp => {
    if (emp.skills) emp.skills.forEach(s => skillSet.add(s.trim().toLowerCase()));
  });
  const uniqueSkillsCount = skillSet.size;

  // Search filter query logic (matches Name, Email, Department, or Skill Tags)
  const filteredEmployees = employees.filter(emp => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      (emp.skills && emp.skills.some(s => s.toLowerCase().includes(q)))
    );
  });

  // If not authenticated, force Auth panel screen
  if (!token) {
    return <AuthSection onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="h-screen overflow-hidden text-slate-100 flex flex-col font-sans select-none bg-[#090d16]">
      
      {/* Decorative Glow Elements */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.03] blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="glass-panel border-x-0 border-t-0 sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <MatchProLogo />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold tracking-tight text-white m-0 leading-tight">
                MatchPro <span className="text-gradient">HR AI</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Employee Performance & Talent Consulting
              </p>
            </div>
          </div>

          {/* Sync status, logged user, & sign out */}
          <div className="flex items-center gap-4">
            {/* Sync trigger */}
            <button
              onClick={() => { checkServerStatus(); fetchEmployees(); }}
              className="p-2 bg-black hover:bg-blue-950/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all active:scale-95 duration-200 border border-slate-800/50 hover:border-blue-500/30 cursor-pointer"
              title="Synchronize Database Records"
            >
              <SyncIcon className={loading ? 'animate-spin text-blue-400' : ''} />
            </button>
            
            {/* Server Online/Offline Indicator */}
            {checkingServer ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800/50 text-[10px] text-slate-400 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                <span>Checking API...</span>
              </div>
            ) : backendOnline ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-400 font-semibold shadow-md shadow-emerald-500/2">
                <DatabaseCheckIcon />
                <span>Database Synced</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-[10px] text-rose-400 font-semibold shadow-md shadow-rose-500/2">
                <DatabaseAlertIcon />
                <span>Offline Mode</span>
              </div>
            )}

            {/* Signed User Avatar pill */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-900">
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-bold text-white block leading-none">{user?.username || 'HR Admin'}</span>
                <span className="text-[8px] text-slate-500 block mt-0.5">{user?.email || 'Administrator'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-rose-950/20 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                title="Log Out Session"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER (Col-locked Sidebars) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-hidden min-h-0 flex flex-col xl:grid xl:grid-cols-12 gap-4">
        
        {/* Left Side: Onboarding form & Stats sidebar (Col-4) */}
        <div className="xl:col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden h-[40%] xl:h-full shrink-0">
          
          {/* Employee Form (Onboards / Edits) */}
          <div className="flex-1 min-h-0">
            <EmployeeForm 
              onEmployeeAdded={fetchEmployees}
              selectedEmployee={selectedEmployee}
              onClearSelection={() => setSelectedEmployee(null)}
              token={token}
            />
          </div>

          {/* HR Talent Database Stats Card */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 shrink-0 bg-slate-950/30">
            <div className="flex items-center gap-2 mb-3.5">
              <StatsDbIcon />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HR Records Summary</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/55 border border-slate-900 rounded-xl p-2.5 text-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Staff Size</span>
                <span className="text-base font-bold text-white block mt-0.5">{totalCount}</span>
              </div>
              <div className="bg-black/55 border border-slate-900 rounded-xl p-2.5 text-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Avg Rating</span>
                <span className="text-base font-bold text-blue-400 block mt-0.5">{averagePerformance}%</span>
              </div>
              <div className="bg-black/55 border border-slate-900 rounded-xl p-2.5 text-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Skills Matrix</span>
                <span className="text-base font-bold text-cyan-400 block mt-0.5">{uniqueSkillsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive workspaces (Col-8) */}
        <div className="xl:col-span-8 flex flex-col gap-4 min-h-0 overflow-hidden h-[60%] xl:h-full">
          
          {/* Workspace Tabs Navigator */}
          <div className="flex justify-between items-center bg-slate-950/40 glass-panel p-1.5 rounded-2xl shrink-0 border border-slate-900">
            <div className="flex gap-1 w-full md:w-auto">
              <button
                onClick={() => setActiveWorkspace('directory')}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeWorkspace === 'directory'
                    ? 'bg-black border border-blue-500/40 text-blue-400 shadow-md shadow-blue-500/5'
                    : 'border border-transparent text-slate-500 hover:text-blue-400 hover:bg-black/40'
                }`}
              >
                <DirectoryAvatarsIcon />
                <span>Employee Directory</span>
              </button>

              <button
                onClick={() => setActiveWorkspace('matching')}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeWorkspace === 'matching'
                    ? 'bg-black border border-blue-500/40 text-blue-400 shadow-md shadow-blue-500/5'
                    : 'border border-transparent text-slate-500 hover:text-blue-400 hover:bg-black/40'
                }`}
              >
                <MatchMatrixIcon />
                <span>AI Consult & Leaderboards</span>
              </button>
            </div>

            {/* Quick search input (only active when in Directory tab) */}
            {activeWorkspace === 'directory' && (
              <div className="relative hidden md:block w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                  <SearchFilterIcon />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by name, skills, role..."
                  className="w-full bg-black border border-slate-900 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>
            )}
          </div>

          {/* Active workspace rendering */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              
              {/* Directory Workspace */}
              {activeWorkspace === 'directory' && (
                <motion.div
                  key="directory"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col min-h-0 overflow-hidden"
                >
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Retrieving HR directory...</p>
                    </div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-900 rounded-3xl p-8 bg-slate-950/10">
                      <ListEmptyGraphic />
                      <h4 className="text-sm font-bold text-slate-400">No Employees Found</h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xs text-center leading-relaxed">
                        {searchTerm 
                          ? `No records match the search term "${searchTerm}". Try refinement.` 
                          : 'No staff profiles onboarded yet. Get started by typing details in the left form sidebar.'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                      {filteredEmployees.map(emp => (
                        <div key={emp._id} className="h-fit">
                          <EmployeeCard 
                            employee={emp}
                            onEdit={handleEmployeeEditSelect}
                            onDelete={handleEmployeeDelete}
                            onAiConsult={handleEmployeeAiSelect}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Match & AI Leaderboard Workspace */}
              {activeWorkspace === 'matching' && (
                <motion.div
                  key="matching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <PerformanceAnalytics 
                    employees={employees}
                    selectedEmployeeForAi={selectedEmployeeForAi}
                    onClearAiSelection={() => setSelectedEmployeeForAi(null)}
                    token={token}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </main>

    </div>
  );
}
