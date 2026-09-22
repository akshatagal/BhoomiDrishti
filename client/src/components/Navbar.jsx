import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Landmark, 
  Bell, 
  LogOut, 
  Map, 
  GitMerge, 
  Calculator, 
  CreditCard, 
  AlertTriangle, 
  UserCheck, 
  ChevronDown, 
  Shield, 
  Palette,
  Users,
  Navigation,
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, activeThemeObj, themes } = useTheme();
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const role = user?.role || 'landowner';

  // Navigation Items defined with strict role permissions
  const allNavItems = [
    { to: '/', label: 'National Dashboard', icon: LayoutDashboard, roles: ['central_admin'] },
    { to: '/workflow', label: '11-Stage LARR Workflow', icon: GitMerge, roles: ['central_admin', 'slao'] },
    { to: '/gis', label: 'GIS Cadastral Studio', icon: Map, roles: ['central_admin', 'slao', 'surveyor'] },
    { to: '/calculator', label: 'LARR Compensation Calc', icon: Calculator, roles: ['central_admin', 'slao'] },
    { to: '/dbt', label: 'DBT & PFMS Ledger', icon: CreditCard, roles: ['central_admin', 'slao'] },
    { to: '/disputes', label: 'Disputes & Risk Radar', icon: AlertTriangle, roles: ['central_admin', 'slao', 'surveyor', 'landowner'] },
    { to: '/citizen', label: 'Citizen Transparency Portal', icon: UserCheck, roles: ['landowner', 'central_admin'] },
  ];

  // Filter allowed navigation items for current role
  const allowedNavItems = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
      {/* Upper Header Tier */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-slate-100">
        {/* Left Branding - Project Name & Tagline */}
        <div className="flex items-center gap-3">
          <Link to={role === 'landowner' ? '/citizen' : role === 'surveyor' ? '/gis' : role === 'slao' ? '/workflow' : '/'} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display">
                  BHOOMI <span className="text-amber-600">DRISHTI</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-800 border border-amber-500/40 uppercase tracking-wider">
                  {role === 'central_admin' ? 'CENTRAL ADMIN' : role === 'slao' ? 'SLAO OFFICER' : role === 'surveyor' ? 'FIELD INSPECTOR' : 'LANDOWNER'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 font-bold italic tracking-wide">
                "Visioning Transparent, Real-Time & Equitable Land Governance for India's Infrastructure"
              </p>
            </div>
          </Link>
        </div>

        {/* Right Quick Actions & Profile */}
        <div className="flex items-center gap-3 text-xs">
          {/* Theme Switcher Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-300 hover:bg-amber-100 transition-all shadow-xs group"
              title="Change Visual Theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
              <span>🎨 Theme Switcher</span>
              <ChevronDown className="w-3 h-3 text-amber-700" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black tracking-wider text-slate-400 uppercase border-b border-slate-100">
                  Select Visual Preset
                </div>
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                      theme === t.id
                        ? 'bg-amber-50 text-amber-950 font-black border-l-4 border-amber-500'
                        : 'hover:bg-slate-50 text-slate-700 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{t.icon}</span>
                      <div>
                        <div className="text-xs">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{t.description}</div>
                      </div>
                    </div>
                    {theme === t.id && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* R&R Families Button - Only for authorized roles */}
          {(role === 'central_admin' || role === 'slao') && (
            <button
              onClick={() => navigate('/workflow')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200 hover:bg-purple-100 transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>R&R Families</span>
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200">
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile Info */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-black flex items-center justify-center text-sm shadow-md border-2 border-amber-500">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-black text-slate-900 leading-tight">{user.name}</div>
                <div className="text-[10px] text-amber-700 font-bold capitalize">{user.designation || user.role}</div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lower Horizontal Navigation Bar Tier - ONLY Show Allowed Items */}
      <div className="px-6 py-2 flex items-center justify-between bg-white text-xs font-semibold overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-600'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right Ledger Pill - Only for authorized roles */}
        {(role === 'central_admin' || role === 'slao') && (
          <div className="hidden lg:flex items-center">
            <NavLink
              to="/dbt"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ledger</span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
