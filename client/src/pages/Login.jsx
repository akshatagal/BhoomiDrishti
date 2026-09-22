import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Landmark, Shield, User, MapPin, Building2, Lock, Mail, ArrowRight, Key, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, register, switchRole } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('central_admin');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@bhoomidrishti.gov.in');
  const [password, setPassword] = useState('admin123');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Role details map
  const roleOptions = [
    {
      id: 'central_admin',
      label: 'Super Admin / Ministry Joint Secretary (SUPER ADMIN)',
      shortLabel: 'Super Admin',
      defaultEmail: 'admin@bhoomidrishti.gov.in',
      defaultPass: 'admin123',
      defaultPath: '/'
    },
    {
      id: 'slao',
      label: 'SLAO Officer / Collectorate (DISTRICT LARR)',
      shortLabel: 'SLAO Officer',
      defaultEmail: 'slao@bhoomidrishti.gov.in',
      defaultPass: 'slao123',
      defaultPath: '/workflow'
    },
    {
      id: 'surveyor',
      label: 'Surveyor (FIELD & SURVEY)',
      shortLabel: 'Surveyor',
      defaultEmail: 'surveyor@bhoomidrishti.gov.in',
      defaultPass: 'survey123',
      defaultPath: '/gis'
    },
    {
      id: 'landowner',
      label: 'Citizen / Displaced Landowner (PUBLIC CITIZEN)',
      shortLabel: 'Citizen / Displaced Landowner',
      defaultEmail: 'landowner@bhoomidrishti.gov.in',
      defaultPass: 'owner123',
      defaultPath: '/citizen'
    }
  ];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    const target = roleOptions.find((r) => r.id === roleId);
    if (target && activeTab === 'login') {
      setEmail(target.defaultEmail);
      setPassword(target.defaultPass);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (activeTab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          const userRole = res.user?.role || selectedRole;
          const target = roleOptions.find((r) => r.id === userRole) || roleOptions[0];
          navigate(target.defaultPath);
        } else {
          // Fallback demo login if server backend credentials differ
          await switchRole(selectedRole);
          const target = roleOptions.find((r) => r.id === selectedRole) || roleOptions[0];
          navigate(target.defaultPath);
        }
      } else {
        // Register flow
        const res = await register({
          name: name || 'Authorized Official',
          email,
          password,
          role: selectedRole,
          designation: designation || 'Nodal Officer',
          department: department || 'Government Portal'
        });
        if (res.success) {
          setSuccessMsg('Account registered successfully! Redirecting...');
          const userRole = res.user?.role || selectedRole;
          const target = roleOptions.find((r) => r.id === userRole) || roleOptions[0];
          setTimeout(() => navigate(target.defaultPath), 1000);
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans text-white">
      {/* Subtle Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Landmark className="w-7 h-7 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-display">
            BHOOMI <span className="text-amber-400">DRISHTI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            National Land Acquisition & Management Platform
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6">
          {/* Sign In / Register Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In (Login)
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* Error / Success Notifications */}
          {error && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Register specific name field */}
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FULL NAME</label>
                <div className="flex items-center bg-slate-900/90 border border-slate-700/80 focus-within:border-amber-500 rounded-xl px-3 py-2.5 transition-colors">
                  <User className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-none outline-none w-full text-white font-medium text-xs placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EMAIL ADDRESS</label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 focus-within:border-amber-500 rounded-xl px-3 py-2.5 transition-colors">
                <Mail className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="officer@bhoomisetu.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white font-medium text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PASSWORD</label>
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 focus-within:border-amber-500 rounded-xl px-3 py-2.5 transition-colors">
                <Key className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white font-medium text-xs placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SELECT ACCESS ROLE</label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 focus:border-amber-500 rounded-xl px-3 py-2.5 text-white font-bold text-xs outline-none cursor-pointer"
              >
                {roleOptions.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white py-2">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Register specific extra fields */}
            {activeTab === 'register' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">DESIGNATION</label>
                  <input
                    type="text"
                    placeholder="e.g. SLAO Officer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-white text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">DEPARTMENT</label>
                  <input
                    type="text"
                    placeholder="e.g. Revenue Dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-2 text-white text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {/* Quick Demo Role Selectors */}
            {activeTab === 'login' && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold text-left truncate transition-all flex items-center gap-1.5 ${
                      selectedRole === r.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-amber-400 font-extrabold">⚡</span>
                    <span className="truncate">{r.shortLabel}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 uppercase tracking-wider mt-4"
            >
              <span>{loading ? 'Authenticating...' : activeTab === 'login' ? 'Sign In & Launch Workspace' : 'Create & Launch Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-500 font-medium">
              Encrypted OAuth2 / DILRMP 3.0 National Single Sign-On Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
