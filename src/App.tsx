/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sitemap from './components/Sitemap';
import Navigation from './components/Navigation';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Grades from './components/Grades';
import Contact from './components/Contact';
import Assignments from './components/Assignments';
import Journal from './components/Journal';
import Classroom from './components/Classroom';
import ExtraCourses from './components/ExtraCourses';
import Internships from './components/Internships';
import Teachers from './components/Teachers';
import About from './components/About';
import Settings from './components/Settings';
import Logo from './components/Logo';
import { User } from './types';
import { Toaster, toast } from 'sonner';

/**
 * Detects if the current environment is a cloud-based preview/dev environment.
 * @returns {boolean} True if in a preview environment.
 */
function checkPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const indicators = [
    'googleusercontent',
    'webcontainer',
    'shim',
    '.goog',
    'scf.usercontent',
    'stackblitz',
    'codesandbox'
  ];
  
  const { hostname, href } = window.location;
  return indicators.some(indicator => 
    hostname.includes(indicator) || href.includes(indicator)
  );
}

const isPreview = checkPreviewEnvironment();

/**
 * Vibrant Placeholder component for routes that are not yet implemented.
 */
function Placeholder({ name, desc }: { name: string, desc: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center p-16 bg-[#F9F9F9] rounded-[60px] shadow-2xl shadow-indigo-600/5 border border-indigo-600/5 max-w-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-8 border-indigo-50 p-2">
             <Logo className="w-full h-full" />
          </div>
          <h2 className="text-5xl font-serif mb-6 italic text-slate-900">{name}</h2>
          <p className="text-xl text-gray-500 leading-relaxed mb-10">{desc}</p>
          <div className="flex justify-center gap-4">
             <Link to="/" className="px-8 py-3 bg-indigo-900 text-white rounded-full font-bold shadow-lg hover:bg-slate-900 transition-all">Voltar ao Início</Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -translate-y-32 translate-x-32" />
      </div>
    </div>
  );
}

export default function App() {
  const Router = isPreview ? HashRouter : BrowserRouter;
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cetep_users');
    const initialUsers: User[] = [
      {
        id: '1',
        email: 'codernador12@gmail.com',
        name: 'Coordenador Pedagógico',
        role: 'teacher',
        grade: 'Docente',
        course: 'Coordenação',
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: 's1',
        email: 'joao.silva@cetep.com',
        name: 'João Silva',
        role: 'student',
        grade: '1º Ano',
        course: 'Técnico em Informática',
        isOnline: true,
        lastSeen: new Date().toISOString()
      }
    ];
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cetep_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cetep_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cetep_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cetep_current_user');
    }
  }, [currentUser]);

  const login = (authenticatedUser: User) => {
    const updatedUser = { ...authenticatedUser, isOnline: true, lastSeen: new Date().toISOString() };
    setCurrentUser(updatedUser);
  };

  const register = (newUser: User) => {
    const userWithStatus = { ...newUser, isOnline: true, lastSeen: new Date().toISOString() };
    setUsers(prev => [...prev, userWithStatus]);
    setCurrentUser(userWithStatus);
  };
  
  const logout = () => {
    if (currentUser) {
      setUsers(prev => prev.map(u => 
        u.id === currentUser.id ? { ...u, isOnline: false } : u
      ));
    }
    setCurrentUser(null);
  };

  const updateUsers = (newList: User[]) => {
    setUsers(newList);
  };

  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role || 'student';

  return (
    <Router>
      <Toaster position="top-center" expand={true} richColors />
      <div className="min-h-screen font-sans bg-white text-slate-900 selection:bg-indigo-600/20">
        <Navigation isAuthenticated={isAuthenticated} logout={logout} userRole={userRole} userEmail={currentUser?.email} />
        
        <main>
          <Routes>
            {/* Intelligent Root Redirect */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/lp-video" replace />} 
            />
            
            {/* Core Public Routes */}
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/lp-video" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Auth onLogin={login} onRegister={register} users={users} />
            } />
            
            {/* Protected Student Routes */}
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard user={currentUser} /> : <Navigate to="/auth" />
            } />
            <Route path="/journal" element={
              isAuthenticated ? <Journal /> : <Navigate to="/auth" />
            } />
            <Route path="/classroom" element={
              isAuthenticated ? <Classroom user={currentUser} allUsers={users} /> : <Navigate to="/auth" />
            } />
            <Route path="/extra-courses" element={
              isAuthenticated ? <ExtraCourses /> : <Navigate to="/auth" />
            } />
            <Route path="/internships" element={
              isAuthenticated ? <Internships /> : <Navigate to="/auth" />
            } />
            <Route path="/students" element={
              isAuthenticated ? <Grades user={currentUser} /> : <Navigate to="/auth" />
            } />
            <Route path="/assignments" element={
              isAuthenticated ? <Assignments /> : <Navigate to="/auth" />
            } />
            
            {/* Protected Teacher/Admin Routes */}
            <Route path="/teachers" element={
              isAuthenticated && currentUser?.email === 'codernador12@gmail.com' ? 
                <Teachers 
                  allUsers={users}
                  onUpdateUsers={updateUsers}
                  currentUser={currentUser} 
                /> : <Navigate to="/auth" />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <Settings user={currentUser} onLogout={logout} /> : <Navigate to="/auth" />
            } />
            
            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer style={{ position: 'fixed', bottom: '10px', width: '100%', textAlign: 'center', color: '#aaa', zIndex: 100, pointerEvents: 'none' }}>
          Site feito por ENZO em beta 🚀
        </footer>
      </div>
    </Router>
  );
}
