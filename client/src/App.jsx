import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GovernmentTopBar } from './components/GovernmentTopBar';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BhuSathiAiAssistant } from './components/BhuSathiAiAssistant';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';

// Pages
import { Dashboard } from './pages/Dashboard';
import { WorkflowEngine } from './pages/WorkflowEngine';
import { GISStudio } from './pages/GISStudio';
import { LARRCalculator } from './pages/LARRCalculator';
import { DisputesPortal } from './pages/DisputesPortal';
import { DBTLedger } from './pages/DBTLedger';
import { CitizenPortal } from './pages/CitizenPortal';
import { Login } from './pages/Login';

// Strict Role Guard Wrapper
const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const userRole = user?.role || 'landowner';

  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md max-w-lg mx-auto my-12 text-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900">Role Access Restricted</h2>
          <p className="text-xs text-slate-600 font-medium">
            Your current logged-in role (<strong className="text-amber-700 uppercase">{user?.designation || userRole}</strong>) does not have authorization to access this administrative module.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={userRole === 'landowner' ? '/citizen' : userRole === 'surveyor' ? '/gis' : userRole === 'slao' ? '/workflow' : '/'}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Authorized Workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

// Smart Root Redirector based on user role
const RootRedirector = () => {
  const { user } = useAuth();
  const role = user?.role || 'landowner';
  
  if (role === 'landowner') return <Navigate to="/citizen" replace />;
  if (role === 'surveyor') return <Navigate to="/gis" replace />;
  if (role === 'slao') return <Navigate to="/workflow" replace />;
  
  return <Dashboard />;
};

const ProtectedLayout = () => {
  const { user } = useAuth();
  const { activeThemeObj } = useTheme();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={`min-h-screen ${activeThemeObj.bgClass} flex flex-col font-sans transition-colors duration-200`}>
      <GovernmentTopBar />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 p-4 md:p-6 overflow-x-hidden ${activeThemeObj.bgClass} relative transition-colors duration-200`}>
          <Routes>
            <Route path="/" element={<RootRedirector />} />
            <Route
              path="/workflow"
              element={
                <RoleGuard allowedRoles={['central_admin', 'slao', 'surveyor']}>
                  <WorkflowEngine />
                </RoleGuard>
              }
            />
            <Route
              path="/gis"
              element={
                <RoleGuard allowedRoles={['central_admin', 'slao', 'surveyor']}>
                  <GISStudio />
                </RoleGuard>
              }
            />
            <Route
              path="/calculator"
              element={
                <RoleGuard allowedRoles={['central_admin', 'slao']}>
                  <LARRCalculator />
                </RoleGuard>
              }
            />
            <Route
              path="/dbt"
              element={
                <RoleGuard allowedRoles={['central_admin', 'slao']}>
                  <DBTLedger />
                </RoleGuard>
              }
            />
            <Route
              path="/disputes"
              element={
                <RoleGuard allowedRoles={['central_admin', 'slao', 'surveyor', 'landowner']}>
                  <DisputesPortal />
                </RoleGuard>
              }
            />
            <Route
              path="/citizen"
              element={
                <RoleGuard allowedRoles={['landowner', 'central_admin']}>
                  <CitizenPortal />
                </RoleGuard>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {/* Floating AI Assistant Widget */}
      <BhuSathiAiAssistant />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
