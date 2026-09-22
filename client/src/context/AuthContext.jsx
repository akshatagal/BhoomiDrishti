import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bhoomidrishti_user');
    return saved ? JSON.parse(saved) : {
      id: 'USR-001',
      name: 'Dr. Rajeshwar Sharma, IAS',
      email: 'admin@bhoomidrishti.gov.in',
      role: 'central_admin',
      designation: 'Joint Secretary (Land Resources)',
      department: 'Ministry of Rural Development & NHAI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('bhoomidrishti_token') || 'demo-jwt-token');
  const [theme, setTheme] = useState(() => localStorage.getItem('bhoomidrishti_theme') || 'govt');

  useEffect(() => {
    localStorage.setItem('bhoomidrishti_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-govt', 'theme-dark', 'theme-cyber', 'theme-light');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const setAppTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('bhoomidrishti_user', JSON.stringify(res.data.user));
      localStorage.setItem('bhoomidrishti_token', res.data.token);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('bhoomidrishti_user', JSON.stringify(res.data.user));
      localStorage.setItem('bhoomidrishti_token', res.data.token);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const switchRole = async (role) => {
    try {
      const res = await axios.post(`/api/auth/demo-switch/${role}`);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('bhoomidrishti_user', JSON.stringify(res.data.user));
      localStorage.setItem('bhoomidrishti_token', res.data.token);
    } catch (err) {
      const demoRoles = {
        central_admin: {
          id: 'USR-001',
          name: 'Dr. Rajeshwar Sharma, IAS',
          email: 'admin@bhoomidrishti.gov.in',
          role: 'central_admin',
          designation: 'Joint Secretary (Land Resources)',
          department: 'Ministry of Rural Development & NHAI'
        },
        slao: {
          id: 'USR-002',
          name: 'Vikramaditya Verma, ADM',
          email: 'slao@bhoomidrishti.gov.in',
          role: 'slao',
          designation: 'Special Land Acquisition Officer (SLAO)',
          department: 'Revenue & Disaster Management Dept'
        },
        surveyor: {
          id: 'USR-003',
          name: 'Priyanka Deshmukh',
          email: 'surveyor@bhoomidrishti.gov.in',
          role: 'surveyor',
          designation: 'Senior GIS Cadastral Surveyor',
          department: 'National Remote Sensing Centre (NRSC)'
        },
        landowner: {
          id: 'USR-004',
          name: 'Ramesh Chandra Yadav',
          email: 'landowner@bhoomidrishti.gov.in',
          role: 'landowner',
          designation: 'Agricultural Farmer',
          department: 'Village Khasra Khata No. 412, Alwar'
        }
      };
      if (demoRoles[role]) {
        setUser(demoRoles[role]);
        localStorage.setItem('bhoomidrishti_user', JSON.stringify(demoRoles[role]));
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bhoomidrishti_user');
    localStorage.removeItem('bhoomidrishti_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, theme, setAppTheme, login, register, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
