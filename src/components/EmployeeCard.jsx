import React from 'react';
import { motion } from 'framer-motion';

// Custom inline SVGs for EmployeeCard (No standard logos or Lucide)
const CardMailIcon = () => (
  <svg className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CardCodeIcon = () => (
  <svg className="w-3 h-3 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4" />
  </svg>
);

const CardEditIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const CardTrashIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CardAiConsultIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export default function EmployeeCard({ employee, onEdit, onDelete, onAiConsult }) {
  const { name, email, department, skills, experience } = employee;

  // Enforce fallback check for performanceScore
  const scoreVal = employee.performanceScore ?? employee.overallScore ?? 0;

  // Score levels logic
  let rankLabel = 'Developing Team Member';
  let rankStyles = 'bg-slate-900/40 text-slate-400 border-slate-800/80';
  let scoreColor = 'stroke-blue-500';

  if (scoreVal >= 85) {
    rankLabel = 'Elite Performer';
    rankStyles = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    scoreColor = 'stroke-cyan-400';
  } else if (scoreVal >= 70) {
    rankLabel = 'Strong Team Core';
    rankStyles = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    scoreColor = 'stroke-blue-400';
  }

  // Radial SVG Arc calculations for progress circle
  const radius = 18;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreVal / 100) * circumference;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass-panel glass-panel-hover rounded-2xl p-5 transition-all duration-300 relative group flex flex-col justify-between h-full border border-slate-900/80"
    >
      {/* Top Brand Edge Flare */}
      <div className={`absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl bg-gradient-to-r ${scoreVal >= 85 ? 'from-cyan-500 via-blue-500 to-cyan-600' : 'from-blue-600 via-cyan-600 to-blue-700'} opacity-75 group-hover:opacity-100 transition-opacity`} />

      <div>
        {/* Header: Name, Department, and Circular SVG Gauge */}
        <div className="flex justify-between items-start gap-3 mb-3 text-left">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors duration-200 truncate">
                {name}
              </h3>
              <span className={`text-[8px] px-2 py-0.5 rounded-full border font-bold tracking-wide uppercase shrink-0 ${rankStyles}`}>
                {department}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[9px] text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 border border-cyan-500/20 rounded-md shrink-0">
                {experience || 0} Yrs Experience
              </span>
            </div>

            <a
              href={`mailto:${email}`}
              className="text-[9px] text-slate-500 hover:text-blue-400 flex items-center gap-1 mt-1.5 transition-colors w-fit truncate"
            >
              <CardMailIcon />
              {email}
            </a>
          </div>

          {/* SVG Score Circle */}
          <div className="relative flex items-center justify-center shrink-0 w-11 h-11" title={`Performance Score: ${scoreVal}%`}>
            <svg className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Dynamic filled score circle */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className={`${scoreColor} transition-all duration-500`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white leading-none">
              {scoreVal}
            </span>
          </div>
        </div>

        {/* Dynamic Skill Badges */}
        {skills && skills.length > 0 && (
          <div className="mb-4 text-left mt-3.5">
            <div className="flex items-center gap-1 text-slate-500 text-[9px] font-bold mb-1.5 uppercase tracking-wider">
              <CardCodeIcon />
              <span>Core Competencies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[9px] bg-slate-900 border border-slate-800/80 text-blue-300 px-2 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="text-[8px] text-slate-500 font-bold px-1 py-0.5">+{skills.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Menu */}
      <div className="border-t border-slate-900/80 pt-3 mt-auto">
        <div className="flex justify-end gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(employee)}
            className="p-1.5 bg-black hover:bg-blue-950/20 text-slate-400 hover:text-blue-400 border border-slate-800/80 hover:border-blue-500/30 rounded-lg transition-all active:scale-90 cursor-pointer"
            title="Edit Profile & Metrics"
          >
            <CardEditIcon />
          </button>
          <button
            onClick={() => onAiConsult(employee)}
            className="p-1.5 bg-black hover:bg-cyan-950/20 text-slate-400 hover:text-cyan-400 border border-slate-800/80 hover:border-cyan-500/30 rounded-lg transition-all active:scale-90 cursor-pointer"
            title="Generate AI Review & Promotion Report"
          >
            <CardAiConsultIcon />
          </button>
          <button
            onClick={() => onDelete(employee._id)}
            className="p-1.5 bg-black hover:bg-rose-950/20 text-slate-500 hover:text-rose-400 border border-slate-800/80 hover:border-rose-500/20 rounded-lg transition-all active:scale-90 cursor-pointer"
            title="Offboard Employee"
          >
            <CardTrashIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
