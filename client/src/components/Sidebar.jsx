import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  GitMerge, 
  Map, 
  Calculator, 
  CreditCard, 
  AlertTriangle, 
  UserCheck, 
  ShieldCheck,
  Lock
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'central_admin';

  const allNavItems = [
    { to: '/', label: 'National Dashboard', icon: LayoutDashboard, badge: 'Live', roles: ['central_admin'] },
    { to: '/workflow', label: '11-Stage LARR Workflow', icon: GitMerge, badge: 'LARR 2013', roles: ['central_admin', 'slao', 'surveyor'] },
    { to: '/gis', label: 'GIS Cadastral Studio', icon: Map, badge: 'DGPS', roles: ['central_admin', 'slao', 'surveyor'] },
    { to: '/calculator', label: 'LARR Compensation Calc', icon: Calculator, badge: 'Solatium', roles: ['central_admin', 'slao'] },
    { to: '/dbt', label: 'DBT & PFMS Ledger', icon: CreditCard, badge: 'Disbursal', roles: ['central_admin', 'slao'] },
    { to: '/disputes', label: 'Disputes & Risk Matrix', icon: AlertTriangle, badge: 'SIH26017', roles: ['central_admin', 'slao', 'surveyor', 'landowner'] },
    { to: '/citizen', label: 'Citizen Transparency Portal', icon: UserCheck, badge: 'Public', roles: ['landowner', 'central_admin'] },
  ];

  // Filter allowed items for the logged-in role
  const allowedNavItems = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] sticky top-[65px] shadow-sm font-sans">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Authorized Modules</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-800 font-mono font-bold text-[9px]">
              {role}
            </span>
          </div>
          <nav className="space-y-1.5">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-semibold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold ${
                          isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Locked Feature Guard Info Box */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Role Access Guard</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            You are logged in as <strong className="text-amber-700 uppercase">{user?.designation || role}</strong>. Non-authorized administrative routes are strictly locked to protect statutory integrity.
          </p>
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-bold text-center">
        BhoomiDrishti v1.0 • SIH 2026
      </div>
    </aside>
  );
};
