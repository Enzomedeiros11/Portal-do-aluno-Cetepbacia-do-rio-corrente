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
import { supabase, isSupabaseConfigured } from './lib/supabase';

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
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Session state management
    const checkState = async () => {
      // 1. If Supabase is configured, use it
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          fetchUserProfile(session.user.id, session.user.email!);
        } else {
          setLoading(false);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            fetchUserProfile(session.user.id, session.user.email!);
          } else {
            setCurrentUser(null);
            setLoading(false);
          }
        });
        
        return () => subscription.unsubscribe();
      } 
      
      // 2. Fallback: Simulation mode using LocalStorage
      const savedUser = localStorage.getItem('cetep_user');
      const savedAllUsers = localStorage.getItem('cetep_all_users');
      
      if (savedAllUsers) {
        setAllUsers(JSON.parse(savedAllUsers));
      }
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkState();
  }, []);

  const fetchUserProfile = async (uid: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
         console.error('Error fetching profile:', error);
      }

      if (data) {
        setCurrentUser({
          id: data.id,
          email: data.email,
          name: data.nome,
          role: data.tipo as 'student' | 'teacher',
          grade: data.grade || '1º Ano',
          course: data.curso || 'Técnico em Informática',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nome}`,
          isOnline: true,
          lastSeen: new Date().toISOString()
        });
      } else {
        // Fallback profile if record doesn't exist yet
        setCurrentUser({
          id: uid,
          email: email,
          name: email.split('@')[0],
          role: 'student',
          grade: '1º Ano',
          course: 'Técnico em Informática',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
          isOnline: true,
          lastSeen: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAllUsers = (newUsers: User[]) => {
    setAllUsers(newUsers);
  };

  useEffect(() => {
    document.title = "PORTAL DO ALUNO CETEP";
  }, []);

  const login = (authenticatedUser: User) => {
    setCurrentUser(authenticatedUser);
    if (!isSupabaseConfigured) {
      localStorage.setItem('cetep_user', JSON.stringify(authenticatedUser));
    }
  };

  const register = (newUser: User) => {
    setCurrentUser(newUser);
    if (!isSupabaseConfigured) {
      localStorage.setItem('cetep_user', JSON.stringify(newUser));
      updateAllUsers([...allUsers, newUser]);
    }
  };
  
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    localStorage.removeItem('cetep_user');
  };

  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role || 'student';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-indigo-600 font-black uppercase tracking-widest text-[10px]">Conectando ao Portal...</p>
        </div>
      </div>
    );
  }

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
              isAuthenticated ? <Navigate to="/dashboard" /> : <Auth onLogin={login} onRegister={register} users={allUsers} />
            } />
            
            {/* Protected Student Routes */}
            <Route path="/dashboard" element={
              isAuthenticated ? <Dashboard user={currentUser} /> : <Navigate to="/auth" />
            } />
            <Route path="/journal" element={
              isAuthenticated ? <Journal /> : <Navigate to="/auth" />
            } />
            <Route path="/classroom" element={
              isAuthenticated ? <Classroom user={currentUser} allUsers={allUsers} /> : <Navigate to="/auth" />
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
                  allUsers={allUsers}
                  onUpdateUsers={updateAllUsers}
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
          PORTAL DO ALUNO CETEP 🚀
        </footer>
      </div>
    </Router>
  );
}
