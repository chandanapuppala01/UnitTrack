import React, { useState } from 'react';
import { Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Screen } from '@/src/types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface LoginPageProps {
  onNavigate: (screen: Screen) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // App.tsx router will automatically redirect based on user state!
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Form Side */}
        <div className="auth-form-side">
          <div className="flex items-center space-x-3 cursor-pointer mb-12" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-slate-900">UnitTrack</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-bold flex items-center mt-6">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Login to Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-8">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="font-bold text-primary hover:underline" type="button">Create account</button>
          </p>
        </div>

        {/* Image Side */}
        <div className="auth-image-side">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold font-display leading-tight">
              Start tracking your energy usage in minutes.
            </h2>
            <p className="text-primary-100 mt-4 text-lg">
              Join over 10,000 users who have reduced their electricity bills by an average of 15%.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Recent Insight</p>
                <p className="text-sm font-bold">Potential Energy Savings: 45 kWh</p>
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              "Your AC usage is 20% higher than last month. Setting it to 24°C could save you 45 kWh next month."
            </p>
          </div>

          {/* Abstract Background Shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
