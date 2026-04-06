/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen } from './types';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddBill from './components/AddBill';
import Calculator from './components/Calculator';
import Insights from './components/Insights';
import Reports from './components/Reports';
import Profile from './components/Profile';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('landing');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const isPublicScreen = ['landing', 'login', 'signup'].includes(activeScreen);
      
      if (user && (activeScreen === 'login' || activeScreen === 'signup')) {
        setActiveScreen('dashboard');
      } else if (!user && !isPublicScreen) {
        setActiveScreen('login');
      }
    }
  }, [user, loading, activeScreen]);

  const isPublicScreen = ['landing', 'login', 'signup'].includes(activeScreen);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading your profile...</div>;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'landing':
        return <LandingPage onNavigate={setActiveScreen} />;
      case 'login':
        return <LoginPage onNavigate={setActiveScreen} />;
      case 'signup':
        return <SignupPage onNavigate={setActiveScreen} />;
      case 'dashboard':
        return <Dashboard />;
      case 'add-bill':
        return <AddBill />;
      case 'calculator':
        return <Calculator />;
      case 'insights':
        return <Insights />;
      case 'reports':
        return <Reports />;
      case 'profile':
      case 'settings':
        return <Profile />;
      default:
        return <LandingPage onNavigate={setActiveScreen} />;
    }
  };

  if (isPublicScreen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeScreen={activeScreen} 
        onScreenChange={setActiveScreen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 print:ml-0 flex flex-col">
        {/* Top Header Bar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-8 mt-16 print:mt-0 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
