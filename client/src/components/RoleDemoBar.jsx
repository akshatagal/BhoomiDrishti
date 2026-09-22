import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Building2, User } from 'lucide-react';

export const RoleDemoBar = () => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { 
      key: 'central_admin', 
      label: 'Central Ministry Admin', 
      icon: Building2, 
      badge: 'MoRD / NHAI', 
      color: 'bg-emerald-600 text-white',
      defaultPath: '/'
    },
    { 
      key: 'slao', 
      label: 'SLAO Officer (District)', 
      icon: Shield, 
      badge: 'Section 3G Award', 
      color: 'bg-amber-500 text-slate-950 font-bold',
      defaultPath: '/workflow'
    },
    { 
      key: 'surveyor', 
      label: 'Field Surveyor (DGPS)', 
      icon: MapPin, 
      badge: 'GIS Cadastre', 
      color: 'bg-sky-600 text-white',
      defaultPath: '/gis'
    },
    { 
      key: 'landowner', 
      label: 'Citizen Landowner', 
      icon: User, 
      badge: 'Public Portal', 
      color: 'bg-indigo-600 text-white',
      defaultPath: '/citizen'
    }
  ];

  const handleRoleClick = async (roleObj) => {
    await switchRole(roleObj.key);
    navigate(roleObj.defaultPath);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md text-white">
      <div className="flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px]">
          SIH 2026 DEMO MODE
        </span>
        <span className="text-slate-300 font-semibold hidden sm:inline">| Switch Persona to Adapt UI & Permissions:</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = user?.role === r.key;
          return (
            <button
              key={r.key}
              onClick={() => handleRoleClick(r)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all font-semibold text-xs ${
                isActive
                  ? `${r.color} ring-2 ring-amber-400 shadow-md scale-105`
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                isActive ? 'bg-black/30 text-white' : 'bg-slate-950 text-slate-300'
              }`}>
                {r.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
