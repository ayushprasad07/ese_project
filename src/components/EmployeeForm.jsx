import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom inline SVGs for Employee profiling (No standard library logos or Lucide)
const RegisterIcon = () => (
  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <path d="M9 9h6M9 13h6M9 17h4" />
  </svg>
);

const DeveloperIcon = () => (
  <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const SuccessIcon = () => (
  <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14" />
  </svg>
);

export default function EmployeeForm({ onEmployeeAdded, selectedEmployee, onClearSelection, token }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    experience: 0,
    performanceScore: 50
  });

  const [skills, setSkills] = useState([]);
  const [skillsInput, setSkillsInput] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill details if editing
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || '',
        email: selectedEmployee.email || '',
        department: selectedEmployee.department || 'Engineering',
        experience: selectedEmployee.experience ?? 0,
        performanceScore: selectedEmployee.performanceScore ?? 50
      });
      setSkills(selectedEmployee.skills || []);
      setError('');
      setSuccess('');
    } else {
      clearForm();
    }
  }, [selectedEmployee]);

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      experience: 0,
      performanceScore: 50
    });
    setSkills([]);
    setError('');
  };

  const handleClear = () => {
    clearForm();
    if (onClearSelection) onClearSelection();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillsInput.trim().replace(/,$/, '');
      if (val && !skills.includes(val)) {
        setSkills((prev) => [...prev, val]);
      }
      setSkillsInput('');
    }
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.name || !formData.email) {
      setError('Please fill in Employee Name and Email.');
      setIsSubmitting(false);
      return;
    }

    if (skills.length === 0) {
      setError('Please add at least one core competency skill.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      skills,
      performanceScore: Number(formData.performanceScore),
      experience: Number(formData.experience || 0)
    };

    try {
      const url = selectedEmployee 
        ? `http://localhost:3000/api/employees/${selectedEmployee._id}` 
        : 'http://localhost:3000/api/employees';
      
      const method = selectedEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit employee data.');
      }

      setSuccess(selectedEmployee ? 'Employee updated successfully!' : 'Employee onboarded successfully!');
      
      setTimeout(() => {
        onEmployeeAdded();
        handleClear();
      }, 1000);

    } catch (err) {
      setError(err.message || 'Server connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 h-full flex flex-col min-h-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
      
      {/* Onboarding Header */}
      <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <RegisterIcon />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            {selectedEmployee ? 'Modify Employee Profile' : 'Employee Registration Form'}
          </h2>
        </div>
        {selectedEmployee && (
          <button 
            onClick={handleClear}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold uppercase tracking-wider cursor-pointer border border-blue-500/20 px-2 py-0.5 rounded-md hover:bg-blue-500/5 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0 text-left scrollbar-thin">
        
        {/* Basic Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Employee Name</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <DeveloperIcon />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full bg-black border border-slate-800/80 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
                <EnvelopeIcon />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@company.com"
                className="w-full bg-black border border-slate-800/80 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full bg-black border border-slate-800/80 rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
            >
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="HR & Admin">HR & Admin</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Experience (Yrs)</label>
            <input
              type="number"
              name="experience"
              min="0"
              max="50"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g. 5"
              className="w-full bg-black border border-slate-800/80 rounded-xl py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Skill Tagging */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Skills (Press Enter)</label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onKeyDown={handleSkillsKeyDown}
            placeholder="e.g. React, Node.js, System Design"
            className="w-full bg-black border border-slate-800/80 rounded-xl py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <AnimatePresence>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 text-blue-300 px-2 py-0.5 rounded-md"
                  >
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSkill(index)} className="hover:text-rose-400 transition-colors">
                      <DeleteIcon />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* HR Ratings Slider */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-3.5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-xl rounded-full" />
          
          <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Performance Rating</span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 border border-blue-500/20 rounded-full">
              Score: {formData.performanceScore}%
            </span>
          </div>

          <div className="space-y-1 pt-1.5">
            <div className="flex justify-between text-[9px] font-medium text-slate-400">
              <span>Set Performance Score (0 - 100)</span>
              <span className="text-blue-400">{formData.performanceScore}%</span>
            </div>
            <input
              type="range"
              name="performanceScore"
              min="0"
              max="100"
              step="1"
              value={formData.performanceScore}
              onChange={(e) => setFormData((prev) => ({ ...prev, performanceScore: Number(e.target.value) }))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Alerts Block */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl overflow-hidden"
            >
              <ErrorIcon />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl overflow-hidden"
            >
              <SuccessIcon />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-blue-950/20 border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-4"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          ) : (
            <PlusIcon />
          )}
          <span>{isSubmitting ? 'Submitting Record...' : selectedEmployee ? 'Apply Record Changes' : 'Register Employee Profile'}</span>
        </button>
      </form>
    </div>
  );
}
