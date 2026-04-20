/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onSnapshot, collection, doc, updateDoc, onSnapshot as onDocSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './lib/firebase';
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
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync users list in real-time
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
      setUsers(usersList);
    });

    return () => unsubUsers();
  }, []);

  // Handle Auth State and Presence
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync current user profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubUserDoc = onDocSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setCurrentUser({ ...userData, id: docSnap.id });
            
            // Mark online
            if (!userData.isOnline) {
              updateDoc(userDocRef, { 
                isOnline: true, 
                lastSeen: new Date().toISOString() 
              });
            }
          }
        });

        return () => unsubUserDoc();
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubAuth();
  }, []);

  // Browser close presence handling
  useEffect(() => {
    const handleUnload = () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        updateDoc(userDocRef, { isOnline: false });
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const handleLogout = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { isOnline: false });
    }
    await signOut(auth);
    setCurrentUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
            <Logo className="w-10 h-10" />
          </div>
          <p className="text-indigo-900 font-bold animate-pulse">Sincronizando com a nuvem...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role || 'student';

  return (
    <Router>
      <Toaster position="top-center" expand={true} richColors />
      <div className="min-h-screen font-sans bg-white text-slate-900 selection:bg-indigo-600/20">
        <Navigation isAuthenticated={isAuthenticated} logout={handleLogout} userRole={userRole} userEmail={currentUser?.email} />
        
        <main>
          <Routes>
            {/* Intelligent Root Redirect */}
            <Route 
              path="/" 
              element={<Navigate to="/lp-video" replace />} 
            />
            
            {/* Core Public Routes */}
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/lp-video" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />
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
                  currentUser={currentUser} 
                /> : <Navigate to="/auth" />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <Settings user={currentUser} onLogout={handleLogout} /> : <Navigate to="/auth" />
            } />
            
            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
